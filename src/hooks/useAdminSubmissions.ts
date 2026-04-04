import { useState, useEffect, useCallback } from "react";
import { adminService, AdminSubmission } from "@/services/adminService";

interface SubmissionFilters {
  type: string;
  status: string;
  search: string;
}

export const useAdminSubmissions = () => {
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [filters, setFilters] = useState<SubmissionFilters>({
    type: "",
    status: "",
    search: "",
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const fetchSubmissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await adminService.getAllSubmissions({
        type: filters.type || undefined,
        status: filters.status || undefined,
        search: filters.search || undefined,
      });
      setSubmissions(data);
      setStats({
        total: data.length,
        pending: data.filter((s) => s.status === "pending").length,
        approved: data.filter((s) => s.status === "approved").length,
        rejected: data.filter((s) => s.status === "rejected").length,
      });
    } catch (err: any) {
      setError(err.message || "Failed to fetch submissions");
      setSubmissions([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const overrideStatus = async (
    id: string,
    submissionType: "Blood Donation" | "Tree Tagging",
    newStatus: "approved" | "rejected" | "pending"
  ) => {
    setError(null);
    setSuccessMessage(null);

    try {
      await adminService.overrideSubmissionStatus(id, submissionType, newStatus);
      setSuccessMessage(`Submission ${newStatus} successfully (admin override)`);

      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
      );
      setStats((prev) => {
        const oldStatus = submissions.find((s) => s.id === id)?.status;
        const newStats = { ...prev };
        if (oldStatus === "pending") newStats.pending--;
        else if (oldStatus === "approved") newStats.approved--;
        else if (oldStatus === "rejected") newStats.rejected--;
        if (newStatus === "pending") newStats.pending++;
        else if (newStatus === "approved") newStats.approved++;
        else if (newStatus === "rejected") newStats.rejected++;
        return newStats;
      });
    } catch (err: any) {
      setError(err.message || "Failed to override submission status");
    }
  };

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  return {
    submissions,
    isLoading,
    error,
    successMessage,
    stats,
    filters,
    setFilters,
    overrideStatus,
    clearMessages,
    refetch: fetchSubmissions,
  };
};
