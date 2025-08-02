import { useState, useEffect, useCallback } from "react";
import {
  BloodDonationSubmission,
  TreeTaggingSubmission,
  CreateBloodDonationRequest,
  CreateTreeTaggingRequest,
  DashboardStats,
} from "../models";
import { SubmissionService } from "../services";

export interface StudentViewModel {
  bloodSubmissions: BloodDonationSubmission[];
  treeSubmissions: TreeTaggingSubmission[];
  stats: DashboardStats;
  isLoading: boolean;
  error: string | null;
  submitBloodDonation: (
    submission: CreateBloodDonationRequest
  ) => Promise<boolean>;
  submitTreeTagging: (submission: CreateTreeTaggingRequest) => Promise<boolean>;
  refreshData: () => void;
  clearError: () => void;
}

export const useStudentViewModel = (studentId: string): StudentViewModel => {
  const [bloodSubmissions, setBloodSubmissions] = useState<
    BloodDonationSubmission[]
  >([]);
  const [treeSubmissions, setTreeSubmissions] = useState<
    TreeTaggingSubmission[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(() => {
    try {
      setIsLoading(true);
      const bloodSubs =
        SubmissionService.getBloodSubmissionsByStudent(studentId);
      const treeSubs = SubmissionService.getTreeSubmissionsByStudent(studentId);

      setBloodSubmissions(bloodSubs);
      setTreeSubmissions(treeSubs);
    } catch (err) {
      setError("Failed to load submissions");
    } finally {
      setIsLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const calculateStats = useCallback((): DashboardStats => {
    const approvedBlood = bloodSubmissions.filter(
      (sub) => sub.status === "approved"
    );
    const approvedTree = treeSubmissions.filter(
      (sub) => sub.status === "approved"
    );
    const pendingBlood = bloodSubmissions.filter(
      (sub) => sub.status === "pending"
    );
    const pendingTree = treeSubmissions.filter(
      (sub) => sub.status === "pending"
    );

    const totalPoints = [...approvedBlood, ...approvedTree].reduce(
      (sum, sub) => sum + (sub.points || 0),
      0
    );

    return {
      totalPoints,
      bloodDonations: bloodSubmissions.length,
      treeTagging: treeSubmissions.length,
      pendingReviews: pendingBlood.length + pendingTree.length,
    };
  }, [bloodSubmissions, treeSubmissions]);

  const submitBloodDonation = useCallback(
    async (submission: CreateBloodDonationRequest): Promise<boolean> => {
      try {
        setError(null);
        const newSubmission = SubmissionService.createBloodSubmission(
          submission,
          studentId
        );
        setBloodSubmissions((prev) => [...prev, newSubmission]);
        return true;
      } catch (err) {
        setError("Failed to submit blood donation");
        return false;
      }
    },
    [studentId]
  );

  const submitTreeTagging = useCallback(
    async (submission: CreateTreeTaggingRequest): Promise<boolean> => {
      try {
        setError(null);
        const newSubmission = SubmissionService.createTreeSubmission(
          submission,
          studentId
        );
        setTreeSubmissions((prev) => [...prev, newSubmission]);
        return true;
      } catch (err) {
        setError("Failed to submit tree tagging");
        return false;
      }
    },
    [studentId]
  );

  const refreshData = useCallback(() => {
    loadData();
  }, [loadData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    bloodSubmissions,
    treeSubmissions,
    stats: calculateStats(),
    isLoading,
    error,
    submitBloodDonation,
    submitTreeTagging,
    refreshData,
    clearError,
  };
};
