export interface UserWithDetails {
  id: string;
  email: string;
  full_name: string | null;
  role: 'student' | 'unit';
  created_at: string;
  updated_at: string;
  phone_number?: string | null;
  college_district?: string | null;
  
  // Unit-specific fields (populated only if role is 'unit')
  unit_number?: string | null;
  college_name?: string | null;
  district?: string | null;
  
  // Volunteer application count
  volunteer_applications?: number;
  
  // Additional profile info
  avatar_url?: string | null;
}

export interface UserFilters {
  role?: 'all' | 'student' | 'unit';
  search?: string;
  district?: string;
}

export interface UserStats {
  totalUsers: number;
  totalStudents: number;
  totalUnits: number;
  studentsWithApplications: number;
}
