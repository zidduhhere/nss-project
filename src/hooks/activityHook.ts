import { activityStatusServices } from "@/services/activityStatusServices";
import { activitySubmissionService } from "@/services/activitySubmissionService";
import { ActivityType } from "@/types/ActivityType";
import { BloodDonationSubmissionData } from "@/types/BloodDonation"
import { TreeTaggingSubmissionData } from "@/types/TreeTagging";



export const useActivity = () => {
    // Placeholder for activity-related hooks


    //Upload the blood donation data
    const addBloodDonation = async (data: BloodDonationSubmissionData) => {
        try {
            const response = await activitySubmissionService.submitBloodDonation(data);
            return response;    
        }
        catch (e) {
            console.error('Error in useActivity hook while adding blood donation:', e);
            
        }
    }

    const addTreeTagging = async (data: TreeTaggingSubmissionData) => {
        try {
            const response = await activitySubmissionService.submitTreeTagging(data);
            return response;    
        }
        catch (e) {
            console.error('Error in useActivity hook while adding tree tagging:', e);
            
        }
    }


    const approveActivity = async (id: string, activityType: ActivityType) => {
        try {
            const response = await activityStatusServices.approveActivity(id, activityType);
            return response;    
        } 
        catch (e) {
            console.error('Error in useActivity hook while approving activity:', e);
            
        }   
    }

    const rejectActivity = async (id: string, activityType: ActivityType) => {
        try {
            const response = await activityStatusServices.rejectActivity(id, activityType);
            return response;    
        }   
        catch (e) {
            console.error('Error in useActivity hook while rejecting activity:', e);
            
        }
    }


    const certifyActivity = async (id: string,  activityType: ActivityType) => {
        try {
            const response = await activityStatusServices.certifyActivity(id, activityType);
            return response;    
        }   
        catch (e) {
            console.error('Error in useActivity hook while certifying activity:', e);
            
        }
    }   

    const changeToPending = async (id: string, activityType: ActivityType) => {
        try {
            const response = await activityStatusServices.changeToPending(id, activityType);
            return response;    
        }   
        catch (e) {
            console.error('Error in useActivity hook while changing activity to pending:', e);
            
        }
    }

    return {
        addBloodDonation,
        addTreeTagging
        ,approveActivity,
        rejectActivity,
        certifyActivity,
        changeToPending
    };
}