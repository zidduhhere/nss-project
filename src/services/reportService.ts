import supabase from "@/services/supabase";
import { handleSupabaseError } from "@/services/errors";

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
  activity_type: "blood_donation" | "tree_tagging";
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
   * Get report stats using head-only count queries (no client-side counting)
   */
  getReportStats: async (): Promise<ReportStats> => {
    const [
      totalVol, certifiedVol,
      totalBlood, approvedBlood, pendingBlood, rejectedBlood,
      totalTree, approvedTree, pendingTree, rejectedTree,
      unitsData,
    ] = await Promise.all([
      supabase.from("volunteers").select("*", { count: "exact", head: true }),
      supabase.from("volunteers").select("*", { count: "exact", head: true }).eq("status", "certified"),
      // Fixed: use blood_donations (not blood_donation_submissions)
      supabase.from("blood_donations").select("*", { count: "exact", head: true }),
      supabase.from("blood_donations").select("*", { count: "exact", head: true }).eq("status", "approved"),
      supabase.from("blood_donations").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("blood_donations").select("*", { count: "exact", head: true }).eq("status", "rejected"),
      // Fixed: use tree_tagging (not tree_tagging_submissions)
      supabase.from("tree_tagging").select("*", { count: "exact", head: true }),
      supabase.from("tree_tagging").select("*", { count: "exact", head: true }).eq("status", "approved"),
      supabase.from("tree_tagging").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("tree_tagging").select("*", { count: "exact", head: true }).eq("status", "rejected"),
      supabase.from("nss_units").select("*", { count: "exact", head: true }),
    ]);

    const firstError = [
      totalVol, certifiedVol,
      totalBlood, approvedBlood, pendingBlood, rejectedBlood,
      totalTree, approvedTree, pendingTree, rejectedTree,
      unitsData,
    ].find((r) => r.error);
    if (firstError?.error) handleSupabaseError(firstError.error, "Failed to fetch report statistics");

    return {
      totalVolunteers: totalVol.count || 0,
      totalBloodDonations: totalBlood.count || 0,
      totalTreePlantations: totalTree.count || 0,
      approvedSubmissions: (approvedBlood.count || 0) + (approvedTree.count || 0),
      pendingSubmissions: (pendingBlood.count || 0) + (pendingTree.count || 0),
      rejectedSubmissions: (rejectedBlood.count || 0) + (rejectedTree.count || 0),
      certifiedVolunteers: certifiedVol.count || 0,
      activeUnits: unitsData.count || 0,
    };
  },

  /**
   * Get activity report — fixed table names
   */
  getActivityReport: async (filters?: {
    activityType?: "blood_donation" | "tree_tagging" | "all";
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ActivityReport[]> => {
    const activities: ActivityReport[] = [];

    if (!filters?.activityType || filters.activityType === "all" || filters.activityType === "blood_donation") {
      let bloodQuery = supabase
        .from("blood_donations_with_volunteer")
        .select("id, student_id, created_at, status, volunteer_name, volunteer_unit_number")
        .order("created_at", { ascending: false });

      if (filters?.status && filters.status !== "all") bloodQuery = bloodQuery.eq("status", filters.status);
      if (filters?.startDate) bloodQuery = bloodQuery.gte("created_at", filters.startDate);
      if (filters?.endDate) bloodQuery = bloodQuery.lte("created_at", filters.endDate);

      const { data: bloodData, error: bloodError } = await bloodQuery;
      if (bloodError) handleSupabaseError(bloodError, "Failed to fetch blood donations");

      bloodData?.forEach((item: Record<string, unknown>) => {
        activities.push({
          id: item.id as string,
          student_id: item.student_id as string,
          volunteer_name: (item.volunteer_name as string) || "Unknown",
          activity_type: "blood_donation",
          submission_date: item.created_at as string,
          status: item.status as string,
          unit_number: (item.volunteer_unit_number as string) || null,
        });
      });
    }

    if (!filters?.activityType || filters.activityType === "all" || filters.activityType === "tree_tagging") {
      let treeQuery = supabase
        .from("tree_tagging_with_volunteer")
        .select("id, student_id, created_at, status, volunteer_name, volunteer_unit_number")
        .order("created_at", { ascending: false });

      if (filters?.status && filters.status !== "all") treeQuery = treeQuery.eq("status", filters.status);
      if (filters?.startDate) treeQuery = treeQuery.gte("created_at", filters.startDate);
      if (filters?.endDate) treeQuery = treeQuery.lte("created_at", filters.endDate);

      const { data: treeData, error: treeError } = await treeQuery;
      if (treeError) handleSupabaseError(treeError, "Failed to fetch tree tagging");

      treeData?.forEach((item: Record<string, unknown>) => {
        activities.push({
          id: item.id as string,
          student_id: item.student_id as string,
          volunteer_name: (item.volunteer_name as string) || "Unknown",
          activity_type: "tree_tagging",
          submission_date: item.created_at as string,
          status: item.status as string,
          unit_number: (item.volunteer_unit_number as string) || null,
        });
      });
    }

    return activities.sort(
      (a, b) => new Date(b.submission_date).getTime() - new Date(a.submission_date).getTime()
    );
  },

  /**
   * Get unit-wise report — fixed table names
   */
  getUnitReport: async (): Promise<UnitReport[]> => {
    const { data: volunteers, error: volError } = await supabase
      .from("volunteers")
      .select("id, unit_id, unit_number, status, student_id")
      .not("unit_id", "is", null);

    if (volError) handleSupabaseError(volError, "Failed to fetch volunteers");

    const unitMap = new Map<string, UnitReport>();

    volunteers?.forEach((vol) => {
      if (!vol.unit_id) return;

      if (!unitMap.has(vol.unit_id)) {
        unitMap.set(vol.unit_id, {
          unit_id: vol.unit_id,
          unit_number: vol.unit_number || "Unknown",
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
      if (vol.status === "certified") unit.certified_volunteers++;
      if (vol.status === "approved") unit.approved_volunteers++;
      if (vol.status === "pending") unit.pending_volunteers++;
    });

    const studentIds = volunteers?.map((v) => v.student_id) || [];

    // Build student_id -> unit_id lookup from already-fetched volunteers
    const studentUnitMap = new Map<string, string>();
    volunteers?.forEach((v) => {
      if (v.student_id && v.unit_id) studentUnitMap.set(v.student_id, v.unit_id);
    });

    if (studentIds.length > 0) {
      const [bloodResult, treeResult] = await Promise.all([
        supabase
          .from("blood_donations")
          .select("student_id")
          .in("student_id", studentIds)
          .eq("status", "approved"),
        supabase
          .from("tree_tagging")
          .select("student_id")
          .in("student_id", studentIds)
          .eq("status", "approved"),
      ]);

      bloodResult.data?.forEach((item: Record<string, unknown>) => {
        const unitId = studentUnitMap.get(item.student_id as string);
        if (unitId && unitMap.has(unitId)) unitMap.get(unitId)!.blood_donations++;
      });

      treeResult.data?.forEach((item: Record<string, unknown>) => {
        const unitId = studentUnitMap.get(item.student_id as string);
        if (unitId && unitMap.has(unitId)) unitMap.get(unitId)!.tree_plantations++;
      });
    }

    return Array.from(unitMap.values()).sort((a, b) => b.total_volunteers - a.total_volunteers);
  },

  /**
   * Monthly trends — fixed table names
   */
  getMonthlyTrends: async (): Promise<MonthlyTrend[]> => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const since = sixMonthsAgo.toISOString();

    const [bloodResult, treeResult, volResult] = await Promise.all([
      supabase.from("blood_donations").select("created_at").gte("created_at", since).eq("status", "approved"),
      supabase.from("tree_tagging").select("created_at").gte("created_at", since).eq("status", "approved"),
      supabase.from("volunteers").select("created_at").gte("created_at", since),
    ]);

    const getMonthKey = (dateStr: string) => {
      const date = new Date(dateStr);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    };

    const getMonthLabel = (monthKey: string) => {
      const [year, month] = monthKey.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    };

    const monthMap = new Map<string, MonthlyTrend>();
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const key = getMonthKey(date.toISOString());
      monthMap.set(key, { month: getMonthLabel(key), blood_donations: 0, tree_plantations: 0, new_volunteers: 0 });
    }

    bloodResult.data?.forEach((item) => {
      const key = getMonthKey(item.created_at);
      if (monthMap.has(key)) monthMap.get(key)!.blood_donations++;
    });

    treeResult.data?.forEach((item) => {
      const key = getMonthKey(item.created_at);
      if (monthMap.has(key)) monthMap.get(key)!.tree_plantations++;
    });

    volResult.data?.forEach((item) => {
      const key = getMonthKey(item.created_at);
      if (monthMap.has(key)) monthMap.get(key)!.new_volunteers++;
    });

    return Array.from(monthMap.values());
  },
};
