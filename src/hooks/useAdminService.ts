import { useState, useEffect, useCallback } from "react";
import { UseAuthContext } from "@/context/AuthContext";
import { adminService } from "@/services/adminService";
import { AdminProfile, AdminStats } from "@/types/AdminProfile";
import { VolunteerProfile } from "@/types/VolunteerProfile";
import type { UserWithDetails, UserFilters, UserStats } from "@/types/UserWithDetails";

/**
 * Custom hook for admin profile management
 * 
 * Fetches and manages admin profile data from the profiles table.
 * Automatically fetches on mount and provides refresh capability.
 * 
 * @returns Admin profile data, loading state, error, and refetch function
 */
export const useAdminProfile = () => {
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { session } = UseAuthContext();

  const fetchAdminProfile = useCallback(async () => {
    if (!session?.user?.id) {
      setError("No authenticated user found");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const profile = await adminService.getAdminProfile(session.user.id);
      setAdminProfile(profile);
    } catch (err: any) {
      setError(err.message || "Failed to fetch admin profile");
      setAdminProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchAdminProfile();
  }, [fetchAdminProfile]);

  return {
    adminProfile,
    isLoading,
    error,
    refetch: fetchAdminProfile,
  };
};

/**
 * Custom hook for updating admin profile
 * 
 * Provides functionality to update admin profile fields with loading and error states.
 * 
 * @returns Update function, loading states, and error/success states
 */
export const useUpdateAdminProfile = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { session } = UseAuthContext();

  const updateAdminProfile = async (
    updates: Partial<Omit<AdminProfile, "id" | "email" | "role" | "created_at" | "updated_at">>
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
      const updatedProfile = await adminService.updateAdminProfile(
        session.user.id,
        updates
      );
      setUpdateSuccess(true);
      return updatedProfile;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update admin profile";
      setUpdateError(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const resetUpdateState = () => {
    setUpdateError(null);
    setUpdateSuccess(false);
  };

  return {
    updateAdminProfile,
    isUpdating,
    updateError,
    updateSuccess,
    resetUpdateState,
  };
};

/**
 * Custom hook for system-wide statistics
 * 
 * Fetches comprehensive statistics for the admin dashboard including
 * volunteer counts, pending approvals, recent registrations, etc.
 * 
 * @returns System stats, loading state, error, and refetch function
 */
export const useSystemStats = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const systemStats = await adminService.getSystemStats();
      setStats(systemStats);
    } catch (err: any) {
      setError(err.message || "Failed to fetch system statistics");
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
};

/**
 * Custom hook for managing volunteers (admin view)
 * 
 * Provides comprehensive volunteer management functionality including
 * filtering, search, status updates, and bulk operations.
 * 
 * @returns Volunteers data, operations, and state management
 */
export const useAdminVolunteerManagement = () => {
  const [volunteers, setVolunteers] = useState<VolunteerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    status?: string;
    unit_id?: string;
    search?: string;
  }>({});

  const fetchVolunteers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await adminService.getAllVolunteers(filters);
      setVolunteers(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch volunteers");
      setVolunteers([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  const updateVolunteerStatus = async (
    volunteerId: string,
    status: "pending" | "approved" | "rejected"
  ) => {
    setIsUpdating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await adminService.updateVolunteerStatus(volunteerId, status);
      setSuccessMessage(`Volunteer status updated to ${status}`);
      await fetchVolunteers();
    } catch (err: any) {
      setError(err.message || "Failed to update volunteer status");
    } finally {
      setIsUpdating(false);
    }
  };

  const bulkApprove = async (volunteerIds: string[]) => {
    setIsUpdating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const count = await adminService.bulkApproveVolunteers(volunteerIds);
      setSuccessMessage(`Successfully approved ${count} volunteer(s)`);
      await fetchVolunteers();
    } catch (err: any) {
      setError(err.message || "Failed to approve volunteers");
    } finally {
      setIsUpdating(false);
    }
  };

  const bulkReject = async (volunteerIds: string[]) => {
    setIsUpdating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const count = await adminService.bulkRejectVolunteers(volunteerIds);
      setSuccessMessage(`Successfully rejected ${count} volunteer(s)`);
      await fetchVolunteers();
    } catch (err: any) {
      setError(err.message || "Failed to reject volunteers");
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteVolunteer = async (volunteerId: string) => {
    setIsUpdating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await adminService.deleteVolunteer(volunteerId);
      setSuccessMessage("Volunteer deleted successfully");
      await fetchVolunteers();
    } catch (err: any) {
      setError(err.message || "Failed to delete volunteer");
    } finally {
      setIsUpdating(false);
    }
  };

  const updateFilters = useCallback((newFilters: {
    status?: string;
    unit_id?: string;
    search?: string;
  }) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  return {
    volunteers,
    isLoading,
    isUpdating,
    error,
    successMessage,
    filters,
    updateVolunteerStatus,
    bulkApprove,
    bulkReject,
    deleteVolunteer,
    updateFilters,
    clearFilters,
    clearMessages,
    refetch: fetchVolunteers,
  };
};

/**
 * Custom hook for managing users with advanced filtering (admin view)
 * 
 * Manages the list of all users (students and units) with volunteer application counts.
 * Supports debounced search and filtering by role and district.
 * 
 * @returns Users data, stats, loading state, error, filters, and management functions
 */
export const useAdminUserManagement = () => {
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [filters, setFilters] = useState<UserFilters>({});
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    totalStudents: 0,
    totalUnits: 0,
    studentsWithApplications: 0,
  });

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminService.getAllUsersWithDetails(filters);
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const statsData = await adminService.getUserStats();
      setStats(statsData);
    } catch (err: any) {
      console.error("Error fetching user stats:", err);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const updateFilters = useCallback((newFilters: UserFilters) => {
    setFilters((prev: UserFilters) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  const refetch = useCallback(async () => {
    await Promise.all([fetchUsers(), fetchStats()]);
  }, [fetchUsers, fetchStats]);

  return {
    users,
    stats,
    isLoading,
    error,
    successMessage,
    filters,
    updateFilters,
    clearFilters,
    clearMessages,
    refetch,
  };
};

/**
 * Custom hook for recent registrations
 * 
 * Fetches the most recent volunteer registrations for the admin dashboard.
 * 
 * @param limit - Number of recent records to fetch
 * @returns Recent registrations, loading state, and error
 */
export const useRecentRegistrations = (limit: number = 10) => {
  const [registrations, setRegistrations] = useState<VolunteerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRegistrations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await adminService.getRecentRegistrations(limit);
      setRegistrations(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch recent registrations");
      setRegistrations([]);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  return {
    registrations,
    isLoading,
    error,
    refetch: fetchRegistrations,
  };
};
