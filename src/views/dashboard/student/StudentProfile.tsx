import { useState, useEffect } from 'react';
import {
    // Award,
    Edit2,
    Save,
    X,
    Camera,
    // CheckCircle,
    // Clock,
    // XCircle,
    // Droplets,
    // TreePine,
    // Users,
    // Heart,
    AlertCircle,
    RefreshCw,
    Loader2
} from 'lucide-react';
import DashboardNavigation from '@/components/common/DashboardNavigation';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import TextArea from '@/components/ui/TextArea';
import ProfilePlaceholder from '@/components/ui/ProfilePlaceholder';
import Footer from '@/components/ui/Footer';
import NoDataFound from '@/components/ui/NoDataFound';
import type { /* Achievement, */ StudentProfile } from '@/context/userContextTypes';
import { useCompleteProfile, useUpdateVolunteerProfile } from '@/hooks/useProfileService';
import ErrorPop from '@/components/common/ErrorPop';
import SuccessModal from '@/components/common/SuccessModal';



// const statusConfig = {
//     pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Pending' },
//     approved: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', text: 'Approved' },
//     rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', text: 'Rejected' },
// };

// const achievementIcons = {
//     'Blood Donation': { icon: Droplets, color: 'text-red-500', bg: 'bg-red-50' },
//     'Tree Plantation': { icon: TreePine, color: 'text-green-500', bg: 'bg-green-50' },
//     'Community Service': { icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
//     'Environmental': { icon: Heart, color: 'text-purple-500', bg: 'bg-purple-50' },
// };


const StudentProfileComponent = () => {
    // Fetch complete profile data (user + volunteer) in a single optimized call
    const {
        userProfile,
        volunteerProfile,
        isVolunteerRegistered,
        isLoading,
        error,
        refetch,
    } = useCompleteProfile();

    // Hook for updating volunteer profile
    const {
        updateVolunteerProfile,
        isUpdating,
        updateError,
        updateSuccess,
        resetUpdateState,
    } = useUpdateVolunteerProfile();

    // Local UI state management
    const [isEditing, setIsEditing] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [editedProfile, setEditedProfile] = useState<StudentProfile | null>(null);
    // const [achievements, setAchievements] = useState<Achievement[]>([]);


    // Map volunteer profile data to StudentProfile format
    const profile: StudentProfile | null = volunteerProfile ? {
        id: volunteerProfile.id,
        name: volunteerProfile.full_name || userProfile?.full_name || '',
        email: userProfile!.email || '', // Email comes from auth session, not stored in profiles
        phone: volunteerProfile.contact_number || '',
        college: userProfile?.college_id || '',
        course: volunteerProfile.course || '',
        year: volunteerProfile.semester ? `S${volunteerProfile.semester}` : '',
        address: volunteerProfile.permanent_address || '',
        dateOfBirth: volunteerProfile.dob || '',
        bloodGroup: volunteerProfile.blood_group || '',
        joinedDate: volunteerProfile.created_at?.split('T')[0] || '',
        profileImage: volunteerProfile.photo_url || undefined,
        ktuId: volunteerProfile.ktu_id || '',
    } : null;

    console.log(profile?.profileImage);

    // const totalPoints = achievements
    //     .filter(achievement => achievement.status === 'approved')
    //     .reduce((sum, achievement) => sum + achievement.points, 0);

    // Initialize edited profile when profile loads
    useEffect(() => {
        if (profile && !editedProfile) {
            setEditedProfile(profile);
        }
    }, [profile, editedProfile]);

    // Handle manual refresh
    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await refetch();
        } catch (err) {
            console.error('Error refreshing profile:', err);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleInputChange = (field: keyof StudentProfile) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setEditedProfile(prev => prev ? ({
            ...prev,
            [field]: e.target.value
        }) : null);
    };

    const handleSave = async () => {
        // Validate editedProfile exists
        //How does this if clause work 
        //Ans : It checks if editedProfile is null or undefined. If it is, the function returns early and does not proceed with saving.
        if (!editedProfile) return;

        resetUpdateState();

        try {
            // Map StudentProfile fields back to VolunteerProfile format for database update
            await updateVolunteerProfile({
                full_name: editedProfile.name,
                contact_number: editedProfile.phone,
                ktu_id: editedProfile.ktuId,
                course: editedProfile.course,
                semester: editedProfile.year ? parseInt(editedProfile.year.replace('S', '')) : null,
                permanent_address: editedProfile.address,
                dob: editedProfile.dateOfBirth,
                blood_group: editedProfile.bloodGroup,
            });
            
            setIsEditing(false);
            
            // Refresh data to get latest from server
            await refetch();
        } catch (err: any) {
            console.error('Error saving profile:', err);
            // Error is already set in the hook
        }
    };

    const handleCancel = () => {
        setEditedProfile(profile); // Reset to original data
        setIsEditing(false);
        resetUpdateState();
    };

    // Loading state
    if (isLoading && !profile) {
        return (
            <div className="font-isans min-h-screen bg-gray-50">
                
                <DashboardNavigation mode="student" />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col items-center justify-center h-96">
                        <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                        <p className="text-gray-600 text-lg">Loading your profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error && !profile) {
        return (
            <div className="font-isans min-h-screen bg-gray-50">
                <DashboardNavigation mode="student" />
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 bg-blood-100 rounded-full flex items-center justify-center">
                                    <AlertCircle className="w-8 h-8 text-blood-500" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Unable to Load Profile
                            </h2>
                            <p className="text-gray-600 mb-6">{error}</p>
                            <div className="flex gap-3 justify-center">
                                <Button
                                    onClick={handleRefresh}
                                    className="bg-primary-600 hover:bg-primary-700 text-white"
                                >
                                    <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                                    {isRefreshing ? 'Retrying...' : 'Try Again'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // No profile data (not registered)
    if (!profile || !isVolunteerRegistered) {
        return (
            <div className="font-isans min-h-screen bg-gray-50">
                <DashboardNavigation mode="student" />
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto">
                        <NoDataFound
                            title="Volunteer Registration Required"
                            description="Please complete your volunteer registration to access your profile."
                            cta={
                                <Button
                                    onClick={() => window.location.href = '/dashboard/student/volunteer-registration'}
                                    className="bg-primary-600 hover:bg-primary-700 text-white"
                                >
                                    Register as Volunteer
                                </Button>
                            }
                        />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const displayProfile = editedProfile || profile;

    return (
        <div className="font-isans min-h-screen bg-gray-50">
            <DashboardNavigation mode="student" />

            {/* Success Modal */}
            {updateSuccess && (
                <SuccessModal
                    title="Profile Updated"
                    message="Your profile has been updated successfully!"
                />
            )}

            {/* Error Alert */}
            {updateError && (
                <ErrorPop
                    error={updateError}
                    onCloseClick={resetUpdateState}
                />
            )}

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                        <p className="text-gray-600 mt-2">Manage your personal information and view your NSS achievements</p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        title="Refresh profile data"
                    >
                        <RefreshCw className={`w-4 h-4 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span className="text-sm font-medium text-gray-700">
                            {isRefreshing ? 'Refreshing...' : 'Refresh'}
                        </span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm  overflow-hidden">
                            {/* Profile Header */}
                            <div className="bg-primary-500 px-6 py-8">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            {displayProfile.profileImage ? (
                                                <img
                                                    src={displayProfile.profileImage}
                                                    alt="Profile Image"
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
                                            <h2 className="text-2xl font-bold">{displayProfile.name}</h2>
                                            <p className="text-blue-100">{displayProfile.course}</p>
                                            <p className="text-blue-100">{displayProfile.college}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        {!isEditing ? (
                                            <Button
                                                onClick={() => setIsEditing(true)}
                                                className="flex flex-row justify-center items-center hover:border  hover:border-white "
                                            >
                                                <Edit2 className="w-4 h-4 mr-2 max-h-4 overflow-hidden" />
                                                Edit
                                            </Button>
                                        ) : (
                                            <div className="flex space-x-2">
                                                <Button
                                                    onClick={handleSave}
                                                    disabled={isUpdating}
                                                    className="bg-tree-500 hover:bg-tree-600 text-white flex flex-row items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isUpdating ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="w-4 h-4 mr-2" />
                                                            Save
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    onClick={handleCancel}
                                                    disabled={isUpdating}
                                                    className="bg-white text-gray-600 hover:bg-gray-50 border border-white flex flex-row items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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
                                            value={displayProfile.name}
                                            onChange={handleInputChange('name')}
                                            disabled={!isEditing}
                                        />
                                        <TextField
                                            label="Email"
                                            value={displayProfile.email}
                                            onChange={handleInputChange('email')}
                                            disabled={true}
                                        />
                                        <TextField
                                            label="Phone"
                                            value={displayProfile.phone}
                                            onChange={handleInputChange('phone')}
                                            disabled={!isEditing}
                                        />
                                        <TextField
                                            label="KTU ID"
                                            value={displayProfile.ktuId}
                                            onChange={handleInputChange('ktuId')}
                                            disabled={!isEditing}
                                        />
                                        <TextField
                                            label="Blood Group"
                                            value={displayProfile.bloodGroup}
                                            onChange={handleInputChange('bloodGroup')}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <TextField
                                            label="College"
                                            value={displayProfile.college}
                                            onChange={handleInputChange('college')}
                                            disabled={true}
                                        />
                                        <TextField
                                            label="Course"
                                            value={displayProfile.course}
                                            onChange={handleInputChange('course')}
                                            disabled={!isEditing}
                                        />
                                        <TextField
                                            label="Year"
                                            value={displayProfile.year}
                                            onChange={handleInputChange('year')}
                                            disabled={!isEditing}
                                        />
                                        <TextField
                                            label="Date of Birth"
                                            type="date"
                                            value={displayProfile.dateOfBirth}
                                            onChange={handleInputChange('dateOfBirth')}
                                            disabled={!isEditing}
                                        />
                                        <TextField
                                            label="Joined NSS"
                                            type="date"
                                            value={displayProfile.joinedDate}
                                            onChange={handleInputChange('joinedDate')}
                                            disabled={true}
                                        />
                                        {volunteerProfile?.status === 'certified' && volunteerProfile?.enroll_no && (
                                            <div className="relative">
                                                <TextField
                                                    label="NSS Enrollment Number"
                                                    value={volunteerProfile.enroll_no}
                                                    disabled={true}
                                                    className="bg-blue-50 border-blue-200"
                                                />
                                                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-bl rounded-tr font-medium">
                                                    Certified
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <TextArea
                                        label="Address"
                                        value={displayProfile.address}
                                        onChange={handleInputChange('address')}
                                        disabled={!isEditing}
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats & Achievements Sidebar */}
                    {/* <div className="space-y-6"> */}
                        {/* Stats Card */}
                        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Award className="w-5 h-5 mr-2 text-nss-500" />
                                NSS Statistics
                            </h3>
                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600">{totalPoints}</div>
                                    <div className="text-sm text-gray-600">Total Points</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-tree-50 rounded-lg">
                                        <div className="text-xl font-semibold text-tree-600">
                                            {achievements.filter(a => a.status === 'approved').length}
                                        </div>
                                        <div className="text-xs text-tree-700">Approved</div>
                                    </div>
                                    <div className="text-center p-3 bg-nss-50 rounded-lg">
                                        <div className="text-xl font-semibold text-nss-600">
                                            {achievements.filter(a => a.status === 'pending').length}
                                        </div>
                                        <div className="text-xs text-nss-700">Pending</div>
                                    </div>
                                </div>
                            </div>
                        </div> */}

                        {/* Recent Achievements */}
                        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
                        </div> */}
                    {/* </div> */}
                </div>
            </div>

            <div className="mt-16">
                <Footer />
            </div>
        </div>
    );
};

export default StudentProfileComponent;
