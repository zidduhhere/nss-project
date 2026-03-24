import supabase from "@/services/supabase";
import { UnitProfile, UnitProfileWithCollege, UnitProfileUpdate, UnitStats } from "@/types/UnitProfile";
import { ServiceError, handleSupabaseError } from "@/services/errors";
import { courseSchema } from "@/services/validationSchemas";

export const unitProfileService = {
  getUnitProfile: async (unitId: string): Promise<UnitProfileWithCollege> => {
    const { data, error } = await supabase
      .from("profiles_with_unit")
      .select("*")
      .eq("id", unitId)
      .eq("role", "unit")
      .single();

    if (error) handleSupabaseError(error, "Unit profile not found");

    const collegeId = data.unit_college_id || data.college_id;
    let collegeName = null;
    let collegeDistrict = null;

    if (collegeId) {
      const { data: collegeData } = await supabase
        .from("colleges")
        .select("name, district")
        .eq("id", collegeId)
        .single();

      if (collegeData) {
        collegeName = collegeData.name;
        collegeDistrict = collegeData.district;
      }
    }

    return {
      id: data.id,
      unit_number: data.unit_number,
      college_id: collegeId,
      created_at: data.created_at,
      po_name: data.po_name,
      po_phone: data.po_phone,
      po_email: data.po_email,
      po_address: data.po_address,
      po_designation: data.po_designation,
      college_name: collegeName,
      college_district: collegeDistrict,
    } as UnitProfileWithCollege;
  },

  updateUnitProfile: async (
    unitNumber: string,
    updates: UnitProfileUpdate
  ): Promise<UnitProfile> => {
    const { data, error } = await supabase
      .from("nss_units")
      .update(updates)
      .eq("unit_number", unitNumber)
      .select()
      .single();

    if (error) handleSupabaseError(error, "Failed to update unit profile");
    return data as UnitProfile;
  },

  getUnitStats: async (unitId: string): Promise<UnitStats> => {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles_with_unit")
      .select("unit_id, created_at")
      .eq("id", unitId)
      .eq("role", "unit")
      .single();

    if (profileError) handleSupabaseError(profileError, "Unit not found");

    const actualUnitId = profileData?.unit_id;
    if (!actualUnitId) {
      throw new ServiceError("Unit ID not found for this profile", "NOT_FOUND");
    }

    // Use head-only count queries instead of fetching all rows
    const [totalResult, pendingResult, approvedResult, rejectedResult, certifiedResult] =
      await Promise.all([
        supabase.from("volunteers").select("*", { count: "exact", head: true }).eq("unit_id", actualUnitId),
        supabase.from("volunteers").select("*", { count: "exact", head: true }).eq("unit_id", actualUnitId).eq("status", "pending"),
        supabase.from("volunteers").select("*", { count: "exact", head: true }).eq("unit_id", actualUnitId).eq("status", "approved"),
        supabase.from("volunteers").select("*", { count: "exact", head: true }).eq("unit_id", actualUnitId).eq("status", "rejected"),
        supabase.from("volunteers").select("*", { count: "exact", head: true }).eq("unit_id", actualUnitId).eq("status", "certified"),
      ]);

    const establishedYear = profileData?.created_at
      ? new Date(profileData.created_at).getFullYear().toString()
      : undefined;

    return {
      totalVolunteers: totalResult.count || 0,
      pendingApprovals: pendingResult.count || 0,
      approvedVolunteers: approvedResult.count || 0,
      rejectedVolunteers: rejectedResult.count || 0,
      certifiedVolunteers: certifiedResult.count || 0,
      establishedYear,
    };
  },

  requestPasswordReset: async (email: string): Promise<void> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) handleSupabaseError(error, "Failed to send password reset email");
  },

  getCollegeCourses: async (collegeId: string) => {
    const { data, error } = await supabase
      .from("courses")
      .select("id, name, code")
      .eq("college_id", collegeId)
      .order("name", { ascending: true });

    if (error) handleSupabaseError(error, "Failed to fetch college courses");
    return data || [];
  },

  addCourse: async (collegeId: string, courseData: { name: string; code: string }) => {
    const parsed = courseSchema.safeParse(courseData);
    if (!parsed.success) {
      throw new ServiceError(
        parsed.error.issues.map((i) => i.message).join(", "),
        "VALIDATION_ERROR"
      );
    }

    const { data, error } = await supabase
      .from("courses")
      .insert({
        college_id: collegeId,
        name: parsed.data.name,
        code: parsed.data.code,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) handleSupabaseError(error, "Failed to add course");
    return data;
  },

  deleteCourse: async (courseId: string): Promise<void> => {
    const { error } = await supabase.from("courses").delete().eq("id", courseId);
    if (error) handleSupabaseError(error, "Failed to delete course");
  },
};
