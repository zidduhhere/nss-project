import { useState, useEffect, useCallback } from "react";
import {
  profileService,

} from "@/services/profileService";
import { UseAuthContext } from "@/context/AuthContext";
import { UserProfile } from "@/types/UserProfile";
import { VolunteerProfile } from "@/types/VolunteerProfile";
import { CompleteProfile } from "@/types/CompleteProfile";

/**
 * Custom hook for managing user profile data from the profiles table
 * 
 * This hook provides state management and CRUD operations for the authenticated user's
 * profile information. It automatically fetches the profile when the user is authenticated
 * and provides methods to update the profile.
 * 
 * @returns {Object} Profile state and methods
 * @property {UserProfile | null} profile - The user's profile data from the profiles table
 * @property {boolean} isLoading - Loading state indicator for async operations
 * @property {string | null} error - Error message if any operation fails
 * @property {Function} refetch - Function to manually refetch the profile data
 * @property {Function} updateProfile - Function to update profile fields
 * 
 * @example
 * ```tsx
 * const { profile, isLoading, error, updateProfile } = useUserProfile();
 * 
 * if (isLoading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage message={error} />;
 * 
 * // Display profile
 * console.log(profile?.full_name);
 * 
 * // Update profile
 * await updateProfile({ display_name: "New Name" });
 * ```
 * 
 * @remarks
 * - Automatically fetches profile data when session.user.id is available
 * - Uses memoized callbacks to prevent unnecessary re-renders
 * - Throws errors during updates for proper error handling in forms
 * - Sets error state for display purposes but also throws for catch blocks
 */
export const useUserProfile = () => {
  // State for storing the user's profile data
  const [profile, setProfile] = useState<UserProfile | null>(null);
  // Loading state to show spinners/skeletons during async operations
  const [isLoading, setIsLoading] = useState(false);
  // Error state to display error messages to users
  const [error, setError] = useState<string | null>(null);
  // Get current authentication session
  const { session } = UseAuthContext();

  /**
   * Fetches the user profile from the database
   * Memoized with useCallback to prevent unnecessary re-renders
   * Dependencies: session.user.id
   */
  const fetchProfile = useCallback(async () => {
    // Guard clause: Ensure user is authenticated
    if (!session?.user?.id) {
      setError("User not authenticated");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch profile data using the profile service
      const data = await profileService.getUserProfile(session.user.id);
      setProfile(data);
    } catch (err: any) {
      // Set error state for UI display
      setError(err.message || "Failed to load profile");
      console.error("Error fetching user profile:", err);
    } finally {
      // Always reset loading state
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  /**
   * Updates the user profile with new data
   * 
   * @param updates - Partial user profile object with fields to update
   * @returns Promise<UserProfile> - The updated profile data
   * @throws {Error} If user is not authenticated or update fails
   * 
   * @example
   * ```tsx
   * try {
   *   await updateProfile({ 
   *     display_name: "John Doe",
   *     mobile_number: "9876543210"
   *   });
   *   // Success handling
   * } catch (error) {
   *   // Error handling
   * }
   * ```
   */
  const updateProfile = async (
    updates: Partial<Omit<UserProfile, "id" | "created_at" | "updated_at">>
  ) => {
    // Guard clause: Ensure user is authenticated
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call profile service to update in database
      const updatedProfile = await profileService.updateUserProfile(
        session.user.id,
        updates
      );
      // Update local state with new profile data
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err: any) {
      // Set error state and re-throw for caller's catch block
      setError(err.message || "Failed to update profile");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Effect: Auto-fetch profile when user becomes authenticated
   * Runs when session.user.id or fetchProfile function changes
   */
  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session?.user?.id, fetchProfile]);

  return {
    profile,
    isLoading,
    error,
    refetch: fetchProfile,
    updateProfile,
  };
};

/**
 * Custom hook for managing volunteer registration profile data
 * 
 * This hook fetches and manages volunteer registration data from the volunteers table
 * using the student_id (which maps to the authenticated user's ID). It provides methods
 * to check registration status and retrieve volunteer-specific information.
 * 
 * @returns {Object} Volunteer profile state and methods
 * @property {VolunteerProfile | null} volunteerProfile - Complete volunteer registration data
 * @property {boolean} isLoading - Loading state for async operations
 * @property {string | null} error - Error message if operations fail
 * @property {boolean} isRegistered - Quick check if user has volunteer registration
 * @property {Function} refetch - Manually refetch volunteer profile data
 * @property {Function} checkRegistrationStatus - Check if user is registered without full data fetch
 * @property {Function} getVolunteerStatus - Get volunteer registration status (pending/approved/rejected)
 * 
 * @example
 * ```tsx
 * const { 
 *   volunteerProfile, 
 *   isRegistered, 
 *   isLoading,
 *   getVolunteerStatus 
 * } = useVolunteerProfile();
 * 
 * if (!isRegistered) {
 *   return <VolunteerRegistrationForm />;
 * }
 * 
 * const status = await getVolunteerStatus();
 * if (status === 'pending') {
 *   return <PendingApprovalMessage />;
 * }
 * ```
 * 
 * @remarks
 * - Returns null for volunteerProfile if user hasn't registered as volunteer
 * - Automatically fetches data when user session is available
 * - Useful for conditional rendering based on volunteer registration status
 * - All methods are memoized to optimize performance
 */
export const useVolunteerProfile = () => {
  // State for storing volunteer registration data
  const [volunteerProfile, setVolunteerProfile] =
    useState<VolunteerProfile | null>(null);
  // Loading state for async operations
  const [isLoading, setIsLoading] = useState(false);
  // Error state for displaying error messages
  const [error, setError] = useState<string | null>(null);
  // Quick boolean check for registration status
  const [isRegistered, setIsRegistered] = useState(false);
  // Get current authentication session
  const { session } = UseAuthContext();

  /**
   * Fetches complete volunteer profile data from the volunteers table
   * Uses student_id (mapped to session.user.id) to query the database
   * Sets isRegistered to true if data exists, false otherwise
   * 
   * @remarks
   * - Returns null without error if no volunteer registration exists
   * - Memoized to prevent unnecessary re-fetches
   */
  const fetchVolunteerProfile = useCallback(async () => {
    // Guard clause: Ensure user is authenticated
    if (!session?.user?.id) {
      setError("User not authenticated");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch volunteer data by student_id
      const data = await profileService.getVolunteerProfile(session.user.id);
      setVolunteerProfile(data);
      // Set registration flag based on data existence
      setIsRegistered(!!data);
    } catch (err: any) {
      setError(err.message || "Failed to load volunteer profile");
      console.error("Error fetching volunteer profile:", err);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  /**
   * Lightweight check for volunteer registration status
   * Only fetches the ID field, not the entire profile
   * Useful when you only need to know if user is registered
   * 
   * @example
   * ```tsx
   * await checkRegistrationStatus();
   * if (isRegistered) {
   *   // Show volunteer dashboard
   * }
   * ```
   */
  const checkRegistrationStatus = useCallback(async () => {
    // Guard clause: Return early if not authenticated
    if (!session?.user?.id) return;

    try {
      // Check registration without fetching full profile
      const registered = await profileService.isVolunteerRegistered(
        session.user.id
      );
      setIsRegistered(registered);
    } catch (err) {
      console.error("Error checking registration status:", err);
    }
  }, [session?.user?.id]);

  /**
   * Retrieves the current volunteer registration status
   * Returns the status string: "pending", "approved", or "rejected"
   * 
   * @returns {Promise<string | null>} Status string or null if not registered
   * 
   * @example
   * ```tsx
   * const status = await getVolunteerStatus();
   * switch(status) {
   *   case 'pending':
   *     return <PendingBadge />;
   *   case 'approved':
   *     return <ApprovedBadge />;
   *   case 'rejected':
   *     return <RejectedBadge />;
   *   default:
   *     return <NotRegisteredBadge />;
   * }
   * ```
   */
  const getVolunteerStatus = useCallback(async () => {
    // Guard clause: Return null if not authenticated
    if (!session?.user?.id) return null;

    try {
      // Fetch only the status field
      return await profileService.getVolunteerStatus(session.user.id);
    } catch (err) {
      console.error("Error fetching volunteer status:", err);
      return null;
    }
  }, [session?.user?.id]);

  /**
   * Effect: Auto-fetch volunteer profile when user becomes authenticated
   * Triggers on session.user.id or fetchVolunteerProfile changes
   */
  useEffect(() => {
    if (session?.user?.id) {
      fetchVolunteerProfile();
    }
  }, [session?.user?.id, fetchVolunteerProfile]);

  return {
    volunteerProfile,
    isLoading,
    error,
    isRegistered,
    refetch: fetchVolunteerProfile,
    checkRegistrationStatus,
    getVolunteerStatus,
  };
};

/**
 * Custom hook for managing complete profile data (user profile + volunteer registration)
 * 
 * This hook combines both user profile and volunteer registration data into a single
 * fetch operation using Promise.all for optimal performance. It's ideal for pages
 * that need to display both sets of information simultaneously (e.g., profile pages).
 * 
 * @returns {Object} Complete profile state and convenient accessor properties
 * @property {CompleteProfile | null} completeProfile - Combined profile object with user and volunteer data
 * @property {UserProfile | null} userProfile - Extracted user profile data for easy access
 * @property {VolunteerProfile | null} volunteerProfile - Extracted volunteer profile data (null if not registered)
 * @property {boolean} isVolunteerRegistered - Convenient flag derived from volunteerProfile existence
 * @property {boolean} isLoading - Loading state for the combined fetch operation
 * @property {string | null} error - Error message if either fetch operation fails
 * @property {Function} refetch - Manually refetch both profile datasets
 * 
 * @example
 * ```tsx
 * const { 
 *   userProfile, 
 *   volunteerProfile, 
 *   isVolunteerRegistered,
 *   isLoading 
 * } = useCompleteProfile();
 * 
 * if (isLoading) return <LoadingSkeleton />;
 * 
 * return (
 *   <div>
 *     <h1>{userProfile?.full_name}</h1>
 *     {isVolunteerRegistered && (
 *       <VolunteerDetails data={volunteerProfile} />
 *     )}
 *   </div>
 * );
 * ```
 * 
 * @remarks
 * - Fetches both profiles in parallel for better performance
 * - Provides convenient direct access to userProfile and volunteerProfile
 * - Automatically handles cases where volunteer profile doesn't exist
 * - Preferred over using both useUserProfile and useVolunteerProfile separately
 * - Single loading state for both operations
 */
export const useCompleteProfile = () => {
  // State for storing combined profile data
  const [completeProfile, setCompleteProfile] =
    useState<CompleteProfile | null>(null);
  // Loading state for the combined fetch operation
  const [isLoading, setIsLoading] = useState(false);
  // Error state that captures failures from either fetch operation
  const [error, setError] = useState<string | null>(null);
  // Get current authentication session
  const { session } = UseAuthContext();

  /**
   * Fetches both user profile and volunteer profile in parallel
   * Uses Promise.all to fetch both datasets simultaneously for optimal performance
   * 
   * @remarks
   * - Fetches user profile (always present) and volunteer profile (may be null)
   * - Both fetches run in parallel, not sequentially
   * - If either fetch fails, error state is set
   * - Memoized to prevent unnecessary re-fetches
   */
  const fetchCompleteProfile = useCallback(async () => {
    // Guard clause: Ensure user is authenticated
    if (!session?.user?.id) {
      setError("User not authenticated");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch both profiles in parallel using Promise.all
      const data = await profileService.getCompleteProfile(session.user.id);
      setCompleteProfile(data);
    } catch (err: any) {
      setError(err.message || "Failed to load complete profile");
      console.error("Error fetching complete profile:", err);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  /**
   * Effect: Auto-fetch complete profile when user becomes authenticated
   * Triggers on session.user.id or fetchCompleteProfile changes
   */
  useEffect(() => {
    if (session?.user?.id) {
      fetchCompleteProfile();
    }
  }, [session?.user?.id, fetchCompleteProfile]);

  return {
    // Complete profile object with both user and volunteer data
    completeProfile,
    // Convenient direct access to user profile (avoids nested access)
    userProfile: completeProfile?.userProfile || null,
    // Convenient direct access to volunteer profile (null if not registered)
    volunteerProfile: completeProfile?.volunteerProfile || null,
    // Boolean flag for easy conditional rendering
    isVolunteerRegistered: !!completeProfile?.volunteerProfile,
    isLoading,
    error,
    refetch: fetchCompleteProfile,
  };
};

/**
 * Lightweight hook for checking volunteer registration status
 * 
 * This is an optimized hook that only fetches minimal data (registration status and status field)
 * without loading the complete volunteer profile. Use this when you need to display status
 * badges, conditional navigation, or quick status checks without the overhead of full profile data.
 * 
 * @returns {Object} Volunteer registration status information
 * @property {string | null} status - Registration status: "pending", "approved", "rejected", or null
 * @property {boolean} isRegistered - Whether user has submitted volunteer registration
 * @property {boolean} isLoading - Loading state for status check operations
 * @property {Function} refetch - Manually recheck the registration status
 * 
 * @example
 * ```tsx
 * // In a navigation component
 * const { status, isRegistered, isLoading } = useVolunteerStatus();
 * 
 * if (isLoading) return <Skeleton />;
 * 
 * return (
 *   <nav>
 *     <Link to="/dashboard">Dashboard</Link>
 *     {!isRegistered && (
 *       <Link to="/volunteer-registration">Register as Volunteer</Link>
 *     )}
 *     {isRegistered && status === 'pending' && (
 *       <Badge color="yellow">Pending Approval</Badge>
 *     )}
 *     {status === 'approved' && (
 *       <Badge color="green">Active Volunteer</Badge>
 *     )}
 *   </nav>
 * );
 * ```
 * 
 * @example
 * ```tsx
 * // Conditional page access
 * const { status, isRegistered } = useVolunteerStatus();
 * 
 * if (!isRegistered) {
 *   return <Navigate to="/volunteer-registration" />;
 * }
 * 
 * if (status === 'rejected') {
 *   return <RejectionNoticePage />;
 * }
 * 
 * return <VolunteerDashboard />;
 * ```
 * 
 * @remarks
 * - More efficient than useVolunteerProfile when you only need status
 * - Fetches only id and status fields, not the entire volunteer record
 * - Both checks run in parallel using Promise.all
 * - Ideal for navigation menus, status badges, and access control
 * - Does not set error state - errors are logged but don't break UI
 */
export const useVolunteerStatus = () => {
  // The volunteer registration status ("pending", "approved", "rejected", or null)
  const [status, setStatus] = useState<string | null>(null);
  // Boolean flag indicating if user has registered as volunteer
  const [isRegistered, setIsRegistered] = useState(false);
  // Loading state for status check operations
  const [isLoading, setIsLoading] = useState(false);
  // Get current authentication session
  const { session } = UseAuthContext();

  /**
   * Performs a lightweight status check
   * Fetches both registration flag and status value in parallel
   * 
   * @remarks
   * - Uses Promise.all to fetch both values simultaneously
   * - No error state - failures are logged but don't break the UI
   * - Suitable for non-critical UI elements like badges
   * - Memoized to prevent unnecessary API calls
   */
  const checkStatus = useCallback(async () => {
    // Guard clause: Return early if not authenticated
    if (!session?.user?.id) return;

    setIsLoading(true);

    try {
      // Fetch both registration flag and status in parallel
      const [registered, statusValue] = await Promise.all([
        profileService.isVolunteerRegistered(session.user.id),
        profileService.getVolunteerStatus(session.user.id),
      ]);

      setIsRegistered(registered);
      setStatus(statusValue);
    } catch (err) {
      // Log error but don't set error state - this is a non-critical operation
      console.error("Error checking volunteer status:", err);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  /**
   * Effect: Auto-check status when user becomes authenticated
   * Triggers on session.user.id or checkStatus changes
   */
  useEffect(() => {
    if (session?.user?.id) {
      checkStatus();
    }
  }, [session?.user?.id, checkStatus]);

  return {
    status,
    isRegistered,
    isLoading,
    refetch: checkStatus,
  };
};

/**
 * Custom hook for updating volunteer profile data
 * 
 * This hook provides a clean interface for updating volunteer profile fields in the volunteers table.
 * It handles loading states, error management, and provides feedback for form submissions.
 * Use this in profile editing forms or any component that needs to update volunteer information.
 * 
 * @returns {Object} Update function, loading and error states
 * @property {Function} updateVolunteerProfile - Function to update volunteer profile fields
 * @property {boolean} isUpdating - Loading state during update operation
 * @property {string | null} updateError - Error message if update fails
 * @property {boolean} updateSuccess - Success flag that can be used to show success feedback
 * @property {Function} resetUpdateState - Resets error and success states
 * 
 * @example
 * ```tsx
 * const { 
 *   updateVolunteerProfile, 
 *   isUpdating, 
 *   updateError,
 *   updateSuccess 
 * } = useUpdateVolunteerProfile();
 * 
 * const handleSave = async () => {
 *   try {
 *     await updateVolunteerProfile({
 *       full_name: "John Doe",
 *       contact_number: "9876543210",
 *       blood_group: "O+"
 *     });
 *     // Success - show success message
 *   } catch (error) {
 *     // Error already set in hook state
 *   }
 * };
 * ```
 * 
 * @remarks
 * - Automatically updates updated_at timestamp
 * - Throws errors for proper form validation integration
 * - Provides success state for showing success messages
 * - Does not automatically refetch - call refetch from useCompleteProfile if needed
 */
export const useUpdateVolunteerProfile = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { session } = UseAuthContext();

  /**
   * Updates volunteer profile fields in the database
   * 
   * @param updates - Partial volunteer profile object with fields to update
   * @returns Promise<VolunteerProfile> - The updated volunteer profile data
   * @throws {Error} If user is not authenticated or update fails
   */
  const updateVolunteerProfile = async (
    updates: Partial<Omit<VolunteerProfile, "id" | "student_id" | "created_at" | "updated_at">>
  ) => {
    if (!session?.user?.id) {
      const error = new Error("User not authenticated");
      setUpdateError(error.message);
      throw error;
    }

    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const updatedProfile = await profileService.updateVolunteerProfile(
        session.user.id,
        updates
      );
      setUpdateSuccess(true);
      return updatedProfile;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update volunteer profile";
      setUpdateError(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Resets error and success states
   * Useful for clearing messages when user starts a new edit
   */
  const resetUpdateState = () => {
    setUpdateError(null);
    setUpdateSuccess(false);
  };

  return {
    updateVolunteerProfile,
    isUpdating,
    updateError,
    updateSuccess,
    resetUpdateState,
  };
};

