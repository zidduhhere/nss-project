import DashboardNavigation from '../../../components/common/DashboardNavigation';
import { UnitInfoCard } from '../../../components/common';
import { useUnitProfile } from '@/hooks/useUnitProfile';
import { UseAuthContext } from '@/context/AuthContext';
import { Users, UserCheck, UserX, Clock, Building, TrendingUp, Calendar } from 'lucide-react';
import { Footer } from '@/components/ui/Footer';

interface UnitDashboardProps {
    user?: { name?: string; role?: string } | null;
}

export default function UnitDashboard({ }: UnitDashboardProps) {
    const { session } = UseAuthContext();
    const unitId = session?.user?.id
    
    const { profile, stats, isLoading } = useUnitProfile(unitId || '');

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-nss-50 font-isans">
            <DashboardNavigation mode="unit" />
            <div className="space-y-6 px-4 sm:px-6 pb-6">
                
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-start justify-between gap-6">
                    <div className="bg-nss-gradient rounded-2xl text-white p-6 sm:p-8 flex-1 shadow-xl">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Unit Dashboard</h2>
                                <p className="text-nss-100 text-base sm:text-lg">
                                    {isLoading ? 'Loading...' : `Welcome, ${profile?.po_name || 'Coordinator'}`}
                                </p>
                                {profile && (
                                    <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-nss-200">
                                        <span className="flex items-center gap-2">
                                            <Building className="h-4 w-4" />
                                            {profile.unit_number}
                                        </span>
                                        <span className="hidden sm:inline">•</span>
                                        <span className="break-words">{profile.college_name}</span>
                                    </div>
                                )}
                            </div>
                            <div className="h-16 w-16 sm:h-20 sm:w-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                                <Building className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                            </div>
                        </div>
                    </div>

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
                            <h3 className="text-2xl sm:text-3xl font-bold text-green-700 mb-1">{stats?.approvedVolunteers || 0}</h3>
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
                            <h3 className="text-2xl sm:text-3xl font-bold text-yellow-700 mb-1">{stats?.pendingApprovals || 0}</h3>
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
                            <h3 className="text-2xl sm:text-3xl font-bold text-red-700 mb-1">{stats?.rejectedVolunteers || 0}</h3>
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
                            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                                <span className="text-sm font-medium text-gray-700">Pending Review</span>
                                <span className="text-lg font-bold text-yellow-700">
                                    {stats?.pendingApprovals || 0}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                                <span className="text-sm font-medium text-gray-700">Active Members</span>
                                <span className="text-lg font-bold text-green-700">
                                    {stats?.approvedVolunteers || 0}
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
            </div>
            <div className="mt-16">
                <Footer />
            </div>
        </div>
    );
}
