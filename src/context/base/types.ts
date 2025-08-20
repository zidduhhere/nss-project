// Shared core types for user and auth contexts.
export type UserRole = "student" | "faculty";

export interface BaseUser {
  id: string;
  name?: string; // Student name or faculty unit number / display name
  mobile: string;
  email: string;
  college?: string;
  district?: string;
  role: UserRole;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  user?: BaseUser | null;
  error?: string;
}

export interface BaseAuthContextValue {
  user: BaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginStudent: (email: string, password: string) => Promise<boolean>;
  loginFaculty: (email: string, password: string) => Promise<boolean>;
  register: (
    data: Omit<BaseUser, "id"> & { password: string }
  ) => Promise<boolean>;
  logout: () => void;
}
