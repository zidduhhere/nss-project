import * as z from "zod";
import { getAllDistricts, getTaluksByDistrict } from "@/utils/data/taluks";
export const VolunteerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  semster: z
    .number()
    .min(1, "Semester is required")
    .max(8, "Semester must be between 1 and 8"),
  course: z.string().min(1, "Course is required"),
  admissionYear: z
    .number()
    .min(2000, "Admission year is required")
    .max(new Date().getFullYear(), "Admission year cannot be in the future"),
  enrollNumber: z.string().min(1, "Enrollment number is required"),
  email: z.email("Invalid email address"),
  gender: z.enum(["Male", "Female", "Other"]),
  dob: z.string().min(1, "Date of Birth is required"),
  contactNumber: z.string().min(10, "Contact number is required"),
  whatsappNumber: z.string().min(10, "WhatsApp number is required"),
  religion: z.enum(["Hindu", "Muslim", "Christian", "Other"]),
  community: z.enum(["General", "OBC", "SC", "ST", "Other"]),
  bloodGroup: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .optional(),
  address: z.string().min(1, "Address is required"),
  pincode: z.string().min(6, "Pincode is required"),
  height: z.number().min(30, "Height is required").max(250, "Invalid height"),
  weight: z.number().min(10, "Weight is required").max(200, "Invalid weight"),
  district: z.enum(getAllDistricts()),
});
