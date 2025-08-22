/**
 * Internal provider component that manages the master authentication state by combining both student and UNIT authentication.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to be wrapped by the provider
 * 
 * @remarks
 * This component:
 * - Combines student and UNIT authentication states and methods from their respective contexts
 * - Determines the current user (either student or UNIT) and their role
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
import { UnitAuthProvider, useUnitAuth } from './unit/UnitAuthContext';
import { BaseUser } from './base/types';

interface MasterAuthValue {
    currentUser: BaseUser | null;
    role: 'student' | 'unit' | null;
    // Student helpers
    student: BaseUser | null;
    loginStudent: (email: string, password: string) => Promise<boolean>;
    registerStudent: (data: Omit<BaseUser, 'id' | 'role'> & { password: string }) => Promise<boolean>;
    // UNIT helpers
    unit: BaseUser | null;
    loginUnit: (email: string, password: string) => Promise<boolean>;
    // Generic logout (decides based on which role is active)
    logout: () => void;
}

const MasterAuthContext = createContext<MasterAuthValue | undefined>(undefined);


function MasterAuthInnerProvider({ children }: { children: ReactNode }) {
    const { student, login: loginStudent, register: registerStudent, logout: logoutStudent } = useStudentAuth();
    const { unit, login: loginUnit, logout: logoutUnit } = useUnitAuth();

    const value: MasterAuthValue = useMemo(() => {
        const currentUser = student || unit || null;
        const role = currentUser ? currentUser.role : null;
        const logout = () => {
            if (student) logoutStudent();
            if (unit) logoutUnit();
        };
        return {
            currentUser,
            role,
            student,
            loginStudent,
            registerStudent,
            unit,
            loginUnit,
            logout
        };
    }, [student, unit, loginStudent, registerStudent, loginUnit, logoutStudent, logoutUnit]);

    return (
        <MasterAuthContext.Provider value={value}>
            {children}
        </MasterAuthContext.Provider>
    );
}

export function MasterAuthProvider({ children }: { children: ReactNode }) {
    return (
        <StudentAuthProvider>
            <UnitAuthProvider>
                <MasterAuthInnerProvider>
                    {children}
                </MasterAuthInnerProvider>
            </UnitAuthProvider>
        </StudentAuthProvider>
    );
}

export function useMasterAuth() {
    const ctx = useContext(MasterAuthContext);
    if (!ctx) throw new Error('useMasterAuth must be used within MasterAuthProvider');
    return ctx;
}
