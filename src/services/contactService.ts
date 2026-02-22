import supabase from "@/services/supabase";

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  message: string;
  created_at?: string;
}

/**
 * Contact Service - Handles contact form submissions to Supabase
 */
export const contactService = {
  /**
   * Submit a contact form message
   */
  submitContactForm: async (data: Omit<ContactSubmission, "id" | "created_at">): Promise<void> => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .insert([{
          name: data.name,
          email: data.email,
          message: data.message,
          created_at: new Date().toISOString(),
        }]);

      if (error) throw error;
    } catch (error: any) {
      console.error("Error submitting contact form:", error);
      throw new Error(error.message || "Failed to send message");
    }
  },
};
