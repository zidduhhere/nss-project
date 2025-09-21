import { useState } from "react";
import { UseAuthContext } from "@/context/AuthContext";
import { z } from "zod";


const LoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password should be at least 6 characters long").max(20, "Password should be at most 20 characters long"),
})

export type LoginForm = z.infer<typeof LoginSchema>;

// Rename to follow hook naming convention
export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { signInUser } = UseAuthContext();

  // The hook returns this function, not being async itself
  const login = async (credentials: LoginForm) => {
     
    try {
     LoginSchema.parse(credentials);
      setErrorMessage(null);
      setIsLoading(true);

      const result = await signInUser(credentials.email, credentials.password);
      if (!result.success) {
        setErrorMessage(result.error || "Login failed");
        return false;
      } else {
        setErrorMessage(null);

        return true;
      }
    } catch (error: any) {
      if(error instanceof z.ZodError) {
          setErrorMessage(error.issues[0].message)
      } else {
          setErrorMessage(error.message || "An unexpected error occurred");
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    errorMessage,
    clearError: () => setErrorMessage(null),
  };
}

// For backward compatibility, though this isn't recommended
export default useLogin;
