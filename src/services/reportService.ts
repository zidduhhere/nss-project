import supabase from "@/services/supabase";

/**
 * Report Service - Handles all report generation and analytics
 */

export interface ReportStats {
  totalVolunteers: number;
  totalBloodDonations: number;
  totalTreePlantations: number;
  approvedSubmissions: number;
  pendingSubmissions: number;
  rejectedSubmissions: number;
  certifiedVolunteers: number;
  activeUnits: number;
}

export interface ActivityReport {
  id: string;
  student_id: string;
  volunteer_name: string;
  activity_type: 'blood_donation' | 'tree_tagging';
  submission_date: string;
  status: string;
  unit_number: string | null;
}

export interface UnitReport {
  unit_id: string;
  unit_number: string;
  total_volunteers: number;
  certified_volunteers: number;
  approved_volunteers: number;
  pending_volunteers: number;
  blood_donations: number;
  tree_plantations: number;
}

export interface MonthlyTrend {
  month: string;
  blood_donations: number;
  tree_plantations: number;
  new_volunteers: number;
}

export const reportService = {
  /**
   * Get comprehensive report statistics
   */
  getReportStats: async (): Promise<ReportStats> => {
    try {
      // Get volunteer counts
      const { count: totalVolunteers } = await supabase
        .from("volunteers")
        .select("*", { count: "exact", head: true });

      const { count: certifiedVolunteers } = await supabase
        .from("volunteers")
        .select("*", { count: "exact", head: true })
        .eq("status", "certified");

      // Get blood donation counts
      const { count: totalBloodDonations } = await supabase
        .from("blood_donation_submissions")
        .select("*", { count: "exact", head: true });

      const { count: approvedBlood } = await supabase
        .from("blood_donation_submissions")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved");

      const { count: pendingBlood } = await supabase
        .from("blood_donation_submissions")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      const { count: rejectedBlood } = await supabase
        .from("blood_donation_submissions")
        .select("*", { count: "exact", head: true })
        .eq("status", "rejected");

      // Get tree plantation counts
      const { count: totalTreePlantations } = await supabase
        .from("tree_tagging_submissions")
        .select("*", { count: "exact", head: true });

      const { count: approvedTree } = await supabase
        .from("tree_tagging_submissions")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved");

      const { count: pendingTree } = await supabase
        .from("tree_tagging_submissions")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      const { count: rejectedTree } = await supabase
        .from("tree_tagging_submissions")
        .select("*", { count: "exact", head: true })
        .eq("status", "rejected");

      // Get unique units
      const { data: unitsData } = await supabase
        .from("volunteers")
        .select("unit_id")
        .not("unit_id", "is", null);

      const activeUnits = new Set(unitsData?.map((v) => v.unit_id)).size;

      return {
        totalVolunteers: totalVolunteers || 0,
        totalBloodDonations: totalBloodDonations || 0,
        totalTreePlantations: totalTreePlantations || 0,
        approvedSubmissions: (approvedBlood || 0) + (approvedTree || 0),
        pendingSubmissions: (pendingBlood || 0) + (pendingTree || 0),
        rejectedSubmissions: (rejectedBlood || 0) + (rejectedTree || 0),
        certifiedVolunteers: certifiedVolunteers || 0,
        activeUnits,
      };
    } catch (error: any) {
      console.error("Error fetching report stats:", error);
      throw new Error(error.message || "Failed to fetch report statistics");
    }
  },

  /**
   * Get activity report (blood donations and tree plantations)
   */
  getActivityReport: async (filters?: {
    activityType?: 'blood_donation' | 'tree_tagging' | 'all';
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ActivityReport[]> => {
    try {
      const activities: ActivityReport[] = [];

      // Fetch blood donations if applicable
      if (!filters?.activityType || filters.activityType === 'all' || filters.activityType === 'blood_donation') {
        let bloodQuery = supabase
          .from("blood_donation_submissions")
          .select(`
            id,
            student_id,
            created_at,
            status,
            volunteers!inner(full_name, unit_number)
          `)
          .order("created_at", { ascending: false });

        if (filters?.status && filters.status !== 'all') {
          bloodQuery = bloodQuery.eq("status", filters.status);
        }
        if (filters?.startDate) {
          bloodQuery = bloodQuery.gte("created_at", filters.startDate);
        }
        if (filters?.endDate) {
          bloodQuery = bloodQuery.lte("created_at", filters.endDate);
        }

        const { data: bloodData, error: bloodError } = await bloodQuery;
        if (bloodError) throw bloodError;

        bloodData?.forEach((item: any) => {
          activities.push({
            id: item.id,
            student_id: item.student_id,
            volunteer_name: item.volunteers?.full_name || 'Unknown',
            activity_type: 'blood_donation',
            submission_date: item.created_at,
            status: item.status,
            unit_number: item.volunteers?.unit_number || null,
          });
        });
      }

      // Fetch tree plantations if applicable
      if (!filters?.activityType || filters.activityType === 'all' || filters.activityType === 'tree_tagging') {
        let treeQuery = supabase
          .from("tree_tagging_submissions")
          .select(`
            id,
            student_id,
            created_at,
            status,
            volunteers!inner(full_name, unit_number)
          `)
          .order("created_at", { ascending: false });

        if (filters?.status && filters.status !== 'all') {
          treeQuery = treeQuery.eq("status", filters.status);
        }
        if (filters?.startDate) {
          treeQuery = treeQuery.gte("created_at", filters.startDate);
        }
        if (filters?.endDate) {
          treeQuery = treeQuery.lte("created_at", filters.endDate);
        }

        const { data: treeData, error: treeError } = await treeQuery;
        if (treeError) throw treeError;

        treeData?.forEach((item: any) => {
          activities.push({
            id: item.id,
            student_id: item.student_id,
            volunteer_name: item.volunteers?.full_name || 'Unknown',
            activity_type: 'tree_tagging',
            submission_date: item.created_at,
            status: item.status,
            unit_number: item.volunteers?.unit_number || null,
          });
        });
      }

      // Sort by date
      return activities.sort((a, b) => 
        new Date(b.submission_date).getTime() - new Date(a.submission_date).getTime()
      );
    } catch (error: any) {
      console.error("Error fetching activity report:", error);
      throw new Error(error.message || "Failed to fetch activity report");
    }
  },

  /**
   * Get unit-wise performance report
   */
  getUnitReport: async (): Promise<UnitReport[]> => {
    try {
      // Get all volunteers with unit information
      const { data: volunteers, error: volError } = await supabase
        .from("volunteers")
        .select("id, unit_id, unit_number, status, student_id")
        .not("unit_id", "is", null);

      if (volError) throw volError;

      // Group by unit
      const unitMap = new Map<string, UnitReport>();

      volunteers?.forEach((vol) => {
        if (!vol.unit_id) return;

        if (!unitMap.has(vol.unit_id)) {
          unitMap.set(vol.unit_id, {
            unit_id: vol.unit_id,
            unit_number: vol.unit_number || 'Unknown',
            total_volunteers: 0,
            certified_volunteers: 0,
            approved_volunteers: 0,
            pending_volunteers: 0,
            blood_donations: 0,
            tree_plantations: 0,
          });
        }

        const unit = unitMap.get(vol.unit_id)!;
        unit.total_volunteers++;
        
        if (vol.status === 'certified') unit.certified_volunteers++;
        if (vol.status === 'approved') unit.approved_volunteers++;
        if (vol.status === 'pending') unit.pending_volunteers++;
      });

      // Get activity counts for each volunteer
      const studentIds = volunteers?.map(v => v.student_id) || [];
      
      const { data: bloodDonations } = await supabase
        .from("blood_donation_submissions")
        .select("student_id, volunteers!inner(unit_id)")
        .in("student_id", studentIds)
        .eq("status", "approved");

      const { data: treePlantations } = await supabase
        .from("tree_tagging_submissions")
        .select("student_id, volunteers!inner(unit_id)")
        .in("student_id", studentIds)
        .eq("status", "approved");

      // Add activity counts
      bloodDonations?.forEach((item: any) => {
        const unitId = item.volunteers?.unit_id;
        if (unitId && unitMap.has(unitId)) {
          unitMap.get(unitId)!.blood_donations++;
        }
      });

      treePlantations?.forEach((item: any) => {
        const unitId = item.volunteers?.unit_id;
        if (unitId && unitMap.has(unitId)) {
          unitMap.get(unitId)!.tree_plantations++;
        }
      });

      return Array.from(unitMap.values()).sort((a, b) => 
        b.total_volunteers - a.total_volunteers
      );
    } catch (error: any) {
      console.error("Error fetching unit report:", error);
      throw new Error(error.message || "Failed to fetch unit report");
    }
  },

  /**
   * Get monthly trends for the last 6 months
   */
  getMonthlyTrends: async (): Promise<MonthlyTrend[]> => {
    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      // Get blood donations
      const { data: bloodData } = await supabase
        .from("blood_donation_submissions")
        .select("created_at")
        .gte("created_at", sixMonthsAgo.toISOString())
        .eq("status", "approved");

      // Get tree plantations
      const { data: treeData } = await supabase
        .from("tree_tagging_submissions")
        .select("created_at")
        .gte("created_at", sixMonthsAgo.toISOString())
        .eq("status", "approved");

      // Get new volunteers
      const { data: volunteerData } = await supabase
        .from("volunteers")
        .select("created_at")
        .gte("created_at", sixMonthsAgo.toISOString());

      // Group by month
      const monthMap = new Map<string, MonthlyTrend>();
      
      const getMonthKey = (dateStr: string) => {
        const date = new Date(dateStr);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      };

      const getMonthLabel = (monthKey: string) => {
        const [year, month] = monthKey.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      };

      // Initialize last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const key = getMonthKey(date.toISOString());
        monthMap.set(key, {
          month: getMonthLabel(key),
          blood_donations: 0,
          tree_plantations: 0,
          new_volunteers: 0,
        });
      }

      // Count activities
      bloodData?.forEach((item) => {
        const key = getMonthKey(item.created_at);
        if (monthMap.has(key)) {
          monthMap.get(key)!.blood_donations++;
        }
      });

      treeData?.forEach((item) => {
        const key = getMonthKey(item.created_at);
        if (monthMap.has(key)) {
          monthMap.get(key)!.tree_plantations++;
        }
      });

      volunteerData?.forEach((item) => {
        const key = getMonthKey(item.created_at);
        if (monthMap.has(key)) {
          monthMap.get(key)!.new_volunteers++;
        }
      });

      return Array.from(monthMap.values());
    } catch (error: any) {
      console.error("Error fetching monthly trends:", error);
      throw new Error(error.message || "Failed to fetch monthly trends");
    }
  },
};
