// User Model
export interface User {
  id: string;
  name: string;
  mobile: string;
  role: "student" | "faculty";
  age?: number;
  place?: string;
  college?: string;
  fatherName?: string;
  address?: string;
}

// Authentication Models
export interface LoginCredentials {
  mobile: string;
  password: string;
}

export interface RegisterData extends Omit<User, "id"> {
  password: string;
}

export interface AuthenticationResult {
  success: boolean;
  user?: User;
  error?: string;
}
