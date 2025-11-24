import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Loader2,
  AlertCircle,
  Users,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import DashboardNavigation from '@/components/common/DashboardNavigation';
import Footer from '@/components/ui/Footer';
import { Table } from '@/components/ui';
import { VolunteerDetailsOverlay } from '@/components/common';
import SuccessModal from '@/components/common/SuccessModal';
import ErrorPop from '@/components/common/ErrorPop';
import { useAdminVolunteerManagement } from '@/hooks/useAdminService';
import { VolunteerProfile } from '@/types/VolunteerProfile';
import { getVolunteerColumns } from '@/structures/tables';
import { adminService } from '@/services/adminService';
import { bloodGroups } from '@/utils/data/community';
import { AdminVolunteerHandlers } from '@/handlers/adminVolunteerHandlers';

const AdminVolunteers = () => {
  // Volunteer management hook
  const {
    volunteers,
    isLoading,
    error,
    successMessage,
    updateFilters,
    clearFilters,
    clearMessages,
    refetch,
  } = useAdminVolunteerManagement();

  // Local UI state
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerProfile | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [certifyingId, setCertifyingId] = useState<string | null>(null);
  const [certifyError, setCertifyError] = useState<string | null>(null);
  const [certifySuccess, setCertifySuccess] = useState<string | null>(null);
  const [uncertifyingId, setUncertifyingId] = useState<string | null>(null);
  const [uncertifyError, setUncertifyError] = useState<string | null>(null);
  const [uncertifySuccess, setUncertifySuccess] = useState<string | null>(null);

  // Filter options state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [unitFilter, setUnitFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Unique values for filters
  const [uniqueUnits, setUniqueUnits] = useState<string[]>([]);
  const uniqueCourses = Array.from(
    new Set(volunteers.map((v) => v.course).filter(Boolean))
  ) as string[];
  const uniqueSemesters = Array.from(
    new Set(volunteers.map((v) => v.semester).filter(Boolean))
  ).sort() as number[];

  // Fetch unique units on mount
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const units = await adminService.getUniqueUnits();
        setUniqueUnits(units);
      } catch (err) {
        console.error('Error fetching units:', err);
      }
    };
    fetchUnits();
  }, []);

  // Apply filters with debounce for search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const filterParams: any = {};

      if (searchQuery) filterParams.search = searchQuery;
      if (statusFilter !== 'all') filterParams.status = statusFilter;
      if (unitFilter !== 'all') filterParams.unit_id = unitFilter;
      if (courseFilter !== 'all') filterParams.course = courseFilter;
      if (semesterFilter) filterParams.semester = parseInt(semesterFilter);
      if (bloodGroupFilter !== 'all') filterParams.blood_group = bloodGroupFilter;
      if (activeFilter === 'active') filterParams.isActive = true;
      if (activeFilter === 'inactive') filterParams.isActive = false;

      updateFilters(filterParams);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [
    searchQuery,
    statusFilter,
    unitFilter,
    courseFilter,
    semesterFilter,
    bloodGroupFilter,
    activeFilter,
    updateFilters,
  ]);

  // Auto-hide success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => clearMessages(), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, clearMessages]);

  // Initialize handlers class
  const handlers = useMemo(
    () =>
      new AdminVolunteerHandlers(
        {
          setSelectedVolunteer,
          setIsOverlayOpen,
          setIsRefreshing,
          setSearchQuery,
          setStatusFilter,
          setUnitFilter,
          setCourseFilter,
          setSemesterFilter,
          setBloodGroupFilter,
          setActiveFilter,
        },
        {
          refetch,
          clearFilters,
        }
      ),
    [refetch, clearFilters]
  );

  // Handler for certifying a volunteer
  const handleCertifyVolunteer = async (volunteer: VolunteerProfile) => {
    if (!confirm(`Are you sure you want to certify ${volunteer.full_name}?\n\nThis will upgrade their status from "approved" to "certified".`)) {
      return;
    }

    setCertifyingId(volunteer.id);
    setCertifyError(null);
    setCertifySuccess(null);

    try {
      const certified = await adminService.certifyVolunteer(volunteer.id);
      setCertifySuccess(`${certified.full_name} has been successfully certified!`);
      await refetch(); // Refresh the volunteer list
      
      // Close overlay if open
      if (isOverlayOpen) {
        handlers.handleCloseOverlay();
      }
      
      // Auto-hide success message
      setTimeout(() => setCertifySuccess(null), 3000);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to certify volunteer';
      setCertifyError(errorMessage);
      console.error('Certification error:', error);
      
      // Auto-hide error message after 5 seconds
      setTimeout(() => setCertifyError(null), 5000);
    } finally {
      setCertifyingId(null);
    }
  };

  // Handler for undoing certification
  const handleUncertifyVolunteer = async (volunteer: VolunteerProfile) => {
    if (!confirm(`Are you sure you want to undo certification for ${volunteer.full_name}?\n\nThis will revert their status from "certified" back to "approved".`)) {
      return;
    }

    setUncertifyingId(volunteer.id);
    setUncertifyError(null);
    setUncertifySuccess(null);

    try {
      const uncertified = await adminService.uncertifyVolunteer(volunteer.id);
      setUncertifySuccess(`${uncertified.full_name} certification has been reverted to approved.`);
      await refetch(); // Refresh the volunteer list
      
      // Close overlay if open
      if (isOverlayOpen) {
        handlers.handleCloseOverlay();
      }
      
      // Auto-hide success message
      setTimeout(() => setUncertifySuccess(null), 3000);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to undo certification';
      setUncertifyError(errorMessage);
      console.error('Uncertification error:', error);
      
      // Auto-hide error message after 5 seconds
      setTimeout(() => setUncertifyError(null), 5000);
    } finally {
      setUncertifyingId(null);
    }
  };

  // Stats for quick overview
  const stats = {
    total: volunteers.length,
    certified: volunteers.filter((v) => v.status === 'certified').length,
    approved: volunteers.filter((v) => v.status === 'approved').length,
    pending: volunteers.filter((v) => v.status === 'pending').length,
    rejected: volunteers.filter((v) => v.status === 'rejected').length,
  };

  return (
    <div className="font-isans min-h-screen bg-gray-50">
      <DashboardNavigation mode="admin" />

      {/* Success Modal */}
      {successMessage && <SuccessModal title="Success" message={successMessage} />}
      {certifySuccess && <SuccessModal title="Volunteer Certified" message={certifySuccess} />}
      {uncertifySuccess && <SuccessModal title="Certification Reverted" message={uncertifySuccess} />}

      {/* Error Alert */}
      {error && <ErrorPop error={error} onCloseClick={clearMessages} />}
      {certifyError && (
        <ErrorPop 
          error={certifyError} 
          onCloseClick={() => setCertifyError(null)} 
        />
      )}
      {uncertifyError && (
        <ErrorPop 
          error={uncertifyError} 
          onCloseClick={() => setUncertifyError(null)} 
        />
      )}

      {/* Volunteer Details Overlay */}
      {isOverlayOpen && selectedVolunteer && (
        <VolunteerDetailsOverlay 
          volunteer={selectedVolunteer} 
          onClose={handlers.handleCloseOverlay}
          isOpen={isOverlayOpen}
          userRole="admin"
          onCertifyVolunteer={handleCertifyVolunteer}
          isCertifying={certifyingId === selectedVolunteer?.id}
          onUncertifyVolunteer={handleUncertifyVolunteer}
          isUncertifying={uncertifyingId === selectedVolunteer?.id}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Info Banner for Certification */}
        {stats.approved > 0 && (
          <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 text-sm">Volunteer Certification Available</h3>
                <p className="text-blue-800 text-sm mt-1">
                  You have <span className="font-bold">{stats.approved}</span> approved volunteer(s) ready for certification. 
                  Click "View" to open volunteer details and certify them.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Volunteer Management</h1>
              <p className="text-gray-600 mt-2">View and manage all volunteers across units</p>
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
              <div className="relative group">
                <button
                  onClick={() => handlers.handleExport(volunteers)}
                  disabled={volunteers.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">Export</span>
                </button>
                {/* Export dropdown on hover */}
                <div className="hidden group-hover:block absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <button
                    onClick={() => handlers.handleExport(volunteers)}
                    disabled={volunteers.length === 0}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg disabled:opacity-50"
                  >
                    Export CSV
                  </button>
                  <button
                    onClick={() => handlers.handleExportWithStats(volunteers)}
                    disabled={volunteers.length === 0}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg disabled:opacity-50"
                  >
                    Export with Stats
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4 bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Certified</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.certified}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
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
                  placeholder="Search by name, KTU ID, email, or phone..."
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
                {(statusFilter !== 'all' ||
                  unitFilter !== 'all' ||
                  courseFilter !== 'all' ||
                  semesterFilter ||
                  bloodGroupFilter !== 'all' ||
                  activeFilter !== 'all' ||
                  searchQuery) && (
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="certified">Certified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Active Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Active Status
                  </label>
                  <select
                    value={activeFilter}
                    onChange={(e) => setActiveFilter(e.target.value as 'all' | 'active' | 'inactive')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Volunteers</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>
                </div>

                {/* Unit Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                  <select
                    value={unitFilter}
                    onChange={(e) => setUnitFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Units</option>
                    {uniqueUnits.map((unit) => (
                      <option key={unit} value={unit}>
                        Unit {unit}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Course Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                  <select
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Courses</option>
                    {uniqueCourses.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Semester Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                  <select
                    value={semesterFilter}
                    onChange={(e) => setSemesterFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Semesters</option>
                    {uniqueSemesters.map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Blood Group Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Group
                  </label>
                  <select
                    value={bloodGroupFilter}
                    onChange={(e) => setBloodGroupFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Blood Groups</option>
                    {bloodGroups.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Volunteers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading volunteers...</p>
            </div>
          ) : volunteers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">No volunteers found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table
                columns={getVolunteerColumns(handlers.handleViewVolunteer)}
                data={volunteers}
              />
            </div>
          )}
        </div>

        {/* Results Summary */}
        {!isLoading && volunteers.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 text-center">
            Showing {volunteers.length} volunteer{volunteers.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
};

export default AdminVolunteers;
