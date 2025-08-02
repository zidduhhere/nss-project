import { useState, useEffect, useCallback } from "react";
import {
  BloodDonationSubmission,
  TreeTaggingSubmission,
  FacultyStats,
  SubmissionType,
} from "../models";
import { SubmissionService } from "../services";

export interface FacultyViewModel {
  bloodSubmissions: BloodDonationSubmission[];
  treeSubmissions: TreeTaggingSubmission[];
  pendingBloodSubmissions: BloodDonationSubmission[];
  pendingTreeSubmissions: TreeTaggingSubmission[];
  stats: FacultyStats;
  isLoading: boolean;
  error: string | null;
  approveSubmission: (
    type: SubmissionType,
    id: string,
    points: number
  ) => Promise<boolean>;
  rejectSubmission: (type: SubmissionType, id: string) => Promise<boolean>;
  refreshData: () => void;
  clearError: () => void;
}

export const useFacultyViewModel = (facultyId: string): FacultyViewModel => {
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
      const bloodSubs = SubmissionService.getAllBloodSubmissions();
      const treeSubs = SubmissionService.getAllTreeSubmissions();

      setBloodSubmissions(bloodSubs);
      setTreeSubmissions(treeSubs);
    } catch (err) {
      setError("Failed to load submissions");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const calculateStats = useCallback((): FacultyStats => {
    const pendingBlood = bloodSubmissions.filter(
      (sub) => sub.status === "pending"
    );
    const pendingTree = treeSubmissions.filter(
      (sub) => sub.status === "pending"
    );
    const approvedSubmissions = [
      ...bloodSubmissions.filter((sub) => sub.status === "approved"),
      ...treeSubmissions.filter((sub) => sub.status === "approved"),
    ];

    return {
      pendingReviews: pendingBlood.length + pendingTree.length,
      totalBloodDonations: bloodSubmissions.length,
      totalTreeTagging: treeSubmissions.length,
      totalApproved: approvedSubmissions.length,
    };
  }, [bloodSubmissions, treeSubmissions]);

  const approveSubmission = useCallback(
    async (
      type: SubmissionType,
      id: string,
      points: number
    ): Promise<boolean> => {
      try {
        setError(null);
        const success = SubmissionService.approveSubmission(
          type,
          id,
          points,
          facultyId
        );

        if (success) {
          // Update local state
          if (type === "blood") {
            setBloodSubmissions((prev) =>
              prev.map((sub) =>
                sub.id === id
                  ? {
                      ...sub,
                      status: "approved",
                      reviewedAt: new Date().toISOString(),
                      reviewedBy: facultyId,
                      points,
                    }
                  : sub
              )
            );
          } else {
            setTreeSubmissions((prev) =>
              prev.map((sub) =>
                sub.id === id
                  ? {
                      ...sub,
                      status: "approved",
                      reviewedAt: new Date().toISOString(),
                      reviewedBy: facultyId,
                      points,
                    }
                  : sub
              )
            );
          }
          return true;
        }

        setError("Failed to approve submission");
        return false;
      } catch (err) {
        setError("Failed to approve submission");
        return false;
      }
    },
    [facultyId]
  );

  const rejectSubmission = useCallback(
    async (type: SubmissionType, id: string): Promise<boolean> => {
      try {
        setError(null);
        const success = SubmissionService.rejectSubmission(type, id, facultyId);

        if (success) {
          // Update local state
          if (type === "blood") {
            setBloodSubmissions((prev) =>
              prev.map((sub) =>
                sub.id === id
                  ? {
                      ...sub,
                      status: "rejected",
                      reviewedAt: new Date().toISOString(),
                      reviewedBy: facultyId,
                    }
                  : sub
              )
            );
          } else {
            setTreeSubmissions((prev) =>
              prev.map((sub) =>
                sub.id === id
                  ? {
                      ...sub,
                      status: "rejected",
                      reviewedAt: new Date().toISOString(),
                      reviewedBy: facultyId,
                    }
                  : sub
              )
            );
          }
          return true;
        }

        setError("Failed to reject submission");
        return false;
      } catch (err) {
        setError("Failed to reject submission");
        return false;
      }
    },
    [facultyId]
  );

  const refreshData = useCallback(() => {
    loadData();
  }, [loadData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const pendingBloodSubmissions = bloodSubmissions.filter(
    (sub) => sub.status === "pending"
  );
  const pendingTreeSubmissions = treeSubmissions.filter(
    (sub) => sub.status === "pending"
  );

  return {
    bloodSubmissions,
    treeSubmissions,
    pendingBloodSubmissions,
    pendingTreeSubmissions,
    stats: calculateStats(),
    isLoading,
    error,
    approveSubmission,
    rejectSubmission,
    refreshData,
    clearError,
  };
};
