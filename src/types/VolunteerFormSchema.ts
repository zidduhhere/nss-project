import { bloodGroups, communities, religions } from "@/utils/data/community";
import { getAllDistricts } from "@/utils/data/taluks";
import * as z from "zod";
export const VolunteerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  unit: z.string().min(3, "Unit is required"),
  semster: z
    .enum(['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8']),
  course: z.string().min(1, "Course is required"),
  admissionYear: z
    .number()
    .min(2000, "Admission year is required")
    .max(new Date().getFullYear(), "Admission year cannot be in the future"),
  ktuId: z.string().max(13, "KTU ID should be at most 13 characters long"),
  gender: z.enum(["Male", "Female"]),
  dob: z.string().min(1, "Date of Birth is required"),
  contactNumber: z.string().min(10, "Contact number is required"),
  whatsappNumber: z.string().min(10, "WhatsApp number is required"),
  religion: z.enum(religions),
  community: z.enum(communities),
  bloodGroup: z
    .enum(bloodGroups)
    .optional(),
  pincode: z.string().length(6, "Pincode is required"),
  height: z.number().min(30, "Height is required").max(250, "Invalid height"),
  weight: z.number().min(10, "Weight is required").max(200, "Invalid weight"),
  district: z.enum(getAllDistricts()),
  taluk: z.string().min(1, "Taluk is required"),
  village: z.string().min(1, "Village is required"),
  parent: z.string().min(4, "Parent/Guardian name is required"),
  parentContact: z.string().min(10, "Parent/Guardian contact number is required"),
  permanentAddress: z.string().min(1, "Permanent address is required").max(200, "Permanent address is too long"),
  photo: z.url("Photo URL is required").optional(),
  signature: z.url("Signature URL is required").optional(),
  languagesKnown: z.enum (['English', 'Hindi', 'Malayalam', 'Tamil', 'Telugu', 'Kannada', 'Other']).array().min(1, "At least one language is required"),
});



export type VolunteerFormFields = z.infer<typeof VolunteerSchema>;