import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Loader2,
  AlertCircle,
  Users,
  GraduationCap,
  Building2,
  UserCheck,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import DashboardNavigation from '@/components/common/DashboardNavigation';
import Footer from '@/components/ui/Footer';
import { Table } from '@/components/ui';
import SuccessModal from '@/components/common/SuccessModal';
import ErrorPop from '@/components/common/ErrorPop';
import { useAdminUserManagement } from '@/hooks/useAdminService';
import { useUserRoleManagement } from '@/hooks/useAdminService';
import { UserWithDetails } from '@/types/UserWithDetails';
import { AdminUsersHandlers } from '@/handlers/adminUsersHandlers';
import { adminService } from '@/services/adminService';

const AdminUsers = () => {
  // User management hook
  const {
    users,
    stats,
    isLoading,
    error,
    successMessage,
    updateFilters,
    clearFilters,
    clearMessages,
    refetch,
  } = useAdminUserManagement();

  // User role management hook
  const {
    promoteStudent,
    demoteUnit,
    isUpdating,
    updateError,
    successMessage: roleUpdateMessage,
    resetUpdateState,
  } = useUserRoleManagement();

  // Local UI state
  const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter options state
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'unit'>('all');
  const [districtFilter, setDistrictFilter] = useState('all');

  // Unique districts for filter
  const [uniqueDistricts, setUniqueDistricts] = useState<string[]>([]);

  // Fetch unique districts on mount
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const districts = await adminService.getUniqueDistricts();
        setUniqueDistricts(districts);
      } catch (err) {
        console.error('Error fetching districts:', err);
      }
    };
    fetchDistricts();
  }, []);

  // Apply filters with debounce for search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const filterParams: any = {};

      if (searchQuery) filterParams.search = searchQuery;
      if (roleFilter !== 'all') filterParams.role = roleFilter;
      if (districtFilter !== 'all') filterParams.district = districtFilter;

      updateFilters(filterParams);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, roleFilter, districtFilter, updateFilters]);

  // Auto-hide success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => clearMessages(), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, clearMessages]);

  // Handle role update success
  useEffect(() => {
    if (roleUpdateMessage) {
      const timer = setTimeout(() => {
        resetUpdateState();
        refetch();
        setIsDetailsOpen(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [roleUpdateMessage, resetUpdateState, refetch]);

  // Initialize handlers class
  const handlers = useMemo(
    () =>
      new AdminUsersHandlers(
        {
          setSelectedUser,
          setIsDetailsOpen,
          setIsRefreshing,
          setSearchQuery,
          setRoleFilter,
          setDistrictFilter,
        },
        {
          refetch,
          clearFilters,
        }
      ),
    [refetch, clearFilters]
  );

  // Table columns configuration
  const columns = [
    {
      key: 'email' as keyof UserWithDetails,
      header: 'Email',
      width: '18%',
      render: (value: string) => (
        <div className="font-medium text-gray-900">{value}</div>
      ),
    },
    {
      key: 'full_name' as keyof UserWithDetails,
      header: 'Name',
      width: '15%',
      render: (value: string | null) => (
        <div className="text-gray-700">{value || 'N/A'}</div>
      ),
    },
    {
      key: 'role' as keyof UserWithDetails,
      header: 'Role',
      width: '10%',
      render: (value: 'student' | 'unit') => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value === 'student'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-purple-100 text-purple-800'
          }`}
        >
          {value === 'student' ? 'Student' : 'Unit'}
        </span>
      ),
    },
    {
      key: 'unit_number' as keyof UserWithDetails,
      header: 'Unit',
      width: '8%',
      render: (value: string | null) => (
        <div className="text-gray-700">{value || 'N/A'}</div>
      ),
    },
    {
      key: 'college_name' as keyof UserWithDetails,
      header: 'College',
      width: '20%',
      render: (value: string | null) => (
        <div className="text-gray-700 text-sm max-w-xs truncate" title={value || ''}>
          {value || 'N/A'}
        </div>
      ),
    },
    {
      key: 'district' as keyof UserWithDetails,
      header: 'District',
      width: '12%',
      render: (value: string | null) => (
        <div className="text-gray-700">{value || 'N/A'}</div>
      ),
    },
    {
      key: 'volunteer_applications' as keyof UserWithDetails,
      header: 'Apps',
      width: '8%',
      render: (value: number | undefined) => (
        <div className="text-center">
          <span
            className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              (value || 0) > 0
                ? 'bg-tree-100 text-tree-800'
                : 'bg-white text-black border border-gray-300'
            }`}
          >
            {value || 0}
          </span>
        </div>
      ),
    },
    {
      key: 'created_at' as keyof UserWithDetails,
      header: 'Created',
      width: '10%',
      render: (value: string) => (
        <div className="text-gray-600 text-sm">
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'id' as keyof UserWithDetails,
      header: 'Actions',
      width: '10%',
      render: (_value: string, user: UserWithDetails) => (
        <button
          onClick={() => handlers.handleViewUser(user)}
          className="text-primary-600 hover:text-primary-800 font-medium text-sm"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="font-isans min-h-screen bg-gray-50">
      <DashboardNavigation mode="admin" />

      {/* Success Modal */}
      {successMessage && <SuccessModal title="Success" message={successMessage} />}

      {/* Role Update Success Message */}
      {roleUpdateMessage && <SuccessModal title="Success" message={roleUpdateMessage} />}

      {/* Error Alert */}
      {error && <ErrorPop error={error} onCloseClick={clearMessages} />}

      {/* Role Update Error */}
      {updateError && <ErrorPop error={updateError} onCloseClick={resetUpdateState} />}

      {/* User Details Modal */}
      {isDetailsOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                <button
                  onClick={handlers.handleCloseDetails}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="mt-1 text-gray-900">{selectedUser.full_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Role</label>
                    <p className="mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedUser.role === 'student'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-nss-100 text-nss-800'
                        }`}
                      >
                        {selectedUser.role === 'student' ? 'Student' : 'Unit'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone Number</label>
                    <p className="mt-1 text-gray-900">{selectedUser.phone_number || 'N/A'}</p>
                  </div>
                  {selectedUser.role === 'unit' && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Unit Number</label>
                        <p className="mt-1 text-gray-900">{selectedUser.unit_number || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">District</label>
                        <p className="mt-1 text-gray-900">{selectedUser.district || 'N/A'}</p>
                      </div>
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-gray-500">College Name</label>
                        <p className="mt-1 text-gray-900">{selectedUser.college_name || 'N/A'}</p>
                      </div>
                    </>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Volunteer Applications</label>
                    <p className="mt-1 text-gray-900">{selectedUser.volunteer_applications || 0}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created At</label>
                    <p className="mt-1 text-gray-900">
                      {new Date(selectedUser.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
                  {selectedUser.role === 'student' && (
                    <button
                      onClick={async () => {
                        try {
                          await promoteStudent(selectedUser.id);
                        } catch (err) {
                          console.error('Promotion failed:', err);
                        }
                      }}
                      disabled={isUpdating}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
                    >
                      {isUpdating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ArrowUp className="w-4 h-4" />
                      )}
                      <span>Promote to Unit</span>
                    </button>
                  )}

                  {selectedUser.role === 'unit' && (
                    <button
                      onClick={async () => {
                        try {
                          await demoteUnit(selectedUser.id);
                        } catch (err) {
                          console.error('Demotion failed:', err);
                        }
                      }}
                      disabled={isUpdating}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 font-medium"
                    >
                      {isUpdating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ArrowDown className="w-4 h-4" />
                      )}
                      <span>Demote to Student</span>
                    </button>
                  )}

                  <button
                    onClick={handlers.handleCloseDetails}
                    disabled={isUpdating}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-2">View and manage all students and units</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlers.handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 shadow-sm"
              >
                <RefreshCw className={`w-4 h-4 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium text-gray-700">Refresh</span>
              </button>
              <button
                onClick={() => handlers.handleExportUsers(users)}
                disabled={users.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export CSV</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Students</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalStudents}</p>
                </div>
                <GraduationCap className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Units</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalUnits}</p>
                </div>
                <Building2 className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">With Applications</p>
                  <p className="text-2xl font-bold text-green-600">{stats.studentsWithApplications}</p>
                </div>
                <UserCheck className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          {/* Filter Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by email, name, unit, college, or district..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Filter Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </span>
                </button>
                {(roleFilter !== 'all' || districtFilter !== 'all' || searchQuery) && (
                  <button
                    onClick={handlers.handleResetFilters}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Role Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as 'all' | 'student' | 'unit')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Roles</option>
                    <option value="student">Students Only</option>
                    <option value="unit">Units Only</option>
                  </select>
                </div>

                {/* District Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                  <select
                    value={districtFilter}
                    onChange={(e) => setDistrictFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Districts</option>
                    {uniqueDistricts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">No users found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table columns={columns} data={users} />
            </div>
          )}
        </div>

        {/* Results Summary */}
        {!isLoading && users.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 text-center">
            Showing {users.length} user{users.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
};

export default AdminUsers;
