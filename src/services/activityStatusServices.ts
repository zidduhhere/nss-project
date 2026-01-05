import { ActivityType } from "@/types/ActivityType";
import supabase from "./supabase";



export const activityStatusServices = {

    approveActivity: async (id: string, activityType: ActivityType) => {
        try {
            const { data, error } = await supabase
                .from(activityType === ActivityType.BloodDonation ? 'blood_donations' : 'tree_tagging')
                .update({ status: 'approved' })
                .eq('id', id);

            if (error) {
                throw error;
            }

            return data;

        }
        catch (e) {
            console.error('Error approving activity:', e);
            throw new Error('Failed to approve activity');
        }
    },

    rejectActivity: async (id: string, activityType: ActivityType) => {
        try {
            const { data, error } = await supabase
                .from(activityType === ActivityType.BloodDonation ? 'blood_donations' : 'tree_tagging')
                .update({ status: 'rejected' })
                .eq('id', id);

            if (error) {
                throw error;
            }

            return data;

        }
        catch (e) {
            console.error('Error rejecting activity:', e);
            throw new Error('Failed to reject activity');
        }
    },

    certifyActivity: async (id: string, activityType: ActivityType) => {
        try {
            const { data, error } = await supabase
                .from(activityType === ActivityType.BloodDonation ? 'blood_donations' : 'tree_tagging')
                .update({ is_certified: true })
                .eq('id', id);

            if (error) {
                throw error;
            }

            return data;

        }
        catch (e) {
            console.error('Error certifying activity:', e);
            throw new Error('Failed to certify activity');
        }
    },

    changeToPending: async (id: string, activityType: ActivityType) => {
        try {
            const { data, error } = await supabase
                .from(activityType === ActivityType.BloodDonation ? 'blood_donations' : 'tree_tagging')
                .update({ status: 'pending' })
                .eq('id', id);

            if (error) {
                throw error;
            }

            return data;

        }
        catch (e) {
            console.error('Error changing activity to pending:', e);
            throw new Error('Failed to change activity to pending');
        }
    }
}