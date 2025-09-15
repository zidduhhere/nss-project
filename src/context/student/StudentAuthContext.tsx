import Student from "@/models/student";
import { supabase } from "@/services/supabase";
import { useContext, createContext, useEffect, useState } from "react";
import { student_college_id, student_email, student_ktu_id, student_mobile, student_name } from "@/models/field";


const StudentAuthContext = createContext<undefined | any>(undefined);

export const StudentAuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<undefined>(undefined);

    //const sign up function

    const signUpUser = async (student: Student, password: string) => {
        try {

            // Create the user in supabase auth
            const { data, error } = await supabase.auth.signUp({
                email: student.email,
                password: password,
            });

            console.log('Sign-up data:', data);

            if (error) {
                console.log('Error signing up:', error);
                return { success: false, error };

            }

            const result = await supabase.from('students').insert([
                {

                    [student_name]: student.name,
                    [student_email]: student.email,
                    [student_mobile]: student.mobile_number,
                    [student_ktu_id]: student.ktu_id,
                    [student_college_id]: student.college_id
                }

            ])
            console.log('Student record created:', result);

            return { success: true, error: null };
        }
        catch (error) {
            console.log('Error creating student record:', error);
        }
        return { success: true, error: null };

    }

    const signInUser = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                console.log('Error signing in:', error);
                return { success: false, error };
            }

            console.log('Sign-in data:', data);
            return { success: true, data };
        } catch (error) {
            console.log('Error during sign-in:', error);
            return { success: false, error };
        }
    }

    return <StudentAuthContext.Provider value={{ session, signUpUser, signInUser }}>{children}</StudentAuthContext.Provider>;
}


export function UseStudentAuth() {
    const context = useContext(StudentAuthContext);
    if (!context) {
        throw new Error("useStudentAuth must be used within a StudentAuthProvider");
    }
    return context;
}