import supabase from "@/services/supabase";
import { CompleteProfile } from "@/types/CompleteProfile";
import { UserProfile } from "@/types/UserProfile";
import { VolunteerProfile } from "@/types/VolunteerProfile";
import { ServiceError, handleSupabaseError } from "@/services/errors";
import { useState, useEffect, useCallback } from "react";

export const profileService = {
  getUserProfile: async (userId: string): Promise<UserProfile> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) handleSupabaseError(error, "User profile not found");
    return data as UserProfile;
  },

  getVolunteerProfile: async (
    userId: string
  ): Promise<VolunteerProfile | null> => {
    const { data, error } = await supabase
      .from("volunteers")
      .select("*")
      .eq("student_id", userId)
      .single();

    // No record found → not registered yet
    if (error && error.code === "PGRST116") return null;
    if (error) handleSupabaseError(error, "Failed to fetch volunteer profile");
    return data as VolunteerProfile;
  },

  getCompleteProfile: async (userId: string): Promise<CompleteProfile> => {
    const [userProfile, volunteerProfile] = await Promise.all([
      profileService.getUserProfile(userId),
      profileService.getVolunteerProfile(userId),
    ]);
    return { userProfile, volunteerProfile };
  },

  updateUserProfile: async (
    userId: string,
    updates: Partial<Omit<UserProfile, "id" | "created_at" | "updated_at">>
  ): Promise<UserProfile> => {
    const { data, error } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single();

    if (error) handleSupabaseError(error, "Failed to update user profile");
    return data as UserProfile;
  },

  isVolunteerRegistered: async (userId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from("volunteers")
      .select("student_id")
      .eq("student_id", userId)
      .single();

    if (error && error.code === "PGRST116") return false;
    if (error) handleSupabaseError(error, "Failed to check registration");
    return !!data;
  },

  getVolunteerStatus: async (userId: string): Promise<string | null> => {
    const { data, error } = await supabase
      .from("volunteers")
      .select("status")
      .eq("student_id", userId)
      .single();

    if (error && error.code === "PGRST116") return null;
    if (error) handleSupabaseError(error, "Failed to fetch volunteer status");
    return data?.status || null;
  },

  updateVolunteerProfile: async (
    userId: string,
    updates: Partial<
      Omit<VolunteerProfile, "id" | "student_id" | "created_at" | "updated_at">
    >
  ): Promise<VolunteerProfile> => {
    const { data, error } = await supabase
      .from("volunteers")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("student_id", userId)
      .select()
      .single();

    if (error) handleSupabaseError(error, "Failed to update volunteer profile");
    return data as VolunteerProfile;
  },
};

/**
 * Hook for fetching and managing volunteers list
 */
export const useVolunteers = (initialFilters?: {
  unit_id?: string;
  status?: string;
  semester?: number;
}) => {
  const [volunteers, setVolunteers] = useState<VolunteerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchVolunteers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase.from("volunteers").select("*");

      if (filters?.unit_id) query = query.eq("unit_id", filters.unit_id);
      if (filters?.status) query = query.eq("status", filters.status);
      if (filters?.semester) query = query.eq("semester", filters.semester);

      const { data, error: fetchError } = await query.order("created_at", {
        ascending: false,
      });

      if (fetchError) throw fetchError;
      setVolunteers(data as VolunteerProfile[]);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch volunteers";
      setError(errorMessage);
      console.error("Error fetching volunteers:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const applyFilters = (newFilters?: {
    unit_id?: string;
    status?: string;
    semester?: number;
  }) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  return { volunteers, isLoading, error, refetch: fetchVolunteers, applyFilters };
};
