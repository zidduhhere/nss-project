import { College, CollegeWithUnit, generalService } from "@/services/generalService";
import { useEffect, useState } from "react";




export const useGeneralServices = () => {

 const [colleges, setColleges] = useState<College[]>([]);
 const [collegesWithUnits, setCollegesWithUnits] = useState<CollegeWithUnit[]>([]);
 const [districtBasedColleges, setDistrictBasedColleges] = useState<College[]>([]);
 const [loading, setLoading] = useState<boolean>(false);


 useEffect(() => {
    fetchAllColleges();
    fetchAllCollegesWithUnits();
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

   const fetchAllCollegesWithUnits = async () => {
        try {
            const response = await generalService.getAllCollegesWithUnits();
            setCollegesWithUnits(response);
        } catch (error) {
            console.error("Error fetching colleges with units:", error);
        }
   };

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
    collegesWithUnits,
    districtBasedColleges,
    loading,
    fetchAllColleges,
    fetchCollegesByDistrict
   };

};

