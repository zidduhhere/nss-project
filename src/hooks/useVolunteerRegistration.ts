import { useState } from "react";
import { volunteerService } from "@/services/volunteerService";
import { VolunteerFormFields } from "@/types/VolunteerFormSchema";
import { UseAuthContext } from "@/context/AuthContext";

export const useVolunteerRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  
  const { session } = UseAuthContext();


  const getCollegeCourses = async () => {
    try {
      let courses = await volunteerService.getCollegeCourses(session!.user.id);
      console.log("Fetched college courses:", courses);

      const formattedCourses = courses.map(course => {
        return `${course.code} - ${course.name}`;
      });

      return formattedCourses;
    } catch (error) {
      console.error("Error fetching college courses:", error);
      return [];
    }
  };

  const registerVolunteer = async (data: VolunteerFormFields) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!session?.user?.id) {
        throw new Error("You must be logged in to register as a volunteer");
      }
      //TODO: Remove this code
      console.log("Registering volunteer for user ID:", session.user.id);
      const response = await volunteerService.registerVolunteer(
        data,
        session.user.id
      );
      setSuccess(true);
      return response;
    } catch (err: any) {
      if (err instanceof Error) {
        console.log(err);
        if (err.message.includes("volunteers_student_id_key")) {
          console.error(err);
          
          setError(
            "You have already registered as a volunteer. Manas Nannavatte"
          );
        }
        if (err.message.includes("volunteers_ktu_id_key")) {
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
    getCollegeCourses,
    isLoading,
    error,
    success,
    resetState,
  };
};
