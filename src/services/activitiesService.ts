import supabase from "@/services/supabase";

export interface Activity {
  id: string;
  title: string;
  description: string;
  activity_type: "camp" | "blood_donation" | "tree_planting" | "workshop" | "awareness" | "other";
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

/**
 * Activities Service - Handles fetching NSS activities from Supabase
 */
export const activitiesService = {
  /**
   * Get all activities ordered by start date
   */
  getAllActivities: async (): Promise<Activity[]> => {
    try {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .order("start_date", { ascending: false });

      if (error) throw error;

      return (data as Activity[]) || [];
    } catch (error: any) {
      console.error("Error fetching activities:", error);
      throw new Error(error.message || "Failed to fetch activities");
    }
  },

  /**
   * Get upcoming activities (start_date >= now)
   */
  getUpcomingActivities: async (): Promise<Activity[]> => {
    try {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .in("status", ["upcoming", "ongoing"])
        .gte("start_date", new Date().toISOString())
        .order("start_date", { ascending: true });

      if (error) throw error;

      return (data as Activity[]) || [];
    } catch (error: any) {
      console.error("Error fetching upcoming activities:", error);
      throw new Error(error.message || "Failed to fetch upcoming activities");
    }
  },

  /**
   * Get past/completed activities
   */
  getPastActivities: async (): Promise<Activity[]> => {
    try {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("status", "completed")
        .order("start_date", { ascending: false });

      if (error) throw error;

      return (data as Activity[]) || [];
    } catch (error: any) {
      console.error("Error fetching past activities:", error);
      throw new Error(error.message || "Failed to fetch past activities");
    }
  },

  /**
   * Get activities by type
   */
  getActivitiesByType: async (type: Activity["activity_type"]): Promise<Activity[]> => {
    try {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("activity_type", type)
        .order("start_date", { ascending: false });

      if (error) throw error;

      return (data as Activity[]) || [];
    } catch (error: any) {
      console.error("Error fetching activities by type:", error);
      throw new Error(error.message || "Failed to fetch activities");
    }
  },
};
