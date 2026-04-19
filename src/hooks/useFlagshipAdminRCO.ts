import { useState, useEffect, useCallback } from "react";
import { flagshipAdminService } from "@/services/flagshipAdminService";
import type { UserProfile } from "@/types/UserProfile";

export const useFlagshipAdminRCO = () => {
  const [rcos, setRcos] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRCOs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await flagshipAdminService.listRCOs();
      setRcos(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch RCOs");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchRCOs(); }, [fetchRCOs]);

  const createRCO = async (params: {
    email: string;
    password: string;
    full_name: string;
    allowed_colleges: string[];
  }) => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await flagshipAdminService.createRCO(params);
      setSuccessMessage(`RCO account created for ${params.full_name}`);
      await fetchRCOs();
    } catch (err: any) {
      setError(err.message || "Failed to create RCO");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeRCO = async (rcoId: string) => {
    setError(null);
    setSuccessMessage(null);
    try {
      await flagshipAdminService.removeRCO(rcoId);
      setSuccessMessage("RCO removed successfully");
      setRcos((prev) => prev.filter((r) => r.id !== rcoId));
    } catch (err: any) {
      setError(err.message || "Failed to remove RCO");
    }
  };

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  return {
    rcos,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    createRCO,
    removeRCO,
    clearMessages,
    refetch: fetchRCOs,
  };
};
