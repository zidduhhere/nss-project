import { z } from "zod";
import { getAllDistricts } from "./taluks";



const collegeSchema = z.object({
  id: z.string().max(5),
  college_name : z.string().min(5).max(100),
  district: z.enum(getAllDistricts()),
  units: z.object({
    units: z.array(z.string().length(3))
  })
});

type College = z.infer<typeof collegeSchema>;

let colleges: College[] = [];

export function getCollege(): College[]  {
    colleges =  [
    {
    id: "ACE",
    college_name: "Ace College Of Engineering",
    district: "TVM",
    units: {
      units: ["309"]
    }
    },
    {
    id: "LBS",
    college_name: "LBS College Of Engineering",
    district: "TVM",
    units: {
      units: ["310", "311"]
    }
    }
  ];
  return colleges;
}
