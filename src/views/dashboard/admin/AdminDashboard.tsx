import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/utils/dateUtils';
import {
  Users,
  UserCheck,
  Clock,
  XCircle,
  TreePine,
  Building2,
  RefreshCw,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import DashboardNavigation from '@/components/common/DashboardNavigation';
import Footer from '@/components/ui/Footer';
import { useSystemStats, useRecentRegistrations } from '@/hooks/useAdminService';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/shadcn/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table';
import { Badge } from '@/components/shadcn/badge';
import { Skeleton } from '@/components/shadcn/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/shadcn/alert';
import { cn } from '@/lib/utils';
import { TourProvider, TourOverlay, TourHelpButton, adminTourConfig } from '@/components/tour';

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  iconBg,
  iconColor,
  onClick,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  onClick?: () => void;
}) => (
  <Card
    className={cn(
      'transition-all duration-200',
      onClick && 'cursor-pointer hover:shadow-md hover:-translate-y-0.5'
    )}
    onClick={onClick}
  >
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardDescription className="text-sm font-medium">{title}</CardDescription>
      <div className={cn('size-10 rounded-lg flex items-center justify-center', iconBg)}>
        <Icon className={cn('size-5', iconColor)} />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold tracking-tight tabular-nums">{value}</div>
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </CardContent>
  </Card>
);

const DashboardSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="mb-8">
      <Skeleton className="h-9 w-56 mb-2" />
      <Skeleton className="h-5 w-72" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-28" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-7 w-14" />
          </CardContent>
        </Card>
      ))}
    </div>
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full mb-2" />
        ))}
      </CardContent>
    </Card>
  </div>
);

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'approved':
      return 'success' as const;
    case 'rejected':
      return 'danger' as const;
    default:
      return 'warning' as const;
  }
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useSystemStats();

  const {
    registrations,
    isLoading: registrationsLoading,
    error: registrationsError,
    refetch: refetchRegistrations,
  } = useRecentRegistrations(5);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchStats(), refetchRegistrations()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (statsLoading && !stats) {
    return (
      <div className="font-isans min-h-dvh bg-gray-50">
        <DashboardNavigation mode="admin" />
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <TourProvider config={adminTourConfig}>
    <div className="font-isans min-h-dvh bg-gray-50">
      <DashboardNavigation mode="admin" />

      <div className="container mx-auto px-4 py-8">
        {/* Error Alert */}
        {statsError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="size-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{statsError}</AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 text-balance">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              System overview and management
            </p>
          </div>
          <button
            data-tour="refresh-button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={cn('size-4', isRefreshing && 'animate-spin')} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Primary Statistics */}
        <div data-tour="stat-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Volunteers"
            value={stats?.totalVolunteers || 0}
            description={stats?.recentRegistrations ? `+${stats.recentRegistrations} this week` : undefined}
            icon={Users}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            title="Pending Approvals"
            value={stats?.pendingApprovals || 0}
            icon={Clock}
            iconBg="bg-yellow-100"
            iconColor="text-yellow-600"
            onClick={() => navigate('/dashboard/admin/volunteers?status=pending')}
          />
          <StatCard
            title="Approved"
            value={stats?.approvedVolunteers || 0}
            icon={UserCheck}
            iconBg="bg-tree-100"
            iconColor="text-tree-600"
          />
          <StatCard
            title="Total Units"
            value={stats?.totalUnits || 0}
            icon={Building2}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />
        </div>

        {/* Secondary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-sm font-medium">Total Students</CardDescription>
              <div className="size-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="size-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums">{stats?.totalStudents || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-sm font-medium">Rejected</CardDescription>
              <div className="size-10 rounded-lg bg-blood-100 flex items-center justify-center">
                <XCircle className="size-5 text-blood-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums">{stats?.rejectedVolunteers || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-sm font-medium">Recent (7 days)</CardDescription>
              <div className="size-10 rounded-lg bg-tree-100 flex items-center justify-center">
                <TreePine className="size-5 text-tree-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums">{stats?.recentRegistrations || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Registrations Table */}
        <Card className="mb-8" data-tour="recent-registrations">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-balance">Recent Registrations</CardTitle>
            <button
              onClick={() => navigate('/dashboard/admin/volunteers')}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              View All
              <ChevronRight className="size-4" />
            </button>
          </CardHeader>
          <CardContent>
            {registrationsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : registrationsError ? (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertTitle>Failed to load registrations</AlertTitle>
                <AlertDescription>{registrationsError}</AlertDescription>
              </Alert>
            ) : registrations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Users className="size-10 mb-3 text-gray-300" />
                <p className="text-sm">No recent registrations</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>KTU ID</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell className="font-medium">
                        {registration.full_name}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {registration.ktu_id}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {registration.course}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(registration.status)}>
                          {registration.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {formatDate(registration.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div data-tour="quick-actions" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              label: 'Manage Volunteers',
              description: 'View and manage all volunteer registrations',
              icon: Users,
              iconBg: 'bg-blue-100 group-hover:bg-blue-200',
              iconColor: 'text-blue-600',
              path: '/dashboard/admin/volunteers',
            },
            {
              label: 'Manage Users',
              description: 'View and manage all system users',
              icon: Users,
              iconBg: 'bg-nss-100 group-hover:bg-nss-200',
              iconColor: 'text-nss-600',
              path: '/dashboard/admin/users',
            },
            {
              label: 'Admin Profile',
              description: 'View and edit your admin profile',
              icon: UserCheck,
              iconBg: 'bg-green-100 group-hover:bg-green-200',
              iconColor: 'text-green-600',
              path: '/dashboard/admin/profile',
            },
          ].map((action) => (
            <Card
              key={action.path}
              className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              onClick={() => navigate(action.path)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <div className={cn('size-12 rounded-lg flex items-center justify-center transition-colors', action.iconBg)}>
                    <action.icon className={cn('size-6', action.iconColor)} />
                  </div>
                  <ChevronRight className="size-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <CardTitle className="text-lg text-balance">{action.label}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
      <TourOverlay />
      <TourHelpButton />
    </div>
    </TourProvider>
  );
};

export default AdminDashboard;
