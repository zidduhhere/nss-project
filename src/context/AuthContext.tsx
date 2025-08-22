import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Front-end only auth context: stores a minimal user role for UI gating.
// No backend calls or validation; purely for navigation flows.
export type FrontendUser = { role: 'student' | 'unit'; name?: string } | null;

interface FrontendAuthContextValue {
    user: FrontendUser;
    loginAs: (role: 'student' | 'unit') => void;
    logout: () => void;
}

const FrontendAuthContext = createContext<FrontendAuthContextValue | undefined>(undefined);

interface AuthProviderProps { children: ReactNode }

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<FrontendUser>(null);

    // Hydrate from localStorage (UI only)
    useEffect(() => {
        try {
            const raw = localStorage.getItem('nss_user');
            if (raw) setUser(JSON.parse(raw));
        } catch { /* ignore */ }
    }, []);

    const loginAs = (role: 'student' | 'unit') => {
        const u: FrontendUser = { role };
        setUser(u);
        try { localStorage.setItem('nss_user', JSON.stringify(u)); } catch { /* ignore */ }
    };

    const logout = () => {
        setUser(null);
        try { localStorage.removeItem('nss_user'); } catch { /* ignore */ }
    };

    return (
        <FrontendAuthContext.Provider value={{ user, loginAs, logout }}>
            {children}
        </FrontendAuthContext.Provider>
    );
};

// Backwards compatibility: existing code may import AuthContextProvider
export const AuthContextProvider = AuthProvider;

export const useAuth = (): FrontendAuthContextValue => {
    const ctx = useContext(FrontendAuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};