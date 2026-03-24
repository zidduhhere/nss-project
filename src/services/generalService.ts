import supabase from "./supabase";
import { handleSupabaseError } from "@/services/errors";

export interface College {
  id: string;
  name: string;
  district: string;
}

export const generalService = {
  getAllColleges: async (): Promise<College[]> => {
    const { data, error } = await supabase
      .from("colleges")
      .select("*")
      .order("name", { ascending: true });

    if (error) handleSupabaseError(error, "Failed to fetch colleges");
    return (data as College[]) || [];
  },

  getCollegeOnDistrict: async (districtCode: string): Promise<College[]> => {
    const { data, error } = await supabase
      .from("colleges")
      .select("*")
      .eq("district", districtCode.toUpperCase())
      .order("name", { ascending: true });

    if (error) handleSupabaseError(error, "Failed to fetch colleges by district");
    return (data as College[]) || [];
  },
};
