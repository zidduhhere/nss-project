import { useState, useCallback } from "react";
import { User, LoginCredentials, RegisterData } from "../models";
import { AuthService } from "../services";

export interface AuthViewModel {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthViewModel = (): AuthViewModel => {
  const [user, setUser] = useState<User | null>(AuthService.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await AuthService.login(credentials);

        if (result.success && result.user) {
          setUser(result.user);
          return true;
        } else {
          setError(result.error || "Login failed");
          return false;
        }
      } catch (err) {
        setError("An unexpected error occurred");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const register = useCallback(
    async (userData: RegisterData): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await AuthService.register(userData);

        if (result.success && result.user) {
          setUser(result.user);
          return true;
        } else {
          setError(result.error || "Registration failed");
          return false;
        }
      } catch (err) {
        setError("An unexpected error occurred");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };
};
