import { createContext, useContext, useState, PropsWithChildren } from "react";


export type UserDataContextType = {
    userData: any;
    setUserData: (data: any) => void;
    avatarUrl: string | null;
    setAvatarUrl: (url: string | null) => void;
}


export const UserDataContext = createContext<UserDataContextType | null>(null);

type UserDataProviderProps = PropsWithChildren<{}>;

export const UserDataProvider = ({ children }: UserDataProviderProps) => {
    const [userData, setUserData] = useState<any>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    return (
        <UserDataContext.Provider value={{ userData, setUserData, avatarUrl, setAvatarUrl }}>
            {children}
        </UserDataContext.Provider>
    );
};

export function useUserData() {
    const context = useContext(UserDataContext);
    if (!context) {
        throw new Error("useUserData must be used within a UserDataProvider");
    }
    return context;
}
