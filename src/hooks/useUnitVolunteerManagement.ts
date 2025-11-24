import { useState, useEffect, useCallback } from "react";
import {
  unitVolunteerService,
  VolunteerFilters,
} from "@/services/unitVolunteerService";
import { VolunteerProfile } from "@/services/profileService";

/**
 * Custom hook for managing volunteers in unit dashboard
 * 
 * This hook provides comprehensive volunteer management functionality for unit coordinators,
 * including fetching, filtering, updating status, and bulk operations.
 * 
 * @param initialFilters - Optional initial filters for volunteers
 * @returns Object with volunteers data, loading states, and management functions
 * 
 * @example
 * ```tsx
 * const {
 *   volunteers,
 *   isLoading,
 *   error,
 *   refetch,
 *   applyFilters,
 *   approveVolunteer,
 *   rejectVolunteer,
 *   stats
 * } = useUnitVolunteerManagement({ status: 'pending' });
 * 
 * // Display volunteers
 * if (isLoading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage />;
 * 
 * return (
 *   <div>
 *     <VolunteerTable data={volunteers} />
 *     <Stats data={stats} />
 *   </div>
 * );
 * ```
 */
export const useUnitVolunteerManagement = (initialFilters?: VolunteerFilters) => {
  // State for volunteers list
  const [volunteers, setVolunteers] = useState<VolunteerProfile[]>([]);
  // Loading state for fetch operations
  const [isLoading, setIsLoading] = useState(false);
  // Error state for displaying error messages
  const [error, setError] = useState<string | null>(null);
  // Current active filters
  const [filters, setFilters] = useState<VolunteerFilters | undefined>(initialFilters);
  // Loading state for status update operations
  const [isUpdating, setIsUpdating] = useState(false);
  // Success message for operations
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  // Volunteer statistics
  const [stats, setStats] = useState<{
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    bySemester: Record<number, number>;
  } | null>(null);

  /**
   * Fetches volunteers from the database with current filters
   * Memoized to prevent unnecessary re-renders
   */
  const fetchVolunteers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await unitVolunteerService.getAllVolunteers(filters);
      setVolunteers(data);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch volunteers";
      setError(errorMessage);
      console.error("Error fetching volunteers:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  /**
   * Fetches volunteer statistics
   * Can be filtered by unit ID
   */
  const fetchStats = useCallback(async (unitId?: string) => {
    try {
      const statsData = await unitVolunteerService.getVolunteerStats(unitId);
      setStats(statsData);
    } catch (err: any) {
      console.error("Error fetching stats:", err);
    }
  }, []);

  /**
   * Apply new filters and refetch volunteers
   * @param newFilters - New filter object
   */
  const applyFilters = useCallback((newFilters?: VolunteerFilters) => {
    setFilters(newFilters);
  }, []);

  /**
   * Clear all filters and fetch all volunteers
   */
  const clearFilters = useCallback(() => {
    setFilters(undefined);
  }, []);

  /**
   * Approve a volunteer
   * @param volunteerId - The volunteer's database ID
   * @returns Promise that resolves when operation completes
   */
  const approveVolunteer = useCallback(async (volunteerId: string) => {
    setIsUpdating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await unitVolunteerService.updateVolunteerStatus(volunteerId, "approved");
      setSuccessMessage("Volunteer approved successfully");
      
      // Update local state to reflect the change
      setVolunteers((prev) =>
        prev.map((v) =>
          v.id === volunteerId ? { ...v, status: "approved" } : v
        )
      );

      // Refresh stats
      await fetchStats(filters?.unit_id);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to approve volunteer";
      setError(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [filters?.unit_id, fetchStats]);

  /**
   * Reject a volunteer
   * @param volunteerId - The volunteer's database ID
   * @returns Promise that resolves when operation completes
   */
  const rejectVolunteer = useCallback(async (volunteerId: string) => {
    setIsUpdating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await unitVolunteerService.updateVolunteerStatus(volunteerId, "rejected");
      setSuccessMessage("Volunteer rejected successfully");
      
      // Update local state to reflect the change
      setVolunteers((prev) =>
        prev.map((v) =>
          v.id === volunteerId ? { ...v, status: "rejected" } : v
        )
      );

      // Refresh stats
      await fetchStats(filters?.unit_id);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to reject volunteer";
      setError(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [filters?.unit_id, fetchStats]);

  /**
   * Update volunteer information
   * @param volunteerId - The volunteer's database ID
   * @param updates - Partial volunteer data to update
   * @returns Promise that resolves when operation completes
   */
  const updateVolunteer = useCallback(async (
    volunteerId: string,
    updates: Record<string, any>
  ) => {
    setIsUpdating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updatedVolunteer = await unitVolunteerService.updateVolunteer(
        volunteerId,
        updates as any
      );
      setSuccessMessage("Volunteer updated successfully");
      
      // Update local state
      setVolunteers((prev) =>
        prev.map((v) => (v.id === volunteerId ? updatedVolunteer : v))
      );
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update volunteer";
      setError(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  /**
   * Bulk approve volunteers
   * @param volunteerIds - Array of volunteer database IDs
   * @returns Promise that resolves when operation completes
   */
  const bulkApprove = useCallback(async (volunteerIds: string[]) => {
    setIsUpdating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await unitVolunteerService.bulkApproveVolunteers(volunteerIds);
      setSuccessMessage(`${volunteerIds.length} volunteers approved successfully`);
      
      // Refetch to get updated data
      await fetchVolunteers();
      await fetchStats(filters?.unit_id);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to approve volunteers";
      setError(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [fetchVolunteers, filters?.unit_id, fetchStats]);

  /**
   * Bulk reject volunteers
   * @param volunteerIds - Array of volunteer database IDs
   * @returns Promise that resolves when operation completes
   */
  const bulkReject = useCallback(async (volunteerIds: string[]) => {
    setIsUpdating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await unitVolunteerService.bulkRejectVolunteers(volunteerIds);
      setSuccessMessage(`${volunteerIds.length} volunteers rejected successfully`);
      
      // Refetch to get updated data
      await fetchVolunteers();
      await fetchStats(filters?.unit_id);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to reject volunteers";
      setError(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [fetchVolunteers, filters?.unit_id, fetchStats]);

  /**
   * Delete a volunteer
   * @param volunteerId - The volunteer's database ID
   * @returns Promise that resolves when operation completes
   */
  const deleteVolunteer = useCallback(async (volunteerId: string) => {
    setIsUpdating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await unitVolunteerService.deleteVolunteer(volunteerId);
      setSuccessMessage("Volunteer deleted successfully");
      
      // Remove from local state
      setVolunteers((prev) => prev.filter((v) => v.id !== volunteerId));
      
      // Refresh stats
      await fetchStats(filters?.unit_id);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to delete volunteer";
      setError(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [filters?.unit_id, fetchStats]);

  /**
   * Search volunteers by name or KTU ID
   * @param searchQuery - Search term
   */
  const searchVolunteers = useCallback(async (searchQuery: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await unitVolunteerService.searchVolunteers(
        searchQuery,
        filters?.unit_id
      );
      setVolunteers(data);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to search volunteers";
      setError(errorMessage);
      console.error("Error searching volunteers:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filters?.unit_id]);

  /**
   * Clear success message
   */
  const clearSuccessMessage = useCallback(() => {
    setSuccessMessage(null);
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Effect: Auto-fetch volunteers when filters change
   */
  useEffect(() => {
    fetchVolunteers();
    fetchStats(filters?.unit_id);
  }, [fetchVolunteers, fetchStats, filters?.unit_id]);

  return {
    // Data
    volunteers,
    stats,
    
    // Loading states
    isLoading,
    isUpdating,
    
    // Messages
    error,
    successMessage,
    
    // Filter operations
    filters,
    applyFilters,
    clearFilters,
    
    // CRUD operations
    refetch: fetchVolunteers,
    approveVolunteer,
    rejectVolunteer,
    updateVolunteer,
    deleteVolunteer,
    
    // Bulk operations
    bulkApprove,
    bulkReject,
    
    // Search
    searchVolunteers,
    
    // Message management
    clearSuccessMessage,
    clearError,
  };
};
