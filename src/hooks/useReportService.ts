import { useState, useEffect, useCallback } from 'react';
import { reportService, ReportStats, ActivityReport, UnitReport, MonthlyTrend } from '@/services/reportService';

/**
 * Hook for fetching report statistics
 */
export const useReportStats = () => {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await reportService.getReportStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch report statistics');
      console.error('Error fetching report stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
};

/**
 * Hook for fetching activity report
 */
export const useActivityReport = (filters?: {
  activityType?: 'blood_donation' | 'tree_tagging' | 'all';
  status?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const [activities, setActivities] = useState<ActivityReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await reportService.getActivityReport(filters);
      setActivities(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch activity report');
      console.error('Error fetching activity report:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    isLoading,
    error,
    refetch: fetchActivities,
  };
};

/**
 * Hook for fetching unit report
 */
export const useUnitReport = () => {
  const [units, setUnits] = useState<UnitReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUnits = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await reportService.getUnitReport();
      setUnits(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch unit report');
      console.error('Error fetching unit report:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  return {
    units,
    isLoading,
    error,
    refetch: fetchUnits,
  };
};

/**
 * Hook for fetching monthly trends
 */
export const useMonthlyTrends = () => {
  const [trends, setTrends] = useState<MonthlyTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrends = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await reportService.getMonthlyTrends();
      setTrends(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch monthly trends');
      console.error('Error fetching monthly trends:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrends();
  }, [fetchTrends]);

  return {
    trends,
    isLoading,
    error,
    refetch: fetchTrends,
  };
};
