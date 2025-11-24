import { UserProfile } from "./UserProfile";
import { VolunteerProfile } from "./VolunteerProfile";

export interface CompleteProfile {
  userProfile: UserProfile;
  volunteerProfile: VolunteerProfile | null;
}