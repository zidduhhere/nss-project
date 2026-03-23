import { useState, useEffect, useCallback } from "react";
import supabase from "@/services/supabase";
import { UseAuthContext } from "@/context/AuthContext";
import { ActivityType } from "@/types/ActivityType";
import { activityStatusServices } from "@/services/activityStatusServices";

export interface UnitSubmission {
  id: string;
  student_id: string;
  student_name: string;
  student_ktu_id: string;
  submission_type: "Blood Donation" | "Tree Tagging";
  submitted_date: string;
  status: string;
  details: string;
  certificate_url?: string | null;
  // Blood donation specific
  hospital_name?: string;
  type_donated?: string;
  donation_case?: string;
  // Tree tagging specific
  trees_planted?: number;
  tagged_tree_links?: string[];
}

interface SubmissionFilters {
  type: string;
  status: string;
  search: string;
}

export const useUnitSubmissions = () => {
  const { session, role } = UseAuthContext();
  const [submissions, setSubmissions] = useState<UnitSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SubmissionFilters>({
    type: "",
    status: "",
    search: "",
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const unitId = role?.unit_id;

  const fetchSubmissions = useCallback(async () => {
    if (!unitId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get volunteers for this unit to filter submissions
      const { data: unitVolunteers, error: volError } = await supabase
        .from("volunteers")
        .select("student_id, full_name, ktu_id")
        .eq("unit_id", unitId);

      if (volError) throw volError;

      const studentIds = unitVolunteers?.map((v) => v.student_id) || [];
      if (studentIds.length === 0) {
        setSubmissions([]);
        setStats({ total: 0, pending: 0, approved: 0, rejected: 0 });
        setIsLoading(false);
        return;
      }

      const studentMap = new Map(
        unitVolunteers?.map((v) => [
          v.student_id,
          { name: v.full_name, ktu_id: v.ktu_id },
        ]) || []
      );

      // Fetch blood donation submissions
      const { data: bloodSubs, error: bloodError } = await supabase
        .from("blood_donation_submissions")
        .select("*")
        .in("student_id", studentIds)
        .order("created_at", { ascending: false });

      if (bloodError) throw bloodError;

      // Fetch tree tagging submissions
      const { data: treeSubs, error: treeError } = await supabase
        .from("tree_tagging_submissions")
        .select("*")
        .in("student_id", studentIds)
        .order("created_at", { ascending: false });

      if (treeError) throw treeError;

      // Merge into unified format
      const allSubmissions: UnitSubmission[] = [
        ...(bloodSubs || []).map((s: any) => ({
          id: s.id,
          student_id: s.student_id,
          student_name: studentMap.get(s.student_id)?.name || "Unknown",
          student_ktu_id: studentMap.get(s.student_id)?.ktu_id || "",
          submission_type: "Blood Donation" as const,
          submitted_date: s.donation_date || s.created_at,
          status: s.status || "pending",
          details: s.hospital_name || "",
          certificate_url: s.certificate_url,
          hospital_name: s.hospital_name,
          type_donated: s.type_donated,
          donation_case: s.donation_case,
        })),
        ...(treeSubs || []).map((s: any) => ({
          id: s.id,
          student_id: s.student_id,
          student_name: studentMap.get(s.student_id)?.name || "Unknown",
          student_ktu_id: studentMap.get(s.student_id)?.ktu_id || "",
          submission_type: "Tree Tagging" as const,
          submitted_date: s.tagging_date || s.created_at,
          status: s.status || "pending",
          details: `${s.trees_planted || 0} trees planted`,
          certificate_url: null,
          trees_planted: s.trees_planted,
          tagged_tree_links: s.tagged_tree_links,
        })),
      ];

      // Sort by date descending
      allSubmissions.sort(
        (a, b) =>
          new Date(b.submitted_date).getTime() -
          new Date(a.submitted_date).getTime()
      );

      setSubmissions(allSubmissions);
      setStats({
        total: allSubmissions.length,
        pending: allSubmissions.filter((s) => s.status === "pending").length,
        approved: allSubmissions.filter((s) => s.status === "approved").length,
        rejected: allSubmissions.filter((s) => s.status === "rejected").length,
      });
    } catch (err: any) {
      console.error("Error fetching submissions:", err);
      setError(err.message || "Failed to fetch submissions");
    } finally {
      setIsLoading(false);
    }
  }, [unitId]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const filteredSubmissions = submissions.filter((s) => {
    if (filters.type && s.submission_type !== filters.type) return false;
    if (filters.status && s.status !== filters.status) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      return (
        s.student_name.toLowerCase().includes(q) ||
        s.student_ktu_id.toLowerCase().includes(q) ||
        s.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const approveSubmission = async (id: string, type: "Blood Donation" | "Tree Tagging") => {
    try {
      const activityType =
        type === "Blood Donation"
          ? ActivityType.BloodDonation
          : ActivityType.TreeTagging;
      await activityStatusServices.approveActivity(id, activityType);
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "approved" } : s))
      );
      setStats((prev) => ({
        ...prev,
        pending: prev.pending - 1,
        approved: prev.approved + 1,
      }));
    } catch (err: any) {
      setError(err.message || "Failed to approve submission");
    }
  };

  const rejectSubmission = async (id: string, type: "Blood Donation" | "Tree Tagging") => {
    try {
      const activityType =
        type === "Blood Donation"
          ? ActivityType.BloodDonation
          : ActivityType.TreeTagging;
      await activityStatusServices.rejectActivity(id, activityType);
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "rejected" } : s))
      );
      setStats((prev) => ({
        ...prev,
        pending: prev.pending - 1,
        rejected: prev.rejected + 1,
      }));
    } catch (err: any) {
      setError(err.message || "Failed to reject submission");
    }
  };

  return {
    submissions: filteredSubmissions,
    allSubmissions: submissions,
    isLoading,
    error,
    stats,
    filters,
    setFilters,
    approveSubmission,
    rejectSubmission,
    refetch: fetchSubmissions,
  };
};
