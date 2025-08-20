/**
 * Internal provider component that manages the master authentication state by combining both student and faculty authentication.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to be wrapped by the provider
 * 
 * @remarks
 * This component:
 * - Combines student and faculty authentication states and methods from their respective contexts
 * - Determines the current user (either student or faculty) and their role
 * - Provides a unified logout method that works for both user types
 * - Memoizes the authentication value to prevent unnecessary re-renders
 * 
 * @example
 * ```tsx
 * <MasterAuthInnerProvider>
 *   <App />
 * </MasterAuthInnerProvider>
 * ```
 * 
 * @internal
 * This is an internal component used by {@link MasterAuthProvider}
 */
import { ReactNode, createContext, useContext, useMemo } from 'react';
import { StudentAuthProvider, useStudentAuth } from './student/StudentAuthContext';
import { FacultyAuthProvider, useFacultyAuth } from './faculty/FacultyAuthContext';
import { BaseUser } from './base/types';

interface MasterAuthValue {
    currentUser: BaseUser | null;
    role: 'student' | 'faculty' | null;
    // Student helpers
    student: BaseUser | null;
    loginStudent: (email: string, password: string) => Promise<boolean>;
    registerStudent: (data: Omit<BaseUser, 'id' | 'role'> & { password: string }) => Promise<boolean>;
    // Faculty helpers
    faculty: BaseUser | null;
    loginFaculty: (email: string, password: string) => Promise<boolean>;
    // Generic logout (decides based on which role is active)
    logout: () => void;
}

const MasterAuthContext = createContext<MasterAuthValue | undefined>(undefined);


function MasterAuthInnerProvider({ children }: { children: ReactNode }) {
    const { student, login: loginStudent, register: registerStudent, logout: logoutStudent } = useStudentAuth();
    const { faculty, login: loginFaculty, logout: logoutFaculty } = useFacultyAuth();

    const value: MasterAuthValue = useMemo(() => {
        const currentUser = student || faculty || null;
        const role = currentUser ? currentUser.role : null;
        const logout = () => {
            if (student) logoutStudent();
            if (faculty) logoutFaculty();
        };
        return {
            currentUser,
            role,
            student,
            loginStudent,
            registerStudent,
            faculty,
            loginFaculty,
            logout
        };
    }, [student, faculty, loginStudent, registerStudent, loginFaculty, logoutStudent, logoutFaculty]);

    return (
        <MasterAuthContext.Provider value={value}>
            {children}
        </MasterAuthContext.Provider>
    );
}

export function MasterAuthProvider({ children }: { children: ReactNode }) {
    return (
        <StudentAuthProvider>
            <FacultyAuthProvider>
                <MasterAuthInnerProvider>
                    {children}
                </MasterAuthInnerProvider>
            </FacultyAuthProvider>
        </StudentAuthProvider>
    );
}

export function useMasterAuth() {
    const ctx = useContext(MasterAuthContext);
    if (!ctx) throw new Error('useMasterAuth must be used within MasterAuthProvider');
    return ctx;
}
