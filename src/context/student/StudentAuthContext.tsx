import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BaseUser } from '../base/types';
import { getJSON, setJSON } from '../base/storage';

interface StudentAuthContextValue {
    student: BaseUser | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (data: Omit<BaseUser, 'id' | 'role'> & { password: string }) => Promise<boolean>;
    logout: () => void;
}

const StudentAuthContext = createContext<StudentAuthContextValue | undefined>(undefined);

const STUDENT_KEY = 'nss_user_student';
const USERS_KEY = 'nss_users';

export function StudentAuthProvider({ children }: { children: ReactNode }) {
    const [student, setStudent] = useState<BaseUser | null>(null);

    useEffect(() => {
        const saved = getJSON<BaseUser>(STUDENT_KEY);
        if (saved && saved.role === 'student') setStudent(saved);
    }, []);

    const login = async (email: string, password: string) => {
        const users = getJSON<any[]>(USERS_KEY) || [];
        const found = users.find(u => u.email === email && u.password === password && u.role === 'student');
        if (!found) return false;
        const { password: _pw, ...userSansPw } = found;
        setStudent(userSansPw);
        setJSON(STUDENT_KEY, userSansPw);
        return true;
    };

    const register = async (data: Omit<BaseUser, 'id' | 'role'> & { password: string }) => {
        const users = getJSON<any[]>(USERS_KEY) || [];
        if (users.some(u => u.email === data.email)) return false;
        const newUser = { ...data, id: Date.now().toString(), role: 'student' as const };
        users.push(newUser);
        setJSON(USERS_KEY, users);
        const { password: _pw, ...userSansPw } = newUser;
        setStudent(userSansPw);
        setJSON(STUDENT_KEY, userSansPw);
        return true;
    };

    const logout = () => {
        setStudent(null);
        localStorage.removeItem(STUDENT_KEY);
    };

    return (
        <StudentAuthContext.Provider value={{ student, login, register, logout }}>
            {children}
        </StudentAuthContext.Provider>
    );
}

export function useStudentAuth() {
    const ctx = useContext(StudentAuthContext);
    if (!ctx) throw new Error('useStudentAuth must be used within StudentAuthProvider');
    return ctx;
}
