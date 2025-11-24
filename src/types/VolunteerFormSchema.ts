import { bloodGroups, communities, genders, religions, semesters } from "@/utils/data/community";
import { getAllDistricts } from "@/utils/data/taluks";
import * as z from "zod";



//Semester enum


// Helper to validate non-empty strings
const nonEmptyString = (fieldName: string) =>
  z.string().refine(
    (val) => {
      // Check for null, undefined, empty string, and whitespace-only strings
      if (val === null || val === undefined || val === "") return false;
      if (typeof val === 'string' && val.trim().length === 0) return false;
      return true;
    },
    { message: `${fieldName} is required` }
  );

export const VolunteerSchema = z.object({
  name: nonEmptyString("Name"),
  unit: nonEmptyString("Unit"),
  semester: z.enum(semesters, "Semester is required"),
  course: nonEmptyString("Course"),
  admissionYear: z.number("Admission year is required")
    .min(2010, "Admission year is required")
    .max(new Date().getFullYear(), "Admission year cannot be in the future"),
  ktuId: nonEmptyString("KTU ID"),
  gender: z.enum(genders, "Gender is required")
    .refine((val) => val !== "" as any, "Gender is required"),
  dob: nonEmptyString("Date of birth"),
  contactNumber: nonEmptyString("Contact number").refine((val) => /^[0-9]{10}$/.test(val), {
    message: "Contact number must be exactly 10 digits and numeric"
  }),
  whatsappNumber: nonEmptyString("WhatsApp number").refine((val) => /^[0-9]{10}$/.test(val), {
    message: "WhatsApp number must be exactly 10 digits and numeric"
  }),
  religion: z.enum(religions, "Religion is required")
    .refine((val) => val !== "" as any, "Religion is required"),
  community: z.enum(communities, "Community is required")
    .refine((val) => val !== "" as any, "Community is required"),
  bloodGroup: z.enum(bloodGroups, "Blood group is required")
    .refine((val) => val !== "" as any, "Blood group is required"),
  pincode: nonEmptyString("Pincode").refine((val) => val.length === 6, {
    message: "Pincode must be 6 digits"
  }),
  height: nonEmptyString("Height"),
  weight: nonEmptyString("Weight"),
  district: z.enum(getAllDistricts(), "District is required")
    .refine((val) => val !== "" as any, "District is required"),
  taluk: nonEmptyString("Taluk"),
  village: nonEmptyString("Village"),
  parent: nonEmptyString("Parent/Guardian name"),
  parentContact: nonEmptyString("Parent/Guardian contact").refine((val) => /^[0-9]{10}$/.test(val), {
    message: "Parent/Guardian contact must be exactly 10 digits and numerics"
  }),
  permanentAddress: nonEmptyString("Permanent address").refine((val) => val.length <= 200, {
    message: "Permanent address is too long"
  }),
  photo: z.any().refine((val) => val instanceof File, {
    message: "Photo is required"
  }).refine((file) => file && file.size <= 2 * 1024 * 1024, {
    message: "Photo must be less than 2MB"
  }).refine((file) => file && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type), {
    message: "Photo must be a JPEG or PNG image"
  }),
  signature: z.any().refine((val) => val instanceof File, {
    message: "Signature is required"
  }).refine((file) => file && file.size <= 2 * 1024 * 1024, {
    message: "Signature must be less than 2MB"
  }).refine((file) => file && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type), {
    message: "Signature must be a JPEG or PNG image"
  }),
  languagesKnown: z.enum (['English', 'Hindi', 'Malayalam', 'Tamil', 'Telugu', 'Kannada', 'Other']).array(),
});

export type VolunteerFormFields = z.infer<typeof VolunteerSchema>;


const languages: string[] = ['English', 'Hindi', 'Malayalam', 'Tamil', 'Telugu', 'Kannada', 'Other'];

export { languages };