import supabase from "@/services/supabase";
import { handleSupabaseError } from "@/services/errors";
import {
  PaginationParams,
  resolvePagination,
  buildPaginatedResult,
  PaginatedResult,
} from "@/services/pagination";

export interface Activity {
  id: string;
  title: string;
  description: string;
  activity_type:
    | "camp"
    | "blood_donation"
    | "tree_planting"
    | "workshop"
    | "awareness"
    | "other";
  location: string | null;
  start_date: string;
  end_date: string | null;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  organizer: string | null;
  max_participants: number | null;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export const activitiesService = {
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
