import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  mobile: string;
  role: 'student' | 'faculty';
  age?: number;
  place?: string;
  college?: string;
  fatherName?: string;
  address?: string;
}

export interface BloodDonationSubmission {
  id: string;
  studentId: string;
  hospitalName: string;
  donationDate: string;
  unitsdonated: number;
  donationCase?: string;
  certificate: File | null;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  points?: number;
}

export interface TreeTaggingSubmission {
  id: string;
  studentId: string;
  studentName: string;
  treeName: string;
  scientificName: string;
  location: string;
  treeImage: File | null;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  points?: number;
}

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  bloodDonationSubmissions: BloodDonationSubmission[];
  treeTaggingSubmissions: TreeTaggingSubmission[];
  login: (mobile: string, password: string) => Promise<boolean>;
  loginFaculty: (mobile: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  submitBloodDonation: (submission: Omit<BloodDonationSubmission, 'id' | 'studentId' | 'status' | 'submittedAt'>) => void;
  submitTreeTagging: (submission: Omit<TreeTaggingSubmission, 'id' | 'studentId' | 'status' | 'submittedAt'>) => void;
  approveSubmission: (type: 'blood' | 'tree', id: string, points: number) => void;
  rejectSubmission: (type: 'blood' | 'tree', id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bloodDonationSubmissions, setBloodDonationSubmissions] = useState<BloodDonationSubmission[]>([]);
  const [treeTaggingSubmissions, setTreeTaggingSubmissions] = useState<TreeTaggingSubmission[]>([]);

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('nss_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Load submissions from localStorage
    const savedBloodSubmissions = localStorage.getItem('nss_blood_submissions');
    if (savedBloodSubmissions) {
      setBloodDonationSubmissions(JSON.parse(savedBloodSubmissions));
    }

    const savedTreeSubmissions = localStorage.getItem('nss_tree_submissions');
    if (savedTreeSubmissions) {
      setTreeTaggingSubmissions(JSON.parse(savedTreeSubmissions));
    }

    setIsLoading(false);
  }, []);

  const baseLogin = async (mobile: string, password: string, roleFilter?: 'student' | 'faculty'): Promise<User | null> => {
    // Demo accounts
    const demoAccounts = [
      { id: '1', name: 'John Doe', mobile: '9876543210', role: 'student' as const, age: 20, place: 'Mumbai', college: 'ABC College', fatherName: 'Robert Doe', address: '123 Main St' },
      { id: '2', name: 'Dr. Smith', mobile: '9876543211', role: 'faculty' as const }
    ];

    const account = demoAccounts.find(acc => acc.mobile === mobile && (!roleFilter || acc.role === roleFilter));
    if (account && password === 'password') {
      setUser(account);
      localStorage.setItem('nss_user', JSON.stringify(account));
      return account;
    }

    // Check registered users
    const users = JSON.parse(localStorage.getItem('nss_users') || '[]');
    const foundUser = users.find((u: any) => u.mobile === mobile && u.password === password && (!roleFilter || u.role === roleFilter));

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('nss_user', JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    }
    return null;
  };

  const login = async (mobile: string, password: string): Promise<boolean> => {
    return !!(await baseLogin(mobile, password, 'student'));
  };

  const loginFaculty = async (mobile: string, password: string): Promise<boolean> => {
    return !!(await baseLogin(mobile, password, 'faculty'));
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('nss_users') || '[]');

    // Check if mobile already exists
    if (users.some((u: any) => u.mobile === userData.mobile)) {
      return false;
    }

    const newUser = {
      ...userData,
      id: Date.now().toString()
    };

    users.push(newUser);
    localStorage.setItem('nss_users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('nss_user', JSON.stringify(userWithoutPassword));

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nss_user');
  };

  const submitBloodDonation = (submission: Omit<BloodDonationSubmission, 'id' | 'studentId' | 'status' | 'submittedAt'>) => {
    if (!user) return;

    const newSubmission: BloodDonationSubmission = {
      ...submission,
      id: Date.now().toString(),
      studentId: user.id,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    const updatedSubmissions = [...bloodDonationSubmissions, newSubmission];
    setBloodDonationSubmissions(updatedSubmissions);
    localStorage.setItem('nss_blood_submissions', JSON.stringify(updatedSubmissions));
  };

  const submitTreeTagging = (submission: Omit<TreeTaggingSubmission, 'id' | 'studentId' | 'status' | 'submittedAt'>) => {
    if (!user) return;

    const newSubmission: TreeTaggingSubmission = {
      ...submission,
      id: Date.now().toString(),
      studentId: user.id,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    const updatedSubmissions = [...treeTaggingSubmissions, newSubmission];
    setTreeTaggingSubmissions(updatedSubmissions);
    localStorage.setItem('nss_tree_submissions', JSON.stringify(updatedSubmissions));
  };

  const approveSubmission = (type: 'blood' | 'tree', id: string, points: number) => {
    if (!user) return;

    if (type === 'blood') {
      const updatedSubmissions = bloodDonationSubmissions.map(sub =>
        sub.id === id
          ? {
            ...sub,
            status: 'approved' as const,
            reviewedAt: new Date().toISOString(),
            reviewedBy: user.id,
            points
          }
          : sub
      );
      setBloodDonationSubmissions(updatedSubmissions);
      localStorage.setItem('nss_blood_submissions', JSON.stringify(updatedSubmissions));
    } else {
      const updatedSubmissions = treeTaggingSubmissions.map(sub =>
        sub.id === id
          ? {
            ...sub,
            status: 'approved' as const,
            reviewedAt: new Date().toISOString(),
            reviewedBy: user.id,
            points
          }
          : sub
      );
      setTreeTaggingSubmissions(updatedSubmissions);
      localStorage.setItem('nss_tree_submissions', JSON.stringify(updatedSubmissions));
    }
  };

  const rejectSubmission = (type: 'blood' | 'tree', id: string) => {
    if (!user) return;

    if (type === 'blood') {
      const updatedSubmissions = bloodDonationSubmissions.map(sub =>
        sub.id === id
          ? {
            ...sub,
            status: 'rejected' as const,
            reviewedAt: new Date().toISOString(),
            reviewedBy: user.id
          }
          : sub
      );
      setBloodDonationSubmissions(updatedSubmissions);
      localStorage.setItem('nss_blood_submissions', JSON.stringify(updatedSubmissions));
    } else {
      const updatedSubmissions = treeTaggingSubmissions.map(sub =>
        sub.id === id
          ? {
            ...sub,
            status: 'rejected' as const,
            reviewedAt: new Date().toISOString(),
            reviewedBy: user.id
          }
          : sub
      );
      setTreeTaggingSubmissions(updatedSubmissions);
      localStorage.setItem('nss_tree_submissions', JSON.stringify(updatedSubmissions));
    }
  };

  const value: AppContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    bloodDonationSubmissions,
    treeTaggingSubmissions,
    login,
    loginFaculty,
    register,
    logout,
    submitBloodDonation,
    submitTreeTagging,
    approveSubmission,
    rejectSubmission
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}