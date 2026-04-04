import { useState, useEffect } from 'react';
import {
    Edit2,
    Save,
    X,
    Camera,
    AlertCircle,
    RefreshCw,
    Loader2,
    Mail,
    Phone,
    MapPin,
    Calendar,
    GraduationCap,
    Heart,
    User,
    Shield,
    BookOpen,
    Droplets,
} from 'lucide-react';
import DashboardNavigation from '@/components/common/DashboardNavigation';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import TextArea from '@/components/ui/TextArea';
import ProfilePlaceholder from '@/components/ui/ProfilePlaceholder';
import Footer from '@/components/ui/Footer';
import NoDataFound from '@/components/ui/NoDataFound';
import type { StudentProfile } from '@/context/userContextTypes';
import { useCompleteProfile, useUpdateVolunteerProfile } from '@/hooks/useProfileService';
import { UseAuthContext } from '@/context/AuthContext';
import { generalService } from '@/services/generalService';
import ErrorPop from '@/components/common/ErrorPop';
import SuccessModal from '@/components/common/SuccessModal';
import { Badge } from '@/components/shadcn/badge';

const statusConfig: Record<string, { label: string; className: string }> = {
    certified: { label: 'Certified', className: 'bg-blue-100 text-blue-800' },
    approved: { label: 'Approved', className: 'bg-tree-100 text-tree-800' },
    pending: { label: 'Pending', className: 'bg-nss-100 text-nss-800' },
    rejected: { label: 'Rejected', className: 'bg-blood-100 text-blood-800' },
};

const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
        <div className="size-9 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
            <Icon className="size-4 text-gray-500" />
        </div>
        <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500">{label}</p>
            <p className="text-sm font-medium text-gray-900 truncate">{value || 'N/A'}</p>
        </div>
    </div>
);

const StudentProfileComponent = () => {
    const { session } = UseAuthContext();
    const {
        userProfile,
        volunteerProfile,
        isVolunteerRegistered,
        isLoading,
        error,
        refetch,
    } = useCompleteProfile();

    const {
        updateVolunteerProfile,
        isUpdating,
        updateError,
        updateSuccess,
        resetUpdateState,
    } = useUpdateVolunteerProfile();

    const [isEditing, setIsEditing] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [editedProfile, setEditedProfile] = useState<StudentProfile | null>(null);
    const [collegeName, setCollegeName] = useState<string>('');

    // Fetch college name from colleges table
    useEffect(() => {
        const fetchCollegeName = async () => {
            if (!session?.user?.id) return;
            const info = await generalService.getStudentCollegeInfo(session.user.id);
            if (info) setCollegeName(info.collegeName);
        };
        fetchCollegeName();
    }, [session?.user?.id]);

    const profile: StudentProfile | null = volunteerProfile ? {
        id: volunteerProfile.id,
        name: volunteerProfile.full_name || userProfile?.full_name || '',
        email: userProfile!.email || '',
        phone: volunteerProfile.contact_number || '',
        college: collegeName || userProfile?.college_id || '',
        course: volunteerProfile.course || '',
        year: volunteerProfile.semester ? `S${volunteerProfile.semester}` : '',
        address: volunteerProfile.permanent_address || '',
        dateOfBirth: volunteerProfile.dob || '',
        bloodGroup: volunteerProfile.blood_group || '',
        joinedDate: volunteerProfile.created_at?.split('T')[0] || '',
        profileImage: volunteerProfile.photo_url || undefined,
        ktuId: volunteerProfile.ktu_id || '',
    } : null;

    useEffect(() => {
        if (profile && !editedProfile) {
            setEditedProfile(profile);
        }
    }, [profile, editedProfile]);

    // Update college name in editedProfile when it loads asynchronously
    useEffect(() => {
        if (collegeName && editedProfile) {
            setEditedProfile(prev => prev ? { ...prev, college: collegeName } : null);
        }
    }, [collegeName]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try { await refetch(); } finally { setIsRefreshing(false); }
    };

    const handleInputChange = (field: keyof StudentProfile) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setEditedProfile(prev => prev ? ({ ...prev, [field]: e.target.value }) : null);
    };

    const handleSave = async () => {
        if (!editedProfile) return;
        resetUpdateState();
        try {
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
            await refetch();
        } catch (err: any) {
            console.error('Error saving profile:', err);
        }
    };

    const handleCancel = () => {
        setEditedProfile(profile);
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
                    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="size-16 bg-blood-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="size-8 text-blood-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Profile</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <Button onClick={handleRefresh} className="bg-primary-600 hover:bg-primary-700 text-white">
                            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                            {isRefreshing ? 'Retrying...' : 'Try Again'}
                        </Button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // Not registered
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
    const volStatus = volunteerProfile?.status || 'pending';
    const badge = statusConfig[volStatus] || statusConfig.pending;

    return (
        <div className="font-isans min-h-screen bg-gray-50">
            <DashboardNavigation mode="student" />

            {updateSuccess && (
                <SuccessModal title="Profile Updated" message="Your profile has been updated successfully!" />
            )}
            {updateError && (
                <ErrorPop error={updateError} onCloseClick={resetUpdateState} />
            )}

            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Profile Header Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-8 sm:px-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    {displayProfile.profileImage ? (
                                        <img
                                            src={displayProfile.profileImage}
                                            alt="Profile"
                                            className="size-20 rounded-full border-4 border-white/30 object-cover"
                                        />
                                    ) : (
                                        <div className="size-20 rounded-full border-4 border-white/30 bg-white flex items-center justify-center">
                                            <ProfilePlaceholder size="lg" />
                                        </div>
                                    )}
                                    <button className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-md hover:shadow-lg transition-shadow">
                                        <Camera className="size-3.5 text-gray-600" />
                                    </button>
                                </div>
                                <div className="text-white">
                                    <h1 className="text-xl sm:text-2xl font-bold">{displayProfile.name}</h1>
                                    <p className="text-white/80 text-sm">{displayProfile.course}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge className={`${badge.className} border-0 text-xs`}>
                                            {badge.label}
                                        </Badge>
                                        {volunteerProfile?.enroll_no && (
                                            <Badge className="bg-white/20 text-white border-0 text-xs">
                                                {volunteerProfile.enroll_no}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                {!isEditing ? (
                                    <>
                                        <button
                                            onClick={handleRefresh}
                                            disabled={isRefreshing}
                                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50"
                                        >
                                            <RefreshCw className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                                        </button>
                                        <Button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-0"
                                        >
                                            <Edit2 className="size-4" />
                                            Edit Profile
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            onClick={handleCancel}
                                            disabled={isUpdating}
                                            className="bg-white/10 hover:bg-white/20 text-white border-0 disabled:opacity-50"
                                        >
                                            <X className="size-4 mr-1" /> Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSave}
                                            disabled={isUpdating}
                                            className="bg-white text-primary-700 hover:bg-gray-100 disabled:opacity-50"
                                        >
                                            {isUpdating ? (
                                                <><Loader2 className="size-4 mr-1 animate-spin" /> Saving...</>
                                            ) : (
                                                <><Save className="size-4 mr-1" /> Save</>
                                            )}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Info Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100 border-b border-gray-100">
                        {[
                            { icon: Mail, label: 'Email', value: displayProfile.email },
                            { icon: Phone, label: 'Phone', value: displayProfile.phone },
                            { icon: Droplets, label: 'Blood Group', value: displayProfile.bloodGroup || 'N/A' },
                            { icon: Calendar, label: 'Joined', value: displayProfile.joinedDate || 'N/A' },
                        ].map((item, i) => (
                            <div key={i} className="px-4 py-3 text-center">
                                <item.icon className="size-4 text-gray-400 mx-auto mb-1" />
                                <p className="text-xs text-gray-500">{item.label}</p>
                                <p className="text-sm font-medium text-gray-900 truncate">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Editable Fields */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <User className="size-5 text-primary-500" />
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextField label="Full Name" value={displayProfile.name} onChange={handleInputChange('name')} disabled={!isEditing} />
                                <TextField label="KTU ID" value={displayProfile.ktuId || ''} onChange={handleInputChange('ktuId')} disabled={!isEditing} />
                                <TextField label="Phone" value={displayProfile.phone} onChange={handleInputChange('phone')} disabled={!isEditing} />
                                <TextField label="Email" value={displayProfile.email} disabled />
                                <TextField label="Date of Birth" type="date" value={displayProfile.dateOfBirth || ''} onChange={handleInputChange('dateOfBirth')} disabled={!isEditing} />
                                <TextField label="Blood Group" value={displayProfile.bloodGroup || ''} onChange={handleInputChange('bloodGroup')} disabled={!isEditing} />
                            </div>
                        </div>

                        {/* Academic Information */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <GraduationCap className="size-5 text-primary-500" />
                                Academic Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextField label="College" value={displayProfile.college} disabled />
                                <TextField label="Course" value={displayProfile.course || ''} onChange={handleInputChange('course')} disabled={!isEditing} />
                                <TextField label="Semester" value={displayProfile.year || ''} onChange={handleInputChange('year')} disabled={!isEditing} />
                                <TextField label="Unit" value={volunteerProfile?.unit_number || 'N/A'} disabled />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="size-5 text-primary-500" />
                                Address
                            </h3>
                            <TextArea label="Permanent Address" value={displayProfile.address || ''} onChange={handleInputChange('address')} disabled={!isEditing} rows={3} />
                        </div>
                    </div>

                    {/* Right: Info Sidebar */}
                    <div className="space-y-6">
                        {/* Volunteer Status Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Shield className="size-5 text-primary-500" />
                                Volunteer Status
                            </h3>
                            <div className="space-y-3">
                                <InfoItem icon={Heart} label="Status" value={badge.label} />
                                <InfoItem icon={BookOpen} label="KTU ID" value={displayProfile.ktuId || 'N/A'} />
                                <InfoItem icon={Calendar} label="Registered" value={displayProfile.joinedDate || 'N/A'} />
                                {volunteerProfile?.enroll_no && (
                                    <InfoItem icon={Shield} label="Enrollment No" value={volunteerProfile.enroll_no} />
                                )}
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
                            <div className="space-y-3">
                                <InfoItem icon={User} label="Gender" value={volunteerProfile?.gender || 'N/A'} />
                                <InfoItem icon={Phone} label="WhatsApp" value={volunteerProfile?.whatsapp_number || 'N/A'} />
                                <InfoItem icon={User} label="Parent" value={volunteerProfile?.parent_name || 'N/A'} />
                                <InfoItem icon={Phone} label="Parent Phone" value={volunteerProfile?.parent_contact_number || 'N/A'} />
                                {volunteerProfile?.languages_known && volunteerProfile.languages_known.length > 0 && (
                                    <InfoItem icon={BookOpen} label="Languages" value={volunteerProfile.languages_known.join(', ')} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-16">
                <Footer />
            </div>
        </div>
    );
};

export default StudentProfileComponent;
