import { useCompleteProfile } from "@/hooks/useProfileService";
import { LoadingSpinner } from "@/components/common";
import { DashboardHeader } from "@/views/dashboard/student/sections";
import { Footer } from "@/components/ui";

const ProfilePage = () => {
  const {
    userProfile,
    volunteerProfile,
    isVolunteerRegistered,
    isLoading,
    error,
    refetch,
  } = useCompleteProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <DashboardHeader />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" message="Loading profile..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <DashboardHeader />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-semibold">Error loading profile</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={refetch}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-600 mb-2">
            My Profile
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            View and manage your account information
          </p>
        </div>

        {/* User Profile Section */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 border-b pb-2">
            Account Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProfileField label="Full Name" value={userProfile?.full_name} />
            <ProfileField
              label="Display Name"
              value={userProfile?.full_name}
            />
            <ProfileField
              label="Mobile Number"
              value={userProfile?.mobile}
            />
            <ProfileField label="KTU ID" value={userProfile?.ktu_id} />
            <ProfileField label="College ID" value={userProfile?.college_id} />
            <ProfileField
              label="Role"
              value={userProfile?.role?.toUpperCase()}
              badge
            />
          </div>
        </div>

        {/* Volunteer Registration Status */}
        {isVolunteerRegistered ? (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4 border-b pb-2">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Volunteer Registration
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  volunteerProfile?.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : volunteerProfile?.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {volunteerProfile?.status?.toUpperCase() || "UNKNOWN"}
              </span>
            </div>

            {/* Institution Details */}
            <div className="mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">
                Institution Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <ProfileField
                  label="Unit Number"
                  value={volunteerProfile?.unit_number}
                />
                <ProfileField
                  label="Semester"
                  value={
                    volunteerProfile?.semester
                      ? `S${volunteerProfile.semester}`
                      : null
                  }
                />
                <ProfileField label="Course" value={volunteerProfile?.course} />
                <ProfileField
                  label="Admission Year"
                  value={volunteerProfile?.admission_year}
                />
                <ProfileField
                  label="Enrollment No"
                  value={volunteerProfile?.enroll_no}
                />
                <ProfileField label="KTU ID" value={volunteerProfile?.ktu_id} />
              </div>
            </div>

            {/* Personal Details */}
            <div className="mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">
                Personal Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <ProfileField
                  label="Full Name"
                  value={volunteerProfile?.full_name}
                />
                <ProfileField
                  label="Gender"
                  value={volunteerProfile?.gender}
                />
                <ProfileField
                  label="Date of Birth"
                  value={volunteerProfile?.dob}
                />
                <ProfileField
                  label="Contact Number"
                  value={volunteerProfile?.contact_number}
                />
                <ProfileField
                  label="WhatsApp Number"
                  value={volunteerProfile?.whatsapp_number}
                />
                <ProfileField
                  label="Blood Group"
                  value={volunteerProfile?.blood_group}
                />
                <ProfileField
                  label="Religion"
                  value={volunteerProfile?.religion}
                />
                <ProfileField
                  label="Community"
                  value={volunteerProfile?.community}
                />
                <ProfileField
                  label="Height"
                  value={
                    volunteerProfile?.height
                      ? `${volunteerProfile.height} cm`
                      : null
                  }
                />
                <ProfileField
                  label="Weight"
                  value={
                    volunteerProfile?.weight
                      ? `${volunteerProfile.weight} kg`
                      : null
                  }
                />
              </div>
            </div>

            {/* Address Details */}
            <div className="mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">
                Address Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <ProfileField
                  label="District"
                  value={volunteerProfile?.district}
                />
                <ProfileField label="Taluk" value={volunteerProfile?.taluk} />
                <ProfileField
                  label="Village"
                  value={volunteerProfile?.village}
                />
                <ProfileField
                  label="Pincode"
                  value={volunteerProfile?.pincode}
                />
              </div>
              <div className="mt-4">
                <ProfileField
                  label="Permanent Address"
                  value={volunteerProfile?.permanent_address}
                  fullWidth
                />
                <ProfileField
                  label="Current Address"
                  value={volunteerProfile?.current_address}
                  fullWidth
                />
              </div>
            </div>

            {/* Parent/Guardian Details */}
            <div className="mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">
                Parent/Guardian Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <ProfileField
                  label="Parent Name"
                  value={volunteerProfile?.parent_name}
                />
                <ProfileField
                  label="Parent Contact"
                  value={volunteerProfile?.parent_contact_number}
                />
              </div>
            </div>

            {/* Documents */}
            <div className="mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">
                Documents
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {volunteerProfile?.photo_url && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Photo
                    </p>
                    <img
                      src={volunteerProfile.photo_url}
                      alt="Volunteer Photo"
                      className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                )}
                {volunteerProfile?.signature_url && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Signature
                    </p>
                    <img
                      src={volunteerProfile.signature_url}
                      alt="Volunteer Signature"
                      className="w-32 h-16 sm:w-40 sm:h-20 object-contain rounded-lg border border-gray-300 bg-white p-2"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Languages Known */}
            {volunteerProfile?.languages_known &&
              volunteerProfile.languages_known.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">
                    Languages Known
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {volunteerProfile.languages_known.map((lang: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Registration Dates */}
            <div className="text-sm text-gray-500 border-t pt-4">
              <p>
                Registered on:{" "}
                {new Date(
                  volunteerProfile?.created_at || ""
                ).toLocaleDateString()}
              </p>
              <p>
                Last updated:{" "}
                {new Date(
                  volunteerProfile?.updated_at || ""
                ).toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6 text-center">
            <p className="text-base sm:text-lg text-yellow-800 font-semibold mb-2">
              You haven't registered as a volunteer yet
            </p>
            <p className="text-yellow-700 text-sm mb-4">
              Complete your volunteer registration to participate in NSS
              activities
            </p>
            <a
              href="/dashboard/student/volunteer-registration"
              className="inline-block px-4 sm:px-6 py-2 bg-primary-600 text-white text-sm sm:text-base rounded-lg hover:bg-primary-700 transition-colors"
            >
              Register as Volunteer
            </a>
          </div>
        )}
      </div>
      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
};

// Helper component for displaying profile fields
interface ProfileFieldProps {
  label: string;
  value: string | number | null | undefined;
  badge?: boolean;
  fullWidth?: boolean;
}

const ProfileField = ({
  label,
  value,
  badge = false,
  fullWidth = false,
}: ProfileFieldProps) => {
  return (
    <div className={fullWidth ? "col-span-full" : ""}>
      <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{label}</p>
      {badge ? (
        <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
          {value || "N/A"}
        </span>
      ) : (
        <p className="text-sm sm:text-base text-gray-900 font-medium">
          {value || <span className="text-gray-400">Not provided</span>}
        </p>
      )}
    </div>
  );
};

export default ProfilePage;
