import { useState, useEffect } from 'react';
import {
    Edit2,
    Save,
    X,
    AlertCircle,
    RefreshCw,
    Loader2,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Building,
    Users,
    UserCheck,
    Clock,
    UserX,
    KeyRound,
    User,
    Shield,
} from 'lucide-react';
import DashboardNavigation from '@/components/common/DashboardNavigation';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import TextArea from '@/components/ui/TextArea';
import Footer from '@/components/ui/Footer';
import { useUnitProfile } from '@/hooks/useUnitProfile';
import { UseAuthContext } from '@/context/AuthContext';
import { UnitProfileUpdate } from '@/types/UnitProfile';
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
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [formData, setFormData] = useState<UnitProfileUpdate>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [resetLoading, setResetLoading] = useState(false);
    const [resetError, setResetError] = useState<string | null>(null);

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

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try { await refreshProfile(); } finally { setIsRefreshing(false); }
    };

    const handleSave = async () => {
        try {
            await updateProfile(formData);
            setIsEditing(false);
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            console.error('Save failed:', err);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
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
        const confirmed = confirm(`Send password reset link to ${profile.po_email}?`);
        if (!confirmed) return;
        try {
            setResetLoading(true);
            setResetError(null);
            await resetPassword();
            alert(`Password reset link sent to ${profile.po_email}. Please check your email.`);
        } catch (err: any) {
            setResetError(err.message || 'Failed to send reset email');
        } finally {
            setResetLoading(false);
        }
    };

    // Loading state
    if (isLoading && !profile) {
        return (
            <div className="font-isans min-h-screen bg-gray-50">
                <DashboardNavigation mode="unit" />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col items-center justify-center h-96">
                        <Loader2 className="size-12 text-primary-600 animate-spin mb-4" />
                        <p className="text-gray-600 text-lg">Loading profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error && !profile) {
        return (
            <div className="font-isans min-h-screen bg-gray-50">
                <DashboardNavigation mode="unit" />
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

    if (!profile) return null;

    return (
        <div className="font-isans min-h-screen bg-gray-50">
            <DashboardNavigation mode="unit" />

            {successMessage && (
                <SuccessModal title="Profile Updated" message={successMessage} />
            )}
            {(error || resetError) && (
                <ErrorPop error={error || resetError || ''} onCloseClick={() => setResetError(null)} />
            )}

            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Profile Header Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-nss-600 to-nss-500 px-6 py-8 sm:px-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="size-20 rounded-full border-4 border-white/30 bg-white flex items-center justify-center">
                                    <Building className="size-10 text-nss-600" />
                                </div>
                                <div className="text-white">
                                    <h1 className="text-xl sm:text-2xl font-bold">{profile.unit_number}</h1>
                                    <p className="text-white/80 text-sm">{profile.college_name || 'NSS Unit'}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge className="bg-white/20 text-white border-0 text-xs">
                                            <MapPin className="size-3 mr-1" />
                                            {profile.college_district || 'N/A'}
                                        </Badge>
                                        {stats?.establishedYear && (
                                            <Badge className="bg-white/20 text-white border-0 text-xs">
                                                <Calendar className="size-3 mr-1" />
                                                Est. {stats.establishedYear}
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
                                            className="bg-white text-nss-700 hover:bg-gray-100 disabled:opacity-50"
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
                            { icon: Mail, label: 'PO Email', value: profile.po_email || 'N/A' },
                            { icon: Phone, label: 'PO Phone', value: profile.po_phone || 'N/A' },
                            { icon: Users, label: 'Volunteers', value: String(stats?.totalVolunteers || 0) },
                            { icon: UserCheck, label: 'Approved', value: String(stats?.approvedVolunteers || 0) },
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
                        {/* Unit Details (Read-only) */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Building className="size-5 text-nss-500" />
                                Unit Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextField label="Unit Number" value={profile.unit_number} disabled />
                                <TextField label="College" value={profile.college_name || ''} disabled />
                                <TextField label="District" value={profile.college_district || ''} disabled />
                                <TextField label="Established" value={stats?.establishedYear || 'N/A'} disabled />
                            </div>
                        </div>

                        {/* Program Officer Details (Editable) */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <User className="size-5 text-nss-500" />
                                Program Officer Details
                            </h3>
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

                    {/* Right: Info Sidebar */}
                    <div className="space-y-6">
                        {/* Volunteer Statistics */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Users className="size-5 text-nss-500" />
                                Volunteer Statistics
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
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
                            <div className="space-y-3">
                                <InfoItem icon={Building} label="Unit Number" value={profile.unit_number} />
                                <InfoItem icon={MapPin} label="District" value={profile.college_district || 'N/A'} />
                                <InfoItem icon={Calendar} label="Established" value={stats?.establishedYear || 'N/A'} />
                                <InfoItem icon={Shield} label="College" value={profile.college_name || 'N/A'} />
                            </div>
                        </div>

                        {/* Security */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <KeyRound className="size-5 text-nss-500" />
                                Security
                            </h3>
                            <Button
                                onClick={handlePasswordReset}
                                disabled={resetLoading}
                                className="w-full bg-nss-50 text-nss-700 hover:bg-nss-100 border border-nss-200"
                            >
                                {resetLoading ? (
                                    <><Loader2 className="size-4 mr-2 animate-spin" /> Sending...</>
                                ) : (
                                    <><KeyRound className="size-4 mr-2" /> Reset Password</>
                                )}
                            </Button>
                            <p className="text-xs text-gray-500 mt-3 text-center">
                                A reset link will be sent to your email
                            </p>
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
