import { Footer } from '@/components/ui';
import DashboardHeader from './sections/DashboardHeader';
import { useStudentDashboard } from '@/hooks/useStudentDashboard';
import { LoadingSpinner, DashboardHeader as CommonDashboardHeader } from '@/components/common';
import { 
  CheckCircle2, 
  Clock, 
  Heart, 
  TreePine, 
  TrendingUp, 
  FileText, 
  UserCheck, 
  AlertCircle,
  Calendar,
  Award,
  ArrowRight,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FilledButton } from '@/components/ui';

interface StudentDashboardProps {
  onLogout: () => void;
}

export default function StudentDashboard({ }: StudentDashboardProps) {
  const { stats, recentActivities, activitySummary, isLoading, error, refetch } = useStudentDashboard();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" message="Loading dashboard..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-semibold">Error loading dashboard</p>
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

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'approved':
      case 'certified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'approved':
      case 'certified':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Page Header */}
        <CommonDashboardHeader
          title="My Dashboard"
          subtitle="Track your NSS journey and activities"
          icon={TrendingUp}
          badges={stats?.isRegistered ? [
            { 
              icon: UserCheck, 
              text: `Status: ${stats.volunteerStatus?.toUpperCase()}` 
            }
          ] : undefined}
          className="mb-8"
        />

        {/* Volunteer Registration Status Banner */}
        {!stats?.isRegistered ? (
          <div className="mb-8 bg-gradient-to-r from-nss-500 to-nss-700 rounded-2xl shadow-lg p-6 sm:p-8 text-white">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold mb-2 flex items-center gap-2">
                  <AlertCircle className="h-6 w-6" />
                  Complete Your Volunteer Registration
                </h3>
                <p className="text-nss-100 text-sm sm:text-base">
                  Register as an NSS volunteer to start tracking your activities and earning recognition for your service.
                </p>
              </div>
              <FilledButton
                variant="lightNss"
                onClick={() => navigate('/dashboard/student/volunteer-registration')}
                className="flex items-center gap-2 whitespace-nowrap bg-white hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" />
                Register Now
              </FilledButton>
            </div>
          </div>
        ) : stats.volunteerStatus === 'pending' ? (
          <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <Clock className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">Registration Pending</h3>
                <p className="text-sm text-yellow-800">
                  Your volunteer registration is under review by your unit coordinator. You'll be notified once it's approved.
                </p>
              </div>
            </div>
          </div>
        ) : stats.volunteerStatus === 'approved' ? (
          <div className="mb-8 bg-green-50 border-l-4 border-green-400 rounded-lg p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900 mb-1">Registration Approved!</h3>
                <p className="text-sm text-green-800">
                  Your volunteer registration has been approved. Start submitting your activities to earn certification.
                </p>
              </div>
            </div>
          </div>
        ) : stats.volunteerStatus === 'certified' ? (
          <div className="mb-8 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg p-4 sm:p-6 text-white">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 flex-shrink-0" />
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-1">Certified NSS Volunteer</h3>
                <p className="text-sm text-green-50">
                  Congratulations! You are now a certified NSS volunteer. Keep up the great work!
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {/* Total Activities Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-nss-500 to-nss-600 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              {stats?.totalActivities || 0}
            </h3>
            <p className="text-sm text-gray-600">Total Activities</p>
          </div>

          {/* Blood Donation Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              {stats?.bloodDonationCount || 0}
            </h3>
            <p className="text-sm text-gray-600">Blood Donations</p>
          </div>

          {/* Tree Tagging Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                <TreePine className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              {stats?.treeTaggingCount || 0}
            </h3>
            <p className="text-sm text-gray-600">Tree Tagging</p>
          </div>

          {/* Pending Submissions Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              {stats?.pendingSubmissions || 0}
            </h3>
            <p className="text-sm text-gray-600">Pending Review</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Recent Activities Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-nss-600" />
                  Recent Activities
                </h2>
                <button
                  onClick={() => navigate('/dashboard/student/profile')}
                  className="text-sm text-nss-600 hover:text-nss-700 flex items-center gap-1"
                >
                  View All <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {recentActivities.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No activities submitted yet</p>
                  <FilledButton
                    variant="primary"
                    onClick={() => navigate('/dashboard/student/submit')}
                    className="flex items-center gap-2 mx-auto"
                  >
                    <Plus className="h-4 w-4" />
                    Submit Activity
                  </FilledButton>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'blood-donation' 
                          ? 'bg-red-100' 
                          : 'bg-green-100'
                      }`}>
                        {activity.type === 'blood-donation' ? (
                          <Heart className="h-5 w-5 text-red-600" />
                        ) : (
                          <TreePine className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {activity.title}
                          </h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                            {getStatusIcon(activity.status)}
                            {activity.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(activity.date)}
                          </span>
                          {activity.location && (
                            <span className="truncate">{activity.location}</span>
                          )}
                          {activity.count && (
                            <span className="font-medium">{activity.count} trees</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Activity Summary */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/dashboard/student/submit')}
                  className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-nss-500 to-nss-600 text-white rounded-lg hover:from-nss-600 hover:to-nss-700 transition-all"
                >
                  <Plus className="h-5 w-5" />
                  <span className="font-medium">Submit Activity</span>
                </button>
                <button
                  onClick={() => navigate('/dashboard/student/profile')}
                  className="w-full flex items-center gap-3 p-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <UserCheck className="h-5 w-5" />
                  <span className="font-medium">View Profile</span>
                </button>
                {!stats?.isRegistered && (
                  <button
                    onClick={() => navigate('/dashboard/student/register')}
                    className="w-full flex items-center gap-3 p-4 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <Award className="h-5 w-5" />
                    <span className="font-medium">Register as Volunteer</span>
                  </button>
                )}
              </div>
            </div>

            {/* Activity Summary Card */}
            {activitySummary && (stats?.totalActivities || 0) > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Activity Summary</h2>
                <div className="space-y-4">
                  {/* Blood Donation Summary */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-600" />
                        Blood Donation
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {activitySummary.bloodDonation.total}
                      </span>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                        ✓ {activitySummary.bloodDonation.approved}
                      </span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                        ⏳ {activitySummary.bloodDonation.pending}
                      </span>
                      {activitySummary.bloodDonation.rejected > 0 && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
                          ✗ {activitySummary.bloodDonation.rejected}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tree Tagging Summary */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <TreePine className="h-4 w-4 text-green-600" />
                        Tree Tagging
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {activitySummary.treeTagging.total}
                      </span>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                        ✓ {activitySummary.treeTagging.approved}
                      </span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                        ⏳ {activitySummary.treeTagging.pending}
                      </span>
                      {activitySummary.treeTagging.rejected > 0 && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
                          ✗ {activitySummary.treeTagging.rejected}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Volunteer Info Card */}
            {stats?.isRegistered && (
              <div className="bg-gradient-to-br from-nss-50 to-nss-100 rounded-2xl shadow-lg border border-nss-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Volunteer Info</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Unit Number</span>
                    <span className="font-semibold text-gray-900">{stats.unitNumber || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Semester</span>
                    <span className="font-semibold text-gray-900">{stats.semester || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Registered On</span>
                    <span className="font-semibold text-gray-900">
                      {stats.registrationDate ? formatDate(stats.registrationDate) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-3 border-t border-nss-200">
                    <span className="text-gray-600">Status</span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(stats.volunteerStatus)}`}>
                      {getStatusIcon(stats.volunteerStatus)}
                      {stats.volunteerStatus?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
}