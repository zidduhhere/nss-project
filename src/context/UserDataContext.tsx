import { createContext } from "react";


export type UserDataContextType = {
    userData: any;
    setUserData: (data: any) => void;
    avatarUrl: string | null;
    setAvatarUrl: (url: string | null) => void;
}


export const UserDataContext = createContext<UserDataContextType | null>(null);

