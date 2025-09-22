import { FormFields } from "@/types/StudentFormSchema";
import { AuthResponse, Session, User } from "@supabase/supabase-js"; 

export type AuthReturnType = {
    user: User | null;
    session: Session | null;
}

export type RoleResult  = 
    | { role: 'student' }
    | { role: 'unit'; unit_uuid: string }
    | { role: 'admin' };


export type AuthContextType = {
    session?: Session | null;
    signUpUser: (student: FormFields) => Promise<void>;
    signInUser: (email: string, password: string) => Promise<RoleResult>;
    logoutUser: () => Promise<void>;
    role: RoleResult | null;
    loading:  boolean;
}


export function evaluateRole(role: string, res: AuthResponse | string): RoleResult {
    if (role == 'student') return { role: 'student' };
    if (typeof res === 'string') {
        const userId = res;
        if (role === 'unit') return { role: 'unit', unit_uuid: userId };
        if (role === 'admin') return { role: 'admin' };
    }
    else {
        const userId = res.data.user?.id;
        if (!userId) throw new Error('User ID not found in response');
        if (role === 'unit') return { role: 'unit', unit_uuid: userId };
        if (role === 'admin') return { role: 'admin' };
    }
    throw new Error('Unknown role');
}

