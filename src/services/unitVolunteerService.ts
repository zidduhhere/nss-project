import supabase from "@/services/supabase";
import { VolunteerProfile } from "./profileService";

/**
 * Unit Volunteer Service - Handles volunteer management operations for unit coordinators
 * 
 * This service provides functions specifically designed for unit-level volunteer management,
 * including fetching volunteers by unit, updating volunteer status, and bulk operations.
 */

export interface VolunteerFilters {
  unit_id?: string;
  status?: string;
  semester?: number;
  course?: string;
  search?: string;
}

export interface VolunteerUpdateData {
  status?: string;
  unit_id?: string;
  unit_number?: string;
  // Add other fields that units can update
}

export const unitVolunteerService = {
  /**
   * Get all volunteers with optional filters
   * @param filters - Optional filters for unit, status, semester, course, search
   * @returns Promise with array of volunteer profiles
   */
  getAllVolunteers: async (filters?: VolunteerFilters): Promise<VolunteerProfile[]> => {
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
      if (filters?.course) {
        query = query.ilike("course", `%${filters.course}%`);
      }
      if (filters?.search) {
        query = query.or(
          `full_name.ilike.%${filters.search}%,ktu_id.ilike.%${filters.search}%`
        );
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;

      return (data as VolunteerProfile[]) || [];
    } catch (error: any) {
      console.error("Error fetching volunteers:", error);
      throw new Error(error.message || "Failed to fetch volunteers");
    }
  },

  /**
   * Get volunteers by unit ID
   * @param unitId - The unit ID to filter by
   * @returns Promise with array of volunteer profiles
   */
  getVolunteersByUnit: async (unitId: string): Promise<VolunteerProfile[]> => {
    return unitVolunteerService.getAllVolunteers({ unit_id: unitId });
  },

  /**
   * Get volunteers by status
   * @param status - The status to filter by (pending, approved, rejected)
   * @returns Promise with array of volunteer profiles
   */
  getVolunteersByStatus: async (status: string): Promise<VolunteerProfile[]> => {
    return unitVolunteerService.getAllVolunteers({ status });
  },

  /**
   * Get a single volunteer by ID
   * @param volunteerId - The volunteer's database ID
   * @returns Promise with volunteer profile
   */
  getVolunteerById: async (volunteerId: string): Promise<VolunteerProfile> => {
    try {
      const { data, error } = await supabase
        .from("volunteers")
        .select("*")
        .eq("id", volunteerId)
        .single();

      if (error) throw error;

      if (!data) {
        throw new Error("Volunteer not found");
      }

      return data as VolunteerProfile;
    } catch (error: any) {
      console.error("Error fetching volunteer:", error);
      throw new Error(error.message || "Failed to fetch volunteer");
    }
  },

  /**
   * Update volunteer status (approve/reject)
   * @param volunteerId - The volunteer's database ID
   * @param status - New status (approved, rejected, pending)
   * @returns Promise with updated volunteer profile
   */
  updateVolunteerStatus: async (
    volunteerId: string,
    status: string
  ): Promise<VolunteerProfile> => {
    try {
      const { data, error } = await supabase
        .from("volunteers")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", volunteerId)
        .select()
        .single();

      if (error) throw error;

      if (!data) {
        throw new Error("Failed to update volunteer status");
      }

      return data as VolunteerProfile;
    } catch (error: any) {
      console.error("Error updating volunteer status:", error);
      throw new Error(error.message || "Failed to update volunteer status");
    }
  },

  /**
   * Update volunteer information
   * @param volunteerId - The volunteer's database ID
   * @param updates - Partial volunteer data to update
   * @returns Promise with updated volunteer profile
   */
  updateVolunteer: async (
    volunteerId: string,
    updates: VolunteerUpdateData
  ): Promise<VolunteerProfile> => {
    try {
      const { data, error } = await supabase
        .from("volunteers")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", volunteerId)
        .select()
        .single();

      if (error) throw error;

      if (!data) {
        throw new Error("Failed to update volunteer");
      }

      return data as VolunteerProfile;
    } catch (error: any) {
      console.error("Error updating volunteer:", error);
      throw new Error(error.message || "Failed to update volunteer");
    }
  },

  /**
   * Approve multiple volunteers at once
   * @param volunteerIds - Array of volunteer database IDs
   * @returns Promise with array of updated volunteer profiles
   */
  bulkApproveVolunteers: async (
    volunteerIds: string[]
  ): Promise<VolunteerProfile[]> => {
    try {
      const { data, error } = await supabase
        .from("volunteers")
        .update({
          status: "approved",
          updated_at: new Date().toISOString(),
        })
        .in("id", volunteerIds)
        .select();

      if (error) throw error;

      return (data as VolunteerProfile[]) || [];
    } catch (error: any) {
      console.error("Error bulk approving volunteers:", error);
      throw new Error(error.message || "Failed to approve volunteers");
    }
  },

  /**
   * Reject multiple volunteers at once
   * @param volunteerIds - Array of volunteer database IDs
   * @returns Promise with array of updated volunteer profiles
   */
  bulkRejectVolunteers: async (
    volunteerIds: string[]
  ): Promise<VolunteerProfile[]> => {
    try {
      const { data, error } = await supabase
        .from("volunteers")
        .update({
          status: "rejected",
          updated_at: new Date().toISOString(),
        })
        .in("id", volunteerIds)
        .select();

      if (error) throw error;

      return (data as VolunteerProfile[]) || [];
    } catch (error: any) {
      console.error("Error bulk rejecting volunteers:", error);
      throw new Error(error.message || "Failed to reject volunteers");
    }
  },

  /**
   * Delete a volunteer record
   * @param volunteerId - The volunteer's database ID
   * @returns Promise with success status
   */
  deleteVolunteer: async (volunteerId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from("volunteers")
        .delete()
        .eq("id", volunteerId);

      if (error) throw error;
    } catch (error: any) {
      console.error("Error deleting volunteer:", error);
      throw new Error(error.message || "Failed to delete volunteer");
    }
  },

  /**
   * Get volunteer statistics for a unit
   * @param unitId - Optional unit ID to filter by
   * @returns Promise with volunteer statistics
   */
  getVolunteerStats: async (unitId?: string) => {
    try {
      let query = supabase.from("volunteers").select("status, semester");

      if (unitId) {
        query = query.eq("unit_id", unitId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const volunteers = data || [];

      return {
        total: volunteers.length,
        approved: volunteers.filter((v) => v.status === "approved").length,
        pending: volunteers.filter((v) => v.status === "pending").length,
        rejected: volunteers.filter((v) => v.status === "rejected").length,
        bySemester: volunteers.reduce((acc, v) => {
          const sem = v.semester || 0;
          acc[sem] = (acc[sem] || 0) + 1;
          return acc;
        }, {} as Record<number, number>),
      };
    } catch (error: any) {
      console.error("Error fetching volunteer stats:", error);
      throw new Error(error.message || "Failed to fetch volunteer statistics");
    }
  },

  /**
   * Search volunteers by name or KTU ID
   * @param searchQuery - Search term
   * @param unitId - Optional unit ID to filter by
   * @returns Promise with array of matching volunteer profiles
   */
  searchVolunteers: async (
    searchQuery: string,
    unitId?: string
  ): Promise<VolunteerProfile[]> => {
    return unitVolunteerService.getAllVolunteers({
      search: searchQuery,
      unit_id: unitId,
    });
  },
};
