import supabase from "@/services/supabase";
import { handleSupabaseError } from "@/services/errors";
import type { AdminSubmission } from "@/services/adminService";

export const rcoService = {
  // ── Profile (includes flagship-admin info) ─────────────────────

  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*, created_by_profile:profiles!profiles_created_by_fkey(certificate_type)")
      .eq("id", userId)
      .single();
    if (error) handleSupabaseError(error, "Failed to fetch RCO profile");
    return data;
  },

  // Returns the certificate_type from the flagship-admin who created this RCO
  getCertificateType: async (createdBy: string): Promise<string> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("certificate_type")
      .eq("id", createdBy)
      .single();
    if (error) handleSupabaseError(error, "Failed to fetch flagship admin certificate type");
    return data?.certificate_type || "";
  },

  // ── Submissions (filtered by allowed_colleges + cert type) ─────

  getSubmissions: async (
    allowedColleges: string[],
    certificateType: "Blood Donation" | "Tree Tagging",
    filters?: { status?: string; search?: string }
  ): Promise<AdminSubmission[]> => {
    if (!allowedColleges.length) return [];

    // Get student IDs from allowed colleges
    const { data: students, error: studentsError } = await supabase
      .from("profiles")
      .select("id")
      .in("college_id", allowedColleges);

    if (studentsError) handleSupabaseError(studentsError, "Failed to fetch students");
    const studentIds = (students || []).map((s: { id: string }) => s.id);
    if (!studentIds.length) return [];

    const table = certificateType === "Blood Donation" ? "blood_donations" : "tree_tagging";

    let query = supabase
      .from(table)
      .select(`*, profiles!${table}_student_id_fkey(full_name, ktu_id, college_id)`)
      .in("student_id", studentIds)
      .order("created_at", { ascending: false });

    if (filters?.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }

    const { data, error } = await query;
    if (error) handleSupabaseError(error, "Failed to fetch submissions");

    let submissions: AdminSubmission[] = (data || []).map((item: any) => {
      const profile = item.profiles;
      if (certificateType === "Blood Donation") {
        return {
          id: item.id,
          student_id: item.student_id,
          student_name: profile?.full_name || "Unknown",
          student_ktu_id: profile?.ktu_id || "",
          unit_number: null,
          submission_type: "Blood Donation" as const,
          submitted_date: item.donation_date || item.created_at,
          status: item.status || "pending",
          details: item.hospital_name || "",
          certificate_url: item.certificate_url,
          hospital_name: item.hospital_name,
          type_donated: item.type_donated,
          donation_case: item.donation_case,
        };
      }
      return {
        id: item.id,
        student_id: item.student_id,
        student_name: profile?.full_name || "Unknown",
        student_ktu_id: profile?.ktu_id || "",
        unit_number: null,
        submission_type: "Tree Tagging" as const,
        submitted_date: item.created_at,
        status: item.status || "pending",
        details: `${item.trees_planted || 0} trees planted`,
        certificate_url: null,
        trees_planted: item.trees_planted,
        tagged_tree_links: item.tagged_links,
      };
    });

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      submissions = submissions.filter(
        (s) =>
          s.student_name.toLowerCase().includes(q) ||
          s.student_ktu_id.toLowerCase().includes(q) ||
          s.details.toLowerCase().includes(q)
      );
    }

    return submissions;
  },

  updateSubmissionStatus: async (
    id: string,
    certificateType: "Blood Donation" | "Tree Tagging",
    status: "approved" | "rejected" | "pending"
  ) => {
    const table = certificateType === "Blood Donation" ? "blood_donations" : "tree_tagging";
    const { data, error } = await supabase
      .from(table)
      .update({ status })
      .eq("id", id)
      .select()
      .single();
    if (error) handleSupabaseError(error, "Failed to update submission status");
    return data;
  },
};
