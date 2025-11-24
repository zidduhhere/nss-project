import { languages, VolunteerFormFields } from "@/types/VolunteerFormSchema";
import supabase from "@/services/supabase";

/**
 * Volunteer Service - Handles all volunteer-related Supabase operations
 */
export const volunteerService = {
  

  /**
   * Register a new volunteer with file uploads
   * @param data - Volunteer form data including photo and signature files
   * @param userId - Authenticated user's ID from auth context
   * @returns Promise with the created volunteer record
   */
  registerVolunteer: async (data: VolunteerFormFields, userId: string) => {
    let photoUrl = null;
    let signatureUrl = null;
    try {

     const isAlreadyRegistered = await supabase
        .from("volunteers")
        .select('student_id')
        .eq('student_id', userId)


      if (isAlreadyRegistered.data?.length != undefined && isAlreadyRegistered.data?.length > 0) {
        throw new Error("You have already registered as a volunteer.");
      }

      const ktuIdCheck = await supabase
        .from("volunteers")
        .select("ktu_id")
        .eq("ktu_id", data.ktuId)

      if (ktuIdCheck.data?.length != undefined && ktuIdCheck.data?.length > 0) {
        throw new Error("A volunteer with this KTU ID already exists.");
      }

      console.log("Starting file uploads...");

      // 1. Upload photo to Supabase Storage
      if (data.photo instanceof File) {
        console.log("First photo upload started...");
        const photoFileName = `${Date.now()}_${data.photo.name}_user_${userId}`;
        const {error: photoError } = await supabase.storage
          .from("volunteer-photos")
          .upload(photoFileName, data.photo);

        if (photoError) throw photoError;

        // Get public URL for the photo
        const { data: photoUrlData } = supabase.storage
          .from("volunteer-photos")
          .getPublicUrl(photoFileName);

        photoUrl = photoUrlData.publicUrl;
      }

      // 2. Upload signature to Supabase Storage
      if (data.signature instanceof File) {
        console.log("First signature upload started...");
        const signatureFileName = `${Date.now()}_${
          data.signature.name
        }_user_${userId}`;
        const { error: signatureError } =
          await supabase.storage
            .from("volunteer-signatures")
            .upload(signatureFileName, data.signature);
        console.log("First signature upload ENDED...");

        if (signatureError) throw signatureError;

        // Get public URL for the signature
        console.log("Getting signature public URL...");
        const { data: signatureUrlData } = supabase.storage
          .from("volunteer-signatures")
          .getPublicUrl(signatureFileName);

        signatureUrl = signatureUrlData.publicUrl;
      }


      const volunteerData = {
        student_id: userId, // ✅ Use the passed userId
        unit_id: null, // TODO: Map unit name to unit_id from units table
        admission_year: data.admissionYear,
        valid_from_year : null,
        valid_to_year : null,
        ktu_id: data.ktuId,
        full_name : data.name,
        //valid_from_year : this is the same as the admission year
        //valid_to_year: this is calculated in the DB trigger
        status: "pending", // Default status
        semester: data.semester,
        course: data.course,
        unit_number: data.unit, // Store unit name in unit_number for now
        enroll_no: null, // TODO: Add to form if needed
        gender: data.gender.toLowerCase(),
        dob: data.dob,
        whatsapp_number: data.whatsappNumber,
        contact_number: data.contactNumber,
        religion: data.religion,
        community: data.community,
        blood_group: data.bloodGroup,
        height: data.height ? parseFloat(data.height) : null,
        weight: data.weight ? parseFloat(data.weight) : null,
        district: data.district,
        taluk: data.taluk,
        village: data.village,
        pincode: data.pincode,
        parent_name: data.parent,
        parent_contact_number: data.parentContact,
        permanent_address: data.permanentAddress,
        current_address: data.permanentAddress, // Use permanent address as current for now
        photo_url: photoUrl,
        signature_url: signatureUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        languages_known: data.languagesKnown || []
      };

      // 4. Insert volunteer record into database
      // Note: The following fields from form are NOT in database schema:
      // - name (data.name) - consider adding a 'name' column
      // - ktu_id (data.ktuId) - consider adding a 'ktu_id' column
      // - contactNumber (data.contactNumber) - consider adding a 'contact_number' column
      // - languagesKnown (data.languagesKnown) - consider adding a 'languages_known' jsonb column
      
      const { data: volunteer, error: insertError } = await supabase
        .from("volunteers")
        .insert(volunteerData)
        .select()
        .single();

      if (insertError) {
        console.error("Database insert error:", insertError);
        throw insertError;
      }

      return {
        success: true,
        message: "Volunteer registered successfully",
        data: volunteer,
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to register volunteer") as Error;
    }
  },

  /**
   * Get volunteer by ID
   */
  getVolunteerById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("volunteers")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch volunteer");
    }
  },

  /**
   * Get all volunteers (with optional filters)
   */
  getAllVolunteers: async (filters?: {
    unit?: string;
    status?: string;
    semester?: string;
  }) => {
    try {
      let query = supabase.from("volunteers").select("*");

      if (filters?.unit) {
        query = query.eq("unit", filters.unit);
      }
      if (filters?.status) {
        query = query.eq("status", filters.status);
      }
      if (filters?.semester) {
        query = query.eq("semester", filters.semester);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch volunteers");
    }
  },

  /**
   * Update volunteer
   */
  updateVolunteer: async (
    id: string,
    updates: Partial<VolunteerFormFields>
  ) => {
    try {
      // Handle file uploads if new files provided
      let photoUrl = undefined;
      let signatureUrl = undefined;

      if (updates.photo instanceof File) {
        const photoFileName = `${Date.now()}_${updates.photo.name}`;
        const { error: photoError } = await supabase.storage
          .from("volunteer-photos")
          .upload(photoFileName, updates.photo);

        if (photoError) throw photoError;

        const { data: photoUrlData } = supabase.storage
          .from("volunteer-photos")
          .getPublicUrl(photoFileName);

        photoUrl = photoUrlData.publicUrl;
      }

      if (updates.signature instanceof File) {
        const signatureFileName = `${Date.now()}_${updates.signature.name}`;
        const { error: signatureError } = await supabase.storage
          .from("volunteer-signatures")
          .upload(signatureFileName, updates.signature);

        if (signatureError) throw signatureError;

        const { data: signatureUrlData } = supabase.storage
          .from("volunteer-signatures")
          .getPublicUrl(signatureFileName);

        signatureUrl = signatureUrlData.publicUrl;
      }

      // Prepare update data
      const updateData: any = { ...updates };
      if (photoUrl) updateData.photo_url = photoUrl;
      if (signatureUrl) updateData.signature_url = signatureUrl;
      delete updateData.photo;
      delete updateData.signature;

      const { data, error } = await supabase
        .from("volunteers")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to update volunteer");
    }
  },

  /**
   * Delete volunteer
   */
  deleteVolunteer: async (id: string) => {
    try {
      const { error } = await supabase.from("volunteers").delete().eq("id", id);

      if (error) throw error;
      return { success: true, message: "Volunteer deleted successfully" };
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete volunteer");
    }
  },
  
};

