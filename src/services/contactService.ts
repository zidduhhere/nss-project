import supabase from "@/services/supabase";
import { ServiceError, handleSupabaseError } from "@/services/errors";
import { contactFormSchema } from "@/services/validationSchemas";

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  message: string;
  created_at?: string;
}

export const contactService = {
  submitContactForm: async (
    data: Omit<ContactSubmission, "id" | "created_at">
  ): Promise<void> => {
    const parsed = contactFormSchema.safeParse(data);
    if (!parsed.success) {
      throw new ServiceError(
        parsed.error.issues.map((i) => i.message).join(", "),
        "VALIDATION_ERROR"
      );
    }

    const { error } = await supabase.from("contact_submissions").insert([
      {
        name: parsed.data.name,
        email: parsed.data.email,
        message: parsed.data.message,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) handleSupabaseError(error, "Failed to send message");
  },
};
