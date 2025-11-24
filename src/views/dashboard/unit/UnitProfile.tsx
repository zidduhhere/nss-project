import DashboardNavigation from '../../../components/common/DashboardNavigation';
import { UnitInfoCard, DashboardHeader } from '../../../components/common';
import { TextField, TextArea, StatCard, FilledButton, OutlinedButton, Footer } from '../../../components/ui';
import { Calendar, Building, Users, KeyRound, AlertCircle, CheckCircle2, RefreshCw, MapPin, User, UserCheck, Clock, UserX } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUnitProfile } from '@/hooks/useUnitProfile';
import { UseAuthContext } from '@/context/AuthContext';
import { UnitProfileUpdate } from '@/types/UnitProfile';

interface UnitProfileProps {
    user?: { name?: string; role?: string } | null;
}

export default function UnitProfile({ }: UnitProfileProps) {
    const { session } = UseAuthContext();
    const unitId = session?.user?.id;

    const {
        profile,
        stats,
        isLoading,
        isUpdating,
        error,
        updateProfile,
        refreshProfile,
        resetPassword,
    } = useUnitProfile(unitId || '');

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UnitProfileUpdate>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [resetLoading, setResetLoading] = useState(false);

    // Update form data when profile loads
    useEffect(() => {
        if (profile && !isEditing) {
            setFormData({
                po_name: profile.po_name || '',
                po_email: profile.po_email || '',
                po_phone: profile.po_phone || '',
                po_address: profile.po_address || '',
                po_designation: profile.po_designation || '',
            });
        }
    }, [profile, isEditing]);

    const handleSave = async () => {
        try {
            await updateProfile(formData);
            setIsEditing(false);
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            // Error is handled by the hook
            console.error('Save failed:', err);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset form to current profile data
        if (profile) {
            setFormData({
                po_name: profile.po_name || '',
                po_email: profile.po_email || '',
                po_phone: profile.po_phone || '',
                po_address: profile.po_address || '',
                po_designation: profile.po_designation || '',
            });
        }
    };

    const handlePasswordReset = async () => {
        if (!profile?.po_email) {
            alert('Email address not found in profile');
            return;
        }

        const confirmed = confirm(
            `Send password reset link to ${profile.po_email}?`
        );

        if (!confirmed) return;

        try {
            setResetLoading(true);
            await resetPassword();
            alert(`Password reset link sent to ${profile.po_email}. Please check your email.`);
        } catch (err: any) {
            alert(`Failed to send reset email: ${err.message}`);
        } finally {
            setResetLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <DashboardNavigation mode="unit" />
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-nss-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600 font-medium">Loading profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50">
                <DashboardNavigation mode="unit" />
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="text-center">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <p className="text-gray-900 font-semibold text-lg mb-2">Profile Not Found</p>
                        <p className="text-gray-600 mb-4">Unable to load your unit profile.</p>
                        <FilledButton onClick={refreshProfile}>Try Again</FilledButton>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-nss-50">
            <DashboardNavigation mode="unit" />
            <div className="space-y-6 px-4 sm:px-6 pb-6">
                {/* Success/Error Messages */}
                {successMessage && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <p className="text-green-800 font-medium">{successMessage}</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-red-800 font-medium">{error}</p>
                        </div>
                        <button
                            onClick={refreshProfile}
                            className="text-red-600 hover:text-red-700 transition-colors"
                        >
                            <RefreshCw className="h-5 w-5" />
                        </button>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-start justify-between gap-6">
                    <DashboardHeader
                        title="Unit Profile"
                        subtitle="Manage your NSS unit information and settings"
                        icon={Building}
                        badges={[
                            { icon: Building, text: profile.unit_number || 'N/A' },
                            { icon: MapPin, text: profile.college_district || 'N/A' }
                        ]}
                    />

                    {/* Unit Info Card */}
                    <UnitInfoCard className="w-full lg:w-80 flex-shrink-0" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Main Profile Form */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Unit Information</h3>
                                <p className="text-sm text-gray-500">Manage your unit and Program Officer details</p>
                            </div>
                            {!isEditing ? (
                                <FilledButton 
                                    onClick={() => setIsEditing(true)}
                                    variant="primary"
                                    className="w-full sm:w-auto"
                                >
                                    Edit Profile
                                </FilledButton>
                            ) : (
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <OutlinedButton 
                                        onClick={handleCancel}
                                        disabled={isUpdating}
                                        className="border-gray-300 text-gray-700 hover:border-gray-400 flex-1 sm:flex-none"
                                    >
                                        Cancel
                                    </OutlinedButton>
                                    <FilledButton 
                                        onClick={handleSave}
                                        isLoading={isUpdating}
                                        loadingText="Saving..."
                                        variant="primary"
                                        className="flex-1 sm:flex-none"
                                    >
                                        Save Changes
                                    </FilledButton>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            {/* Read-only Unit Info */}
                            <div className="bg-gradient-to-br from-nss-50 to-nss-100 rounded-xl p-4 sm:p-6 border border-nss-200">
                                <h4 className="text-sm font-semibold text-nss-800 mb-4 flex items-center gap-2">
                                    <Building className="h-4 w-4" />
                                    Unit Details (Read-only)
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-nss-700 mb-1 block">Unit Number</label>
                                        <p className="text-nss-900 font-semibold text-lg">{profile.unit_number}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-nss-700 mb-1 block">College</label>
                                        <p className="text-nss-900 font-medium">{profile.college_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-nss-700 mb-1 block">District</label>
                                        <p className="text-nss-900 font-medium">{profile.college_district}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-nss-700 mb-1 block">Established</label>
                                        <p className="text-nss-900 font-medium">{stats?.establishedYear || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Editable Program Officer Details */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Program Officer Details
                                </h4>
                                <div className="space-y-4">
                                    <TextField
                                        label="Program Officer Name"
                                        placeholder="Dr. John Doe"
                                        value={formData.po_name || ''}
                                        onChange={(e) => setFormData({ ...formData, po_name: e.target.value })}
                                        disabled={!isEditing}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <TextField
                                            label="Email Address"
                                            type="email"
                                            placeholder="po@college.edu"
                                            value={formData.po_email || ''}
                                            onChange={(e) => setFormData({ ...formData, po_email: e.target.value })}
                                            disabled={!isEditing}
                                        />
                                        <TextField
                                            label="Phone Number"
                                            placeholder="9876543210"
                                            value={formData.po_phone || ''}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                setFormData({ ...formData, po_phone: value });
                                            }}
                                            disabled={!isEditing}
                                        />
                                    </div>

                                    <TextField
                                        label="Designation"
                                        placeholder="Associate Professor & NSS Coordinator"
                                        value={formData.po_designation || ''}
                                        onChange={(e) => setFormData({ ...formData, po_designation: e.target.value })}
                                        disabled={!isEditing}
                                    />

                                    <TextArea
                                        label="Address"
                                        placeholder="Faculty Quarters, College Campus"
                                        value={formData.po_address || ''}
                                        onChange={(e) => setFormData({ ...formData, po_address: e.target.value })}
                                        disabled={!isEditing}
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats & Actions Sidebar */}
                    <div className="space-y-6">
                        {/* Unit Statistics */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 px-1">
                                <Users className="h-5 w-5 text-nss-600" />
                                Unit Statistics
                            </h3>
                            
                            <StatCard
                                titleStat={String(stats?.totalVolunteers || 0)}
                                subtitle="Total Volunteers"
                                icon={Users}
                                iconColor="text-white"
                                iconBgColor="bg-gradient-to-br from-nss-500 to-nss-700"
                            />
                            
                            <StatCard
                                titleStat={String(stats?.approvedVolunteers || 0)}
                                subtitle="Approved"
                                description="By Unit"
                                icon={UserCheck}
                                iconColor="text-white"
                                iconBgColor="bg-gradient-to-br from-green-500 to-green-700"
                            />
                            
                            <StatCard
                                titleStat={String(stats?.certifiedVolunteers || 0)}
                                subtitle="Certified"
                                description="By Admin"
                                icon={UserCheck}
                                iconColor="text-white"
                                iconBgColor="bg-gradient-to-br from-blue-500 to-blue-700"
                            />
                            
                            <StatCard
                                titleStat={String(stats?.pendingApprovals || 0)}
                                subtitle="Pending Approvals"
                                description="Awaiting Review"
                                icon={Clock}
                                iconColor="text-white"
                                iconBgColor="bg-gradient-to-br from-yellow-500 to-yellow-700"
                            />
                            
                            <StatCard
                                titleStat={String(stats?.rejectedVolunteers || 0)}
                                subtitle="Rejected"
                                description="Applications"
                                icon={UserX}
                                iconColor="text-white"
                                iconBgColor="bg-gradient-to-br from-red-500 to-red-700"
                            />
                        </div>

                        {/* Security Actions */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                                <KeyRound className="h-5 w-5 text-nss-600" />
                                Security
                            </h3>
                            <FilledButton
                                variant="lightNss"
                                onClick={handlePasswordReset}
                                isLoading={resetLoading}
                                loadingText="Sending..."
                                className="w-full flex items-center justify-center gap-2"
                            >
                                <KeyRound className="h-4 w-4" />
                                Reset Password
                            </FilledButton>
                            <p className="text-xs text-gray-500 mt-3 text-center">
                                A reset link will be sent to your email
                            </p>
                        </div>

                        {/* Quick Info */}
                        <div className="bg-gradient-to-br from-nss-500 to-nss-700 rounded-2xl shadow-lg p-4 sm:p-6 text-white">
                            <h3 className="text-sm font-semibold mb-4 opacity-90">Quick Info</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs opacity-80">Established Year</p>
                                        <p className="font-semibold">{stats?.establishedYear || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Building className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs opacity-80">Unit Number</p>
                                        <p className="font-semibold">{profile.unit_number}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs opacity-80">Location</p>
                                        <p className="font-semibold">{profile.college_district}</p>
                                    </div>
                                </div>
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
}
