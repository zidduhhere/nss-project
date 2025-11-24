import { useState, useEffect, useCallback } from "react";
import { unitProfileService } from "@/services/unitProfileService";
import {
  UnitProfileWithCollege,
  UnitProfileUpdate,
  UnitStats,
} from "@/types/UnitProfile";

/**
 * Custom hook for managing unit profile state and operations
 * 
 * Provides a complete interface for unit profile management including:
 * - Profile data fetching with college information
 * - Profile updates with optimistic UI
 * - Statistics aggregation
 * - Password reset functionality
 * - Error handling and loading states
 * 
 * @param {string} unitId - The UUID of the unit from the profiles table
 * 
 * @returns {Object} Hook state and functions:
 *   - profile: Current unit profile with college details
 *   - stats: Unit statistics (volunteers, approvals, etc.)
 *   - isLoading: Loading state for initial data fetch
 *   - isUpdating: Loading state for profile updates
 *   - error: Error message if any operation fails
 *   - updateProfile: Function to update profile data
 *   - refreshProfile: Function to refetch profile data
 *   - refreshStats: Function to refetch statistics
 *   - resetPassword: Function to initiate password reset
 * 
 * @example
 * // Basic usage in a component
 * function UnitProfile() {
 *   const { profile, stats, isLoading, updateProfile } = useUnitProfile(unitId);
 *   
 *   if (isLoading) return <Loading />;
 *   
 *   return (
 *     <div>
 *       <h1>{profile.unit_number}</h1>
 *       <p>{profile.college_name}</p>
 *       <p>Total Volunteers: {stats.totalVolunteers}</p>
 *     </div>
 *   );
 * }
 * 
 * @example
 * // With profile editing
 * const { profile, updateProfile, isUpdating } = useUnitProfile(unitId);
 * 
 * const handleSave = async (updates) => {
 *   try {
 *     await updateProfile(updates);
 *     alert('Profile updated successfully');
 *   } catch (error) {
 *     alert('Update failed: ' + error.message);
 *   }
 * };
 * 
 * @example
 * // With password reset
 * const { profile, resetPassword } = useUnitProfile(unitId);
 * 
 * const handleReset = async () => {
 *   if (confirm('Send password reset email?')) {
 *     await resetPassword();
 *     alert('Reset email sent to ' + profile.po_email);
 *   }
 * };
 */
export function useUnitProfile(unitId: string) {
  const [profile, setProfile] = useState<UnitProfileWithCollege | null>(null);
  const [stats, setStats] = useState<UnitStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch unit profile data
   * Optimized to fetch profile and stats in parallel
   */
  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch profile and stats in parallel for better performance
      const [profileData, statsData] = await Promise.all([
        unitProfileService.getUnitProfile(unitId),
        unitProfileService.getUnitStats(unitId),
      ]);

      setProfile(profileData);
      setStats(statsData);
    } catch (err: any) {
      console.error("Error fetching unit profile:", err);
      setError(err.message || "Failed to load unit profile");
    } finally {
      setIsLoading(false);
    }
  }, [unitId]);

  /**
   * Fetch only statistics (for periodic updates without refreshing profile)
   */
  const fetchStats = useCallback(async () => {
    try {
      const statsData = await unitProfileService.getUnitStats(unitId);
      setStats(statsData);
    } catch (err: any) {
      console.error("Error fetching unit stats:", err);
      // Don't set global error for stats-only failures
    }
  }, [unitId]);

  /**
   * Update unit profile with optimistic UI update
   */
  const updateProfile = useCallback(
    async (updates: UnitProfileUpdate) => {
      if (!profile) {
        throw new Error("Profile not loaded");
      }

      try {
        setIsUpdating(true);
        setError(null);

        // Optimistic update - immediately update UI
        const optimisticProfile = { ...profile, ...updates };
        setProfile(optimisticProfile);

        // Perform actual update
        const updatedProfile = await unitProfileService.updateUnitProfile(
          profile.unit_number,
          updates
        );

        // Update with server response (includes college info)
        setProfile({ ...profile, ...updatedProfile });
      } catch (err: any) {
        console.error("Error updating unit profile:", err);
        setError(err.message || "Failed to update profile");
        
        // Revert optimistic update on error by refetching
        await fetchProfile();
        
        throw err; // Re-throw so caller can handle
      } finally {
        setIsUpdating(false);
      }
    },
    [profile, fetchProfile]
  );

  /**
   * Initiate password reset
   */
  const resetPassword = useCallback(async () => {
    if (!profile?.po_email) {
      throw new Error("Email address not found in profile");
    }

    try {
      setError(null);
      await unitProfileService.requestPasswordReset(profile.po_email);
    } catch (err: any) {
      console.error("Error requesting password reset:", err);
      setError(err.message || "Failed to send password reset email");
      throw err;
    }
  }, [profile]);

  /**
   * Refresh profile data (manual refresh)
   */
  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  /**
   * Refresh only stats (useful for periodic updates)
   */
  const refreshStats = useCallback(async () => {
    await fetchStats();
  }, [fetchStats]);

  // Initial data fetch
  useEffect(() => {
    if (unitId) {
      fetchProfile();
    }
  }, [unitId, fetchProfile]);

  return {
    profile,
    stats,
    isLoading,
    isUpdating,
    error,
    updateProfile,
    refreshProfile,
    refreshStats,
    resetPassword,
  };
}
