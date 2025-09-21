import { FormFields } from "@/types/StudentFormSchema";
import { supabase } from "@/services/supabase";
import { User, Session } from "@supabase/supabase-js";
import { useContext, useState, createContext, PropsWithChildren } from "react";


type AuthReturnType = {
    user: User | null;
    session: Session | null;
}

type AuthContextType = {
    session?: Session | null;
    signUpUser: (student: FormFields) => Promise<AuthReturnType>;
    signInUser: (email: string, password: string) => Promise<{ success: boolean; error?: string | null }>;
    logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = PropsWithChildren<{}>;

export const AuthProvider = ({ children }: AuthProviderProps) => {

    const [session, setSession] = useState<Session | null>(null);

    // //
    // supabase.auth.onAuthStateChange((event, session) => {
    //     if (session) {

    //         setSession(session);
    //     }
    // });

    // useEffect(() => {
    //     const fetchSession = async () => {
    //         const { data } = await supabase.auth.getSession();
    //         console.log('Initial session data:', data);
    //         setSession(data.session);
    //     };
    //     fetchSession();
    // }, []);

    const signUpUser = async (student: FormFields) => {
        try {
            console.log('Signing up user:', student);
            const { data } = await supabase.auth.signUp(
                {
                    email: student.email,
                    password: student.password,

                    options: {
                        data: {
                            display_name: student.fullName,
                            ktu_id: student.ktuRollNumber,
                            college_id: student.college,
                            mobile_number: student.mobileNumber,
                            name: student.fullName,
                            email: student.email,
                        }
                    }

                });

            return data;


        } catch (error) {
            console.error('Sign-up error:', error);
            throw error;
        }


    }

    const signInUser = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            console.log('Sign-in data:', data, 'Error:', error, 'Session:', data.session, "token:", data.session?.access_token);

            return { success: !!data.session, error: error?.message || null };
        } catch (error) {
            throw error;
        }
    }

    const logoutUser = () => {
        supabase.auth.signOut()
    }
    return <AuthContext.Provider value={{ session, signUpUser, signInUser, logoutUser }}>{children}</AuthContext.Provider>;
}


export function UseAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("UseAuthContext must be used within an AuthProvider");
    }
    return context;
}