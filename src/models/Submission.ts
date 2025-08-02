// Blood Donation Models
export interface BloodDonationSubmission {
  id: string;
  studentId: string;
  hospitalName: string;
  donationDate: string;
  unitsdonated: number;
  donationCase?: string;
  certificate: File | null;
  status: SubmissionStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  points?: number;
}

export interface BloodDonationFormData {
  hospitalName: string;
  donationDate: string;
  unitsdonated: string;
  donationCase: string;
  certificate: File | null;
}

export interface CreateBloodDonationRequest
  extends Omit<
    BloodDonationSubmission,
    "id" | "studentId" | "status" | "submittedAt"
  > {}

// Tree Tagging Models
export interface TreeTaggingSubmission {
  id: string;
  studentId: string;
  studentName: string;
  treeName: string;
  scientificName: string;
  location: string;
  treeImage: File | null;
  status: SubmissionStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  points?: number;
}

export interface TreeTaggingFormData {
  treeName: string;
  scientificName: string;
  location: string;
  treeImage: File | null;
}

export interface CreateTreeTaggingRequest
  extends Omit<
    TreeTaggingSubmission,
    "id" | "studentId" | "status" | "submittedAt"
  > {}

// Common Types
export type SubmissionStatus = "pending" | "approved" | "rejected";
export type SubmissionType = "blood" | "tree";

export interface SubmissionReview {
  id: string;
  type: SubmissionType;
  points?: number;
  action: "approve" | "reject";
}
