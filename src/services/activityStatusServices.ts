import { ActivityType } from "@/types/ActivityType";
import supabase from "./supabase";
import { handleSupabaseError } from "@/services/errors";

const getTableName = (activityType: ActivityType) =>
  activityType === ActivityType.BloodDonation
    ? "blood_donations"
    : "tree_tagging";

type SubmissionStatus = "pending" | "approved" | "rejected";

export const activityStatusServices = {
  /**
   * Single method for all status transitions — replaces
   * approveActivity / rejectActivity / changeToPending
   */
  updateStatus: async (
    id: string,
    activityType: ActivityType,
    status: SubmissionStatus
  ) => {
    const { data, error } = await supabase
      .from(getTableName(activityType))
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) handleSupabaseError(error, `Failed to update activity to ${status}`);
    return data;
  },

  certifyActivity: async (id: string, activityType: ActivityType) => {
    const { data, error } = await supabase
      .from(getTableName(activityType))
      .update({ is_certified: true })
      .eq("id", id)
      .select()
      .single();

    if (error) handleSupabaseError(error, "Failed to certify activity");
    return data;
  },

  // Keep legacy aliases so existing UI code doesn't break
  approveActivity: (id: string, activityType: ActivityType) =>
    activityStatusServices.updateStatus(id, activityType, "approved"),
  rejectActivity: (id: string, activityType: ActivityType) =>
    activityStatusServices.updateStatus(id, activityType, "rejected"),
  changeToPending: (id: string, activityType: ActivityType) =>
    activityStatusServices.updateStatus(id, activityType, "pending"),
};
