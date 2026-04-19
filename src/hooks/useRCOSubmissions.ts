import { useState, useEffect, useCallback } from "react";
import { rcoService } from "@/services/rcoService";
import type { AdminSubmission } from "@/services/adminService";

interface Filters {
  status: string;
  search: string;
}

export const useRCOSubmissions = (
  allowedColleges: string[],
  createdBy: string
) => {
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);
  const [certificateType, setCertificateType] = useState<"Blood Donation" | "Tree Tagging" | "">("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({ status: "", search: "" });
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  // Resolve certificate type from flagship admin
  useEffect(() => {
    if (!createdBy) return;
    rcoService.getCertificateType(createdBy).then((ct) => {
      setCertificateType(ct as "Blood Donation" | "Tree Tagging");
    });
  }, [createdBy]);

  const fetchSubmissions = useCallback(async () => {
    if (!certificateType || !allowedColleges.length) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await rcoService.getSubmissions(
        allowedColleges,
        certificateType,
        { status: filters.status || undefined, search: filters.search || undefined }
      );
      setSubmissions(data);
      setStats({
        total: data.length,
        pending: data.filter((s) => s.status === "pending").length,
        approved: data.filter((s) => s.status === "approved").length,
        rejected: data.filter((s) => s.status === "rejected").length,
      });
    } catch (err: any) {
      setError(err.message || "Failed to fetch submissions");
    } finally {
      setIsLoading(false);
    }
  }, [certificateType, allowedColleges, filters]);

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

  const updateStatus = async (
    id: string,
    newStatus: "approved" | "rejected" | "pending"
  ) => {
    if (!certificateType) return;
    setError(null);
    setSuccessMessage(null);
    try {
      await rcoService.updateSubmissionStatus(id, certificateType, newStatus);
      setSuccessMessage(`Submission ${newStatus} successfully`);
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
      );
      setStats((prev) => {
        const old = submissions.find((s) => s.id === id)?.status;
        const next = { ...prev };
        if (old === "pending") next.pending--;
        else if (old === "approved") next.approved--;
        else if (old === "rejected") next.rejected--;
        if (newStatus === "pending") next.pending++;
        else if (newStatus === "approved") next.approved++;
        else if (newStatus === "rejected") next.rejected++;
        return next;
      });
    } catch (err: any) {
      setError(err.message || "Failed to update status");
    }
  };

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  return {
    submissions,
    certificateType,
    isLoading,
    error,
    successMessage,
    stats,
    filters,
    setFilters,
    updateStatus,
    clearMessages,
    refetch: fetchSubmissions,
  };
};
