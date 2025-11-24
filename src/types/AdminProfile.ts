export interface AdminProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone_number: string | null;
  role: 'admin';
  college_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminStats {
  totalVolunteers: number;
  totalUnits: number;
  pendingApprovals: number;
  approvedVolunteers: number;
  certifiedVolunteers: number; // Certified by admin
  rejectedVolunteers: number;
  totalStudents: number;
  recentRegistrations: number; // Last 7 days
}

export interface SystemActivity {
  id: string;
  action: string;
  user_id: string;
  user_name: string;
  user_role: string;
  timestamp: string;
  details?: string;
}
