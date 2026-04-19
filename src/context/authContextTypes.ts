import { FormFields } from "@/types/StudentFormSchema";
import {  Session, User } from "@supabase/supabase-js"; 

export type AuthReturnType = {
    user: User | null;
    session: Session | null;
}

export type RoleResult  =
    | { role: 'student' }
    | { role: 'unit'; unit_id: string }
    | { role: 'admin' }
    | { role: 'flagship_admin'; certificate_type: string }
    | { role: 'rco'; allowed_colleges: string[]; created_by: string };


export type AuthContextType = {
    session?: Session | null;
    signUpUser: (student: FormFields) => Promise<AuthReturnType>;
    signInUser: (email: string, password: string) => Promise<RoleResult>;
    logoutUser: () => Promise<void>;
    role: RoleResult | null;
    loading:  boolean;
}


