import supabase from "@/services/supabase";
import { AdminProfile, AdminStats } from "@/types/AdminProfile";
import { VolunteerProfile } from "@/types/VolunteerProfile";
import { UserProfile } from "@/types/UserProfile";
import { UserWithDetails, UserFilters } from "@/types/UserWithDetails";
import { ServiceError, handleSupabaseError } from "@/services/errors";
import { sanitizeFilter } from "@/services/validationSchemas";
import {
  PaginationParams,
  resolvePagination,
  buildPaginatedResult,
  PaginatedResult,
} from "@/services/pagination";
export interface AdminSubmission {
  id: string;
  student_id: string;
  student_name: string;
  student_ktu_id: string;
  unit_number: string | null;
  submission_type: "Blood Donation" | "Tree Tagging";
  submitted_date: string;
  status: string;
  details: string;
  certificate_url?: string | null;
  hospital_name?: string;
  type_donated?: string;
  donation_case?: string;
  trees_planted?: number;
  tagged_tree_links?: string[];
}

export const adminService = {
  // ── Profile ──────────────────────────────────────────────────

  getAdminProfile: async (adminId: string): Promise<AdminProfile> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", adminId)
      .eq("role", "admin")
      .single();

    if (error) handleSupabaseError(error, "Admin profile not found");
    return data as AdminProfile;
  },

  updateAdminProfile: async (
    adminId: string,
    updates: Partial<Omit<AdminProfile, "id" | "email" | "role" | "created_at" | "updated_at">>
  ): Promise<AdminProfile> => {
    const { data, error } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", adminId)
      .eq("role", "admin")
      .select()
      .single();

    if (error) handleSupabaseError(error, "Failed to update admin profile");
    return data as AdminProfile;
  },

  // ── System stats (optimised: head-only counts) ───────────────

  getSystemStats: async (): Promise<AdminStats> => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      totalVolResult,
      pendingResult,
      approvedResult,
      certifiedResult,
      rejectedResult,
      studentsResult,
      unitsResult,
      recentResult,
    ] = await Promise.all([
      supabase.from("volunteers").select("*", { count: "exact", head: true }),
      supabase.from("volunteers").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("volunteers").select("*", { count: "exact", head: true }).eq("status", "approved"),
      supabase.from("volunteers").select("*", { count: "exact", head: true }).eq("status", "certified"),
      supabase.from("volunteers").select("*", { count: "exact", head: true }).eq("status", "rejected"),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student"),
      supabase.from("nss_units").select("*", { count: "exact", head: true }),
      supabase.from("volunteers").select("*", { count: "exact", head: true }).gte("created_at", sevenDaysAgo.toISOString()),
    ]);

    // Check first error that exists
    const firstError = [
      totalVolResult, pendingResult, approvedResult, certifiedResult,
      rejectedResult, studentsResult, unitsResult, recentResult,
    ].find((r) => r.error);
    if (firstError?.error) handleSupabaseError(firstError.error, "Failed to fetch system statistics");

    return {
      totalVolunteers: totalVolResult.count || 0,
      totalUnits: unitsResult.count || 0,
      pendingApprovals: pendingResult.count || 0,
      approvedVolunteers: approvedResult.count || 0,
      certifiedVolunteers: certifiedResult.count || 0,
      rejectedVolunteers: rejectedResult.count || 0,
      totalStudents: studentsResult.count || 0,
      recentRegistrations: recentResult.count || 0,
    };
  },

  // ── Volunteers (paginated) ───────────────────────────────────

  getAllVolunteers: async (
    filters?: {
      status?: string;
      unit_id?: string;
      search?: string;
      course?: string;
      semester?: number;
      blood_group?: string;
      isActive?: boolean;
    },
    pagination?: PaginationParams
  ): Promise<PaginatedResult<VolunteerProfile>> => {
    const { page, pageSize, from, to } = resolvePagination(pagination);

    let query = supabase
      .from("volunteers")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (filters?.status && filters.status !== "all")
      query = query.eq("status", filters.status);
    if (filters?.unit_id && filters.unit_id !== "all")
      query = query.eq("unit_id", filters.unit_id);
    if (filters?.course && filters.course !== "all")
      query = query.eq("course", filters.course);
    if (filters?.semester) query = query.eq("semester", filters.semester);
    if (filters?.blood_group && filters.blood_group !== "all")
      query = query.eq("blood_group", filters.blood_group);
    if (filters?.isActive !== undefined) {
      query = filters.isActive
        ? query.eq("status", "approved")
        : query.neq("status", "approved");
    }
    if (filters?.search) {
      const safeSearch = sanitizeFilter(filters.search);
      query = query.or(
        `full_name.ilike.%${safeSearch}%,ktu_id.ilike.%${safeSearch}%,contact_number.ilike.%${safeSearch}%`
      );
    }

    const { data, error, count } = await query.range(from, to);
    if (error) handleSupabaseError(error, "Failed to fetch volunteers");

    return buildPaginatedResult(
      (data as VolunteerProfile[]) || [],
      count ?? 0,
      page,
      pageSize
    );
  },

  getUniqueUnits: async (): Promise<string[]> => {
    const { data, error } = await supabase
      .from("nss_units")
      .select("id")
      .order("id", { ascending: true });

    if (error) handleSupabaseError(error, "Failed to fetch units");
    return (data?.map((u) => u.id) || []) as string[];
  },

  // ── Users (paginated) ────────────────────────────────────────

  getAllUsers: async (
    search?: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<UserProfile>> => {
    const { page, pageSize, from, to } = resolvePagination(pagination);

    let query = supabase
      .from("profiles")
      .select("*", { count: "exact" })
      .eq("role", "student")
      .order("created_at", { ascending: false });

    if (search) {
      const safeSearch = sanitizeFilter(search);
      query = query.or(
        `full_name.ilike.%${safeSearch}%,email.ilike.%${safeSearch}%`
      );
    }

    const { data, error, count } = await query.range(from, to);
    if (error) handleSupabaseError(error, "Failed to fetch users");

    return buildPaginatedResult(
      (data as UserProfile[]) || [],
      count ?? 0,
      page,
      pageSize
    );
  },

  // ── Volunteer status operations ──────────────────────────────

  updateVolunteerStatus: async (
    volunteerId: string,
    status: "pending" | "approved" | "rejected" | "certified"
  ): Promise<VolunteerProfile> => {
    const { data, error } = await supabase
      .from("volunteers")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", volunteerId)
      .select()
      .single();

    if (error) handleSupabaseError(error, "Failed to update volunteer status");
    return data as VolunteerProfile;
  },

  bulkApproveVolunteers: async (volunteerIds: string[]): Promise<number> => {
    const { data, error } = await supabase
      .from("volunteers")
      .update({ status: "approved", updated_at: new Date().toISOString() })
      .in("id", volunteerIds)
      .select();

    if (error) handleSupabaseError(error, "Failed to approve volunteers");
    return data?.length || 0;
  },

  bulkRejectVolunteers: async (volunteerIds: string[]): Promise<number> => {
    const { data, error } = await supabase
      .from("volunteers")
      .update({ status: "rejected", updated_at: new Date().toISOString() })
      .in("id", volunteerIds)
      .select();

    if (error) handleSupabaseError(error, "Failed to reject volunteers");
    return data?.length || 0;
  },

  deleteVolunteer: async (volunteerId: string): Promise<void> => {
    const { error } = await supabase
      .from("volunteers")
      .delete()
      .eq("id", volunteerId);

    if (error) handleSupabaseError(error, "Failed to delete volunteer");
  },

  certifyVolunteer: async (volunteerId: string): Promise<VolunteerProfile> => {
    // Verify volunteer is approved before certifying
    const { data: volunteer, error: fetchError } = await supabase
      .from("volunteers")
      .select("id, full_name, status")
      .eq("id", volunteerId)
      .single();

    if (fetchError) handleSupabaseError(fetchError, "Volunteer not found");

    if (volunteer.status !== "approved") {
      throw new ServiceError(
        `Cannot certify volunteer with status "${volunteer.status}". Only approved volunteers can be certified.`,
        "VALIDATION_ERROR"
      );
    }

    const { data, error } = await supabase
      .from("volunteers")
      .update({ status: "certified", updated_at: new Date().toISOString() })
      .eq("id", volunteerId)
      .select()
      .single();

    if (error) handleSupabaseError(error, "Failed to certify volunteer");
    return data as VolunteerProfile;
  },

  uncertifyVolunteer: async (volunteerId: string): Promise<VolunteerProfile> => {
    const { data: volunteer, error: fetchError } = await supabase
      .from("volunteers")
      .select("id, full_name, status")
      .eq("id", volunteerId)
      .single();

    if (fetchError) handleSupabaseError(fetchError, "Volunteer not found");

    if (volunteer.status !== "certified") {
      throw new ServiceError(
        `Cannot undo certification for volunteer with status "${volunteer.status}".`,
        "VALIDATION_ERROR"
      );
    }

    const { data, error } = await supabase
      .from("volunteers")
      .update({ status: "approved", updated_at: new Date().toISOString() })
      .eq("id", volunteerId)
      .select()
      .single();

    if (error) handleSupabaseError(error, "Failed to undo certification");
    return data as VolunteerProfile;
  },

  bulkCertifyVolunteers: async (
    volunteerIds: string[]
  ): Promise<{ success: number; failed: number; errors: string[] }> => {
    const { data: volunteers, error: fetchError } = await supabase
      .from("volunteers")
      .select("id, full_name, status")
      .in("id", volunteerIds);

    if (fetchError) handleSupabaseError(fetchError, "Failed to fetch volunteers");

    if (!volunteers || volunteers.length === 0) {
      throw new ServiceError("No volunteers found with the provided IDs", "NOT_FOUND");
    }

    const approved = volunteers.filter((v) => v.status === "approved");
    const notApproved = volunteers.filter((v) => v.status !== "approved");

    const errors: string[] = notApproved.map(
      (v) => `${v.full_name || "Unknown"} (${v.status}): Cannot certify - must be approved first`
    );

    let successCount = 0;
    if (approved.length > 0) {
      const { data, error } = await supabase
        .from("volunteers")
        .update({ status: "certified", updated_at: new Date().toISOString() })
        .in("id", approved.map((v) => v.id))
        .select();

      if (error) errors.push(`Database error: ${error.message}`);
      else successCount = data?.length || 0;
    }

    return { success: successCount, failed: notApproved.length, errors };
  },

  getRecentRegistrations: async (
    limit: number = 10
  ): Promise<VolunteerProfile[]> => {
    const { data, error } = await supabase
      .from("volunteers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) handleSupabaseError(error, "Failed to fetch recent registrations");
    return (data as VolunteerProfile[]) || [];
  },

  // ── Users with details (paginated) ──────────────────────────

  getAllUsersWithDetails: async (
    filters?: UserFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<UserWithDetails>> => {
    const { page, pageSize, from, to } = resolvePagination(pagination);

    let query = supabase
      .from("user_with_college")
      .select("*", { count: "exact" });

    if (filters?.role && filters.role !== "all") {
      query = query.eq("role", filters.role);
    } else {
      query = query.in("role", ["student", "unit"]);
    }

    if (filters?.district && filters.district !== "all") {
      query = query.eq("college_district", filters.district);
    }

    if (filters?.search) {
      const safeSearch = sanitizeFilter(filters.search);
      query = query.or(
        `email.ilike.%${safeSearch}%,full_name.ilike.%${safeSearch}%,unit_number.ilike.%${safeSearch}%,college_name.ilike.%${safeSearch}%,college_district.ilike.%${safeSearch}%`
      );
    }

    const { data: viewData, error: viewError, count } = await query.range(from, to);
    if (viewError) handleSupabaseError(viewError, "Failed to fetch users");

    if (!viewData || viewData.length === 0) {
      return buildPaginatedResult([], 0, page, pageSize);
    }

    // Volunteer counts for the page
    const { data: volunteerCounts, error: countsError } = await supabase
      .from("volunteers")
      .select("student_id")
      .in("student_id", viewData.map((u: UserWithDetails) => u.id));

    if (countsError) handleSupabaseError(countsError, "Failed to fetch volunteer counts");

    const countMap = new Map<string, number>();
    volunteerCounts?.forEach((v: { student_id: string }) => {
      if (v.student_id) {
        countMap.set(v.student_id, (countMap.get(v.student_id) || 0) + 1);
      }
    });

    const usersWithDetails: UserWithDetails[] = viewData.map((user: UserWithDetails) => ({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
      phone_number: user.phone_number,
      unit_number: user.unit_number,
      college_name: user.college_name,
      district: user.college_district,
      avatar_url: user.avatar_url,
      volunteer_applications: countMap.get(user.id) || 0,
    }));

    return buildPaginatedResult(usersWithDetails, count ?? 0, page, pageSize);
  },

  getUniqueDistricts: async (): Promise<string[]> => {
    const { data, error } = await supabase
      .from("user_with_college")
      .select("college_district")
      .not("college_district", "is", null)
      .neq("college_district", "Not Defined");

    if (error) handleSupabaseError(error, "Failed to fetch districts");

    const uniqueDistricts = Array.from(
      new Set(data?.map((d: { college_district: string }) => d.college_district).filter(Boolean))
    ) as string[];
    return uniqueDistricts.sort();
  },

  getUserStats: async () => {
    const [studentsResult, unitsResult, appsResult] = await Promise.all([
      supabase.from("user_with_college").select("*", { count: "exact", head: true }).eq("role", "student"),
      supabase.from("user_with_college").select("*", { count: "exact", head: true }).eq("role", "unit"),
      supabase.from("volunteers").select("student_id"),
    ]);

    if (studentsResult.error) handleSupabaseError(studentsResult.error, "Failed to fetch student count");
    if (unitsResult.error) handleSupabaseError(unitsResult.error, "Failed to fetch unit count");
    if (appsResult.error) handleSupabaseError(appsResult.error, "Failed to fetch volunteer apps");

    const uniqueStudentsWithApps = new Set(
      appsResult.data?.map((v: { student_id: string }) => v.student_id).filter(Boolean)
    ).size;

    return {
      totalUsers: (studentsResult.count || 0) + (unitsResult.count || 0),
      totalStudents: studentsResult.count || 0,
      totalUnits: unitsResult.count || 0,
      studentsWithApplications: uniqueStudentsWithApps,
    };
  },

  // ── Role management ──────────────────────────────────────────

  promoteStudent: async (
    userId: string,
    unitConfig: {
      unitNumber: string;
      collegeId: string;
      poName?: string;
      poEmail?: string;
      poPhone?: string;
    }
  ): Promise<UserProfile> => {
    const { data: user, error: fetchError } = await supabase
      .from("profiles")
      .select("id, full_name, role, email")
      .eq("id", userId)
      .single();

    if (fetchError) handleSupabaseError(fetchError, "User not found");

    if (user.role !== "student") {
      throw new ServiceError(
        `Cannot promote user with role "${user.role}". Only student accounts can be promoted.`,
        "VALIDATION_ERROR"
      );
    }

    const { data: existingUnit } = await supabase
      .from("nss_units")
      .select("id")
      .eq("unit_number", unitConfig.unitNumber)
      .maybeSingle();

    let unitId: string;

    if (existingUnit) {
      unitId = existingUnit.id;
    } else {
      const { data: newUnit, error: unitError } = await supabase
        .from("nss_units")
        .insert({
          unit_number: unitConfig.unitNumber,
          college_id: unitConfig.collegeId,
          po_name: unitConfig.poName || user.full_name || null,
          po_email: unitConfig.poEmail || user.email || null,
          po_phone: unitConfig.poPhone || null,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (unitError) handleSupabaseError(unitError, "Failed to create unit entry");
      unitId = newUnit.id;
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({ role: "unit", unit_id: unitId, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single();

    if (error) handleSupabaseError(error, "Failed to promote student to unit");
    return data as UserProfile;
  },

  demoteUnit: async (userId: string): Promise<UserProfile> => {
    const { data: user, error: fetchError } = await supabase
      .from("profiles")
      .select("id, full_name, role")
      .eq("id", userId)
      .single();

    if (fetchError) handleSupabaseError(fetchError, "User not found");

    if (user.role !== "unit") {
      throw new ServiceError(
        `Cannot demote user with role "${user.role}". Only unit accounts can be demoted.`,
        "VALIDATION_ERROR"
      );
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({ role: "student", updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single();

    if (error) handleSupabaseError(error, "Failed to demote unit to student");
    return data as UserProfile;
  },

  // ── Activity Submissions (admin override) ─────────────────────

  getAllSubmissions: async (filters?: {
    type?: string;
    status?: string;
    search?: string;
  }): Promise<AdminSubmission[]> => {
    const submissions: AdminSubmission[] = [];

    const shouldFetchBlood =
      !filters?.type || filters.type === "Blood Donation" || filters.type === "all";
    const shouldFetchTree =
      !filters?.type || filters.type === "Tree Tagging" || filters.type === "all";

    // Use database views that pre-join volunteer info (no FK needed)
    const bloodPromise = shouldFetchBlood
      ? (() => {
          let q = supabase
            .from("blood_donations_with_volunteer")
            .select("*")
            .order("created_at", { ascending: false });
          if (filters?.status && filters.status !== "all") q = q.eq("status", filters.status);
          return q;
        })()
      : null;

    const treePromise = shouldFetchTree
      ? (() => {
          let q = supabase
            .from("tree_tagging_with_volunteer")
            .select("*")
            .order("created_at", { ascending: false });
          if (filters?.status && filters.status !== "all") q = q.eq("status", filters.status);
          return q;
        })()
      : null;

    const [bloodResult, treeResult] = await Promise.all([
      bloodPromise,
      treePromise,
    ]);

    if (bloodResult?.error) handleSupabaseError(bloodResult.error, "Failed to fetch blood donations");
    if (treeResult?.error) handleSupabaseError(treeResult.error, "Failed to fetch tree tagging submissions");

    (bloodResult?.data || []).forEach((item: any) => {
      submissions.push({
        id: item.id,
        student_id: item.student_id,
        student_name: item.volunteer_name || "Unknown",
        student_ktu_id: item.volunteer_ktu_id || "",
        unit_number: item.volunteer_unit_number || null,
        submission_type: "Blood Donation",
        submitted_date: item.donation_date || item.created_at,
        status: item.status || "pending",
        details: item.hospital_name || "",
        certificate_url: item.certificate_url,
        hospital_name: item.hospital_name,
        type_donated: item.type_donated,
        donation_case: item.donation_case,
      });
    });

    (treeResult?.data || []).forEach((item: any) => {
      submissions.push({
        id: item.id,
        student_id: item.student_id,
        student_name: item.volunteer_name || "Unknown",
        student_ktu_id: item.volunteer_ktu_id || "",
        unit_number: item.volunteer_unit_number || null,
        submission_type: "Tree Tagging",
        submitted_date: item.created_at,
        status: item.status || "pending",
        details: `${item.trees_planted || 0} trees planted`,
        certificate_url: null,
        trees_planted: item.trees_planted,
        tagged_tree_links: item.tagged_links,
      });
    });

    // Apply client-side search filter
    let filtered = submissions;
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      filtered = submissions.filter(
        (s) =>
          s.student_name.toLowerCase().includes(q) ||
          s.student_ktu_id.toLowerCase().includes(q) ||
          s.details.toLowerCase().includes(q) ||
          (s.unit_number && s.unit_number.toLowerCase().includes(q))
      );
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.submitted_date).getTime() - new Date(a.submitted_date).getTime()
    );
  },

  overrideSubmissionStatus: async (
    id: string,
    submissionType: "Blood Donation" | "Tree Tagging",
    status: "approved" | "rejected" | "pending"
  ) => {
    const table =
      submissionType === "Blood Donation" ? "blood_donations" : "tree_tagging";

    const { data, error } = await supabase
      .from(table)
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) handleSupabaseError(error, `Failed to update submission status to ${status}`);
    return data;
  },
};
