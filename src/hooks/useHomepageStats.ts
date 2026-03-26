import { useState, useEffect } from "react";
import { generalService, HomepageStats } from "@/services/generalService";

export const useHomepageStats = () => {
  const [stats, setStats] = useState<HomepageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchStats = async () => {
      try {
        const data = await generalService.getHomepageStats();
        if (!cancelled) setStats(data);
      } catch (err) {
        console.error("Failed to fetch homepage stats:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchStats();
    return () => { cancelled = true; };
  }, []);

  return { stats, isLoading };
};
