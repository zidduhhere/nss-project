import supabase from "./supabase";
import { handleSupabaseError } from "@/services/errors";

export interface College {
  id: string;
  name: string;
  district: string;
}

const DISTRICT_NAME_TO_CODE: Record<string, string> = {
  Thiruvananthapuram: "TVM",
  Kollam: "KOL",
  Pathanamthitta: "PAT",
  Alappuzha: "ALA",
  Kottayam: "KOT",
  Idukki: "IDU",
  Ernakulam: "ERN",
  Thrissur: "THR",
  Palakkad: "PAL",
  Malappuram: "MAL",
  Kozhikode: "KOZ",
  Wayanad: "WAY",
  Kannur: "KAN",
  Kasargode: "KAS",
};

const toDistrictCode = (district: string): string =>
  DISTRICT_NAME_TO_CODE[district] || district.toUpperCase();

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
    const code = toDistrictCode(districtCode);
    const { data, error } = await supabase
      .from("colleges")
      .select("*")
      .eq("district", code)
      .order("name", { ascending: true });

    if (error) handleSupabaseError(error, "Failed to fetch colleges by district");
    return (data as College[]) || [];
  },

  getUnitsByDistrict: async (
    district: string
  ): Promise<{ id: string; unitNumber: string; collegeName: string }[]> => {
    const { data, error } = await supabase
      .from("nss_units")
      .select("id, unit_number, colleges!inner(name, district)")
      .eq("colleges.district", toDistrictCode(district))
      .order("unit_number", { ascending: true });

    if (error) handleSupabaseError(error, "Failed to fetch units by district");

    return (
      (data || []).map((row: Record<string, unknown>) => {
        const college = row.colleges as { name?: string } | null;
        return {
          id: row.id as string,
          unitNumber: row.unit_number as string,
          collegeName: college?.name || "Unknown",
        };
      })
    );
  },
};
