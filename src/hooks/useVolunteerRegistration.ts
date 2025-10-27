import { useState } from 'react';
import { volunteerService } from '@/services/volunteerService';
import { VolunteerFormFields } from '@/types/VolunteerFormSchema';

export const useVolunteerRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const registerVolunteer = async (data: VolunteerFormFields) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await volunteerService.registerVolunteer(data);
      setSuccess(true);
      return response;
    } catch (err: any) {
      setError(err.message);
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
