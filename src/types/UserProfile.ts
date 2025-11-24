export interface UserProfile {
  id: string; //
  mobile: string | null;//
  ktu_id: string | null;//
  college_id: string | null;//
  full_name: string | null;//
  role: 'student' | 'unit' | 'admin';//
  email: string | null;//
  unit_id?: string | null;//
  created_at: string;//
  updated_at: string;//
}
