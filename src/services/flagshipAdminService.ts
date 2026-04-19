import supabase from "@/services/supabase";
import { handleSupabaseError } from "@/services/errors";
import type { AdminSubmission } from "@/services/adminService";
import type { UserProfile } from "@/types/UserProfile";

export const flagshipAdminService = {
  // ── Submissions ───────────────────────────────────────────────

  getSubmissions: async (
    certificateType: "Blood Donation" | "Tree Tagging",
    filters?: { status?: string; search?: string }
  ): Promise<AdminSubmission[]> => {
    const table = certificateType === "Blood Donation" ? "blood_donations" : "tree_tagging";

    let query = supabase
      .from(table)
      .select("*")
      .order("created_at", { ascending: false });

    if (filters?.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }

    const { data, error } = await query;
    if (error) handleSupabaseError(error, "Failed to fetch submissions");

    const rows = data || [];

    // Fetch profiles for all unique student_ids in one query
    const studentIds = [...new Set(rows.map((r: any) => r.student_id).filter(Boolean))];
    const profileMap: Record<string, any> = {};
    if (studentIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, ktu_id, college_id, mobile")
        .in("id", studentIds);
      (profiles || []).forEach((p: any) => { profileMap[p.id] = p; });
    }

    let submissions: AdminSubmission[] = rows.map((item: any) => {
      const profile = profileMap[item.student_id];
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
    if (error) handleSupabaseError(error, `Failed to update submission status`);
    return data;
  },

  // ── Profile ───────────────────────────────────────────────────

  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) handleSupabaseError(error, "Failed to fetch flagship admin profile");
    return data;
  },

  // ── RCO management ───────────────────────────────────────────

  listRCOs: async (): Promise<UserProfile[]> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "rco")
      .order("created_at", { ascending: false });
    if (error) handleSupabaseError(error, "Failed to fetch RCOs");
    return (data as UserProfile[]) || [];
  },

  removeRCO: async (rcoId: string): Promise<void> => {
    const { error } = await supabase
      .from("profiles")
      .update({ role: "student", allowed_colleges: [], created_by: null, updated_at: new Date().toISOString() })
      .eq("id", rcoId);
    if (error) handleSupabaseError(error, "Failed to remove RCO");
  },

  createRCO: async (
    params: { email: string; password: string; full_name: string; allowed_colleges: string[] }
  ): Promise<{ user_id: string }> => {
    const { data, error } = await supabase.functions.invoke("create-privileged-user", {
      body: { action: "create", role: "rco", ...params },
    });
    if (error) throw new Error(error.message || "Failed to create RCO");
    if (data?.error) throw new Error(data.error);
    return data;
  },
};
