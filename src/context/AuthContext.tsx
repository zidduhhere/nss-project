import { FormFields } from "@/types/StudentFormSchema";
import { supabase } from "@/services/supabase";
import { Session } from "@supabase/supabase-js";
import { useContext, useState, createContext, PropsWithChildren, useEffect } from "react";
import { AuthContextType, evaluateRole, RoleResult } from "./authContextTypes";

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = PropsWithChildren<{}>;




export const AuthProvider = ({ children }: AuthProviderProps) => {

    const [session, setSession] = useState<Session | null>(null);
    const [role, setRole] = useState<RoleResult | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchSessionAndSetRole = async () => {
            setLoading(true); // Set loading to true at the start
            try {
                const { data } = await supabase.auth.getSession();
                if (data.session) {
                    setSession(data.session);
                    const roleName = (data.session.user?.app_metadata.role) as string;
                    if (roleName) {
                        const tempRole = evaluateRole(roleName, data.session.user.id);
                        setRole(tempRole);
                    }

                }

                // Set up auth state change listener
                const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
                    if (event === 'SIGNED_OUT') {
                        setSession(null);
                        setRole(null);
                    } else if (event === 'SIGNED_IN' && session) {
                        setSession(session);
                        const roleName = session.user?.app_metadata.role as string;
                        if (roleName) {
                            const tempRole = evaluateRole(roleName, session.user.id);
                            setRole(tempRole);
                        }
                    }

                });

                // Return cleanup function
                return () => {
                    authListener.subscription.unsubscribe();
                };
            } catch (e) {
                console.error("Error fetching session:", e);
                // Handle error appropriately
            } finally {
                setLoading(false); // Set loading to false when done
            }
        };
        fetchSessionAndSetRole();
    }, []);

    const signUpUser = async (student: FormFields) => {

        try {
            console.log('Signing up user:', student);
            setLoading(true);
            const { data, error } = await supabase.auth.signUp(
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

            setSession(data.session || null);

            if (error) {

                throw error;
            }

            setRole({ role: 'student' } as const);
            if (!data.session) {
                throw "No session returned after sign-up, check the credentials"
            }

        } catch (error) {
            console.error('Sign-up error:', error);
            throw error;
        }
        finally {
            setLoading(false);
        }


    }

    async function signInUser(email: string, password: string): Promise<RoleResult> {
        try {
            setLoading(true);
            const { data } = await supabase.auth.signInWithPassword({ email, password });

            //User ID is extracted from the session object.
            const userId = data.session?.user.id;

            //Check if userId is null or undefined and throw an error if it is.
            if (!userId) {
                throw new Error('Authentication failed. No user ID found.');
            }

            //The session is set which is accessible to the entire app via context.
            setSession(data.session);

            //Invoke the serverless function to ensure the role claim is set.
            await supabase.functions.invoke('ensure-role-claim', {
                method: 'POST',
                headers: { Authorization: `Bearer ${data.session?.access_token}` }
            })
            //Refresh the session to get the updated JWT with role claim.
            const newRes = await supabase.auth.refreshSession();

            // If session refresh failed, sign out and throw error
            if (newRes.error || !newRes.data.session) {
                await supabase.auth.signOut();
                throw new Error('User role not found. Contact admin.');
            }

            setSession(newRes.data.session);

            //Extract the role from the JWT claims in the session.
            //Assumes the role is stored in app_metadata.role
            const roleName = (newRes.data.user?.app_metadata.role) as string;

            console.log("User role from JWT:", roleName);

            //Evaluates the role and returns the appropriate RoleResult object.
            const role = evaluateRole(roleName, newRes);


            setRole(role);
            if (!role) throw new Error('Role evaluation failed');

            return role;

        }
        catch (e) {
            console.error('Sign-in error:', e);
            throw e;
        }
        finally {
            setLoading(false);
        }
    }

    const logoutUser = async (): Promise<void> => {
        try {
            setLoading(true);
            await supabase.auth.signOut();
            setSession(null);
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }
    return <AuthContext.Provider value={{ session, signUpUser, signInUser, logoutUser, role, loading }}>{children}</AuthContext.Provider>;
}


export function UseAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("UseAuthContext must be used within an AuthProvider");
    }
    return context;
}