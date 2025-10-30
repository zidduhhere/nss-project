import { useState } from "react";
import { volunteerService } from "@/services/volunteerService";
import { VolunteerFormFields } from "@/types/VolunteerFormSchema";
import { UseAuthContext } from "@/context/AuthContext";

export const useVolunteerRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // ✅ Get user from auth context in the HOOK (allowed!)
  const { session } = UseAuthContext();

  const registerVolunteer = async (data: VolunteerFormFields) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!session?.user?.id) {
        throw new Error("You must be logged in to register as a volunteer");
      }

      console.log("Registering volunteer for user ID:", session.user.id);
      const response = await volunteerService.registerVolunteer(
        data,
        session.user.id
      );
      setSuccess(true);
      return response;
    } catch (err: any) {
      if (err instanceof Error) {
        if (err.message.includes("volunteers_student_id_key")) {
          console.error("❌ Duplicate Student ID detected");
          setError("You have already registered as a volunteer. Manas Nannavatte");
        }
        if (err.message.includes("volunteers_ktu_id_key")) {
          console.error("❌ Duplicate KTU ID detected");
          setError("A volunteer with this KTU ID already exists.");
        }
        setError(err.message);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    registerVolunteer,
    isLoading,
    error,
    success,
    resetState,
  };
};
