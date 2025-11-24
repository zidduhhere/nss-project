import { useState, useEffect, useCallback } from "react";
import { studentService } from "@/services/studentService";
import { UseAuthContext } from "@/context/AuthContext";

export interface DashboardStats {
  isRegistered: boolean;
  volunteerStatus: string | null;
  registrationDate: string | null;
  unitNumber: string | null;
  semester: number | null;
  bloodDonationCount: number;
  treeTaggingCount: number;
  totalActivities: number;
  pendingSubmissions: number;
  approvedActivities: number;
}

export interface RecentActivity {
  id: string;
  type: 'blood-donation' | 'tree-tagging';
  title: string;
  date: string;
  location?: string;
  status: string;
  count?: number;
  createdAt: string;
}

export interface ActivitySummary {
  bloodDonation: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  treeTagging: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

/**
 * Custom hook for managing student dashboard data
 * 
 * This hook provides comprehensive dashboard statistics, recent activities,
 * and notifications for the authenticated student user.
 * 
 * @returns {Object} Dashboard state and methods
 * @property {DashboardStats | null} stats - Dashboard statistics
 * @property {RecentActivity[]} recentActivities - List of recent submissions
 * @property {ActivitySummary | null} activitySummary - Detailed activity breakdown
 * @property {any[]} notifications - User notifications
 * @property {boolean} isLoading - Loading state indicator
 * @property {string | null} error - Error message if any operation fails
 * @property {Function} refetch - Function to manually refetch all dashboard data
 * 
 * @example
 * ```tsx
 * const { 
 *   stats, 
 *   recentActivities, 
 *   isLoading, 
 *   error,
 *   refetch 
 * } = useStudentDashboard();
 * 
 * if (isLoading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage message={error} />;
 * 
 * console.log(stats.totalActivities);
 * ```
 */
export const useStudentDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [activitySummary, setActivitySummary] = useState<ActivitySummary | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { session } = UseAuthContext();
  const studentId = session?.user?.id;

  /**
   * Fetch all dashboard data
   */
  const fetchDashboardData = useCallback(async () => {
    if (!studentId) {
      setError("User not authenticated");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel for better performance
      const [statsData, activitiesData, summaryData, notificationsData] = await Promise.all([
        studentService.getDashboardStats(studentId),
        studentService.getRecentActivities(studentId, 5),
        studentService.getActivitySummary(studentId),
        studentService.getNotifications(studentId),
      ]);

      setStats(statsData);
      setRecentActivities(activitiesData);
      setActivitySummary(summaryData);
      setNotifications(notificationsData);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to load dashboard data";
      setError(errorMessage);
      console.error("Error fetching dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [studentId]);

  /**
   * Refetch dashboard data
   */
  const refetch = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Fetch data on mount and when studentId changes
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    recentActivities,
    activitySummary,
    notifications,
    isLoading,
    error,
    refetch,
  };
};
