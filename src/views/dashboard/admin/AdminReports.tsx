import { useState } from 'react';
import {
  FileText,
  TrendingUp,
  Users,
  Droplets,
  TreePine,
  Building2,
  Download,
  RefreshCw,
  Loader2,
  Filter,
  Calendar,
} from 'lucide-react';
import DashboardNavigation from '@/components/common/DashboardNavigation';
import { DashboardHeader } from '@/components/common';
import { Footer, StatCard, FilledButton, OutlinedButton } from '@/components/ui';
import { useReportStats, useActivityReport, useUnitReport, useMonthlyTrends } from '@/hooks/useReportService';
import ErrorPop from '@/components/common/ErrorPop';

const AdminReports = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activityFilter, setActivityFilter] = useState<'all' | 'blood_donation' | 'tree_tagging'>('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch data
  const { stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useReportStats();
  const { activities, isLoading: activitiesLoading, error: activitiesError, refetch: refetchActivities } = useActivityReport({
    activityType: activityFilter,
    status: statusFilter === 'all' ? undefined : statusFilter,
  });
  const { units, isLoading: unitsLoading, error: unitsError, refetch: refetchUnits } = useUnitReport();
  const { trends, isLoading: trendsLoading, error: trendsError, refetch: refetchTrends } = useMonthlyTrends();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchStats(), refetchActivities(), refetchUnits(), refetchTrends()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportCSV = () => {
    if (!activities.length) return;

    const headers = ['Volunteer Name', 'Activity Type', 'Submission Date', 'Status', 'Unit'];
    const rows = activities.map(activity => [
      activity.volunteer_name,
      activity.activity_type === 'blood_donation' ? 'Blood Donation' : 'Tree Plantation',
      new Date(activity.submission_date).toLocaleDateString(),
      activity.status,
      activity.unit_number || 'N/A',
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nss-activities-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (statsLoading && !stats) {
    return (
      <div className="font-isans min-h-screen bg-gray-50">
        <DashboardNavigation mode="admin" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center h-96">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
            <p className="text-gray-600 text-lg">Loading reports...</p>
          </div>
        </div>
      </div>
    );
  }

  const allErrors = [statsError, activitiesError, unitsError, trendsError].filter(Boolean);

  return (
    <div className="font-isans min-h-screen bg-gray-50">
      <DashboardNavigation mode="admin" />

      {allErrors.length > 0 && (
        <ErrorPop
          error={allErrors[0]!}
          onCloseClick={() => {}}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <DashboardHeader
            title="Reports & Analytics"
            subtitle="Comprehensive insights and data exports"
            icon={FileText}
          />
          <div className="flex gap-2">
            <OutlinedButton
              onClick={handleRefresh}
              disabled={isRefreshing}
              size="md"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </OutlinedButton>
            <FilledButton
              onClick={handleExportCSV}
              variant="primary"
              size="md"
              disabled={!activities.length}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </FilledButton>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            titleStat={String(stats?.totalVolunteers || 0)}
            subtitle="Total Volunteers"
            description={`${stats?.certifiedVolunteers || 0} certified`}
            icon={Users}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100"
          />
          <StatCard
            titleStat={String(stats?.totalBloodDonations || 0)}
            subtitle="Blood Donations"
            description={`${stats?.approvedSubmissions || 0} approved`}
            icon={Droplets}
            iconColor="text-blood-600"
            iconBgColor="bg-blood-100"
          />
          <StatCard
            titleStat={String(stats?.totalTreePlantations || 0)}
            subtitle="Tree Plantations"
            description={`${stats?.pendingSubmissions || 0} pending`}
            icon={TreePine}
            iconColor="text-tree-600"
            iconBgColor="bg-tree-100"
          />
          <StatCard
            titleStat={String(stats?.activeUnits || 0)}
            subtitle="Active Units"
            description="Participating"
            icon={Building2}
            iconColor="text-blue-600"
            iconBgColor="bg-purple-100"
          />
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            Monthly Trends (Last 6 Months)
          </h3>
          {trendsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
          ) : trends.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Month</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Blood Donations</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Tree Plantations</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">New Volunteers</th>
                  </tr>
                </thead>
                <tbody>
                  {trends.map((trend, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{trend.month}</td>
                      <td className="py-3 px-4 text-sm text-gray-900 text-right">{trend.blood_donations}</td>
                      <td className="py-3 px-4 text-sm text-gray-900 text-right">{trend.tree_plantations}</td>
                      <td className="py-3 px-4 text-sm text-gray-900 text-right">{trend.new_volunteers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No trend data available</p>
          )}
        </div>

        {/* Unit Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary-600" />
            Unit Performance
          </h3>
          {unitsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
          ) : units.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Unit</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Certified</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Approved</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Blood</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Trees</th>
                  </tr>
                </thead>
                <tbody>
                  {units.map((unit, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{unit.unit_number}</td>
                      <td className="py-3 px-4 text-sm text-gray-900 text-right">{unit.total_volunteers}</td>
                      <td className="py-3 px-4 text-sm text-blue-600 text-right font-medium">{unit.certified_volunteers}</td>
                      <td className="py-3 px-4 text-sm text-tree-600 text-right font-medium">{unit.approved_volunteers}</td>
                      <td className="py-3 px-4 text-sm text-blood-600 text-right font-medium">{unit.blood_donations}</td>
                      <td className="py-3 px-4 text-sm text-tree-600 text-right font-medium">{unit.tree_plantations}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No unit data available</p>
          )}
        </div>

        {/* Activity Report */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-600" />
              Activity Report
            </h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Activity Type</label>
                <select
                  value={activityFilter}
                  onChange={(e) => setActivityFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Activities</option>
                  <option value="blood_donation">Blood Donation</option>
                  <option value="tree_tagging">Tree Plantation</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          )}

          {/* Activities Table */}
          {activitiesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
          ) : activities.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Volunteer</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Activity</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Unit</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.slice(0, 50).map((activity) => (
                    <tr key={activity.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{activity.volunteer_name}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          activity.activity_type === 'blood_donation' 
                            ? 'bg-blood-50 text-blood-700' 
                            : 'bg-tree-50 text-tree-700'
                        }`}>
                          {activity.activity_type === 'blood_donation' ? (
                            <><Droplets className="w-3 h-3" /> Blood Donation</>
                          ) : (
                            <><TreePine className="w-3 h-3" /> Tree Plantation</>
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(activity.submission_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{activity.unit_number || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          activity.status === 'approved' ? 'bg-tree-100 text-tree-800' :
                          activity.status === 'pending' ? 'bg-nss-100 text-nss-800' :
                          'bg-blood-100 text-blood-800'
                        }`}>
                          {activity.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {activities.length > 50 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Showing 50 of {activities.length} activities. Export to CSV for full report.
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No activities found</p>
          )}
        </div>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
};

export default AdminReports;
