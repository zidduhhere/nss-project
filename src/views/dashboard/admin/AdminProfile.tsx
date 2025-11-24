import { useState, useEffect } from 'react';
import {
  Edit2,
  Save,
  X,
  Shield,
  RefreshCw,
  Loader2,
  AlertCircle,
  Mail,
  Phone,
  Building2
} from 'lucide-react';
import DashboardNavigation from '@/components/common/DashboardNavigation';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import Footer from '@/components/ui/Footer';
import { useAdminProfile, useUpdateAdminProfile } from '@/hooks/useAdminService';
import ErrorPop from '@/components/common/ErrorPop';
import SuccessModal from '@/components/common/SuccessModal';
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
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
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

  if (isLoading && !adminProfile) {
    return (
      <div className="font-isans min-h-screen bg-gray-50">
        <DashboardNavigation mode="admin" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center h-96">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
            <p className="text-gray-600 text-lg">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !adminProfile) {
    return (
      <div className="font-isans min-h-screen bg-gray-50">
        <DashboardNavigation mode="admin" />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Profile</h2>
              <p className="text-gray-600 mb-6">{error}</p>
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
    <div className="font-isans min-h-screen bg-gray-50">
      <DashboardNavigation mode="admin" />

      {updateSuccess && (
        <SuccessModal
          title="Profile Updated"
          message="Your admin profile has been updated successfully!"
        />
      )}

      {updateError && (
        <ErrorPop error={updateError} onCloseClick={resetUpdateState} />
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
            <p className="text-gray-600 mt-2">Manage your administrator account information</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium text-gray-700">
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </span>
          </button>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Shield className="w-10 h-10 text-indigo-600" />
                  </div>
                  <div className="text-white">
                    <h2 className="text-2xl font-bold">
                      {displayProfile.full_name || 'Admin User'}
                    </h2>
                    <p className="text-indigo-100 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      System Administrator
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="flex flex-row justify-center items-center hover:border hover:border-white"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSave}
                        disabled={isUpdating}
                        className="bg-green-500 hover:bg-green-600 text-white flex items-center disabled:opacity-50"
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
                        className="bg-white text-gray-600 hover:bg-gray-50 border border-white flex items-center disabled:opacity-50"
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
              <div className="space-y-6">
                {/* Email (Read-only) */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <p className="text-gray-900">{adminProfile?.email || 'Not available'}</p>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                </div>

                {/* Full Name */}
                <TextField
                  label="Full Name"
                  value={displayProfile.full_name}
                  onChange={handleInputChange('full_name')}
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                />

                {/* Phone Number */}
                <div className="relative">
                  <TextField
                    label="Phone Number"
                    value={displayProfile.phone_number}
                    onChange={handleInputChange('phone_number')}
                    disabled={!isEditing}
                    placeholder="Enter your phone number"
                  />
                  {!isEditing && (
                    <Phone className="absolute right-3 top-9 w-5 h-5 text-gray-400" />
                  )}
                </div>

                {/* College ID */}
                <div className="relative">
                  <TextField
                    label="College ID"
                    value={displayProfile.college_id}
                    onChange={handleInputChange('college_id')}
                    disabled={!isEditing}
                    placeholder="Enter college identifier"
                  />
                  {!isEditing && (
                    <Building2 className="absolute right-3 top-9 w-5 h-5 text-gray-400" />
                  )}
                </div>

                {/* Account Info */}
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Account Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Account Created</p>
                      <p className="text-sm font-medium text-gray-900">
                        {adminProfile?.created_at
                          ? new Date(adminProfile.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : 'N/A'}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Last Updated</p>
                      <p className="text-sm font-medium text-gray-900">
                        {adminProfile?.updated_at
                          ? new Date(adminProfile.updated_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : 'N/A'}
                      </p>
                    </div>
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
};

export default AdminProfile;
