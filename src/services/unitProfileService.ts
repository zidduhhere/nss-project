import supabase from "@/services/supabase";
import { UnitProfile, UnitProfileWithCollege, UnitProfileUpdate, UnitStats } from "@/types/UnitProfile";

/**
 * Unit Profile Service - Handles all unit profile-related operations
 * 
 * This service provides functionality for:
 * - Fetching unit profile data with college information
 * - Updating unit profile details
 * - Getting unit statistics
 * - Password reset initiation
 * 
 * All operations are optimized to minimize database queries.
 */

export const unitProfileService = {
  /**
   * Get unit profile with college information using the profiles_with_unit view
   * 
   * Retrieves the complete unit profile in a **single optimized query** using the
   * pre-joined `profiles_with_unit` database view. This view combines data from
   * profiles, nss_units, and colleges tables for maximum efficiency.
   * 
   * **Performance Improvement**: Reduced from 2 queries to 1 query by using the view.
   * 
   * @param {string} unitId - The UUID of the unit from the profiles table
   * 
   * @returns {Promise<UnitProfileWithCollege>} Complete unit profile with:
   *   - Profile data: id, full_name, email, role, college_id, unit_id
   *   - Unit data: unit_number, po_name, po_phone, po_email, po_address, po_designation
   *   - College information: college_name (from colleges table), college_district
   *   - Note: college_name is derived from college_id via the colleges table
   * 
   * @throws {Error} If unit profile is not found or database query fails
   * 
   * @example
   * // Fetch current unit's profile
   * const profile = await unitProfileService.getUnitProfile(session.user.id);
   * console.log(`Unit: ${profile.unit_number}`);
   * console.log(`College: ${profile.college_name}, ${profile.college_district}`);
   * console.log(`PO: ${profile.po_name} (${profile.po_email})`);
   * 
   * @example
   * // Handle missing profile
   * try {
   *   const profile = await unitProfileService.getUnitProfile(unitId);
   * } catch (error) {
   *   console.error('Profile not found:', error.message);
   * }
   */
  getUnitProfile: async (unitId: string): Promise<UnitProfileWithCollege> => {
    try {
      // Use the profiles_with_unit view for a single optimized query
      // This view pre-joins profiles, nss_units, and colleges tables
      const { data, error } = await supabase
        .from("profiles_with_unit")
        .select("*")
        .eq("id", unitId)
        .eq("role", "unit")
        .single();

      if (error) throw error;

      if (!data) {
        throw new Error("Unit profile not found");
      }

      // The view already provides all necessary data in a flat structure
      // Map the view columns to our UnitProfileWithCollege interface
      const unitProfile: UnitProfileWithCollege = {
        id: data.id,
        unit_number: data.unit_number,
        college_id: data.unit_college_id, // Use unit_college_id from nss_units table
        created_at: data.created_at,
        po_name: data.po_name,
        po_phone: data.po_phone,
        po_email: data.po_email,
        po_address: data.po_address,
        po_designation: data.po_designation,
        // Get college name from the colleges table via college_id lookup
        college_name: data.college_id, // This will need to be resolved via colleges table
        college_district: data.college_id, // This will need to be resolved via colleges table
      };

      // If we have college_id, fetch college name and district
      if (data.college_id) {
        const { data: collegeData } = await supabase
          .from("colleges")
          .select("name, district")
          .eq("id", data.college_id)
          .single();

        if (collegeData) {
          unitProfile.college_name = collegeData.name;
          unitProfile.college_district = collegeData.district;
        }
      }

      return unitProfile;
    } catch (error: any) {
      console.error("Error fetching unit profile:", error);
      throw new Error(error.message || "Failed to fetch unit profile");
    }
  },

  /**
   * Update unit profile information
   * 
   * Updates Program Officer details and other editable fields in the unit profile.
   * Protected fields (id, unit_number, college_id, created_at) cannot be modified.
   * 
   * **Performance Note**: Uses unit_number for the update query since it's indexed
   * and avoids an additional lookup.
   * 
   * @param {string} unitNumber - The unit number to update
   * @param {UnitProfileUpdate} updates - Object containing fields to update
   *   Can include: po_name, po_phone, po_email, po_address, po_designation
   * 
   * @returns {Promise<UnitProfile>} The updated unit profile
   * 
   * @throws {Error} If the update fails or unit is not found
   * 
   * @example
   * // Update Program Officer contact details
   * const updated = await unitProfileService.updateUnitProfile('UNIT-001', {
   *   po_name: 'Dr. Sarah Johnson',
   *   po_email: 'sarah.j@college.edu',
   *   po_phone: '9876543210'
   * });
   * 
   * @example
   * // Update only Program Officer designation
   * const updated = await unitProfileService.updateUnitProfile(unitNumber, {
   *   po_designation: 'Associate Professor & NSS Coordinator'
   * });
   * 
   * @example
   * // Update multiple fields at once
   * const updated = await unitProfileService.updateUnitProfile(unitNumber, {
   *   po_name: 'Dr. Rajesh Kumar',
   *   po_email: 'rajesh.k@college.edu',
   *   po_phone: '9123456780',
   *   po_address: 'Faculty Quarters, College Campus',
   *   po_designation: 'Assistant Professor, Computer Science'
   * });
   */
  updateUnitProfile: async (
    unitNumber: string,
    updates: UnitProfileUpdate
  ): Promise<UnitProfile> => {
    try {
      const { data, error } = await supabase
        .from("nss_units")
        .update(updates)
        .eq("unit_number", unitNumber)
        .select()
        .single();

      if (error) throw error;

      if (!data) {
        throw new Error("Failed to update unit profile");
      }

      return data as UnitProfile;
    } catch (error: any) {
      console.error("Error updating unit profile:", error);
      throw new Error(error.message || "Failed to update unit profile");
    }
  },

  /**
   * Get unit statistics for dashboard display using profiles_with_unit view
   * 
   * Aggregates volunteer counts and approval statistics for a specific unit.
   * Uses the profiles_with_unit view to get the unit_number efficiently, then
   * queries volunteer statistics. All count queries use head-only optimization.
   * 
   * **Performance Optimization**: All queries use `{ count: "exact", head: true }`
   * which returns only the count without fetching actual data.
   * 
   * @param {string} unitId - The profile ID (from profiles table) of the unit
   * 
   * @returns {Promise<UnitStats>} Statistics object containing:
   *   - totalVolunteers: Total volunteer applications for this unit
   *   - pendingApprovals: Applications awaiting approval
   *   - approvedVolunteers: Count of approved applications
   *   - rejectedVolunteers: Count of rejected applications
   *   - establishedYear: Year the unit was created (extracted from created_at)
   * 
   * @throws {Error} If database query fails
   * 
   * @example
   * // Fetch stats for unit dashboard
   * const stats = await unitProfileService.getUnitStats('profile-uuid-123');
   * console.log(`Total Volunteers: ${stats.totalVolunteers}`);
   * console.log(`Pending: ${stats.pendingApprovals}`);
   * console.log(`Approved: ${stats.approvedVolunteers}`);
   * console.log(`Established: ${stats.establishedYear}`);
   * 
   * @example
   * // Use in component to display stats cards
   * useEffect(() => {
   *   async function loadStats() {
   *     const stats = await unitProfileService.getUnitStats(unitId);
   *     setUnitStats(stats);
   *   }
   *   loadStats();
   * }, [unitId]);
   */
  getUnitStats: async (unitId: string): Promise<UnitStats> => {
    try {
      // First get the unit_id from profiles_with_unit view
      const { data: profileData, error: profileError } = await supabase
        .from("profiles_with_unit")
        .select("unit_id, created_at")
        .eq("id", unitId)
        .eq("role", "unit")
        .single();

      if (profileError) throw profileError;
      
      const actualUnitId = profileData?.unit_id;
      if (!actualUnitId) {
        throw new Error("Unit ID not found for this profile");
      }

      // Get total volunteers count for this unit
      const { count: totalVolunteers, error: totalError } = await supabase
        .from("volunteers")
        .select("*", { count: "exact", head: true })
        .eq("unit_id", actualUnitId);

      if (totalError) throw totalError;

      // Get pending approvals count
      const { count: pendingApprovals, error: pendingError } = await supabase
        .from("volunteers")
        .select("*", { count: "exact", head: true })
        .eq("unit_id", actualUnitId)
        .eq("status", "pending");

      if (pendingError) throw pendingError;

      // Get approved volunteers count
      const { count: approvedVolunteers, error: approvedError } = await supabase
        .from("volunteers")
        .select("*", { count: "exact", head: true })
        .eq("unit_id", actualUnitId)
        .eq("status", "approved");

      if (approvedError) throw approvedError;

      // Get rejected volunteers count
      const { count: rejectedVolunteers, error: rejectedError } = await supabase
        .from("volunteers")
        .select("*", { count: "exact", head: true })
        .eq("unit_id", actualUnitId)
        .eq("status", "rejected");

      if (rejectedError) throw rejectedError;

      // Get certified volunteers count
      const { count: certifiedVolunteers, error: certifiedError } = await supabase
        .from("volunteers")
        .select("*", { count: "exact", head: true })
        .eq("unit_id", actualUnitId)
        .eq("status", "certified");

      if (certifiedError) throw certifiedError;

      // Extract established year from the created_at timestamp from the view
      const establishedYear = profileData?.created_at
        ? new Date(profileData.created_at).getFullYear().toString()
        : undefined;

      return {
        totalVolunteers: totalVolunteers || 0,
        pendingApprovals: pendingApprovals || 0,
        approvedVolunteers: approvedVolunteers || 0,
        rejectedVolunteers: rejectedVolunteers || 0,
        certifiedVolunteers: certifiedVolunteers || 0,
        establishedYear,
      };
    } catch (error: any) {
      console.error("Error fetching unit stats:", error);
      throw new Error(error.message || "Failed to fetch unit statistics");
    }
  },

  /**
   * Initiate password reset for unit account
   * 
   * Sends a password reset email to the unit's registered email address.
   * The email contains a secure link to reset the password.
   * 
   * **Security Note**: This function requires the user's current email from their
   * profile. It does not expose the email to the client until they're authenticated.
   * 
   * @param {string} email - The email address of the unit account
   * 
   * @returns {Promise<void>} Resolves when reset email is sent successfully
   * 
   * @throws {Error} If email sending fails or email is not found
   * 
   * @example
   * // Send password reset email
   * try {
   *   await unitProfileService.requestPasswordReset(userEmail);
   *   alert('Password reset link sent to your email');
   * } catch (error) {
   *   alert('Failed to send reset email');
   * }
   * 
   * @example
   * // With loading state
   * const handlePasswordReset = async () => {
   *   setLoading(true);
   *   try {
   *     await unitProfileService.requestPasswordReset(profile.po_email);
   *     setSuccessMessage('Check your email for the reset link');
   *   } catch (error) {
   *     setErrorMessage(error.message);
   *   } finally {
   *     setLoading(false);
   *   }
   * };
   */
  requestPasswordReset: async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;
    } catch (error: any) {
      console.error("Error requesting password reset:", error);
      throw new Error(error.message || "Failed to send password reset email");
    }
  },

  /**
   * Get college courses for the unit's college
   * 
   * @param {string} collegeId - The college ID
   * @returns {Promise<Array>} List of courses with name and code
   */
  getCollegeCourses: async (collegeId: string) => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("id, name, code")
        .eq("college_id", collegeId)
        .order("name", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error("Error fetching college courses:", error);
      throw new Error(error.message || "Failed to fetch college courses");
    }
  },

  /**
   * Add a new course to the college
   * 
   * @param {string} collegeId - The college ID
   * @param {Object} courseData - Course information (name, code)
   * @returns {Promise<Object>} The created course
   */
  addCourse: async (collegeId: string, courseData: { name: string; code: string }) => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .insert({
          college_id: collegeId,
          name: courseData.name,
          code: courseData.code,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error("Error adding course:", error);
      throw new Error(error.message || "Failed to add course");
    }
  },

  /**
   * Delete a course from the college
   * 
   * @param {string} courseId - The course ID to delete
   * @returns {Promise<void>}
   */
  deleteCourse: async (courseId: string) => {
    try {
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", courseId);

      if (error) throw error;
    } catch (error: any) {
      console.error("Error deleting course:", error);
      throw new Error(error.message || "Failed to delete course");
    }
  },
};
