/**
 * Unit Profile Type Definitions
 * 
 * Represents the complete unit profile data structure based on the nss_units table schema.
 * Includes both unit details and Program Officer (PO) information.
 */

export interface UnitProfile {
  // Primary identifiers
  id: string; // UUID primary key
  unit_number: string; // Unique unit identifier
  college_id: string; // Foreign key to colleges table

  // Timestamps
  created_at: string; // ISO timestamp

  // Program Officer details
  po_name: string | null;
  po_phone: string | null; // varchar(10)
  po_email: string | null;
  po_address: string | null;
  po_designation: string | null;
}

/**
 * Extended unit profile with college information
 * Used when displaying unit data with college details
 */
export interface UnitProfileWithCollege extends UnitProfile {
  college_name?: string;
  college_district?: string;
}

/**
 * Unit profile update data
 * Excludes read-only fields (id, unit_number, college_id, created_at)
 */
export type UnitProfileUpdate = Partial<
  Omit<UnitProfile, "id" | "unit_number" | "college_id" | "created_at">
>;

/**
 * Unit statistics for profile page
 */
export interface UnitStats {
  totalVolunteers: number;
  pendingApprovals: number;
  approvedVolunteers: number;
  rejectedVolunteers: number;
  certifiedVolunteers: number; // Volunteers certified by admin
  establishedYear?: string;
}
