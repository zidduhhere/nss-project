import { z } from "zod";


export const FormSchema = z.object({
  district: z.string(),
  college: z.string(),
  ktuRollNumber: z.string().max(13).optional(),
  email: z.email("Invalid email address"),
  fullName: z.string().min(2, "Name should be at least 2 characters long"),
  mobileNumber: z.string().min(10, "Mobile number should be at least 10 digits long"),
  password: z.string()
    .min(6, "Password should be at least 6 characters long")
    .max(20, "Password should be at most 20 characters long"),
  confirmPassword: z.string()
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type FormFields = z.infer<typeof FormSchema>;
