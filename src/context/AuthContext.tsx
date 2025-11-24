import { FormFields } from "@/types/StudentFormSchema";
import supabase from "@/services/supabase";
import { Session } from "@supabase/supabase-js";
import { useContext, useState, createContext, PropsWithChildren, useEffect } from "react";
import { AuthContextType, RoleResult } from "./authContextTypes";

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
                    const fetched_role = (await supabase.from("profiles").select("role, unit_id").eq("id", data.session.user.id).single());
                    console.log(session);
                    const roleName = fetched_role.data?.role;
                    const unitId = fetched_role.data?.unit_id;


                    if (roleName) {
                        
                        setRole({role: roleName, unit_id: unitId} as RoleResult);
                    }
                    else {
                        setRole(null);
                        setSession(null);
                        throw new Error("User role not found. Contact admin.");
                    }
                }


                 const authListener = supabase.auth.onAuthStateChange((_event, session) => {
                    setSession(session);
                    if (!session) {
                        setRole(null);
                    }
                    else {
                        //Fetch role when session changes
                        supabase.from("profiles").select("role, unit_id").eq("id", session.user.id).single().then(({data}) => {
                            const roleName = data?.role;
                            const unitId = data?.unit_id;
                            if (roleName) {
                                setRole({role: roleName, unit_id: unitId} as RoleResult);
                            }
                        });
                    }
                });


                // Return cleanup function
                return () => {
                    authListener.data.subscription.unsubscribe();
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
                            display_name: student.full_name,
                            mobile: student.mobile,
                            ktu_id: student.ktu_id,
                            college_id: student.college.toLowerCase(),
                            full_name: student.full_name,
                        }
                    }
                });

            if (error) {
                throw error;
            }

            if (!data.session) {
                throw new Error("No session returned after sign-up, check the credentials");
            }

            setSession(data.session);
            setRole({ role: 'student' } as const);

            // Return the session data so the form can use it
            return data;

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
                console.log("No user ID found in session");
                throw new Error('Authentication failed. User doesn\'t exist.');
               
            }

            //The session is set which is accessible to the entire app via context.
            setSession(data.session);

            //Refresh the session to get the updated JWT with role claim.
            const newRes = await supabase.auth.refreshSession();

            // If session refresh failed, sign out and throw error
            if (newRes.error || !newRes.data.session) {
                await supabase.auth.signOut();
                throw new Error('User role not found. Contact admin.');
            }

            setSession(newRes.data.session);

            //Extract the roke from the profiles table
            //unit_id is not null for the units
           const {data: role} = await supabase.from("profiles").select("role, unit_id").eq("id", userId).single();

            
            //assign the role to the state variable by checking the unit condition
            if(role ) {
                setRole({ role: role.role, unit_id: role.unit_id } as const);
            }
            else {
                setRole(role);
            }
            
            //Throws an error if role is null or undefined
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

    //This function handles logout for the user
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