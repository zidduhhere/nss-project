import supabase from "@/services/supabase";
import { AdminProfile, AdminStats } from "@/types/AdminProfile";
import { VolunteerProfile } from "@/types/VolunteerProfile";
import { UserProfile } from "@/types/UserProfile";
import { UserWithDetails, UserFilters } from "@/types/UserWithDetails";

/**
 * Admin Service - Handles all admin-related operations
 * 
 * This service provides comprehensive admin functionality including:
 * - Admin profile management
 * - System-wide statistics
 * - Volunteer management across all units
 * - User management
 * - Bulk operations
 */

export const adminService = {
  /**
   * Get admin profile from the profiles table
   * 
   * Retrieves the complete profile information for an admin user by their unique ID.
   * This function ensures that only users with the 'admin' role can be fetched.
   * 
   * @param {string} adminId - The UUID of the admin user from authentication
   * 
   * @returns {Promise<AdminProfile>} Complete admin profile including:
   *   - id: Admin's unique identifier
   *   - email: Admin's email address
   *   - full_name: Admin's full name
   *   - role: Will always be 'admin'
   *   - created_at: Account creation timestamp
   *   - updated_at: Last profile update timestamp
   *   - Other profile fields (phone, avatar, etc.)
   * 
   * @throws {Error} If admin profile is not found or database query fails
   * 
   * @example
   * // Get current admin's profile
   * const adminProfile = await adminService.getAdminProfile(session.user.id);
   * console.log(adminProfile.email); // 'admin@example.com'
   * 
   * @example
   * // Handle errors when profile doesn't exist
   * try {
   *   const profile = await adminService.getAdminProfile('invalid-id');
   * } catch (error) {
   *   console.error('Admin not found:', error.message);
   * }
   */
  getAdminProfile: async (adminId: string): Promise<AdminProfile> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", adminId)
        .eq("role", "admin")
        .single();

      if (error) throw error;
      
      if (!data) {
        throw new Error("Admin profile not found");
      }

      return data as AdminProfile;
    } catch (error: any) {
      console.error("Error fetching admin profile:", error);
      throw new Error(error.message || "Failed to fetch admin profile");
    }
  },

  /**
   * Update admin profile information
   * 
   * Updates specific fields in an admin's profile. Protected fields (id, email, role, 
   * created_at, updated_at) cannot be modified. The updated_at timestamp is automatically
   * set to the current time.
   * 
   * @param {string} adminId - The UUID of the admin to update
   * @param {Partial<AdminProfile>} updates - Object containing fields to update
   *   Can include: full_name, phone_number, avatar_url, or any other profile fields
   *   except protected fields (id, email, role, timestamps)
   * 
   * @returns {Promise<AdminProfile>} The complete updated admin profile
   * 
   * @throws {Error} If the update fails or admin is not found
   * 
   * @example
   * // Update admin's name and phone
   * const updated = await adminService.updateAdminProfile(adminId, {
   *   full_name: 'John Admin',
   *   phone_number: '+91 9876543210'
   * });
   * 
   * @example
   * // Update only avatar
   * const updated = await adminService.updateAdminProfile(adminId, {
   *   avatar_url: 'https://example.com/avatar.jpg'
   * });
   */
  updateAdminProfile: async (
    adminId: string,
    updates: Partial<Omit<AdminProfile, "id" | "email" | "role" | "created_at" | "updated_at">>
  ): Promise<AdminProfile> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", adminId)
        .eq("role", "admin")
        .select()
        .single();

      if (error) throw error;

      if (!data) {
        throw new Error("Failed to update admin profile");
      }

      return data as AdminProfile;
    } catch (error: any) {
      console.error("Error updating admin profile:", error);
      throw new Error(error.message || "Failed to update admin profile");
    }
  },

  /**
   * Get comprehensive system-wide statistics for admin dashboard
   * 
   * Aggregates various metrics across the entire NSS system including volunteer counts,
   * approvals, student registrations, and recent activity. All counts are fetched using
   * optimized head-only queries for better performance.
   * 
   * @returns {Promise<AdminStats>} Statistics object containing:
   *   - totalVolunteers: Total number of volunteer applications
   *   - totalUnits: Count of unique unit IDs in the system
   *   - pendingApprovals: Volunteer applications awaiting approval
   *   - approvedVolunteers: Count of approved volunteer applications
   *   - rejectedVolunteers: Count of rejected volunteer applications
   *   - totalStudents: Total number of student profiles
   *   - recentRegistrations: New volunteer registrations in the last 7 days
   * 
   * @throws {Error} If any database query fails
   * 
   * @example
   * // Fetch stats for admin dashboard
   * const stats = await adminService.getSystemStats();
   * console.log(`Pending Approvals: ${stats.pendingApprovals}`);
   * console.log(`Total Volunteers: ${stats.totalVolunteers}`);
   * console.log(`Recent Activity: ${stats.recentRegistrations} new registrations`);
   * 
   * @example
   * // Use in dashboard component
   * useEffect(() => {
   *   async function loadStats() {
   *     const stats = await adminService.getSystemStats();
   *     setDashboardData(stats);
   *   }
   *   loadStats();
   * }, []);
   */
  getSystemStats: async (): Promise<AdminStats> => {
    try {
      // Get total volunteers count
      const { count: totalVolunteers, error: volError } = await supabase
        .from("volunteers")
        .select("*", { count: "exact", head: true });

      if (volError) throw volError;

      // Get pending approvals count
      const { count: pendingApprovals, error: pendingError } = await supabase
        .from("volunteers")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      if (pendingError) throw pendingError;

      // Get approved volunteers count
      const { count: approvedVolunteers, error: approvedError } = await supabase
        .from("volunteers")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved");

      if (approvedError) throw approvedError;

      // Get rejected volunteers count
      const { count: rejectedVolunteers, error: rejectedError } = await supabase
        .from("volunteers")
        .select("*", { count: "exact", head: true })
        .eq("status", "rejected");

      if (rejectedError) throw rejectedError;

      // Get certified volunteers count
      const { count: certifiedVolunteers, error: certifiedError } = await supabase
        .from("volunteers")
        .select("*", { count: "exact", head: true })
        .eq("status", "certified");

      if (certifiedError) throw certifiedError;

      // Get total students (profiles with student role)
      const { count: totalStudents, error: studentsError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "student");

      if (studentsError) throw studentsError;

      // Get unique units count
      const { data: unitsData, error: unitsError } = await supabase
        .from("volunteers")
        .select("unit_id")
        .not("unit_id", "is", null);

      if (unitsError) throw unitsError;

      const uniqueUnits = new Set(unitsData?.map((v) => v.unit_id)).size;

      // Get recent registrations (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { count: recentRegistrations, error: recentError } = await supabase
        .from("volunteers")
        .select("*", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo.toISOString());

      if (recentError) throw recentError;

      return {
        totalVolunteers: totalVolunteers || 0,
        totalUnits: uniqueUnits,
        pendingApprovals: pendingApprovals || 0,
        approvedVolunteers: approvedVolunteers || 0,
        certifiedVolunteers: certifiedVolunteers || 0,
        rejectedVolunteers: rejectedVolunteers || 0,
        totalStudents: totalStudents || 0,
        recentRegistrations: recentRegistrations || 0,
      };
    } catch (error: any) {
      console.error("Error fetching system stats:", error);
      throw new Error(error.message || "Failed to fetch system statistics");
    }
  },

  /**
   * Get all volunteer applications with advanced filtering capabilities
   * 
   * Retrieves volunteer applications from across all units with support for complex
   * filtering. All filters are applied at the database level for optimal performance.
   * Results are ordered by creation date (newest first).
   * 
   * @param {Object} [filters] - Optional filter criteria
   * @param {string} [filters.status] - Filter by approval status ('pending' | 'approved' | 'rejected' | 'all')
   * @param {string} [filters.unit_id] - Filter by specific unit ID
   * @param {string} [filters.search] - Search across name, KTU ID, and contact number (case-insensitive)
   * @param {string} [filters.course] - Filter by course name
   * @param {number} [filters.semester] - Filter by semester number
   * @param {string} [filters.blood_group] - Filter by blood group (A+, B+, O+, etc.)
   * @param {boolean} [filters.isActive] - Filter active volunteers (approved) vs inactive
   * 
   * @returns {Promise<VolunteerProfile[]>} Array of volunteer profiles matching filters
   * 
   * @throws {Error} If database query fails
   * 
   * @example
   * // Get all pending approvals
   * const pending = await adminService.getAllVolunteers({ status: 'pending' });
   * 
   * @example
   * // Get approved volunteers from a specific unit
   * const unitVolunteers = await adminService.getAllVolunteers({
   *   status: 'approved',
   *   unit_id: 'unit-123'
   * });
   * 
   * @example
   * // Search for volunteers by name or KTU ID
   * const results = await adminService.getAllVolunteers({
   *   search: 'John'
   * });
   * 
   * @example
   * // Get all active volunteers (approved) in semester 3
   * const activeS3 = await adminService.getAllVolunteers({
   *   isActive: true,
   *   semester: 3
   * });
   * 
   * @example
   * // Complex filter: Approved CS students with O+ blood group
   * const filtered = await adminService.getAllVolunteers({
   *   status: 'approved',
   *   course: 'Computer Science',
   *   blood_group: 'O+'
   * });
   */
  getAllVolunteers: async (filters?: {
    status?: string;
    unit_id?: string;
    search?: string;
    course?: string;
    semester?: number;
    blood_group?: string;
    isActive?: boolean; // Filter by whether volunteer is currently active
  }): Promise<VolunteerProfile[]> => {
    try {
      let query = supabase.from("volunteers").select("*").order("created_at", { ascending: false });

      // Apply status filter
      if (filters?.status && filters.status !== 'all') {
        query = query.eq("status", filters.status);
      }

      // Apply unit filter
      if (filters?.unit_id && filters.unit_id !== 'all') {
        query = query.eq("unit_id", filters.unit_id);
      }

      // Apply course filter
      if (filters?.course && filters.course !== 'all') {
        query = query.eq("course", filters.course);
      }

      // Apply semester filter
      if (filters?.semester) {
        query = query.eq("semester", filters.semester);
      }

      // Apply blood group filter
      if (filters?.blood_group && filters.blood_group !== 'all') {
        query = query.eq("blood_group", filters.blood_group);
      }

      // Apply active status filter (active = approved volunteers)
      if (filters?.isActive !== undefined) {
        if (filters.isActive) {
          query = query.eq("status", "approved");
        } else {
          query = query.neq("status", "approved");
        }
      }

      // Apply search filter (searches across multiple fields)
      if (filters?.search) {
        query = query.or(
          `full_name.ilike.%${filters.search}%,ktu_id.ilike.%${filters.search}%,contact_number.ilike.%${filters.search}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data as VolunteerProfile[]) || [];
    } catch (error: any) {
      console.error("Error fetching volunteers:", error);
      throw new Error(error.message || "Failed to fetch volunteers");
    }
  },

  /**
   * Get list of unique unit IDs that have volunteer applications
   * 
   * Retrieves all distinct unit IDs from the volunteers table, sorted alphabetically.
   * Useful for populating filter dropdowns in admin interfaces.
   * 
   * @returns {Promise<string[]>} Sorted array of unique unit IDs
   * 
   * @throws {Error} If database query fails
   * 
   * @example
   * // Get units for dropdown filter
   * const units = await adminService.getUniqueUnits();
   * // ['unit-001', 'unit-002', 'unit-003']
   * 
   * @example
   * // Populate filter options
   * const units = await adminService.getUniqueUnits();
   * const options = units.map(unit => ({ value: unit, label: `Unit ${unit}` }));
   */
  getUniqueUnits: async (): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from("volunteers")
        .select("unit_id")
        .not("unit_id", "is", null);

      if (error) throw error;

      const uniqueUnits = Array.from(new Set(data?.map((v) => v.unit_id).filter(Boolean))) as string[];
      return uniqueUnits.sort();
    } catch (error: any) {
      console.error("Error fetching unique units:", error);
      throw new Error(error.message || "Failed to fetch units");
    }
  },

  /**
   * Get all student users in the system with optional search
   * 
   * Retrieves student profiles (role='student') ordered by creation date.
   * Can filter results using a search term that matches name or email.
   * 
   * @param {string} [search] - Optional search term to filter by name or email (case-insensitive)
   * 
   * @returns {Promise<UserProfile[]>} Array of student profiles
   * 
   * @throws {Error} If database query fails
   * 
   * @example
   * // Get all students
   * const allStudents = await adminService.getAllUsers();
   * 
   * @example
   * // Search for students by name
   * const results = await adminService.getAllUsers('John');
   * 
   * @example
   * // Search by email
   * const results = await adminService.getAllUsers('john@college.edu');
   */
  getAllUsers: async (search?: string): Promise<UserProfile[]> => {
    try {
      let query = supabase
        .from("profiles")
        .select("*")
        .eq("role", "student")
        .order("created_at", { ascending: false });

      if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data as UserProfile[]) || [];
    } catch (error: any) {
      console.error("Error fetching users:", error);
      throw new Error(error.message || "Failed to fetch users");
    }
  },

  /**
   * Update the approval status of a volunteer application (admin override)
   * 
   * Allows admins to approve, reject, or reset volunteer applications to pending status.
   * The updated_at timestamp is automatically set to the current time.
   * 
   * @param {string} volunteerId - The UUID of the volunteer application to update
   * @param {('pending' | 'approved' | 'rejected')} status - New status to set
   * 
   * @returns {Promise<VolunteerProfile>} The updated volunteer profile with new status
   * 
   * @throws {Error} If volunteer is not found or update fails
   * 
   * @example
   * // Approve a volunteer application
   * const approved = await adminService.updateVolunteerStatus(
   *   'volunteer-123',
   *   'approved'
   * );
   * console.log(`${approved.full_name} is now approved`);
   * 
   * @example
   * // Reject an application
   * const rejected = await adminService.updateVolunteerStatus(
   *   'volunteer-456',
   *   'rejected'
   * );
   * 
   * @example
   * // Reset to pending for reconsideration
   * const reset = await adminService.updateVolunteerStatus(
   *   'volunteer-789',
   *   'pending'
   * );
   */
  updateVolunteerStatus: async (
    volunteerId: string,
    status: "pending" | "approved" | "rejected" | "certified"
  ): Promise<VolunteerProfile> => {
    try {
      const { data, error } = await supabase
        .from("volunteers")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", volunteerId)
        .select()
        .single();

      if (error) throw error;

      if (!data) {
        throw new Error("Failed to update volunteer status");
      }

      return data as VolunteerProfile;
    } catch (error: any) {
      console.error("Error updating volunteer status:", error);
      throw new Error(error.message || "Failed to update volunteer status");
    }
  },

  /**
   * Approve multiple volunteer applications in a single operation
   * 
   * Efficiently updates the status of multiple volunteers to 'approved' in one database
   * operation. All timestamps are updated to the current time.
   * 
   * @param {string[]} volunteerIds - Array of volunteer application IDs to approve
   * 
   * @returns {Promise<number>} Number of volunteers successfully approved
   * 
   * @throws {Error} If bulk update fails
   * 
   * @example
   * // Approve selected volunteers
   * const count = await adminService.bulkApproveVolunteers([
   *   'vol-1',
   *   'vol-2',
   *   'vol-3'
   * ]);
   * console.log(`${count} volunteers approved`);
   * 
   * @example
   * // Approve all pending from a unit
   * const pending = volunteers.filter(v => v.status === 'pending');
   * const ids = pending.map(v => v.id);
   * await adminService.bulkApproveVolunteers(ids);
   */
  bulkApproveVolunteers: async (volunteerIds: string[]): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from("volunteers")
        .update({ status: "approved", updated_at: new Date().toISOString() })
        .in("id", volunteerIds)
        .select();

      if (error) throw error;

      return data?.length || 0;
    } catch (error: any) {
      console.error("Error bulk approving volunteers:", error);
      throw new Error(error.message || "Failed to approve volunteers");
    }
  },

  /**
   * Reject multiple volunteer applications in a single operation
   * 
   * Efficiently updates the status of multiple volunteers to 'rejected' in one database
   * operation. All timestamps are updated to the current time.
   * 
   * @param {string[]} volunteerIds - Array of volunteer application IDs to reject
   * 
   * @returns {Promise<number>} Number of volunteers successfully rejected
   * 
   * @throws {Error} If bulk update fails
   * 
   * @example
   * // Reject selected volunteers
   * const count = await adminService.bulkRejectVolunteers([
   *   'vol-1',
   *   'vol-2'
   * ]);
   * console.log(`${count} volunteers rejected`);
   * 
   * @example
   * // Reject incomplete applications
   * const incomplete = volunteers.filter(v => !v.photo_url);
   * const ids = incomplete.map(v => v.id);
   * await adminService.bulkRejectVolunteers(ids);
   */
  bulkRejectVolunteers: async (volunteerIds: string[]): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from("volunteers")
        .update({ status: "rejected", updated_at: new Date().toISOString() })
        .in("id", volunteerIds)
        .select();

      if (error) throw error;

      return data?.length || 0;
    } catch (error: any) {
      console.error("Error bulk rejecting volunteers:", error);
      throw new Error(error.message || "Failed to reject volunteers");
    }
  },

  /**
   * Permanently delete a volunteer application record (admin only)
   * 
   * **⚠️ WARNING**: This operation is irreversible. The volunteer record will be
   * permanently removed from the database. Consider using rejection status instead
   * for records that should be retained for audit purposes.
   * 
   * @param {string} volunteerId - The UUID of the volunteer application to delete
   * 
   * @returns {Promise<void>} Resolves when deletion is complete
   * 
   * @throws {Error} If deletion fails or volunteer is not found
   * 
   * @example
   * // Delete a duplicate or test volunteer record
   * await adminService.deleteVolunteer('volunteer-123');
   * console.log('Volunteer record deleted');
   * 
   * @example
   * // Delete with confirmation
   * if (confirm('Permanently delete this volunteer?')) {
   *   try {
   *     await adminService.deleteVolunteer(volunteerId);
   *     alert('Volunteer deleted successfully');
   *   } catch (error) {
   *     alert('Failed to delete volunteer');
   *   }
   * }
   */
  deleteVolunteer: async (volunteerId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from("volunteers")
        .delete()
        .eq("id", volunteerId);

      if (error) throw error;
    } catch (error: any) {
      console.error("Error deleting volunteer:", error);
      throw new Error(error.message || "Failed to delete volunteer");
    }
  },

  /**
   * Certify a volunteer (admin only)
   * 
   * Upgrades an approved volunteer to certified status. Only approved volunteers
   * can be certified. This is the final recognition status for NSS volunteers.
   * 
   * @param {string} volunteerId - The UUID of the volunteer to certify
   * 
   * @returns {Promise<VolunteerProfile>} The updated volunteer profile with certified status
   * 
   * @throws {Error} If volunteer is not found, not approved, or certification fails
   * 
   * @example
   * // Certify an approved volunteer
   * try {
   *   const certified = await adminService.certifyVolunteer('volunteer-123');
   *   console.log(`${certified.full_name} is now certified!`);
   * } catch (error) {
   *   console.error('Certification failed:', error.message);
   * }
   */
  certifyVolunteer: async (volunteerId: string): Promise<VolunteerProfile> => {
    try {
      // First check if volunteer exists and is approved
      const { data: volunteer, error: fetchError } = await supabase
        .from("volunteers")
        .select("id, full_name, status")
        .eq("id", volunteerId)
        .single();

      if (fetchError) throw fetchError;

      if (!volunteer) {
        throw new Error("Volunteer not found");
      }

      if (volunteer.status !== "approved") {
        throw new Error(
          `Cannot certify volunteer with status "${volunteer.status}". Only approved volunteers can be certified.`
        );
      }

      // Update to certified status
      const { data, error } = await supabase
        .from("volunteers")
        .update({ status: "certified", updated_at: new Date().toISOString() })
        .eq("id", volunteerId)
        .select()
        .single();

      if (error) throw error;

      if (!data) {
        throw new Error("Failed to certify volunteer");
      }

      return data as VolunteerProfile;
    } catch (error: any) {
      console.error("Error certifying volunteer:", error);
      throw new Error(error.message || "Failed to certify volunteer");
    }
  },

  /**
   * Undo volunteer certification (admin only)
   * 
   * Reverts a certified volunteer back to approved status. This allows admins
   * to undo certification if it was done in error or needs to be reconsidered.
   * Only certified volunteers can be uncertified.
   * 
   * @param {string} volunteerId - The UUID of the volunteer to uncertify
   * 
   * @returns {Promise<VolunteerProfile>} The updated volunteer profile with approved status
   * 
   * @throws {Error} If volunteer is not found, not certified, or operation fails
   * 
   * @example
   * // Undo certification
   * try {
   *   const uncertified = await adminService.uncertifyVolunteer('volunteer-123');
   *   console.log(`${uncertified.full_name} certification reverted to approved`);
   * } catch (error) {
   *   console.error('Failed to undo certification:', error.message);
   * }
   */
  uncertifyVolunteer: async (volunteerId: string): Promise<VolunteerProfile> => {
    try {
      // First check if volunteer exists and is certified
      const { data: volunteer, error: fetchError } = await supabase
        .from("volunteers")
        .select("id, full_name, status")
        .eq("id", volunteerId)
        .single();

      if (fetchError) throw fetchError;

      if (!volunteer) {
        throw new Error("Volunteer not found");
      }

      if (volunteer.status !== "certified") {
        throw new Error(
          `Cannot undo certification for volunteer with status "${volunteer.status}". Only certified volunteers can be reverted.`
        );
      }

      // Revert to approved status
      const { data, error } = await supabase
        .from("volunteers")
        .update({ status: "approved", updated_at: new Date().toISOString() })
        .eq("id", volunteerId)
        .select()
        .single();

      if (error) throw error;

      if (!data) {
        throw new Error("Failed to undo certification");
      }

      return data as VolunteerProfile;
    } catch (error: any) {
      console.error("Error undoing certification:", error);
      throw new Error(error.message || "Failed to undo certification");
    }
  },

  /**
   * Certify multiple volunteers in a single operation (admin only)
   * 
   * Efficiently updates multiple approved volunteers to certified status.
   * Only volunteers with 'approved' status will be certified.
   * 
   * @param {string[]} volunteerIds - Array of volunteer IDs to certify
   * 
   * @returns {Promise<{success: number, failed: number, errors: string[]}>} 
   *          Results object with success count, failed count, and error messages
   * 
   * @example
   * // Certify selected volunteers
   * const result = await adminService.bulkCertifyVolunteers(['vol-1', 'vol-2']);
   * console.log(`${result.success} certified, ${result.failed} failed`);
   * if (result.errors.length > 0) {
   *   console.error('Errors:', result.errors);
   * }
   */
  bulkCertifyVolunteers: async (
    volunteerIds: string[]
  ): Promise<{ success: number; failed: number; errors: string[] }> => {
    try {
      // First, get all volunteers to check their status
      const { data: volunteers, error: fetchError } = await supabase
        .from("volunteers")
        .select("id, full_name, status")
        .in("id", volunteerIds);

      if (fetchError) throw fetchError;

      if (!volunteers || volunteers.length === 0) {
        throw new Error("No volunteers found with the provided IDs");
      }

      // Filter only approved volunteers
      const approvedVolunteers = volunteers.filter(
        (v) => v.status === "approved"
      );
      const notApprovedVolunteers = volunteers.filter(
        (v) => v.status !== "approved"
      );

      const errors: string[] = [];

      // Add errors for non-approved volunteers
      notApprovedVolunteers.forEach((v) => {
        errors.push(
          `${v.full_name || 'Unknown'} (${v.status}): Cannot certify - must be approved first`
        );
      });

      // Certify approved volunteers
      let successCount = 0;
      if (approvedVolunteers.length > 0) {
        const approvedIds = approvedVolunteers.map((v) => v.id);
        const { data, error } = await supabase
          .from("volunteers")
          .update({ status: "certified", updated_at: new Date().toISOString() })
          .in("id", approvedIds)
          .select();

        if (error) {
          errors.push(`Database error: ${error.message}`);
        } else {
          successCount = data?.length || 0;
        }
      }

      return {
        success: successCount,
        failed: notApprovedVolunteers.length,
        errors,
      };
    } catch (error: any) {
      console.error("Error bulk certifying volunteers:", error);
      throw new Error(error.message || "Failed to certify volunteers");
    }
  },

  /**
   * Get the most recent volunteer registrations
   * 
   * Retrieves the latest volunteer applications ordered by creation date (newest first).
   * Useful for displaying recent activity on admin dashboards.
   * 
   * @param {number} [limit=10] - Maximum number of records to return (default: 10)
   * 
   * @returns {Promise<VolunteerProfile[]>} Array of recent volunteer profiles
   * 
   * @throws {Error} If database query fails
   * 
   * @example
   * // Get last 10 registrations (default)
   * const recent = await adminService.getRecentRegistrations();
   * 
   * @example
   * // Get last 25 registrations
   * const recent = await adminService.getRecentRegistrations(25);
   * 
   * @example
   * // Display in dashboard
   * const recentActivity = await adminService.getRecentRegistrations(5);
   * recentActivity.forEach(vol => {
   *   console.log(`${vol.full_name} registered on ${vol.created_at}`);
   * });
   */
  getRecentRegistrations: async (limit: number = 10): Promise<VolunteerProfile[]> => {
    try {
      const { data, error } = await supabase
        .from("volunteers")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data as VolunteerProfile[]) || [];
    } catch (error: any) {
      console.error("Error fetching recent registrations:", error);
      throw new Error(error.message || "Failed to fetch recent registrations");
    }
  },

  /**
   * Get all users with detailed information using user_with_college database view
   * 
   * This function retrieves a comprehensive list of users (students and units) with their
   * college information and volunteer application counts. It leverages a database view
   * that pre-joins the profiles table with the colleges table, significantly reducing
   * the number of queries and improving performance.
   * 
   * @description
   * **How it works:**
   * 
   * 1. **Database View Query** - Queries the `user_with_college` view which contains:
   *    - User profile data (id, email, full_name, role, etc.)
   *    - College information (college_name, college_district)
   *    - Pre-joined data from profiles and colleges tables
   * 
   * 2. **Server-Side Filtering** - Applies all filters at the database level for optimal performance:
   *    - **Role Filter**: Filters by user role (student/unit), excludes admins by default
   *    - **District Filter**: Filters by college_district from the joined colleges data
   *    - **Search Filter**: Case-insensitive search across email, name, unit_number, college_name, and district
   * 
   * 3. **Volunteer Count Aggregation** - After getting filtered users:
   *    - Queries the volunteers table only for the returned user IDs (not all users)
   *    - Uses `student_id` to match volunteers to users
   *    - Builds a Map for O(1) lookup performance
   *    - Counts how many volunteer applications each user has submitted
   * 
   * 4. **Data Transformation** - Maps the view data to UserWithDetails interface:
   *    - Combines user data from the view
   *    - Adds volunteer application count from the Map
   *    - Uses college_district as the primary district field
   * 
   * **Performance Benefits:**
   * - Single query to get user and college data (view handles the join)
   * - All filters applied at database level (faster than client-side filtering)
   * - Volunteer counts fetched only for filtered users (reduced data transfer)
   * - Map-based counting provides O(1) lookup time
   * 
   * @param {UserFilters} [filters] - Optional filter criteria
   * @param {('all' | 'student' | 'unit')} [filters.role] - Filter by user role
   * @param {string} [filters.search] - Search term for email, name, unit, college, or district
   * @param {string} [filters.district] - Filter by college district
   * 
   * @returns {Promise<UserWithDetails[]>} Array of users with:
   *   - Basic profile info (id, email, name, role, phone, avatar)
   *   - College details (college_name, district from college_district)
   *   - Unit information (unit_number for unit accounts)
   *   - Volunteer application count (volunteer_applications)
   *   - Timestamps (created_at, updated_at)
   * 
   * @throws {Error} If database query fails or data transformation encounters issues
   * 
   * @example
   * // Get all students from Malappuram district
   * const students = await getAllUsersWithDetails({
   *   role: 'student',
   *   district: 'Malappuram'
   * });
   * 
   * @example
   * // Search for users by email or name
   * const users = await getAllUsersWithDetails({
   *   search: 'john@example.com'
   * });
   * 
   * @example
   * // Get all units (college accounts)
   * const units = await getAllUsersWithDetails({
   *   role: 'unit'
   * });
   * 
   * @see UserFilters for available filter options
   * @see UserWithDetails for the returned data structure
   */
  getAllUsersWithDetails: async (filters?: UserFilters): Promise<UserWithDetails[]> => {
    try {
      // Query the user_with_college view with all data pre-joined
      let query = supabase
        .from("user_with_college")
        .select("*");

      // Apply role filter at database level
      if (filters?.role && filters.role !== 'all') {
        query = query.eq("role", filters.role);
      } else {
        // Only show students and units, not admins
        query = query.in("role", ["student", "unit"]);
      }

      // Apply district filter at database level (college_district)
      if (filters?.district && filters.district !== 'all') {
        query = query.eq("college_district", filters.district);
      }

      // Apply search filter at database level using OR condition
      if (filters?.search) {
        query = query.or(
          `email.ilike.%${filters.search}%,full_name.ilike.%${filters.search}%,unit_number.ilike.%${filters.search}%,college_name.ilike.%${filters.search}%,college_district.ilike.%${filters.search}%`
        );
      }

      const { data: viewData, error: viewError } = await query;

      if (viewError) throw viewError;

      if (!viewData || viewData.length === 0) {
        return [];
      }

      // Get volunteer counts only for the filtered users
      const { data: volunteerCounts, error: countsError } = await supabase
        .from("volunteers")
        .select("student_id")
        .in("student_id", viewData.map(u => u.id));

      if (countsError) throw countsError;

      // Create a map of student_id to volunteer count for O(1) lookup
      // This counts how many times each student has applied as a volunteer
      const countMap = new Map<string, number>();
      volunteerCounts?.forEach((v) => {
        if (v.student_id) {
          countMap.set(v.student_id, (countMap.get(v.student_id) || 0) + 1);
        }
      });

      // Map view data to UserWithDetails format
      const usersWithDetails: UserWithDetails[] = viewData.map((user: UserWithDetails) => ({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
        phone_number: user.phone_number,
        unit_number: user.unit_number,
        college_name: user.college_name,
        district: user.college_district, // Use college_district from view
        avatar_url: user.avatar_url,
        volunteer_applications: countMap.get(user.id) || 0,
      }));

      return usersWithDetails;
    } catch (error: any) {
      console.error("Error fetching users with details:", error);
      throw new Error(error.message || "Failed to fetch users");
    }
  },

  /**
   * Get list of unique college districts from the system
   * 
   * Retrieves all distinct district names from the user_with_college view,
   * which contains properly joined college location data. Excludes null values
   * and 'Not Defined' entries. Results are sorted alphabetically.
   * 
   * @returns {Promise<string[]>} Sorted array of unique district names
   * 
   * @throws {Error} If database query fails
   * 
   * @example
   * // Get districts for filter dropdown
   * const districts = await adminService.getUniqueDistricts();
   * // ['Ernakulam', 'Kannur', 'Kozhikode', 'Malappuram', 'Thrissur']
   * 
   * @example
   * // Create filter options
   * const districts = await adminService.getUniqueDistricts();
   * const options = [
   *   { value: 'all', label: 'All Districts' },
   *   ...districts.map(d => ({ value: d, label: d }))
   * ];
   */
  getUniqueDistricts: async (): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from("user_with_college")
        .select("college_district")
        .not("college_district", "is", null)
        .neq("college_district", "Not Defined");

      if (error) throw error;

      const uniqueDistricts = Array.from(
        new Set(data?.map((d) => d.college_district).filter(Boolean))
      ) as string[];
      return uniqueDistricts.sort();
    } catch (error: any) {
      console.error("Error fetching districts:", error);
      throw new Error(error.message || "Failed to fetch districts");
    }
  },

  /**
   * Get comprehensive user statistics for the admin users page
   * 
   * Aggregates metrics about users in the system including total counts,
   * role breakdowns, and volunteer application statistics. Uses optimized
   * count-only queries for better performance.
   * 
   * @returns {Promise<Object>} Statistics object containing:
   *   - totalUsers: Combined count of students and units
   *   - totalStudents: Number of student profiles
   *   - totalUnits: Number of unit (college) profiles
   *   - studentsWithApplications: Count of unique students who have submitted
   *     at least one volunteer application
   * 
   * @throws {Error} If any database query fails
   * 
   * @example
   * // Load stats for admin users dashboard
   * const stats = await adminService.getUserStats();
   * console.log(`Total Users: ${stats.totalUsers}`);
   * console.log(`Students: ${stats.totalStudents}`);
   * console.log(`Units: ${stats.totalUnits}`);
   * console.log(`Active Students: ${stats.studentsWithApplications}`);
   * 
   * @example
   * // Calculate engagement percentage
   * const stats = await adminService.getUserStats();
   * const engagement = (stats.studentsWithApplications / stats.totalStudents) * 100;
   * console.log(`${engagement.toFixed(1)}% of students have applied`);
   */
  getUserStats: async () => {
    try {
      // Get total students
      const { count: totalStudents, error: studentsError } = await supabase
        .from("user_with_college")
        .select("*", { count: "exact", head: true })
        .eq('role', 'student');

      if (studentsError) throw studentsError;

      // Get total units
      const { count: totalUnits, error: unitsError } = await supabase
        .from("user_with_college")
        .select("*", { count: "exact", head: true })
        .eq('role', 'unit');

      if (unitsError) throw unitsError;

      // Get students with volunteer applications
      const { data: studentsWithApps, error: appsError } = await supabase
        .from("volunteers")
        .select("id");

      if (appsError) throw appsError;

      const uniqueStudentsWithApps = new Set(
        studentsWithApps?.map((v) => v.id).filter(Boolean)
      ).size;

      return {
        totalUsers: (totalStudents || 0) + (totalUnits || 0),
        totalStudents: totalStudents || 0,
        totalUnits: totalUnits || 0,
        studentsWithApplications: uniqueStudentsWithApps,
      };
    } catch (error: any) {
      console.error("Error fetching user stats:", error);
      throw new Error(error.message || "Failed to fetch user statistics");
    }
  },


};
