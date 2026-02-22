import { activityStatusServices } from "@/services/activityStatusServices";
import { activitySubmissionService } from "@/services/activitySubmissionService";
import { ActivityType } from "@/types/ActivityType";
import { BloodDonationSubmissionData } from "@/types/BloodDonation"
import { TreeTaggingSubmissionData } from "@/types/TreeTagging";
import { UseAuthContext } from "@/context/AuthContext";



export const useActivity = () => {

    const { session } = UseAuthContext();

    //Upload the blood donation data
    const addBloodDonation = async (data: BloodDonationSubmissionData) => {
        try {
            if (!session?.user?.id) {
                throw new Error("You must be logged in to submit a blood donation");
            }
            const response = await activitySubmissionService.submitBloodDonation(data, session.user.id);
            return response;    
        }
        catch (e) {
            
            throw e;
            
        }
    }

    const addTreeTagging = async (data: TreeTaggingSubmissionData) => {
        try {
            if (!session?.user?.id) {
                throw new Error("You must be logged in to submit a tree tagging activity");
            }
            const response = await activitySubmissionService.submitTreeTagging(data, session.user.id);
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