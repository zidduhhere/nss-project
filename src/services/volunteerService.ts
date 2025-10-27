
import { VolunteerFormFields } from '@/types/VolunteerFormSchema';
import { supabase } from './supabase';
import { UseAuthContext } from '@/context/AuthContext';

/**
 * Volunteer Service - Handles all volunteer-related Supabase operations
 */



export const volunteerService = {

  /**
   * Register a new volunteer with file uploads
   * @param data - Volunteer form data including photo and signature files
   * @returns Promise with the created volunteer record
   */
  registerVolunteer: async (data: VolunteerFormFields) => {
    try {
         const authContext = UseAuthContext();
      // 1. Upload photo to Supabase Storage
      let photoUrl = null;
      if (data.photo instanceof File) {
        const photoFileName = `${Date.now()}_${data.photo.name}`;
        const { data: photoData, error: photoError } = await supabase.storage
          .from('volunteer-photos')
          .upload(photoFileName, data.photo);

        if (photoError) throw photoError;

        // Get public URL for the photo
        const { data: photoUrlData } = supabase.storage
          .from('volunteer-photos')
          .getPublicUrl(photoFileName);
        
        photoUrl = photoUrlData.publicUrl;
      }

      // 2. Upload signature to Supabase Storage
      let signatureUrl = null;
      if (data.signature instanceof File) {
        const signatureFileName = `${Date.now()}_${data.signature.name}`;
        const { data: signatureData, error: signatureError } = await supabase.storage
          .from('volunteer-signatures')
          .upload(signatureFileName, data.signature);

        if (signatureError) throw signatureError;

        // Get public URL for the signature
        const { data: signatureUrlData } = supabase.storage
          .from('volunteer-signatures')
          .getPublicUrl(signatureFileName);
        
        signatureUrl = signatureUrlData.publicUrl;
      }

      // 3. Prepare volunteer data (exclude File objects)
      const volunteerData = {
        unit: data.unit,
        semester: data.semster,
        course: data.course,
        admission_year: data.admissionYear,
        ktu_id: data.ktuId,
        name: data.name,
        student_id : authContext.session?.user.id,
        gender: data.gender,
        dob: data.dob,
        contact_number: data.contactNumber,
        whatsapp_number: data.whatsappNumber,
        religion: data.religion,
        community: data.community,
        blood_group: data.bloodGroup,
        height: data.height ? parseInt(data.height) : null,
        weight: data.weight ? parseInt(data.weight) : null,
        district: data.district,
        taluk: data.taluk,
        village: data.village,
        pincode: data.pincode,
        permanent_address: data.permanentAddress,
        parent_name: data.parent,
        parent_contact: data.parentContact,
        photo_url: photoUrl,
        signature_url: signatureUrl,
        languages_known: data.languagesKnown || [],
        status: 'pending', // Default status
        created_at: new Date().toISOString(),
      };

      // 4. Insert volunteer record into database
      const { data: volunteer, error: insertError } = await supabase
        .from('volunteers')
        .insert([volunteerData])
        .select()
        .single();

      if (insertError) throw insertError;

      return {
        success: true,
        message: 'Volunteer registered successfully',
        data: volunteer,
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Failed to register volunteer');
    }
  },

  /**
   * Get volunteer by ID
   */
  getVolunteerById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch volunteer');
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
      let query = supabase.from('volunteers').select('*');

      if (filters?.unit) {
        query = query.eq('unit', filters.unit);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.semester) {
        query = query.eq('semester', filters.semester);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch volunteers');
    }
  },

  /**
   * Update volunteer
   */
  updateVolunteer: async (id: string, updates: Partial<VolunteerFormFields>) => {
    try {
      // Handle file uploads if new files provided
      let photoUrl = undefined;
      let signatureUrl = undefined;

      if (updates.photo instanceof File) {
        const photoFileName = `${Date.now()}_${updates.photo.name}`;
        const { error: photoError } = await supabase.storage
          .from('volunteer-photos')
          .upload(photoFileName, updates.photo);

        if (photoError) throw photoError;

        const { data: photoUrlData } = supabase.storage
          .from('volunteer-photos')
          .getPublicUrl(photoFileName);
        
        photoUrl = photoUrlData.publicUrl;
      }

      if (updates.signature instanceof File) {
        const signatureFileName = `${Date.now()}_${updates.signature.name}`;
        const { error: signatureError } = await supabase.storage
          .from('volunteer-signatures')
          .upload(signatureFileName, updates.signature);

        if (signatureError) throw signatureError;

        const { data: signatureUrlData } = supabase.storage
          .from('volunteer-signatures')
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
        .from('volunteers')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update volunteer');
    }
  },

  /**
   * Delete volunteer
   */
  deleteVolunteer: async (id: string) => {
    try {
      const { error } = await supabase
        .from('volunteers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true, message: 'Volunteer deleted successfully' };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete volunteer');
    }
  },
};
