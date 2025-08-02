import {
  User,
  LoginCredentials,
  RegisterData,
  AuthenticationResult,
} from "../models";
import { StorageService } from "./StorageService";

export class AuthService {
  private static readonly DEMO_ACCOUNTS = [
    {
      id: "1",
      name: "John Doe",
      mobile: "9876543210",
      role: "student" as const,
      age: 20,
      place: "Mumbai",
      college: "ABC College",
      fatherName: "Robert Doe",
      address: "123 Main St",
    },
    {
      id: "2",
      name: "Dr. Smith",
      mobile: "9876543211",
      role: "faculty" as const,
    },
  ];

  static async login(
    credentials: LoginCredentials
  ): Promise<AuthenticationResult> {
    try {
      const { mobile, password } = credentials;

      // Check demo accounts first
      const demoAccount = this.DEMO_ACCOUNTS.find(
        (acc) => acc.mobile === mobile
      );
      if (demoAccount && password === "password") {
        StorageService.saveCurrentUser(demoAccount);
        return { success: true, user: demoAccount };
      }

      // Check registered users
      const users = StorageService.getAllUsers();
      const foundUser = users.find(
        (u: any) => u.mobile === mobile && u.password === password
      );

      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        StorageService.saveCurrentUser(userWithoutPassword);
        return { success: true, user: userWithoutPassword };
      }

      return { success: false, error: "Invalid credentials" };
    } catch (error) {
      return { success: false, error: "Login failed" };
    }
  }

  static async register(userData: RegisterData): Promise<AuthenticationResult> {
    try {
      const users = StorageService.getAllUsers();

      // Check if mobile already exists
      if (users.some((u: any) => u.mobile === userData.mobile)) {
        return { success: false, error: "Mobile number already registered" };
      }

      const newUser = {
        ...userData,
        id: Date.now().toString(),
      };

      users.push(newUser);
      StorageService.saveUsers(users);

      const { password: _, ...userWithoutPassword } = newUser;
      StorageService.saveCurrentUser(userWithoutPassword);

      return { success: true, user: userWithoutPassword };
    } catch (error) {
      return { success: false, error: "Registration failed" };
    }
  }

  static logout(): void {
    StorageService.clearCurrentUser();
  }

  static getCurrentUser(): User | null {
    return StorageService.getCurrentUser();
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}
