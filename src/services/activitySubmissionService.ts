import { BloodDonationSubmissionData } from "@/types/BloodDonation";
import supabase from "./supabase";
import { TreeTaggingSubmissionData } from "@/types/TreeTagging";


export const activitySubmissionService = {

 submitBloodDonation: async (data: BloodDonationSubmissionData) => {

        try {


            const { hospitalName, donationDate, typeDonated, donationCase, certificate } = data;
            
            let certificateUrl = null;

            if (certificate) {
                const { data: uploadData, error: uploadError } = await supabase
                    .storage
                    .from('blood-donation-certificates')
                    .upload(`certificates/${Date.now()}_${certificate.name}`, certificate);

                if (uploadError) {
                    throw uploadError;
                }

                const { data: publicURL } = supabase
                    .storage
                    .from('blood-donation-certificates')
                    .getPublicUrl(uploadData.path);

                certificateUrl = publicURL;
            }

            const { data: insertData, error: insertError } = await supabase
                .from('blood_donations')
                .insert([{
                    hospital_name: hospitalName,
                    donation_date: donationDate,
                    type_donated: typeDonated,
                    donation_case: donationCase,
                    certificate_url: certificateUrl,
                }]);

            if (insertError) {
                throw insertError;
            }

            return insertData;
        }

        catch(e) {

            console.error('Error submitting blood donation:', e);
            throw e;
        }
 },


    submitTreeTagging: async (data: TreeTaggingSubmissionData) => {

        try {

            const { treesPlanted, taggedTreeLinks, taggingDate } = data;

            const { data: insertData, error: insertError } = await supabase
                .from('tree_tagging_activities')
                .insert([{
                    trees_planted: treesPlanted,
                    tagged_tree_links: taggedTreeLinks,
                    tagging_date: taggingDate,
                }]);

            if (insertError) {
                throw insertError;
            }

            return insertData;
        }

        catch(e) {

            console.error('Error submitting tree tagging activity:', e);
            throw e;
        }
    }
}