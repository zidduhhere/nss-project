import {
  BloodDonationSubmission,
  TreeTaggingSubmission,
  CreateBloodDonationRequest,
  CreateTreeTaggingRequest,
  SubmissionType,
} from "../models";
import { StorageService } from "./StorageService";

export class SubmissionService {
  // Blood Donation Methods
  static getAllBloodSubmissions(): BloodDonationSubmission[] {
    return StorageService.getBloodSubmissions();
  }

  static getBloodSubmissionsByStudent(
    studentId: string
  ): BloodDonationSubmission[] {
    return this.getAllBloodSubmissions().filter(
      (sub) => sub.studentId === studentId
    );
  }

  static createBloodSubmission(
    submission: CreateBloodDonationRequest,
    studentId: string
  ): BloodDonationSubmission {
    const newSubmission: BloodDonationSubmission = {
      ...submission,
      id: Date.now().toString(),
      studentId,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };

    const submissions = this.getAllBloodSubmissions();
    submissions.push(newSubmission);
    StorageService.saveBloodSubmissions(submissions);

    return newSubmission;
  }

  // Tree Tagging Methods
  static getAllTreeSubmissions(): TreeTaggingSubmission[] {
    return StorageService.getTreeSubmissions();
  }

  static getTreeSubmissionsByStudent(
    studentId: string
  ): TreeTaggingSubmission[] {
    return this.getAllTreeSubmissions().filter(
      (sub) => sub.studentId === studentId
    );
  }

  static createTreeSubmission(
    submission: CreateTreeTaggingRequest,
    studentId: string
  ): TreeTaggingSubmission {
    const newSubmission: TreeTaggingSubmission = {
      ...submission,
      id: Date.now().toString(),
      studentId,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };

    const submissions = this.getAllTreeSubmissions();
    submissions.push(newSubmission);
    StorageService.saveTreeSubmissions(submissions);

    return newSubmission;
  }

  // Review Methods
  static approveSubmission(
    type: SubmissionType,
    id: string,
    points: number,
    reviewerId: string
  ): boolean {
    try {
      if (type === "blood") {
        const submissions = this.getAllBloodSubmissions();
        const updatedSubmissions = submissions.map((sub) =>
          sub.id === id
            ? {
                ...sub,
                status: "approved" as const,
                reviewedAt: new Date().toISOString(),
                reviewedBy: reviewerId,
                points,
              }
            : sub
        );
        StorageService.saveBloodSubmissions(updatedSubmissions);
      } else {
        const submissions = this.getAllTreeSubmissions();
        const updatedSubmissions = submissions.map((sub) =>
          sub.id === id
            ? {
                ...sub,
                status: "approved" as const,
                reviewedAt: new Date().toISOString(),
                reviewedBy: reviewerId,
                points,
              }
            : sub
        );
        StorageService.saveTreeSubmissions(updatedSubmissions);
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  static rejectSubmission(
    type: SubmissionType,
    id: string,
    reviewerId: string
  ): boolean {
    try {
      if (type === "blood") {
        const submissions = this.getAllBloodSubmissions();
        const updatedSubmissions = submissions.map((sub) =>
          sub.id === id
            ? {
                ...sub,
                status: "rejected" as const,
                reviewedAt: new Date().toISOString(),
                reviewedBy: reviewerId,
              }
            : sub
        );
        StorageService.saveBloodSubmissions(updatedSubmissions);
      } else {
        const submissions = this.getAllTreeSubmissions();
        const updatedSubmissions = submissions.map((sub) =>
          sub.id === id
            ? {
                ...sub,
                status: "rejected" as const,
                reviewedAt: new Date().toISOString(),
                reviewedBy: reviewerId,
              }
            : sub
        );
        StorageService.saveTreeSubmissions(updatedSubmissions);
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  // Utility Methods
  static getPendingBloodSubmissions(): BloodDonationSubmission[] {
    return this.getAllBloodSubmissions().filter(
      (sub) => sub.status === "pending"
    );
  }

  static getPendingTreeSubmissions(): TreeTaggingSubmission[] {
    return this.getAllTreeSubmissions().filter(
      (sub) => sub.status === "pending"
    );
  }

  static getApprovedSubmissions(): (
    | BloodDonationSubmission
    | TreeTaggingSubmission
  )[] {
    return [
      ...this.getAllBloodSubmissions().filter(
        (sub) => sub.status === "approved"
      ),
      ...this.getAllTreeSubmissions().filter(
        (sub) => sub.status === "approved"
      ),
    ];
  }
}
