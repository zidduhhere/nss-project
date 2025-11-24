import supabase from "@/services/supabase";
import { CompleteProfile } from "@/types/CompleteProfile";
import { UserProfile } from "@/types/UserProfile";
import { VolunteerProfile } from "@/types/VolunteerProfile";
import { useState, useEffect, useCallback } from "react";
/**
 * Profile data type from the profiles table
 */

/**
 * Volunteer data type from the volunteers table
 */

/**
 * Combined profile data including user profile and volunteer registration
 */


/**
 * Profile Service - Handles all profile-related Supabase operations
 */
export const profileService = {
  /**
   * Get user profile from profiles table
   * @param userId - User's UUID from auth
   * @returns Promise with user profile data
   */
  getUserProfile: async (userId: string): Promise<UserProfile> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      
      if (!data) {
        throw new Error("User profile not found");
      }

      return data as UserProfile;
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      throw new Error(error.message || "Failed to fetch user profile");
    }
  },

  /**
   * Get volunteer registration data by student_id
   * @param userId - User's UUID from auth (maps to student_id in volunteers table)
   * @returns Promise with volunteer profile data or null if not registered
   */
  getVolunteerProfile: async (userId: string): Promise<VolunteerProfile | null> => {
    try {
      const { data, error } = await supabase
        .from("volunteers")
        .select("*")
        .eq("student_id", userId)
        .single();


      // If no volunteer record found, return null (not an error)
      if (error && error.code === 'PGRST116') {
        return null;
      }

      if (error) throw error;

      return data as VolunteerProfile;
    } catch (error: any) {
      console.error("Error fetching volunteer profile:", error);
      throw new Error(error.message || "Failed to fetch volunteer profile");
    }
  },

  /**
   * Get complete profile (user + volunteer data)
   * @param userId - User's UUID from auth
   * @returns Promise with complete profile data
   */
  getCompleteProfile: async (userId: string): Promise<CompleteProfile> => {
    try {
      const [userProfile, volunteerProfile] = await Promise.all([
        profileService.getUserProfile(userId),
        profileService.getVolunteerProfile(userId),
      ]);

      return {
        userProfile,
        volunteerProfile,
      };
    } catch (error: any) {
      console.error("Error fetching complete profile:", error);
      throw new Error(error.message || "Failed to fetch complete profile");
    }
  },

  /**
   * Update user profile in profiles table
   * @param userId - User's UUID from auth
   * @param updates - Partial user profile data to update
   * @returns Promise with updated user profile
   */
  updateUserProfile: async (
    userId: string,
    updates: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<UserProfile> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;

      return data as UserProfile;
    } catch (error: any) {
      console.error("Error updating user profile:", error);
      throw new Error(error.message || "Failed to update user profile");
    }
  },

  /**
   * Check if user has registered as volunteer
   * @param userId - User's UUID from auth
   * @returns Promise with boolean indicating volunteer registration status
   */
  isVolunteerRegistered: async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("volunteers")
        .select("id")
        .eq("student_id", userId)
        .single();

      if (error && error.code === 'PGRST116') {
        return false; // No record found
      }

      if (error) throw error;

      return !!data;
    } catch (error: any) {
      console.error("Error checking volunteer registration:", error);
      return false;
    }
  },

  /**
   * Get volunteer registration status
   * @param userId - User's UUID from auth
   * @returns Promise with status string or null if not registered
   */
  getVolunteerStatus: async (userId: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from("volunteers")
        .select("status")
        .eq("student_id", userId)
        .single();

      if (error && error.code === 'PGRST116') {
        return null; // Not registered
      }

      if (error) throw error;

      return data?.status || null;
    } catch (error: any) {
      console.error("Error fetching volunteer status:", error);
      return null;
    }
  },

  /**
   * Update volunteer profile in volunteers table
   * @param userId - User's UUID from auth (maps to student_id)
   * @param updates - Partial volunteer profile data to update
   * @returns Promise with updated volunteer profile
   */
  updateVolunteerProfile: async (
    userId: string,
    updates: Partial<Omit<VolunteerProfile, 'id' | 'student_id' | 'created_at' | 'updated_at'>>
  ): Promise<VolunteerProfile> => {
    try {
      const { data, error } = await supabase
        .from("volunteers")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("student_id", userId)
        .select()
        .single();

      if (error) throw error;

      if (!data) {
        throw new Error("Volunteer profile not found");
      }

      return data as VolunteerProfile;
    } catch (error: any) {
      console.error("Error updating volunteer profile:", error);
      throw new Error(error.message || "Failed to update volunteer profile");
    }
  },
  
};



/**
 * Custom hook for fetching and managing volunteers list
 * 
 * This hook provides functionality to fetch all volunteers with optional filters.
 * It handles loading states, error management, and provides search/filter capabilities.
 * Use this in unit dashboards or admin panels that need to display volunteer lists.
 * 
 * @param filters - Optional filters for unit, status, semester
 * @returns {Object} Volunteers data, loading and error states
 * @property {VolunteerProfile[]} volunteers - Array of volunteer profile records
 * @property {boolean} isLoading - Loading state during fetch operation
 * @property {string | null} error - Error message if fetch fails
 * @property {Function} refetch - Manually refetch volunteers list
 * @property {Function} applyFilters - Apply new filters and refetch
 * 
 * @example
 * ```tsx
 * const { 
 *   volunteers, 
 *   isLoading, 
 *   error,
 *   applyFilters 
 * } = useVolunteers({ status: 'pending' });
 * 
 * // Apply new filters
 * const handleFilterChange = (status: string) => {
 *   applyFilters({ status });
 * };
 * ```
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

      // Apply filters if provided
      if (filters?.unit_id) {
        query = query.eq("unit_id", filters.unit_id);
      }
      if (filters?.status) {
        query = query.eq("status", filters.status);
      }
      if (filters?.semester) {
        query = query.eq("semester", filters.semester);
      }

      const { data, error: fetchError } = await query.order("created_at", {
        ascending: false,
      });

      if (fetchError) throw fetchError;

      setVolunteers(data as VolunteerProfile[]);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch volunteers";
      setError(errorMessage);
      console.error("Error fetching volunteers:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  /**
   * Apply new filters and refetch data
   */
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

  return {
    volunteers,
    isLoading,
    error,
    refetch: fetchVolunteers,
    applyFilters,
  };
};

