import { useState } from 'react';
import {
    Award,
    Edit2,
    Save,
    X,
    Camera,
    CheckCircle,
    Clock,
    XCircle,
    Droplets,
    TreePine,
    Users,
    Heart
} from 'lucide-react';
import DashboardNavigation from '@/components/common/DashboardNavigation';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import TextArea from '@/components/ui/TextArea';
import ProfilePlaceholder from '@/components/ui/ProfilePlaceholder';
import Footer from '@/components/ui/Footer';

interface StudentProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    college: string;
    course: string;
    year: string;
    rollNumber: string;
    address: string;
    dateOfBirth: string;
    bloodGroup: string;
    bio: string;
    profileImage?: string;
    joinedDate: string;
}

interface Achievement {
    id: string;
    type: 'Blood Donation' | 'Tree Plantation' | 'Community Service' | 'Environmental';
    title: string;
    date: string;
    status: 'approved' | 'pending' | 'rejected';
    points: number;
}

const statusConfig = {
    pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Pending' },
    approved: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', text: 'Approved' },
    rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', text: 'Rejected' },
};

const achievementIcons = {
    'Blood Donation': { icon: Droplets, color: 'text-red-500', bg: 'bg-red-50' },
    'Tree Plantation': { icon: TreePine, color: 'text-green-500', bg: 'bg-green-50' },
    'Community Service': { icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    'Environmental': { icon: Heart, color: 'text-purple-500', bg: 'bg-purple-50' },
};

// Mock data
const mockStudentProfile: StudentProfile = {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@college.edu',
    phone: '+91 9876543210',
    college: 'ABC College of Engineering',
    course: 'Computer Science Engineering',
    year: '3rd Year',
    rollNumber: 'CSE/2022/101',
    address: '123, Student Hostel, College Campus, City - 400001',
    dateOfBirth: '2003-05-15',
    bloodGroup: 'B+',
    bio: 'Passionate computer science student interested in web development and community service. Active NSS volunteer with focus on environmental conservation and blood donation drives.',
    joinedDate: '2022-08-15'
};

const mockAchievements: Achievement[] = [
    {
        id: '1',
        type: 'Blood Donation',
        title: 'Campus Blood Drive 2024',
        date: '2024-01-15',
        status: 'approved',
        points: 25
    },
    {
        id: '2',
        type: 'Tree Plantation',
        title: 'World Environment Day - Tree Plantation',
        date: '2024-06-05',
        status: 'approved',
        points: 20
    },
    {
        id: '3',
        type: 'Community Service',
        title: 'Local Community Health Camp',
        date: '2024-03-10',
        status: 'pending',
        points: 15
    },
    {
        id: '4',
        type: 'Environmental',
        title: 'Beach Cleanup Drive',
        date: '2024-02-25',
        status: 'approved',
        points: 18
    }
];

const StudentProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<StudentProfile>(mockStudentProfile);
    const [achievements] = useState<Achievement[]>(mockAchievements);

    const totalPoints = achievements
        .filter(achievement => achievement.status === 'approved')
        .reduce((sum, achievement) => sum + achievement.points, 0);

    const handleInputChange = (field: keyof StudentProfile) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setProfile(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleSave = () => {
        // Here you would typically save to backend
        setIsEditing(false);
        // Show success message
    };

    const handleCancel = () => {
        setProfile(mockStudentProfile); // Reset to original data
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardNavigation mode="student" />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-600 mt-2">Manage your personal information and view your NSS achievements</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Profile Header */}
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            {profile.profileImage ? (
                                                <img
                                                    src={profile.profileImage}
                                                    alt="Profile"
                                                    className="w-20 h-20 rounded-full border-4 border-white object-cover"
                                                />
                                            ) : (
                                                <div className="w-20 h-20 rounded-full border-4 border-white bg-white flex items-center justify-center">
                                                    <ProfilePlaceholder size="lg" />
                                                </div>
                                            )}
                                            <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow">
                                                <Camera className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </div>
                                        <div className="text-white">
                                            <h2 className="text-2xl font-bold">{profile.name}</h2>
                                            <p className="text-blue-100">{profile.course}</p>
                                            <p className="text-blue-100">{profile.college}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        {!isEditing ? (
                                            <Button
                                                onClick={() => setIsEditing(true)}
                                                className="bg-white text-blue-600 hover:bg-blue-50 border border-white"
                                            >
                                                <Edit2 className="w-4 h-4 mr-2" />
                                                Edit Profile
                                            </Button>
                                        ) : (
                                            <div className="flex space-x-2">
                                                <Button
                                                    onClick={handleSave}
                                                    className="bg-green-500 hover:bg-green-600 text-white"
                                                >
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Save
                                                </Button>
                                                <Button
                                                    onClick={handleCancel}
                                                    className="bg-white text-gray-600 hover:bg-gray-50 border border-white"
                                                >
                                                    <X className="w-4 h-4 mr-2" />
                                                    Cancel
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Profile Details */}
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <TextField
                                            label="Full Name"
                                            value={profile.name}
                                            onChange={handleInputChange('name')}
                                            disabled={!isEditing}
                                        />
                                        <TextField
                                            label="Email"
                                            value={profile.email}
                                            onChange={handleInputChange('email')}
                                            disabled={!isEditing}
                                        />
                                        <TextField
                                            label="Phone"
                                            value={profile.phone}
                                            onChange={handleInputChange('phone')}
                                            disabled={!isEditing}
                                        />
                                        <TextField
                                            label="Roll Number"
                                            value={profile.rollNumber}
                                            onChange={handleInputChange('rollNumber')}
                                            disabled={!isEditing}
                                        />
                                        <TextField
                                            label="Blood Group"
                                            value={profile.bloodGroup}
                                            onChange={handleInputChange('bloodGroup')}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <TextField
                                            label="College"
                                            value={profile.college}
                                            onChange={handleInputChange('college')}
                                            disabled={!isEditing}
                                        />
                                        <TextField
                                            label="Course"
                                            value={profile.course}
                                            onChange={handleInputChange('course')}
                                            disabled={!isEditing}
                                        />
                                        <TextField
                                            label="Year"
                                            value={profile.year}
                                            onChange={handleInputChange('year')}
                                            disabled={!isEditing}
                                        />
                                        <TextField
                                            label="Date of Birth"
                                            type="date"
                                            value={profile.dateOfBirth}
                                            onChange={handleInputChange('dateOfBirth')}
                                            disabled={!isEditing}
                                        />
                                        <TextField
                                            label="Joined NSS"
                                            type="date"
                                            value={profile.joinedDate}
                                            onChange={handleInputChange('joinedDate')}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 space-y-4">
                                    <TextArea
                                        label="Address"
                                        value={profile.address}
                                        onChange={handleInputChange('address')}
                                        disabled={!isEditing}
                                        rows={2}
                                    />
                                    <TextArea
                                        label="Bio"
                                        value={profile.bio}
                                        onChange={handleInputChange('bio')}
                                        disabled={!isEditing}
                                        rows={3}
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats & Achievements Sidebar */}
                    <div className="space-y-6">
                        {/* Stats Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Award className="w-5 h-5 mr-2 text-yellow-500" />
                                NSS Statistics
                            </h3>
                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600">{totalPoints}</div>
                                    <div className="text-sm text-gray-600">Total Points</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-green-50 rounded-lg">
                                        <div className="text-xl font-semibold text-green-600">
                                            {achievements.filter(a => a.status === 'approved').length}
                                        </div>
                                        <div className="text-xs text-green-700">Approved</div>
                                    </div>
                                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                        <div className="text-xl font-semibold text-yellow-600">
                                            {achievements.filter(a => a.status === 'pending').length}
                                        </div>
                                        <div className="text-xs text-yellow-700">Pending</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Achievements */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
                            <div className="space-y-3">
                                {achievements.slice(0, 4).map((achievement) => {
                                    const StatusIcon = statusConfig[achievement.status].icon;
                                    const AchievementIcon = achievementIcons[achievement.type].icon;

                                    return (
                                        <div key={achievement.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                            <div className={`p-2 rounded-lg ${achievementIcons[achievement.type].bg}`}>
                                                <AchievementIcon className={`w-4 h-4 ${achievementIcons[achievement.type].color}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {achievement.title}
                                                    </p>
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig[achievement.status].bg} ${statusConfig[achievement.status].color}`}>
                                                        <StatusIcon className="w-3 h-3 mr-1" />
                                                        {statusConfig[achievement.status].text}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500">{achievement.date}</p>
                                                {achievement.status === 'approved' && (
                                                    <p className="text-xs text-blue-600 font-medium">+{achievement.points} points</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default StudentProfile;
