import { VolunteerFormFields } from "@/types/VolunteerFormSchema";
import supabase from "@/services/supabase";
import { VolunteerProfile } from "@/types/VolunteerProfile";
import { ServiceError, handleSupabaseError } from "@/services/errors";
import { sanitizeFileName, sanitizeFilter } from "@/services/validationSchemas";
import {
  PaginationParams,
  resolvePagination,
  buildPaginatedResult,
  PaginatedResult,
} from "@/services/pagination";

// ── Shared filter interface (replaces duplicate definitions) ──
export interface VolunteerFilters {
  unit_id?: string;
  status?: string;
  semester?: number;
  course?: string;
  search?: string;
  blood_group?: string;
  isActive?: boolean;
}

export interface VolunteerUpdateData {
  status?: string;
  unit_id?: string;
  unit_number?: string;
}

export const volunteerService = {
  // ── Lookup helpers ───────────────────────────────────────────

  getCollegeId: async (studentId: string): Promise<string | null> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("college_id")
      .eq("id", studentId)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      handleSupabaseError(error, "Failed to fetch college ID");
    }
    return data?.college_id || null;
  },

  getCollegeCourses: async (studentId: string) => {
    const collegeId = await volunteerService.getCollegeId(studentId);
    if (!collegeId) {
      throw new ServiceError(
        "College ID not found for the student",
        "NOT_FOUND"
      );
    }

    const { data, error } = await supabase
      .from("courses")
      .select("name, code")
      .eq("college_id", collegeId)
      .order("name", { ascending: true });

    if (error) handleSupabaseError(error, "Failed to fetch college courses");
    return data || [];
  },

  // ── Registration ─────────────────────────────────────────────

  registerVolunteer: async (data: VolunteerFormFields, userId: string) => {
    // Check for duplicate registration
    const { data: existing } = await supabase
      .from("volunteers")
      .select("student_id")
      .eq("student_id", userId)
      .limit(1);

    if (existing && existing.length > 0) {
      throw new ServiceError(
        "You have already registered as a volunteer.",
        "DUPLICATE"
      );
    }

    // Check KTU ID uniqueness
    const { data: ktuCheck } = await supabase
      .from("volunteers")
      .select("ktu_id")
      .eq("ktu_id", data.ktuId)
      .limit(1);

    if (ktuCheck && ktuCheck.length > 0) {
      throw new ServiceError(
        "A volunteer with this KTU ID already exists.",
        "DUPLICATE"
      );
    }

    // Upload photo
    let photoUrl = null;
    if (data.photo instanceof File) {
      const photoFileName = `${Date.now()}_${sanitizeFileName(data.photo.name)}_user_${userId}`;
      const { error: photoError } = await supabase.storage
        .from("volunteer-photos")
        .upload(photoFileName, data.photo);

      if (photoError) {
        throw new ServiceError(
          photoError.message || "Failed to upload photo",
          "STORAGE_ERROR"
        );
      }

      const { data: photoUrlData } = supabase.storage
        .from("volunteer-photos")
        .getPublicUrl(photoFileName);
      photoUrl = photoUrlData.publicUrl;
    }

    // Upload signature
    let signatureUrl = null;
    if (data.signature instanceof File) {
      const signatureFileName = `${Date.now()}_${sanitizeFileName(data.signature.name)}_user_${userId}`;
      const { error: signatureError } = await supabase.storage
        .from("volunteer-signatures")
        .upload(signatureFileName, data.signature);

      if (signatureError) {
        throw new ServiceError(
          signatureError.message || "Failed to upload signature",
          "STORAGE_ERROR"
        );
      }

      const { data: signatureUrlData } = supabase.storage
        .from("volunteer-signatures")
        .getPublicUrl(signatureFileName);
      signatureUrl = signatureUrlData.publicUrl;
    }

    // Resolve unit_number → unit_id
    let unitId = null;
    const unitNumber = data.unit;
    if (unitNumber) {
      const { data: unitData, error: unitError } = await supabase
        .from("nss_units")
        .select("id")
        .eq("unit_number", unitNumber)
        .single();
      if (unitError)
        handleSupabaseError(unitError, "Failed to resolve unit");
      if (unitData) unitId = unitData.id;
    }

    const volunteerData = {
      student_id: userId,
      unit_id: unitId,
      admission_year: data.admissionYear,
      valid_from_year: null,
      valid_to_year: null,
      ktu_id: data.ktuId,
      full_name: data.name,
      status: "pending",
      semester: data.semester,
      course: data.course,
      unit_number: unitNumber,
      enroll_no: null,
      gender: data.gender.toLowerCase(),
      dob: data.dob,
      whatsapp_number: data.whatsappNumber,
      contact_number: data.contactNumber,
      religion: data.religion,
      community: data.community,
      blood_group: data.bloodGroup,
      height: data.height ? parseFloat(data.height) : null,
      weight: data.weight ? parseFloat(data.weight) : null,
      district: data.district,
      taluk: data.taluk,
      village: data.village,
      pincode: data.pincode,
      parent_name: data.parent,
      parent_contact_number: data.parentContact,
      permanent_address: data.permanentAddress,
      current_address: data.permanentAddress,
      photo_url: photoUrl,
      signature_url: signatureUrl,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      languages_known: data.languagesKnown || [],
      area_of_interest: data.areaOfInterest || null,
      hobbies: data.hobbies || null,
      prior_experience: data.priorExperience || null,
      cultural_talents: data.culturalTalents || null,
      camp_interest: data.campInterest || null,
    };

    const { data: volunteer, error: insertError } = await supabase
      .from("volunteers")
      .insert(volunteerData)
      .select()
      .single();

    if (insertError) handleSupabaseError(insertError, "Failed to register volunteer");

    return { success: true, message: "Volunteer registered successfully", data: volunteer };
  },

  // ── CRUD (used by all roles) ─────────────────────────────────

  getVolunteerById: async (id: string): Promise<VolunteerProfile> => {
    const { data, error } = await supabase
      .from("volunteers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) handleSupabaseError(error, "Volunteer not found");
    return data as VolunteerProfile;
  },

  getAllVolunteers: async (
    filters?: VolunteerFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<VolunteerProfile>> => {
    const { page, pageSize, from, to } = resolvePagination(pagination);

    let query = supabase
      .from("volunteers")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (filters?.unit_id) query = query.eq("unit_id", filters.unit_id);
    if (filters?.status && filters.status !== "all")
      query = query.eq("status", filters.status);
    if (filters?.semester) query = query.eq("semester", filters.semester);
    if (filters?.blood_group && filters.blood_group !== "all")
      query = query.eq("blood_group", filters.blood_group);
    if (filters?.course && filters.course !== "all") {
      const safeCourse = sanitizeFilter(filters.course);
      query = query.ilike("course", `%${safeCourse}%`);
    }
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

  // ── Status management ────────────────────────────────────────

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

  bulkUpdateStatus: async (
    volunteerIds: string[],
    status: "approved" | "rejected" | "certified"
  ): Promise<number> => {
    const { data, error } = await supabase
      .from("volunteers")
      .update({ status, updated_at: new Date().toISOString() })
      .in("id", volunteerIds)
      .select();

    if (error) handleSupabaseError(error, `Failed to ${status} volunteers`);
    return data?.length || 0;
  },

  // ── Update / Delete ──────────────────────────────────────────

  updateVolunteer: async (
    id: string,
    updates: VolunteerUpdateData
  ): Promise<VolunteerProfile> => {
    const { data, error } = await supabase
      .from("volunteers")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) handleSupabaseError(error, "Failed to update volunteer");
    return data as VolunteerProfile;
  },

  deleteVolunteer: async (id: string): Promise<void> => {
    const { error } = await supabase.from("volunteers").delete().eq("id", id);
    if (error) handleSupabaseError(error, "Failed to delete volunteer");
  },

  // ── Stats (uses SQL-side counting where possible) ────────────

  getVolunteerStats: async (unitId?: string) => {
    let query = supabase.from("volunteers").select("status, semester");
    if (unitId) query = query.eq("unit_id", unitId);

    const { data, error } = await query;
    if (error) handleSupabaseError(error, "Failed to fetch volunteer statistics");

    const volunteers = data || [];
    return {
      total: volunteers.length,
      approved: volunteers.filter((v) => v.status === "approved").length,
      certified: volunteers.filter((v) => v.status === "certified").length,
      pending: volunteers.filter((v) => v.status === "pending").length,
      rejected: volunteers.filter((v) => v.status === "rejected").length,
      bySemester: volunteers.reduce(
        (acc, v) => {
          const sem = v.semester || 0;
          acc[sem] = (acc[sem] || 0) + 1;
          return acc;
        },
        {} as Record<number, number>
      ),
    };
  },

  // ── Convenience wrappers ─────────────────────────────────────

  getVolunteersByUnit: async (
    unitId: string,
    pagination?: PaginationParams
  ) => volunteerService.getAllVolunteers({ unit_id: unitId }, pagination),

  searchVolunteers: async (
    searchQuery: string,
    unitId?: string,
    pagination?: PaginationParams
  ) =>
    volunteerService.getAllVolunteers(
      { search: searchQuery, unit_id: unitId },
      pagination
    ),
};
