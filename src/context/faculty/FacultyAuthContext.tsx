import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BaseUser } from '../base/types';
import { getJSON, setJSON } from '../base/storage';

interface FacultyAuthContextValue {
    faculty: BaseUser | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const FacultyAuthContext = createContext<FacultyAuthContextValue | undefined>(undefined);

const FACULTY_KEY = 'nss_user_faculty';
const USERS_KEY = 'nss_users';

export function FacultyAuthProvider({ children }: { children: ReactNode }) {
    const [faculty, setFaculty] = useState<BaseUser | null>(null);

    useEffect(() => {
        const saved = getJSON<BaseUser>(FACULTY_KEY);
        if (saved && saved.role === 'faculty') setFaculty(saved);
    }, []);

    const login = async (email: string, password: string) => {
        const users = getJSON<any[]>(USERS_KEY) || [];
        const found = users.find(u => u.email === email && u.password === password && u.role === 'faculty');
        if (!found) return false;
        const { password: _pw, ...userSansPw } = found;
        setFaculty(userSansPw);
        setJSON(FACULTY_KEY, userSansPw);
        return true;
    };

    const logout = () => {
        setFaculty(null);
        localStorage.removeItem(FACULTY_KEY);
    };

    return (
        <FacultyAuthContext.Provider value={{ faculty, login, logout }}>
            {children}
        </FacultyAuthContext.Provider>
    );
}

export function useFacultyAuth() {
    const ctx = useContext(FacultyAuthContext);
    if (!ctx) throw new Error('useFacultyAuth must be used within FacultyAuthProvider');
    return ctx;
}
