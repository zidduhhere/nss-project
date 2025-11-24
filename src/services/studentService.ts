import supabase from "@/services/supabase";

/**
 * Student Service - Handles student dashboard specific operations
 */
export const studentService = {
  /**
   * Get dashboard statistics for a student
   * @param studentId - Student's user ID
   * @returns Dashboard statistics including volunteer status, submissions, etc.
   */
  getDashboardStats: async (studentId: string) => {
    try {
      // Get volunteer profile and status
      const { data: volunteerData, error: volunteerError } = await supabase
        .from("volunteers")
        .select("status, created_at, unit_number, semester")
        .eq("student_id", studentId)
        .single();

      const isRegistered = !volunteerError && volunteerData !== null;
      const volunteerStatus = volunteerData?.status || null;

      // Get blood donation submissions count
      const { data: bloodDonations } = await supabase
        .from("blood_donation_submissions")
        .select("id, status, created_at")
        .eq("student_id", studentId);

      // Get tree tagging submissions count
      const { data: treeTags } = await supabase
        .from("tree_tagging_submissions")
        .select("id, status, created_at")
        .eq("student_id", studentId);

      const bloodDonationCount = bloodDonations?.length || 0;
      const treeTaggingCount = treeTags?.length || 0;
      const totalActivities = bloodDonationCount + treeTaggingCount;

      // Calculate pending submissions
      const pendingBlood = bloodDonations?.filter(d => d.status === 'pending').length || 0;
      const pendingTrees = treeTags?.filter(t => t.status === 'pending').length || 0;
      const pendingSubmissions = pendingBlood + pendingTrees;

      // Calculate approved submissions
      const approvedBlood = bloodDonations?.filter(d => d.status === 'approved').length || 0;
      const approvedTrees = treeTags?.filter(t => t.status === 'approved').length || 0;
      const approvedActivities = approvedBlood + approvedTrees;

      return {
        isRegistered,
        volunteerStatus,
        registrationDate: volunteerData?.created_at || null,
        unitNumber: volunteerData?.unit_number || null,
        semester: volunteerData?.semester || null,
        bloodDonationCount,
        treeTaggingCount,
        totalActivities,
        pendingSubmissions,
        approvedActivities,
      };
    } catch (error: any) {
      console.error("Error fetching dashboard stats:", error);
      throw new Error(error.message || "Failed to fetch dashboard statistics");
    }
  },

  /**
   * Get recent activity submissions for a student
   * @param studentId - Student's user ID
   * @param limit - Number of recent activities to fetch
   * @returns Array of recent submissions
   */
  getRecentActivities: async (studentId: string, limit: number = 5) => {
    try {
      // Fetch recent blood donations
      const { data: bloodDonations } = await supabase
        .from("blood_donation_submissions")
        .select("id, created_at, status, donation_date, location")
        .eq("student_id", studentId)
        .order("created_at", { ascending: false })
        .limit(limit);

      // Fetch recent tree tagging
      const { data: treeTags } = await supabase
        .from("tree_tagging_submissions")
        .select("id, created_at, status, tag_date, location, tree_count")
        .eq("student_id", studentId)
        .order("created_at", { ascending: false })
        .limit(limit);

      // Combine and format activities
      const activities = [
        ...(bloodDonations || []).map(item => ({
          id: item.id,
          type: 'blood-donation' as const,
          title: 'Blood Donation',
          date: item.donation_date || item.created_at,
          location: item.location,
          status: item.status,
          createdAt: item.created_at,
        })),
        ...(treeTags || []).map(item => ({
          id: item.id,
          type: 'tree-tagging' as const,
          title: 'Tree Tagging',
          date: item.tag_date || item.created_at,
          location: item.location,
          status: item.status,
          count: item.tree_count,
          createdAt: item.created_at,
        })),
      ];

      // Sort by creation date and limit
      activities.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      return activities.slice(0, limit);
    } catch (error: any) {
      console.error("Error fetching recent activities:", error);
      throw new Error(error.message || "Failed to fetch recent activities");
    }
  },

  /**
   * Get upcoming events or notifications for student
   * @param studentId - Student's user ID
   * @returns Array of notifications/events
   */
  getNotifications: async (studentId: string) => {
    try {
      // This can be extended based on your notifications table structure
      // For now, return basic status-based notifications
      const { data: volunteerData } = await supabase
        .from("volunteers")
        .select("status, updated_at")
        .eq("student_id", studentId)
        .single();

      const notifications = [];

      if (volunteerData?.status === 'pending') {
        notifications.push({
          type: 'info',
          message: 'Your volunteer registration is pending approval',
          date: volunteerData.updated_at,
        });
      }

      if (volunteerData?.status === 'approved') {
        notifications.push({
          type: 'success',
          message: 'Congratulations! Your volunteer registration has been approved',
          date: volunteerData.updated_at,
        });
      }

      if (volunteerData?.status === 'certified') {
        notifications.push({
          type: 'success',
          message: 'You are now a certified NSS volunteer!',
          date: volunteerData.updated_at,
        });
      }

      return notifications;
    } catch (error: any) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  },

  /**
   * Get volunteer activity summary by type
   * @param studentId - Student's user ID
   * @returns Activity breakdown by status
   */
  getActivitySummary: async (studentId: string) => {
    try {
      const { data: bloodDonations } = await supabase
        .from("blood_donation_submissions")
        .select("status")
        .eq("student_id", studentId);

      const { data: treeTags } = await supabase
        .from("tree_tagging_submissions")
        .select("status")
        .eq("student_id", studentId);

      const bloodStats = {
        total: bloodDonations?.length || 0,
        pending: bloodDonations?.filter(d => d.status === 'pending').length || 0,
        approved: bloodDonations?.filter(d => d.status === 'approved').length || 0,
        rejected: bloodDonations?.filter(d => d.status === 'rejected').length || 0,
      };

      const treeStats = {
        total: treeTags?.length || 0,
        pending: treeTags?.filter(t => t.status === 'pending').length || 0,
        approved: treeTags?.filter(t => t.status === 'approved').length || 0,
        rejected: treeTags?.filter(t => t.status === 'rejected').length || 0,
      };

      return {
        bloodDonation: bloodStats,
        treeTagging: treeStats,
      };
    } catch (error: any) {
      console.error("Error fetching activity summary:", error);
      throw new Error(error.message || "Failed to fetch activity summary");
    }
  },
};
