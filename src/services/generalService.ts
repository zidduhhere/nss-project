import supabase from "./supabase"


export interface College {
    id: string;
    name: string;
    district: string;
}


export const generalService = {

    getAllColleges : async () => {
       try {
         // Fetch colleges from the database or an external API
         
        const {data, error} = await supabase.from('colleges').select('*');
        if (error) {
            console.error("Error fetching colleges:", error);
            return [];
        }
        console.log("Fetched colleges:", data);
        return data as College[];
       }

       catch (error) {
        console.error("Error fetching colleges:", error);
        return [];
       }
    },

    getCollegeOnDistrict: async (districtCode: string) => {
        // Fetch colleges based on district from the database or an external API
        try {
            const {data, error} = await supabase
            .from('colleges')
            .select('*')
            .eq('district', districtCode.toUpperCase());
        if (error) {
            console.error("Error fetching colleges by district:", error);
            return [];
        }
        return data as College[];
        }
        catch (error) {
            console.error("Error fetching colleges by district:", error);
            return [];
        }
    }
}