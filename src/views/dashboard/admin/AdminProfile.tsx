import { useState, useEffect } from 'react';
import { formatDate } from '@/utils/dateUtils';
import {
    Edit2,
    Save,
    X,
    AlertCircle,
    RefreshCw,
    Loader2,
    Mail,
    Phone,
    Shield,
    Building2,
    Users,
    UserCheck,
    Clock,
    Calendar,
    UserX,
    Activity,
} from 'lucide-react';
import DashboardNavigation from '@/components/common/DashboardNavigation';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import Footer from '@/components/ui/Footer';
import { useAdminProfile, useUpdateAdminProfile, useSystemStats } from '@/hooks/useAdminService';
import ErrorPop from '@/components/common/ErrorPop';
import SuccessModal from '@/components/common/SuccessModal';
import { Badge } from '@/components/shadcn/badge';

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

const StatItem = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
        <span className="text-sm text-gray-600">{label}</span>
        <span className={`text-lg font-bold ${color}`}>{value}</span>
    </div>
);

interface AdminProfileForm {
    full_name: string;
    phone_number: string;
    college_id: string;
}

const AdminProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [editedProfile, setEditedProfile] = useState<AdminProfileForm | null>(null);

    const {
        adminProfile,
        isLoading,
        error,
        refetch,
    } = useAdminProfile();

    const {
        updateAdminProfile,
        isUpdating,
        updateError,
        updateSuccess,
        resetUpdateState,
    } = useUpdateAdminProfile();

    const {
        stats,
    } = useSystemStats();

    useEffect(() => {
        if (adminProfile && !editedProfile) {
            setEditedProfile({
                full_name: adminProfile.full_name || '',
                phone_number: adminProfile.phone_number || '',
                college_id: adminProfile.college_id || '',
            });
        }
    }, [adminProfile, editedProfile]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try { await refetch(); } finally { setIsRefreshing(false); }
    };

    const handleInputChange = (field: keyof AdminProfileForm) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setEditedProfile((prev) =>
            prev ? { ...prev, [field]: e.target.value } : null
        );
    };

    const handleSave = async () => {
        if (!editedProfile) return;
        resetUpdateState();
        try {
            await updateAdminProfile(editedProfile);
            setIsEditing(false);
            await refetch();
        } catch (err) {
            console.error('Error saving profile:', err);
        }
    };

    const handleCancel = () => {
        if (adminProfile) {
            setEditedProfile({
                full_name: adminProfile.full_name || '',
                phone_number: adminProfile.phone_number || '',
                college_id: adminProfile.college_id || '',
            });
        }
        setIsEditing(false);
        resetUpdateState();
    };

    // Loading state
    if (isLoading && !adminProfile) {
        return (
            <div className="font-isans min-h-dvh bg-gray-50">
                <DashboardNavigation mode="admin" />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col items-center justify-center h-96">
                        <Loader2 className="size-12 text-primary-600 animate-spin mb-4" />
                        <p className="text-gray-600 text-lg">Loading your profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error && !adminProfile) {
        return (
            <div className="font-isans min-h-dvh bg-gray-50">
                <DashboardNavigation mode="admin" />
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="size-16 bg-blood-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="size-8 text-blood-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Profile</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <Button onClick={handleRefresh} className="bg-primary-600 hover:bg-primary-700 text-white">
                            <RefreshCw className={`size-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                            {isRefreshing ? 'Retrying...' : 'Try Again'}
                        </Button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const displayProfile = editedProfile || {
        full_name: adminProfile?.full_name || '',
        phone_number: adminProfile?.phone_number || '',
        college_id: adminProfile?.college_id || '',
    };

    return (
        <div className="font-isans min-h-dvh bg-gray-50">
            <DashboardNavigation mode="admin" />

            {updateSuccess && (
                <SuccessModal title="Profile Updated" message="Your admin profile has been updated successfully!" />
            )}
            {updateError && (
                <ErrorPop error={updateError} onCloseClick={resetUpdateState} />
            )}

            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Profile Header Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-8 sm:px-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="size-20 rounded-full border-4 border-white/30 bg-white flex items-center justify-center">
                                    <Shield className="size-10 text-indigo-600" />
                                </div>
                                <div className="text-white">
                                    <h1 className="text-xl sm:text-2xl font-bold">
                                        {displayProfile.full_name || 'Admin User'}
                                    </h1>
                                    <p className="text-white/80 text-sm">System Administrator</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge className="bg-white/20 text-white border-0 text-xs">
                                            <Shield className="size-3 mr-1" />
                                            Admin
                                        </Badge>
                                        {adminProfile?.created_at && (
                                            <Badge className="bg-white/20 text-white border-0 text-xs">
                                                <Calendar className="size-3 mr-1" />
                                                Since {formatDate(adminProfile.created_at, { year: 'numeric', month: 'short' })}
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
                                            className="bg-white text-indigo-700 hover:bg-gray-100 disabled:opacity-50"
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
                            { icon: Mail, label: 'Email', value: adminProfile?.email || 'N/A' },
                            { icon: Phone, label: 'Phone', value: displayProfile.phone_number || 'N/A' },
                            { icon: Users, label: 'Total Volunteers', value: String(stats?.totalVolunteers || 0) },
                            { icon: Building2, label: 'Active Units', value: String(stats?.totalUnits || 0) },
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
                                <Shield className="size-5 text-indigo-500" />
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextField
                                    label="Full Name"
                                    value={displayProfile.full_name}
                                    onChange={handleInputChange('full_name')}
                                    disabled={!isEditing}
                                    placeholder="Enter your full name"
                                />
                                <TextField
                                    label="Email Address"
                                    value={adminProfile?.email || ''}
                                    disabled
                                />
                                <TextField
                                    label="Phone Number"
                                    value={displayProfile.phone_number}
                                    onChange={handleInputChange('phone_number')}
                                    disabled={!isEditing}
                                    placeholder="Enter your phone number"
                                />
                                <TextField
                                    label="College ID"
                                    value={displayProfile.college_id}
                                    onChange={handleInputChange('college_id')}
                                    disabled={!isEditing}
                                    placeholder="Enter college identifier"
                                />
                            </div>
                        </div>

                        {/* Account Information */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Calendar className="size-5 text-indigo-500" />
                                Account Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextField
                                    label="Account Created"
                                    value={formatDate(adminProfile?.created_at, { year: 'numeric', month: 'long', day: 'numeric' })}
                                    disabled
                                />
                                <TextField
                                    label="Last Updated"
                                    value={formatDate(adminProfile?.updated_at, { year: 'numeric', month: 'long', day: 'numeric' })}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: Info Sidebar */}
                    <div className="space-y-6">
                        {/* System Statistics */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Activity className="size-5 text-indigo-500" />
                                System Overview
                            </h3>
                            <div className="space-y-2">
                                <StatItem label="Total Volunteers" value={stats?.totalVolunteers || 0} color="text-gray-900" />
                                <StatItem label="Approved" value={stats?.approvedVolunteers || 0} color="text-tree-600" />
                                <StatItem label="Certified" value={stats?.certifiedVolunteers || 0} color="text-blue-600" />
                                <StatItem label="Pending" value={stats?.pendingApprovals || 0} color="text-nss-600" />
                                <StatItem label="Rejected" value={stats?.rejectedVolunteers || 0} color="text-blood-600" />
                            </div>
                        </div>

                        {/* Quick Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
                            <div className="space-y-3">
                                <InfoItem icon={Shield} label="Role" value="System Administrator" />
                                <InfoItem icon={Building2} label="Active Units" value={String(stats?.totalUnits || 0)} />
                                <InfoItem icon={Users} label="Total Students" value={String(stats?.totalStudents || 0)} />
                                <InfoItem icon={Clock} label="Recent Registrations" value={`${stats?.recentRegistrations || 0} (7 days)`} />
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

export default AdminProfile;
