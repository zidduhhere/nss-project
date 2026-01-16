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
            
            throw e;
            
        }
    }

    const addTreeTagging = async (data: TreeTaggingSubmissionData) => {
        try {
            const response = await activitySubmissionService.submitTreeTagging(data);
            return response;    
        }
        catch (e) {
            
            throw e;
        }
    }


    const approveActivity = async (id: string, activityType: ActivityType) => {
        try {
            const response = await activityStatusServices.approveActivity(id, activityType);
            return response;    
        } 
        catch (e) {
            throw e;
            
        }   
    }

    const rejectActivity = async (id: string, activityType: ActivityType) => {
        try {
            const response = await activityStatusServices.rejectActivity(id, activityType);
            return response;    
        }   
        catch (e) {
            throw e;
            
        }
    }


    const certifyActivity = async (id: string,  activityType: ActivityType) => {
        try {
            const response = await activityStatusServices.certifyActivity(id, activityType);
            return response;    
        }   
        catch (e) {
            throw e;
            
        }
    }   

    const changeToPending = async (id: string, activityType: ActivityType) => {
        try {
            const response = await activityStatusServices.changeToPending(id, activityType);
            return response;    
        }   
        catch (e) {
            throw e;
            
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