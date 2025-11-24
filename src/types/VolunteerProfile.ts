export interface VolunteerProfile {
  id: string;//
  student_id: string;//
  unit_id: string | null;//
  unit_number: string | null;//
  admission_year: number;//
  valid_from_year: number | null;//
  valid_to_year: number | null;//
  status: 'pending' | 'approved' | 'rejected' | 'certified'; // pending -> approved (unit) -> certified (admin only)
  semester: number | null;//
  course: string | null;//
  enroll_no: string | null;//
  ktu_id: string | null;//
  full_name: string | null;//
  gender: string | null;//
  dob: string | null;//
  contact_number: string | null;//
  whatsapp_number: string | null;//
  religion: string | null;//
  community: string | null;//
  blood_group: string | null;//
  height: number | null;//
  weight: number | null;//
  district: string | null;//
  taluk: string | null;//
  village: string | null;//
  pincode: string | null;//
  parent_name: string | null;//
  parent_contact_number: string | null;//
  permanent_address: string | null;//
  current_address: string | null;//
  photo_url: string | null;//
  signature_url: string | null;//
  languages_known: string[] | null;//
  created_at: string;//
  updated_at: string;//
}
