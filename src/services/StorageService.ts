// Local Storage Service - handles all localStorage operations
export class StorageService {
  private static readonly KEYS = {
    USER: "nss_user",
    USERS: "nss_users",
    BLOOD_SUBMISSIONS: "nss_blood_submissions",
    TREE_SUBMISSIONS: "nss_tree_submissions",
  } as const;

  // User storage methods
  static saveCurrentUser(user: any): void {
    localStorage.setItem(this.KEYS.USER, JSON.stringify(user));
  }

  static getCurrentUser(): any | null {
    const user = localStorage.getItem(this.KEYS.USER);
    return user ? JSON.parse(user) : null;
  }

  static clearCurrentUser(): void {
    localStorage.removeItem(this.KEYS.USER);
  }

  // Users storage methods
  static getAllUsers(): any[] {
    const users = localStorage.getItem(this.KEYS.USERS);
    return users ? JSON.parse(users) : [];
  }

  static saveUsers(users: any[]): void {
    localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
  }

  // Blood submissions storage methods
  static getBloodSubmissions(): any[] {
    const submissions = localStorage.getItem(this.KEYS.BLOOD_SUBMISSIONS);
    return submissions ? JSON.parse(submissions) : [];
  }

  static saveBloodSubmissions(submissions: any[]): void {
    localStorage.setItem(
      this.KEYS.BLOOD_SUBMISSIONS,
      JSON.stringify(submissions)
    );
  }

  // Tree submissions storage methods
  static getTreeSubmissions(): any[] {
    const submissions = localStorage.getItem(this.KEYS.TREE_SUBMISSIONS);
    return submissions ? JSON.parse(submissions) : [];
  }

  static saveTreeSubmissions(submissions: any[]): void {
    localStorage.setItem(
      this.KEYS.TREE_SUBMISSIONS,
      JSON.stringify(submissions)
    );
  }

  // Generic methods
  static getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  static setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  static clear(): void {
    localStorage.clear();
  }
}
