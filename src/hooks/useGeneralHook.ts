import { College, generalService } from "@/services/generalService";
import { useEffect, useState } from "react";




export const useGeneralServices = () => {

 const [colleges, setColleges] = useState<College[]>([]);
 const [districtBasedColleges, setDistrictBasedColleges] = useState<College[]>([]);
 const [loading, setLoading] = useState<boolean>(false);


 useEffect(() => {
    // Fetch all colleges on hook initialization
    fetchAllColleges();
 }, []);


   const fetchAllColleges = async () => {
        try {
            setLoading(true);
            const response = await generalService.getAllColleges();
            setColleges(response);
        }
        catch (error) {
            console.error("Error fetching all colleges:", error);
        }
        finally {
            setLoading(false);
        }
   }

   const fetchCollegesByDistrict = async (districtCode: string) => {
        try {
            setLoading(true);
            const response = await generalService.getCollegeOnDistrict(districtCode);
            setDistrictBasedColleges(response);
        }
        catch (error) {
            console.error("Error fetching colleges by district:", error);
        }
        finally {
            setLoading(false);
        }
   }

   return {
    colleges,
    districtBasedColleges,
    loading,
    fetchAllColleges,
    fetchCollegesByDistrict
   };

};

