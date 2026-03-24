import { z } from "zod";

/** Strip characters that could manipulate PostgREST filter syntax */
export const sanitizeFilter = (value: string) =>
  value.replace(/[%_.,()\\]/g, "");

export const sanitizeFileName = (name: string) =>
  name.replace(/[^a-zA-Z0-9._-]/g, "_");

// ── Contact form ──────────────────────────────────────────────
export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});
export type ContactFormInput = z.infer<typeof contactFormSchema>;

// ── Blood donation submission ─────────────────────────────────
export const BLOOD_DONATION_CASE_VALUES = [
  "platelets",
  "rbc",
  "double blood cells",
  "whole blood",
] as const;

export const bloodDonationSchema = z.object({
  hospitalName: z.string().min(1, "Hospital name is required").max(200),
  donationDate: z.string().min(1, "Donation date is required"),
  typeDonated: z.string().nullable().optional(),
  donationCase: z.enum(BLOOD_DONATION_CASE_VALUES, {
    errorMap: () => ({
      message: `Donation case must be one of: ${BLOOD_DONATION_CASE_VALUES.join(", ")}`,
    }),
  }),
});
export type BloodDonationInput = z.infer<typeof bloodDonationSchema>;

// ── Tree tagging submission ───────────────────────────────────
export const treeTaggingSchema = z.object({
  treesPlanted: z.number().int().min(1, "At least 1 tree required"),
  taggedTreeLinks: z.array(z.string().url("Each link must be a valid URL")).optional(),
});
export type TreeTaggingInput = z.infer<typeof treeTaggingSchema>;

// ── Blog post (admin) ─────────────────────────────────────────
export const blogPostSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1),
  category: z.string().min(1).max(100),
  cover_image_url: z.string().url().nullable().optional(),
  published: z.boolean().optional(),
});
export type BlogPostInput = z.infer<typeof blogPostSchema>;

// ── Activity (admin) ──────────────────────────────────────────
export const activitySchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  activity_type: z.enum([
    "camp",
    "blood_donation",
    "tree_planting",
    "workshop",
    "awareness",
    "other",
  ]),
  location: z.string().max(300).nullable().optional(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().nullable().optional(),
  status: z.enum(["upcoming", "ongoing", "completed", "cancelled"]).optional(),
  organizer: z.string().max(200).nullable().optional(),
  max_participants: z.number().int().positive().nullable().optional(),
  cover_image_url: z.string().url().nullable().optional(),
});
export type ActivityInput = z.infer<typeof activitySchema>;

// ── Course (unit) ─────────────────────────────────────────────
export const courseSchema = z.object({
  name: z.string().min(1, "Course name is required").max(200),
  code: z.string().min(1, "Course code is required").max(20),
});
export type CourseInput = z.infer<typeof courseSchema>;
