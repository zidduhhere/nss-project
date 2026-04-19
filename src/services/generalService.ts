import supabase from "./supabase";
import { handleSupabaseError } from "@/services/errors";

export interface College {
  id: string;
  name: string;
  district: string;
}

export interface CollegeWithUnit extends College {
  unit_number: string | null;
}

export const DISTRICT_CODE_TO_NAME: Record<string, string> = {
  TVM: "Thiruvananthapuram",
  KOL: "Kollam",
  PAT: "Pathanamthitta",
  ALA: "Alappuzha",
  KOT: "Kottayam",
  IDU: "Idukki",
  ERN: "Ernakulam",
  THR: "Thrissur",
  PAL: "Palakkad",
  MAL: "Malappuram",
  KOZ: "Kozhikode",
  WAY: "Wayanad",
  KAN: "Kannur",
  KAS: "Kasargode",
};

export interface HomepageStats {
  bloodDonations: number;
  treesTagged: number;
  activeVolunteers: number;
  activeUnits: number;
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

  getAllCollegesWithUnits: async (): Promise<CollegeWithUnit[]> => {
    const { data, error } = await supabase
      .from("colleges")
      .select("id, name, district, nss_units(unit_number)")
      .order("name", { ascending: true });

    if (error) handleSupabaseError(error, "Failed to fetch colleges with units");

    return ((data as any[]) || []).map((c) => {
      const units: { unit_number: string }[] = c.nss_units || [];
      const minUnit = units
        .map((u) => u.unit_number)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))[0] ?? null;
      return { id: c.id, name: c.name, district: c.district, unit_number: minUnit };
    });
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

  getStudentCollegeInfo: async (
    studentId: string
  ): Promise<{ collegeId: string; collegeName: string; district: string } | null> => {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("college_id")
      .eq("id", studentId)
      .single();

    if (profileError || !profile?.college_id) return null;

    const { data: college, error: collegeError } = await supabase
      .from("colleges")
      .select("id, name, district")
      .eq("id", profile.college_id)
      .single();

    if (collegeError || !college) return null;

    return {
      collegeId: college.id,
      collegeName: college.name,
      district: college.district,
    };
  },

  getUnitsByCollege: async (
    collegeId: string
  ): Promise<{ id: string; unitNumber: string }[]> => {
    const { data, error } = await supabase
      .from("nss_units")
      .select("id, unit_number")
      .eq("college_id", collegeId)
      .order("unit_number", { ascending: true });

    if (error) handleSupabaseError(error, "Failed to fetch units by college");

    return (data || []).map((row: any) => ({
      id: row.id,
      unitNumber: row.unit_number,
    }));
  },

  getHomepageStats: async (): Promise<HomepageStats> => {
    const [bloodRes, treeRes, volunteerRes, unitRes] = await Promise.all([
      supabase.from("blood_donations").select("*", { count: "exact", head: true }),
      supabase.from("tree_tagging").select("*", { count: "exact", head: true }),
      supabase.from("volunteers").select("*", { count: "exact", head: true }).eq("status", "approved"),
      supabase.from("nss_units").select("*", { count: "exact", head: true }),
    ]);

    const firstError = [bloodRes, treeRes, volunteerRes, unitRes].find((r) => r.error);
    if (firstError?.error) handleSupabaseError(firstError.error, "Failed to fetch homepage stats");

    return {
      bloodDonations: bloodRes.count || 0,
      treesTagged: treeRes.count || 0,
      activeVolunteers: volunteerRes.count || 0,
      activeUnits: unitRes.count || 0,
    };
  },
};
