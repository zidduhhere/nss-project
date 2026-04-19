export type UserRole = 'student' | 'unit' | 'admin' | 'flagship_admin' | 'rco';

export interface UserProfile {
  id: string;
  mobile: string | null;
  ktu_id: string | null;
  college_id: string | null;
  full_name: string | null;
  role: UserRole;
  email: string | null;
  unit_id?: string | null;
  certificate_type?: string | null;
  allowed_colleges?: string[] | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}
