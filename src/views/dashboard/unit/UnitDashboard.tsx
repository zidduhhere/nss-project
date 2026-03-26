import DashboardNavigation from '../../../components/common/DashboardNavigation';
import { UnitInfoCard, DashboardHeader } from '../../../components/common';
import { useUnitProfile } from '@/hooks/useUnitProfile';
import { UseAuthContext } from '@/context/AuthContext';
import { Users, UserCheck, UserX, Clock, Building, TrendingUp, Calendar, Plus, BookOpen, Trash2 } from 'lucide-react';
import { Footer } from '@/components/ui/Footer';
import { useState } from 'react';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/shadcn/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/shadcn/dialog';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { Skeleton } from '@/components/shadcn/skeleton';
import { Separator } from '@/components/shadcn/separator';
import { cn } from '@/lib/utils';
import { TourProvider, TourOverlay, TourHelpButton, unitTourConfig } from '@/components/tour';

interface UnitDashboardProps {
    user?: { name?: string; role?: string } | null;
}

interface StatCardProps {
    icon: React.ElementType;
    label: string;
    value: number;
    subtitle: string;
    gradient: string;
    valueColor?: string;
}

function StatCard({ icon: Icon, label, value, subtitle, gradient, valueColor = 'text-gray-900' }: StatCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={cn('size-10 sm:size-12 rounded-xl flex items-center justify-center', gradient)}>
                        <Icon className="size-5 sm:size-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
                        {label}
                    </Badge>
                </div>
                <h3 className={cn('text-2xl sm:text-3xl font-bold mb-1 tabular-nums text-balance', valueColor)}>{value}</h3>
                <p className="text-xs sm:text-sm text-gray-500">{subtitle}</p>
            </CardContent>
        </Card>
    );
}

function StatCardSkeleton() {
    return (
        <Card>
            <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                    <Skeleton className="size-10 sm:size-12 rounded-xl" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-24" />
            </CardContent>
        </Card>
    );
}

function DeleteConfirmDialog({
    open,
    onOpenChange,
    courseName,
    onConfirm,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    courseName: string;
    onConfirm: () => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete Course</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete "{courseName}"? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function UnitDashboard({ }: UnitDashboardProps) {
    const { session } = UseAuthContext();
    const unitId = session?.user?.id;

    const { profile, stats, isLoading, courses, isLoadingCourses, addCourse, deleteCourse } = useUnitProfile(unitId || '');

    // Course management state
    const [showAddCourseModal, setShowAddCourseModal] = useState(false);
    const [newCourseName, setNewCourseName] = useState('');
    const [newCourseCode, setNewCourseCode] = useState('');
    const [courseError, setCourseError] = useState<string | null>(null);

    // Delete confirmation state
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

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

    const handleDeleteCourse = async () => {
        if (!deleteTarget) return;
        try {
            await deleteCourse(deleteTarget.id);
            setDeleteTarget(null);
        } catch (err: any) {
            alert(`Failed to delete course: ${err.message}`);
            setDeleteTarget(null);
        }
    };

    const resetAddCourseModal = () => {
        setShowAddCourseModal(false);
        setCourseError(null);
        setNewCourseName('');
        setNewCourseCode('');
    };

    const statCards: StatCardProps[] = [
        {
            icon: Users,
            label: 'Total',
            value: stats?.totalVolunteers || 0,
            subtitle: 'Volunteers',
            gradient: 'bg-nss-600',
            valueColor: 'text-gray-900',
        },
        {
            icon: UserCheck,
            label: 'Approved',
            value: stats?.approvedVolunteers || 0,
            subtitle: 'By Unit',
            gradient: 'bg-green-600',
            valueColor: 'text-tree-700',
        },
        {
            icon: UserCheck,
            label: 'Certified',
            value: stats?.certifiedVolunteers || 0,
            subtitle: 'By Admin',
            gradient: 'bg-blue-600',
            valueColor: 'text-blue-700',
        },
        {
            icon: Clock,
            label: 'Pending',
            value: stats?.pendingApprovals || 0,
            subtitle: 'Awaiting Review',
            gradient: 'bg-yellow-600',
            valueColor: 'text-nss-700',
        },
        {
            icon: UserX,
            label: 'Rejected',
            value: stats?.rejectedVolunteers || 0,
            subtitle: 'Applications',
            gradient: 'bg-red-600',
            valueColor: 'text-blood-700',
        },
    ];

    return (
        <TourProvider config={unitTourConfig}>
        <div className="min-h-dvh bg-gray-50 font-isans flex flex-col">
            <DashboardNavigation mode="unit" />
            <div className="space-y-6 px-4 sm:px-6 pb-6 flex-grow">

                {/* Header Section */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-start justify-between gap-6">
                    <DashboardHeader
                        title="Unit Dashboard"
                        subtitle={isLoading ? 'Loading...' : `Welcome, ${profile?.po_name || 'Coordinator'}`}
                        icon={Building}
                        badges={profile ? [
                            { icon: Building, text: profile.unit_number || 'N/A' },
                            { icon: Building, text: profile.college_name || 'N/A' },
                        ] : undefined}
                    />
                    <UnitInfoCard className="w-full lg:w-80 flex-shrink-0" />
                </div>

                {/* Statistics Cards */}
                <div data-tour="stat-cards" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                    {isLoading
                        ? Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)
                        : statCards.map((card) => <StatCard key={card.label} {...card} />)
                    }
                </div>

                {/* Additional Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

                    {/* Quick Stats */}
                    <Card data-tour="quick-stats">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-balance">
                                <TrendingUp className="size-5 text-nss-600" />
                                Quick Stats
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-nss-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-700">Approval Rate</span>
                                <Badge variant="warning" className="text-sm font-bold">
                                    {stats?.totalVolunteers
                                        ? Math.round((stats.approvedVolunteers / stats.totalVolunteers) * 100)
                                        : 0}%
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-nss-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-700">Pending Review</span>
                                <Badge variant="warning" className="text-sm font-bold">
                                    {stats?.pendingApprovals || 0}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-tree-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-700">Active Members</span>
                                <Badge variant="success" className="text-sm font-bold">
                                    {stats?.certifiedVolunteers || 0}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Unit Information */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-balance">
                                <Building className="size-5 text-nss-600" />
                                Unit Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-5/6" />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Unit Number</p>
                                        <p className="text-sm font-semibold text-gray-900">{profile?.unit_number || 'N/A'}</p>
                                    </div>
                                    <Separator />
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">College</p>
                                        <p className="text-sm font-semibold text-gray-900">{profile?.college_name || 'N/A'}</p>
                                    </div>
                                    <Separator />
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">District</p>
                                        <p className="text-sm font-semibold text-gray-900">{profile?.college_district || 'N/A'}</p>
                                    </div>
                                    {stats?.establishedYear && (
                                        <>
                                            <Separator />
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Established</p>
                                                <p className="text-sm font-semibold text-gray-900">{stats.establishedYear}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="bg-nss-600 border-none text-white">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-white text-balance">
                                <Calendar className="size-5" />
                                Recent Activity
                            </CardTitle>
                            <CardDescription className="text-nss-100">
                                Track your unit's latest activities and volunteer registrations.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Separator className="bg-white/20 mb-4" />
                            <p className="text-xs text-nss-200 mb-2">Last 7 Days</p>
                            <p className="text-3xl font-bold tabular-nums">{stats?.pendingApprovals || 0}</p>
                            <p className="text-sm text-nss-100 mt-1">New Applications</p>
                        </CardContent>
                    </Card>
                </div>

                {/* College Courses Management Section */}
                <Card data-tour="college-courses">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-lg bg-nss-100 flex items-center justify-center">
                                    <BookOpen className="size-5 text-nss-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl text-balance">College Courses</CardTitle>
                                    <CardDescription className="mt-1">Manage courses offered at your college</CardDescription>
                                </div>
                            </div>
                            <Button variant="nss" onClick={() => setShowAddCourseModal(true)}>
                                <Plus className="size-4" />
                                Add Course
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoadingCourses ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="rounded-lg border border-gray-200 p-4">
                                        <Skeleton className="h-5 w-3/4 mb-3" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                ))}
                            </div>
                        ) : courses.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="mx-auto size-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                    <BookOpen className="size-7 text-gray-400" />
                                </div>
                                <p className="text-gray-600 mb-4">No courses added yet</p>
                                <Button variant="outline" onClick={() => setShowAddCourseModal(true)}>
                                    <Plus className="size-4" />
                                    Add Your First Course
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {courses.map((course) => (
                                    <div
                                        key={course.id}
                                        className="group relative rounded-lg border border-nss-200 bg-nss-50 p-4 hover:shadow-md transition-all"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-gray-900 text-sm pr-8">{course.name}</h4>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-2 right-2 size-8 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => setDeleteTarget({ id: course.id, name: course.name })}
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                        <Badge variant="secondary" className="font-mono text-xs">
                                            {course.code}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Add Course Dialog */}
            <Dialog open={showAddCourseModal} onOpenChange={(open) => { if (!open) resetAddCourseModal(); }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add New Course</DialogTitle>
                        <DialogDescription>
                            Enter the details for the new course offered at your college.
                        </DialogDescription>
                    </DialogHeader>

                    {courseError && (
                        <div className="bg-blood-50 border border-blood-200 text-blood-700 px-4 py-3 rounded-lg text-sm">
                            {courseError}
                        </div>
                    )}

                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="course-name">Course Name</Label>
                            <Input
                                id="course-name"
                                placeholder="e.g., Computer Science Engineering"
                                value={newCourseName}
                                onChange={(e) => setNewCourseName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="course-code">Course Code</Label>
                            <Input
                                id="course-code"
                                placeholder="e.g., CSE or B.Tech CSE"
                                value={newCourseCode}
                                onChange={(e) => setNewCourseCode(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={resetAddCourseModal}>
                            Cancel
                        </Button>
                        <Button variant="nss" onClick={handleAddCourse} disabled={isLoadingCourses}>
                            {isLoadingCourses ? 'Adding...' : 'Add Course'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmDialog
                open={!!deleteTarget}
                onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
                courseName={deleteTarget?.name || ''}
                onConfirm={handleDeleteCourse}
            />

            <Footer />
            <TourOverlay />
            <TourHelpButton />
        </div>
        </TourProvider>
    );
}
