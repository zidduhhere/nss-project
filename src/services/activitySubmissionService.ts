import { BloodDonationSubmissionData } from "@/types/BloodDonation";
import supabase from "./supabase";
import { TreeTaggingSubmissionData } from "@/types/TreeTagging";

const sanitizeFileName = (name: string) =>
  name.replace(/[^a-zA-Z0-9._-]/g, "_");

export const activitySubmissionService = {
  submitBloodDonation: async (
    data: BloodDonationSubmissionData,
    studentId: string
  ) => {
    try {
      if (!studentId) {
        throw new Error("You must be logged in to submit a blood donation");
      }

      const { hospitalName, donationDate, typeDonated, donationCase, certificate } = data;

      let certificateUrl = null;

      if (certificate) {
        const filePath = `certificates/${Date.now()}_${sanitizeFileName(certificate.name)}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("blood-donations")
          .upload(filePath, certificate);

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicURL } = supabase.storage
          .from("blood-donations")
          .getPublicUrl(uploadData.path);

        certificateUrl = publicURL.publicUrl;
      }

      const { data: insertData, error: insertError } = await supabase
        .from("blood_donations")
        .insert([
          {
            student_id: studentId,
            hospital_name: hospitalName,
            donation_date: donationDate,
            type_donated: typeDonated,
            donation_case: donationCase,
            certificate_url: certificateUrl,
          },
        ]);

      if (insertError) {
        throw insertError;
      }

      return insertData;
    } catch (e) {
      console.error("Error submitting blood donation:", e);
      throw e;
    }
  },

  submitTreeTagging: async (
    data: TreeTaggingSubmissionData,
    studentId: string
  ) => {
    try {
      if (!studentId) {
        throw new Error(
          "You must be logged in to submit a tree tagging activity"
        );
      }

      const { treesPlanted, taggedTreeLinks } = data;

      const { data: insertData, error: insertError } = await supabase
        .from("tree_tagging")
        .insert([
          {
            student_id: studentId,
            trees_planted: treesPlanted,
            tagged_links: taggedTreeLinks,
          },
        ]);

      if (insertError) {
        throw insertError;
      }

      return insertData;
    } catch (e) {
      console.error("Error submitting tree tagging activity:", e);
      throw e;
    }
  },
};
