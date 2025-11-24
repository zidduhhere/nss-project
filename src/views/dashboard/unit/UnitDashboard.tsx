import DashboardNavigation from '../../../components/common/DashboardNavigation';
import { UnitInfoCard, DashboardHeader } from '../../../components/common';
import { useUnitProfile } from '@/hooks/useUnitProfile';
import { UseAuthContext } from '@/context/AuthContext';
import { Users, UserCheck, UserX, Clock, Building, TrendingUp, Calendar, Plus, BookOpen, Trash2, X } from 'lucide-react';
import { Footer } from '@/components/ui/Footer';
import { useState } from 'react';
import { FilledButton, TextField } from '@/components/ui';

interface UnitDashboardProps {
    user?: { name?: string; role?: string } | null;
}

export default function UnitDashboard({ }: UnitDashboardProps) {
    const { session } = UseAuthContext();
    const unitId = session?.user?.id
    
    const { profile, stats, isLoading, courses, isLoadingCourses, addCourse, deleteCourse } = useUnitProfile(unitId || '');
    
    // Course management state
    const [showAddCourseModal, setShowAddCourseModal] = useState(false);
    const [newCourseName, setNewCourseName] = useState('');
    const [newCourseCode, setNewCourseCode] = useState('');
    const [courseError, setCourseError] = useState<string | null>(null);

    const handleAddCourse = async () => {
        if (!newCourseName.trim() || !newCourseCode.trim()) {
            setCourseError('Please enter both course name and code');
            return;
        }

        try {
            setCourseError(null);
            await addCourse({ name: newCourseName.trim(), code: newCourseCode.trim() });
            setNewCourseName('');
            setNewCourseCode('');
            setShowAddCourseModal(false);
        } catch (err: any) {
            setCourseError(err.message || 'Failed to add course');
        }
    };

    const handleDeleteCourse = async (courseId: string, courseName: string) => {
        if (confirm(`Are you sure you want to delete "${courseName}"?`)) {
            try {
                await deleteCourse(courseId);
            } catch (err: any) {
                alert(`Failed to delete course: ${err.message}`);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-nss-50 font-isans">
            <DashboardNavigation mode="unit" />
            <div className="space-y-6 px-4 sm:px-6 pb-6">
                
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-start justify-between gap-6">
                    <DashboardHeader
                        title="Unit Dashboard"
                        subtitle={isLoading ? 'Loading...' : `Welcome, ${profile?.po_name || 'Coordinator'}`}
                        icon={Building}
                        badges={profile ? [
                            { icon: Building, text: profile.unit_number || 'N/A' },
                            { icon: Building, text: profile.college_name || 'N/A' }
                        ] : undefined}
                    />

                    {/* Unit Info Card */}
                    <UnitInfoCard className="w-full lg:w-80 flex-shrink-0" />
                </div>

                {/* Statistics Cards */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 animate-pulse">
                                <div className="h-12 w-12 bg-gray-200 rounded-xl mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                <div className="h-8 bg-gray-200 rounded w-16"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                        {/* Total Volunteers */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-nss-500 to-nss-700 rounded-xl flex items-center justify-center">
                                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total</p>
                                </div>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{stats?.totalVolunteers || 0}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">Volunteers</p>
                        </div>

                        {/* Approved Volunteers */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center">
                                    <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Approved</p>
                                </div>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-tree-700 mb-1">{stats?.approvedVolunteers || 0}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">By Unit</p>
                        </div>

                        {/* Certified Volunteers */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                                    <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Certified</p>
                                </div>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-1">{stats?.certifiedVolunteers || 0}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">By Admin</p>
                        </div>

                        {/* Pending Approvals */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-xl flex items-center justify-center">
                                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pending</p>
                                </div>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-nss-700 mb-1">{stats?.pendingApprovals || 0}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">Awaiting Review</p>
                        </div>

                        {/* Rejected Applications */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center">
                                    <UserX className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Rejected</p>
                                </div>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-blood-700 mb-1">{stats?.rejectedVolunteers || 0}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">Applications</p>
                        </div>
                    </div>
                )}

                {/* Additional Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Quick Stats */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-nss-600" />
                            Quick Stats
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-nss-50 rounded-xl">
                                <span className="text-sm font-medium text-gray-700">Approval Rate</span>
                                <span className="text-lg font-bold text-nss-700">
                                    {stats?.totalVolunteers 
                                        ? Math.round((stats.approvedVolunteers / stats.totalVolunteers) * 100) 
                                        : 0}%
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-nss-50 rounded-xl">
                                <span className="text-sm font-medium text-gray-700">Pending Review</span>
                                <span className="text-lg font-bold text-nss-700">
                                    {stats?.pendingApprovals || 0}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-tree-50 rounded-xl">
                                <span className="text-sm font-medium text-gray-700">Active Members</span>
                                <span className="text-lg font-bold text-tree-700">
                                    {stats?.certifiedVolunteers || 0}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Unit Information */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Building className="h-5 w-5 text-nss-600" />
                            Unit Information
                        </h3>
                        {isLoading ? (
                            <div className="space-y-3 animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Unit Number</p>
                                    <p className="text-sm font-semibold text-gray-900">{profile?.unit_number || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">College</p>
                                    <p className="text-sm font-semibold text-gray-900">{profile?.college_name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">District</p>
                                    <p className="text-sm font-semibold text-gray-900">{profile?.college_district || 'N/A'}</p>
                                </div>
                                {stats?.establishedYear && (
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Established</p>
                                        <p className="text-sm font-semibold text-gray-900">{stats.establishedYear}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Recent Activity Placeholder */}
                    <div className="bg-gradient-to-br from-nss-500 to-nss-700 rounded-2xl shadow-lg p-4 sm:p-6 text-white">
                        <h3 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Recent Activity
                        </h3>
                        <div className="space-y-3">
                            <p className="text-sm text-nss-100">
                                Track your unit's latest activities and volunteer registrations.
                            </p>
                            <div className="pt-4 border-t border-white/20">
                                <p className="text-xs text-nss-200 mb-2">Last 7 Days</p>
                                <p className="text-2xl font-bold">{stats?.pendingApprovals || 0}</p>
                                <p className="text-sm text-nss-100">New Applications</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* College Courses Management Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-6 w-6 text-nss-600" />
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">College Courses</h3>
                                <p className="text-sm text-gray-600">Manage courses offered at your college</p>
                            </div>
                        </div>
                        <FilledButton
                            variant="primary"
                            onClick={() => setShowAddCourseModal(true)}
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add Course
                        </FilledButton>
                    </div>

                    {isLoadingCourses ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-gray-50 rounded-xl p-4 animate-pulse">
                                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : courses.length === 0 ? (
                        <div className="text-center py-12">
                            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600 mb-4">No courses added yet</p>
                            <FilledButton
                                variant="lightNss"
                                onClick={() => setShowAddCourseModal(true)}
                                className="flex items-center gap-2 mx-auto"
                            >
                                <Plus className="h-4 w-4" />
                                Add Your First Course
                            </FilledButton>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {courses.map((course) => (
                                <div
                                    key={course.id}
                                    className="bg-gradient-to-br from-nss-50 to-nss-100 rounded-xl p-4 border border-nss-200 hover:shadow-md transition-shadow relative group"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-gray-900 text-sm pr-8">{course.name}</h4>
                                        <button
                                            onClick={() => handleDeleteCourse(course.id, course.name)}
                                            className="absolute top-3 right-3 p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Delete course"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-600 font-mono bg-white/50 px-2 py-1 rounded inline-block">
                                        {course.code}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Course Modal */}
            {showAddCourseModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Add New Course</h3>
                            <button
                                onClick={() => {
                                    setShowAddCourseModal(false);
                                    setCourseError(null);
                                    setNewCourseName('');
                                    setNewCourseCode('');
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {courseError && (
                            <div className="mb-4 bg-blood-50 border border-blood-200 text-blood-700 px-4 py-3 rounded-lg text-sm">
                                {courseError}
                            </div>
                        )}

                        <div className="space-y-4">
                            <TextField
                                label="Course Name"
                                placeholder="e.g., Computer Science Engineering"
                                value={newCourseName}
                                onChange={(e) => setNewCourseName(e.target.value)}
                                required
                            />
                            <TextField
                                label="Course Code"
                                placeholder="e.g., CSE or B.Tech CSE"
                                value={newCourseCode}
                                onChange={(e) => setNewCourseCode(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex gap-3 mt-6">
                            <FilledButton
                                variant="lightNss"
                                onClick={() => {
                                    setShowAddCourseModal(false);
                                    setCourseError(null);
                                    setNewCourseName('');
                                    setNewCourseCode('');
                                }}
                                className="flex-1"
                            >
                                Cancel
                            </FilledButton>
                            <FilledButton
                                variant="primary"
                                onClick={handleAddCourse}
                                isLoading={isLoadingCourses}
                                className="flex-1"
                            >
                                Add Course
                            </FilledButton>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-16">
                <Footer />
            </div>
        </div>
    );
}
