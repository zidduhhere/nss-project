import { BloodDonationSubmissionData } from "@/types/BloodDonation";
import supabase from "./supabase";
import { TreeTaggingSubmissionData } from "@/types/TreeTagging";
import { ServiceError, handleSupabaseError } from "@/services/errors";
import {
  sanitizeFileName,
  bloodDonationSchema,
  treeTaggingSchema,
} from "@/services/validationSchemas";

export const activitySubmissionService = {
  submitBloodDonation: async (
    data: BloodDonationSubmissionData,
    studentId: string
  ) => {
    if (!studentId) {
      throw new ServiceError(
        "You must be logged in to submit a blood donation",
        "UNAUTHORIZED"
      );
    }

    // Normalise donationCase to lowercase to match DB enum
    const normalisedData = {
      ...data,
      donationCase: data.donationCase?.toLowerCase() ?? "",
    };

    const parsed = bloodDonationSchema.safeParse(normalisedData);
    if (!parsed.success) {
      throw new ServiceError(
        parsed.error.issues.map((i) => i.message).join(", "),
        "VALIDATION_ERROR"
      );
    }

    const { hospitalName, donationDate, typeDonated, certificate } = data;
    const donationCase = parsed.data.donationCase;

    let certificateUrl = null;

    if (certificate) {
      const filePath = `certificates/${Date.now()}_${sanitizeFileName(certificate.name)}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("blood-donations")
        .upload(filePath, certificate);

      if (uploadError) {
        throw new ServiceError(
          uploadError.message || "Failed to upload certificate",
          "STORAGE_ERROR"
        );
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

    if (insertError) handleSupabaseError(insertError, "Failed to submit blood donation");
    return insertData;
  },

  submitTreeTagging: async (
    data: TreeTaggingSubmissionData,
    studentId: string
  ) => {
    if (!studentId) {
      throw new ServiceError(
        "You must be logged in to submit a tree tagging activity",
        "UNAUTHORIZED"
      );
    }

    const parsed = treeTaggingSchema.safeParse({
      treesPlanted: Number(data.treesPlanted),
      taggedTreeLinks: data.taggedTreeLinks,
    });
    if (!parsed.success) {
      throw new ServiceError(
        parsed.error.issues.map((i) => i.message).join(", "),
        "VALIDATION_ERROR"
      );
    }

    const { data: insertData, error: insertError } = await supabase
      .from("tree_tagging")
      .insert([
        {
          student_id: studentId,
          trees_planted: parsed.data.treesPlanted,
          tagged_links: parsed.data.taggedTreeLinks,
        },
      ]);

    if (insertError) handleSupabaseError(insertError, "Failed to submit tree tagging");
    return insertData;
  },
};
