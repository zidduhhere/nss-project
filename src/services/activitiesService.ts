import supabase from "@/services/supabase";
import { handleSupabaseError } from "@/services/errors";
import {
  PaginationParams,
  resolvePagination,
  buildPaginatedResult,
  PaginatedResult,
} from "@/services/pagination";

export type ActivityType =
  | "camp"
  | "blood_donation"
  | "tree_planting"
  | "workshop"
  | "awareness"
  | "other";

export type ActivityStatus = "upcoming" | "ongoing" | "completed" | "cancelled";
export type ApprovalStatus = "pending" | "approved" | "rejected" | "changes_requested";

export interface Activity {
  id: string;
  title: string;
  description: string;
  activity_type: ActivityType;
  custom_type_name: string | null;
  location: string | null;
  start_date: string;
  end_date: string | null;
  status: ActivityStatus;
  organizer: string | null;
  max_participants: number | null;
  cover_image_url: string | null;
  unit_id: string | null;
  duration_hours: number | null;
  students_attended: number | null;
  report: string | null;
  image_urls: string[];
  approval_status: ApprovalStatus;
  admin_remarks: string | null;
  template_id: string | null;
  ai_generated: boolean;
  image_metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface CreateActivityData {
  title: string;
  description: string;
  activity_type: ActivityType;
  custom_type_name?: string;
  location?: string;
  start_date: string;
  end_date?: string;
  duration_hours?: number;
  students_attended?: number;
  report?: string;
  organizer?: string;
  max_participants?: number;
}

export interface ActivityFilters {
  unit_id?: string;
  activity_type?: ActivityType | "all";
  approval_status?: ApprovalStatus | "all";
  district?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
}

export const activitiesService = {
  // =============================================
  // Read operations (existing + extended)
  // =============================================

  getAllActivities: async (
    pagination?: PaginationParams
  ): Promise<PaginatedResult<Activity>> => {
    const { page, pageSize, from, to } = resolvePagination(pagination);

    const { data, error, count } = await supabase
      .from("activities")
      .select("*", { count: "exact" })
      .order("start_date", { ascending: false })
      .range(from, to);

    if (error) handleSupabaseError(error, "Failed to fetch activities");
    return buildPaginatedResult(
      (data as Activity[]) || [],
      count ?? 0,
      page,
      pageSize
    );
  },

  getUnitActivities: async (
    unitId: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<Activity>> => {
    const { page, pageSize, from, to } = resolvePagination(pagination);

    const { data, error, count } = await supabase
      .from("activities")
      .select("*", { count: "exact" })
      .eq("unit_id", unitId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) handleSupabaseError(error, "Failed to fetch unit activities");
    return buildPaginatedResult(
      (data as Activity[]) || [],
      count ?? 0,
      page,
      pageSize
    );
  },

  getActivityById: async (id: string): Promise<Activity> => {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("id", id)
      .single();

    if (error) handleSupabaseError(error, "Failed to fetch activity");
    return data as Activity;
  },

  // =============================================
  // Admin filtered view
  // =============================================

  getFilteredActivities: async (
    filters: ActivityFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<Activity & { unit_number?: string; college_name?: string; college_district?: string }>> => {
    const { page, pageSize, from, to } = resolvePagination(pagination);

    let query = supabase
      .from("activities")
      .select("*, nss_units!left(unit_number, college_id, colleges!left(name, district))", { count: "exact" });

    if (filters.unit_id) query = query.eq("unit_id", filters.unit_id);
    if (filters.activity_type && filters.activity_type !== "all") query = query.eq("activity_type", filters.activity_type);
    if (filters.approval_status && filters.approval_status !== "all") query = query.eq("approval_status", filters.approval_status);
    if (filters.start_date) query = query.gte("start_date", filters.start_date);
    if (filters.end_date) query = query.lte("start_date", filters.end_date);
    if (filters.search) query = query.ilike("title", `%${filters.search}%`);

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) handleSupabaseError(error, "Failed to fetch filtered activities");

    const items = (data || []).map((row: any) => {
      const unit = row.nss_units;
      const college = unit?.colleges;
      return {
        ...row,
        nss_units: undefined,
        unit_number: unit?.unit_number || null,
        college_name: college?.name || null,
        college_district: college?.district || null,
      };
    });

    // Client-side district filter (since it's through a nested join)
    const filtered = filters.district
      ? items.filter((item: any) => item.college_district === filters.district)
      : items;

    return buildPaginatedResult(
      filtered,
      filters.district ? filtered.length : (count ?? 0),
      page,
      pageSize
    );
  },

  // =============================================
  // Create / Update operations
  // =============================================

  createActivity: async (
    unitId: string,
    data: CreateActivityData,
    images: File[]
  ): Promise<Activity> => {
    // Upload images first
    const imageUrls: string[] = [];
    for (const file of images) {
      const filePath = `${unitId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("activity-images")
        .upload(filePath, file);

      if (uploadError) {
        handleSupabaseError(uploadError, `Failed to upload image: ${file.name}`);
      }

      const { data: publicURL } = supabase.storage
        .from("activity-images")
        .getPublicUrl(uploadData!.path);

      imageUrls.push(publicURL.publicUrl);
    }

    const { data: activity, error } = await supabase
      .from("activities")
      .insert({
        unit_id: unitId,
        title: data.title,
        description: data.description,
        activity_type: data.activity_type,
        custom_type_name: data.activity_type === "other" ? data.custom_type_name : null,
        location: data.location || null,
        start_date: data.start_date,
        end_date: data.end_date || null,
        duration_hours: data.duration_hours || null,
        students_attended: data.students_attended || null,
        report: data.report || null,
        organizer: data.organizer || null,
        max_participants: data.max_participants || null,
        image_urls: imageUrls,
        status: "completed",
        approval_status: "pending",
      })
      .select()
      .single();

    if (error) handleSupabaseError(error, "Failed to create activity");
    return activity as Activity;
  },

  // =============================================
  // Admin status management
  // =============================================

  updateApprovalStatus: async (
    activityId: string,
    status: ApprovalStatus,
    remarks?: string
  ): Promise<Activity> => {
    const { data, error } = await supabase
      .from("activities")
      .update({
        approval_status: status,
        admin_remarks: remarks || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", activityId)
      .select()
      .single();

    if (error) handleSupabaseError(error, "Failed to update activity status");
    return data as Activity;
  },

  // =============================================
  // Image operations
  // =============================================

  deleteImage: async (imageUrl: string): Promise<void> => {
    // Extract path from URL
    const url = new URL(imageUrl);
    const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/activity-images\/(.*)/);
    if (!pathMatch) return;

    const { error } = await supabase.storage
      .from("activity-images")
      .remove([pathMatch[1]]);

    if (error) handleSupabaseError(error, "Failed to delete image");
  },

  // =============================================
  // Legacy read operations (kept for compatibility)
  // =============================================

  getUpcomingActivities: async (
    pagination?: PaginationParams
  ): Promise<PaginatedResult<Activity>> => {
    const { page, pageSize, from, to } = resolvePagination(pagination);

    const { data, error, count } = await supabase
      .from("activities")
      .select("*", { count: "exact" })
      .in("status", ["upcoming", "ongoing"])
      .gte("start_date", new Date().toISOString())
      .order("start_date", { ascending: true })
      .range(from, to);

    if (error) handleSupabaseError(error, "Failed to fetch upcoming activities");
    return buildPaginatedResult(
      (data as Activity[]) || [],
      count ?? 0,
      page,
      pageSize
    );
  },

  getPastActivities: async (
    pagination?: PaginationParams
  ): Promise<PaginatedResult<Activity>> => {
    const { page, pageSize, from, to } = resolvePagination(pagination);

    const { data, error, count } = await supabase
      .from("activities")
      .select("*", { count: "exact" })
      .eq("status", "completed")
      .order("start_date", { ascending: false })
      .range(from, to);

    if (error) handleSupabaseError(error, "Failed to fetch past activities");
    return buildPaginatedResult(
      (data as Activity[]) || [],
      count ?? 0,
      page,
      pageSize
    );
  },

  getActivitiesByType: async (
    type: Activity["activity_type"],
    pagination?: PaginationParams
  ): Promise<PaginatedResult<Activity>> => {
    const { page, pageSize, from, to } = resolvePagination(pagination);

    const { data, error, count } = await supabase
      .from("activities")
      .select("*", { count: "exact" })
      .eq("activity_type", type)
      .order("start_date", { ascending: false })
      .range(from, to);

    if (error) handleSupabaseError(error, "Failed to fetch activities");
    return buildPaginatedResult(
      (data as Activity[]) || [],
      count ?? 0,
      page,
      pageSize
    );
  },
};
