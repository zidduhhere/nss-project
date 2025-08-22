import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BaseUser } from '../base/types';
import { getJSON, setJSON } from '../base/storage';

interface UnitAuthContextValue {
    unit: BaseUser | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const UnitAuthContext = createContext<UnitAuthContextValue | undefined>(undefined);

const UNIT_KEY = 'nss_user_unit';
const LEGACY_FACULTY_KEY = 'nss_user_faculty';
const USERS_KEY = 'nss_users';

export function UnitAuthProvider({ children }: { children: ReactNode }) {
    const [unit, setUnit] = useState<BaseUser | null>(null);

    // Migrate legacy faculty storage to unit key
    useEffect(() => {
        const existing = getJSON<BaseUser>(UNIT_KEY);
        if (!existing) {
            const legacy = getJSON<BaseUser>(LEGACY_FACULTY_KEY);
            // Accept legacy record with role string 'faculty' (cast bypass because union no longer includes it)
            if (legacy && (legacy as any).role === 'faculty') {
                // migrate
                const migrated = { ...legacy, role: 'unit' as const };
                setJSON(UNIT_KEY, migrated);
                localStorage.removeItem(LEGACY_FACULTY_KEY);
                setUnit(migrated);
                return;
            }
        }
        if (existing && existing.role === 'unit') setUnit(existing);
    }, []);

    const login = async (email: string, password: string) => {
        const users = getJSON<any[]>(USERS_KEY) || [];
        const found = users.find(u => u.email === email && u.password === password && u.role === 'unit');
        if (!found) return false;
        const { password: _pw, ...userSansPw } = found;
        setUnit(userSansPw);
        setJSON(UNIT_KEY, userSansPw);
        return true;
    };

    const logout = () => {
        setUnit(null);
        localStorage.removeItem(UNIT_KEY);
    };

    return (
        <UnitAuthContext.Provider value={{ unit, login, logout }}>
            {children}
        </UnitAuthContext.Provider>
    );
}

export function useUnitAuth() {
    const ctx = useContext(UnitAuthContext);
    if (!ctx) throw new Error('useUnitAuth must be used within UnitAuthProvider');
    return ctx;
}
