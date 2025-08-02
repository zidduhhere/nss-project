// Dashboard Models
export interface DashboardStats {
  totalPoints: number;
  bloodDonations: number;
  treeTagging: number;
  pendingReviews: number;
}

export interface FacultyStats {
  pendingReviews: number;
  totalBloodDonations: number;
  totalTreeTagging: number;
  totalApproved: number;
}

export interface StatCard {
  title: string;
  value: number;
  icon: any; // Lucide React icon component
  color: string;
}
