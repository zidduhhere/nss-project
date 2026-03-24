import supabase from "@/services/supabase";
import { handleSupabaseError } from "@/services/errors";

export const studentService = {
  getDashboardStats: async (studentId: string) => {
    const [volunteerResult, bloodResult, treeResult] = await Promise.all([
      supabase
        .from("volunteers")
        .select("status, created_at, unit_number, semester")
        .eq("student_id", studentId)
        .single(),
      supabase
        .from("blood_donations")
        .select("id, status")
        .eq("student_id", studentId),
      supabase
        .from("tree_tagging")
        .select("id, status")
        .eq("student_id", studentId),
    ]);

    const volunteerData = volunteerResult.data;
    const isRegistered = !volunteerResult.error && volunteerData !== null;
    const volunteerStatus = volunteerData?.status || null;

    if (bloodResult.error) handleSupabaseError(bloodResult.error, "Failed to fetch blood donations");
    if (treeResult.error) handleSupabaseError(treeResult.error, "Failed to fetch tree tagging data");

    const bloodDonations = bloodResult.data || [];
    const treeTags = treeResult.data || [];

    const bloodDonationCount = bloodDonations.length;
    const treeTaggingCount = treeTags.length;
    const totalActivities = bloodDonationCount + treeTaggingCount;

    const pendingSubmissions =
      bloodDonations.filter((d) => d.status === "pending").length +
      treeTags.filter((t) => t.status === "pending").length;

    const approvedActivities =
      bloodDonations.filter((d) => d.status === "approved").length +
      treeTags.filter((t) => t.status === "approved").length;

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
  },

  getRecentActivities: async (studentId: string, limit: number = 5) => {
    const [{ data: bloodDonations }, { data: treeTags }] = await Promise.all([
      supabase
        .from("blood_donations")
        .select("id, created_at, status, donation_date, hospital_name")
        .eq("student_id", studentId)
        .order("created_at", { ascending: false })
        .limit(limit),
      supabase
        .from("tree_tagging")
        .select("id, created_at, status, trees_planted")
        .eq("student_id", studentId)
        .order("created_at", { ascending: false })
        .limit(limit),
    ]);

    const activities = [
      ...(bloodDonations || []).map((item) => ({
        id: item.id,
        type: "blood-donation" as const,
        title: "Blood Donation",
        date: item.donation_date || item.created_at,
        location: item.hospital_name,
        status: item.status,
        createdAt: item.created_at,
      })),
      ...(treeTags || []).map((item) => ({
        id: item.id,
        type: "tree-tagging" as const,
        title: "Tree Tagging",
        date: item.created_at,
        location: null,
        status: item.status,
        count: item.trees_planted,
        createdAt: item.created_at,
      })),
    ];

    activities.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return activities.slice(0, limit);
  },

  getNotifications: async (studentId: string) => {
    const { data: volunteerData } = await supabase
      .from("volunteers")
      .select("status, updated_at")
      .eq("student_id", studentId)
      .single();

    const notifications = [];

    if (volunteerData?.status === "pending") {
      notifications.push({
        type: "info",
        message: "Your volunteer registration is pending approval",
        date: volunteerData.updated_at,
      });
    }
    if (volunteerData?.status === "approved") {
      notifications.push({
        type: "success",
        message: "Congratulations! Your volunteer registration has been approved",
        date: volunteerData.updated_at,
      });
    }
    if (volunteerData?.status === "certified") {
      notifications.push({
        type: "success",
        message: "You are now a certified NSS volunteer!",
        date: volunteerData.updated_at,
      });
    }

    return notifications;
  },

  getActivitySummary: async (studentId: string) => {
    const [{ data: bloodDonations }, { data: treeTags }] = await Promise.all([
      supabase
        .from("blood_donations")
        .select("status")
        .eq("student_id", studentId),
      supabase
        .from("tree_tagging")
        .select("status")
        .eq("student_id", studentId),
    ]);

    const countByStatus = (items: { status: string }[] | null) => ({
      total: items?.length || 0,
      pending: items?.filter((d) => d.status === "pending").length || 0,
      approved: items?.filter((d) => d.status === "approved").length || 0,
      rejected: items?.filter((d) => d.status === "rejected").length || 0,
    });

    return {
      bloodDonation: countByStatus(bloodDonations),
      treeTagging: countByStatus(treeTags),
    };
  },
};
