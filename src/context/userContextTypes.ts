export type StudentProfile  = {
    id: string;
    name: string;
    email: string;
    phone: string;
    college: string;
    course?: string;
    year?: string;
    address?: string;
    dateOfBirth?: string;
    bloodGroup?: string;
    bio?: string;
    profileImage?: string;
    joinedDate?: string;
    ktuId?: string;
}

export interface Achievement {
    id: string;
    type: 'Blood Donation' | 'Tree Plantation' | 'Community Service' | 'Environmental';
    title: string;
    date: string;
    status: 'approved' | 'pending' | 'rejected';
    points: number;
}
