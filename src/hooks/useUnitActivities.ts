import { useState, useEffect, useCallback } from "react";
import { activitiesService, Activity } from "@/services/activitiesService";

export const useUnitActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await activitiesService.getAllActivities({ pageSize: 100 });
      setActivities(result.items);
    } catch (err: any) {
      console.error("Error fetching activities:", err);
      setError(err.message || "Failed to fetch activities");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const stats = {
    total: activities.length,
    upcoming: activities.filter((a) => a.status === "upcoming").length,
    ongoing: activities.filter((a) => a.status === "ongoing").length,
    completed: activities.filter((a) => a.status === "completed").length,
  };

  return {
    activities,
    isLoading,
    error,
    stats,
    refetch: fetchActivities,
  };
};
