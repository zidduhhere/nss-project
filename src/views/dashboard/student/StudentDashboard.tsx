import { Footer } from "@/components/ui";
import DashboardHeader from "./sections/DashboardHeader";
import { useStudentDashboard } from "@/hooks/useStudentDashboard";
import {
  DashboardHeader as CommonDashboardHeader,
} from "@/components/common";
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
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/shadcn/card";
import { Badge } from "@/components/shadcn/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/shadcn/alert";
import { Skeleton } from "@/components/shadcn/skeleton";
import { cn } from "@/lib/utils";
import { TourProvider, TourOverlay, TourHelpButton, studentTourConfig } from "@/components/tour";

interface StudentDashboardProps {
  onLogout: () => void;
}

export default function StudentDashboard({}: StudentDashboardProps) {
  const {
    stats,
    recentActivities,
    activitySummary,
    isLoading,
    error,
    refetch,
  } = useStudentDashboard();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-gray-50">
        <DashboardHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="space-y-3 mb-10">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="size-12 rounded-lg" />
                    <Skeleton className="size-5 rounded" />
                  </div>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="lg:col-span-2">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-40 mb-4" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))}
              </CardContent>
            </Card>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-dvh bg-gray-50">
        <DashboardHeader />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Alert variant="destructive" className="border-blood-200 bg-blood-50">
            <AlertCircle className="size-4" />
            <AlertTitle className="text-blood-700 font-semibold">
              Error loading dashboard
            </AlertTitle>
            <AlertDescription className="text-blood-600">
              <p>{error}</p>
              <button
                onClick={refetch}
                className="mt-2 text-sm font-medium underline hover:no-underline"
              >
                Try again
              </button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const getStatusVariant = (status: string | null) => {
    switch (status) {
      case "approved":
      case "certified":
        return "success" as const;
      case "pending":
        return "warning" as const;
      case "rejected":
        return "danger" as const;
      default:
        return "outline" as const;
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case "approved":
      case "certified":
        return <CheckCircle2 className="size-3.5" />;
      case "pending":
        return <Clock className="size-3.5" />;
      case "rejected":
        return <AlertCircle className="size-3.5" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const statCards = [
    {
      label: "Total Activities",
      value: stats?.totalActivities || 0,
      icon: FileText,
      gradient: "bg-nss-600",
      trend: <TrendingUp className="size-5 text-tree-500" />,
    },
    {
      label: "Blood Donations",
      value: stats?.bloodDonationCount || 0,
      icon: Heart,
      gradient: "bg-red-600",
      trend: null,
    },
    {
      label: "Tree Tagging",
      value: stats?.treeTaggingCount || 0,
      icon: TreePine,
      gradient: "bg-green-600",
      trend: null,
    },
    {
      label: "Pending Review",
      value: stats?.pendingSubmissions || 0,
      icon: Clock,
      gradient: "bg-yellow-600",
      trend: null,
    },
  ];

  return (
    <TourProvider config={studentTourConfig}>
    <div className="min-h-dvh bg-gray-50">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <CommonDashboardHeader
          title="My Dashboard"
          subtitle="Track your NSS journey and activities"
          icon={TrendingUp}
          badges={
            stats?.isRegistered
              ? [
                  {
                    icon: UserCheck,
                    text: `Status: ${stats.volunteerStatus?.toUpperCase()}`,
                  },
                ]
              : undefined
          }
          className="mb-8"
        />

        {!stats?.isRegistered ? (
          <Card className="mb-8 border-0 bg-nss-600 shadow-lg overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 flex items-center gap-2 text-white text-balance">
                    <AlertCircle className="size-6" />
                    Complete Your Volunteer Registration
                  </h3>
                  <p className="text-nss-100 text-sm sm:text-base">
                    Register as an NSS volunteer to start tracking your activities
                    and earning recognition for your service.
                  </p>
                </div>
                <button
                  onClick={() =>
                    navigate("/dashboard/student/volunteer-registration")
                  }
                  className="flex items-center gap-2 whitespace-nowrap bg-white hover:bg-gray-50 text-nss-700 font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm"
                >
                  <Plus className="size-4" />
                  Register Now
                </button>
              </div>
            </CardContent>
          </Card>
        ) : stats.volunteerStatus === "pending" ? (
          <Alert className="mb-8 border-l-4 border-l-nss-400 bg-nss-50 border-nss-200">
            <Clock className="size-5 text-nss-600" />
            <AlertTitle className="font-semibold text-nss-900">
              Registration Pending
            </AlertTitle>
            <AlertDescription className="text-sm text-nss-800">
              Your volunteer registration is under review by your unit
              coordinator. You'll be notified once it's approved.
            </AlertDescription>
          </Alert>
        ) : stats.volunteerStatus === "approved" ? (
          <Alert className="mb-8 border-l-4 border-l-tree-400 bg-tree-50 border-tree-200">
            <CheckCircle2 className="size-5 text-tree-600" />
            <AlertTitle className="font-semibold text-tree-900">
              Registration Approved!
            </AlertTitle>
            <AlertDescription className="text-sm text-tree-800">
              Your volunteer registration has been approved. Start
              submitting your activities to earn certification.
            </AlertDescription>
          </Alert>
        ) : stats.volunteerStatus === "certified" ? (
          <Card className="mb-8 border-0 bg-green-600 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 text-white">
                <Award className="size-8 flex-shrink-0" />
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1 text-balance">
                    Certified NSS Volunteer
                  </h3>
                  <p className="text-sm text-green-50">
                    Congratulations! You are now a certified NSS volunteer. Keep
                    up the great work!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div data-tour="stat-cards" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {statCards.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.label}
                className="hover:shadow-md transition-shadow duration-200"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn("p-3 rounded-lg", item.gradient)}>
                      <Icon className="size-5 text-white" />
                    </div>
                    {item.trend}
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 tabular-nums">
                    {item.value}
                  </p>
                  <p className="text-sm text-gray-500">{item.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2" data-tour="recent-activities">
            <Card className="shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2 text-balance">
                    <Calendar className="size-5 text-nss-600" />
                    Recent Activities
                  </CardTitle>
                  <button
                    onClick={() => navigate("/dashboard/student/profile")}
                    className="text-sm text-nss-600 hover:text-nss-700 font-medium flex items-center gap-1 transition-colors"
                  >
                    View All <ArrowRight className="size-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                {recentActivities.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center size-16 rounded-full bg-gray-100 mb-4">
                      <FileText className="size-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-4">
                      No activities submitted yet
                    </p>
                    <button
                      onClick={() => navigate("/dashboard/student/submit")}
                      className="inline-flex items-center gap-2 bg-nss-600 hover:bg-nss-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
                    >
                      <Plus className="size-4" />
                      Submit Activity
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-4 p-4 rounded-lg bg-gray-50/80 hover:bg-gray-100/80 transition-colors border border-gray-100"
                      >
                        <div
                          className={cn(
                            "p-2.5 rounded-lg flex-shrink-0",
                            activity.type === "blood-donation"
                              ? "bg-red-100"
                              : "bg-green-100"
                          )}
                        >
                          {activity.type === "blood-donation" ? (
                            <Heart className="size-4 text-blood-600" />
                          ) : (
                            <TreePine className="size-4 text-tree-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <h3 className="font-medium text-gray-900 text-sm text-balance">
                              {activity.title}
                            </h3>
                            <Badge
                              variant={getStatusVariant(activity.status)}
                              className="gap-1 flex-shrink-0"
                            >
                              {getStatusIcon(activity.status)}
                              {activity.status}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="size-3" />
                              {formatDate(activity.date)}
                            </span>
                            {activity.location && (
                              <span className="truncate">
                                {activity.location}
                              </span>
                            )}
                            {activity.count && (
                              <span className="font-medium text-gray-600">
                                {activity.count} trees
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6" data-tour="quick-actions">
            <Card className="shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-balance">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button
                  onClick={() => navigate("/dashboard/student/submit")}
                  className="w-full flex items-center gap-3 p-3.5 bg-nss-600 text-white rounded-lg hover:bg-nss-700 transition-all shadow-sm"
                >
                  <Plus className="size-5" />
                  <span className="font-medium">Submit Activity</span>
                </button>
                <button
                  onClick={() => navigate("/dashboard/student/profile")}
                  className="w-full flex items-center gap-3 p-3.5 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <UserCheck className="size-5" />
                  <span className="font-medium">View Profile</span>
                </button>
                {!stats?.isRegistered && (
                  <button
                    onClick={() =>
                      navigate("/dashboard/student/volunteer-registration")
                    }
                    className="w-full flex items-center gap-3 p-3.5 bg-tree-50 text-tree-700 border border-tree-200 rounded-lg hover:bg-tree-100 transition-colors"
                  >
                    <Award className="size-5" />
                    <span className="font-medium">Register as Volunteer</span>
                  </button>
                )}
              </CardContent>
            </Card>

            {activitySummary && (stats?.totalActivities || 0) > 0 && (
              <Card className="shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-balance">Activity Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Heart className="size-4 text-blood-600" />
                        Blood Donation
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {activitySummary.bloodDonation.total}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="success" className="gap-1 text-xs">
                        <CheckCircle2 className="size-3" />
                        {activitySummary.bloodDonation.approved}
                      </Badge>
                      <Badge variant="warning" className="gap-1 text-xs">
                        <Clock className="size-3" />
                        {activitySummary.bloodDonation.pending}
                      </Badge>
                      {activitySummary.bloodDonation.rejected > 0 && (
                        <Badge variant="danger" className="gap-1 text-xs">
                          <AlertCircle className="size-3" />
                          {activitySummary.bloodDonation.rejected}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <TreePine className="size-4 text-tree-600" />
                        Tree Tagging
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {activitySummary.treeTagging.total}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="success" className="gap-1 text-xs">
                        <CheckCircle2 className="size-3" />
                        {activitySummary.treeTagging.approved}
                      </Badge>
                      <Badge variant="warning" className="gap-1 text-xs">
                        <Clock className="size-3" />
                        {activitySummary.treeTagging.pending}
                      </Badge>
                      {activitySummary.treeTagging.rejected > 0 && (
                        <Badge variant="danger" className="gap-1 text-xs">
                          <AlertCircle className="size-3" />
                          {activitySummary.treeTagging.rejected}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {stats?.isRegistered && (
              <Card className="shadow-md bg-nss-50 border-nss-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-balance">Volunteer Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Unit Number</span>
                    <span className="font-semibold text-gray-900">
                      {stats.unitNumber || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Semester</span>
                    <span className="font-semibold text-gray-900">
                      {stats.semester || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Registered On</span>
                    <span className="font-semibold text-gray-900">
                      {stats.registrationDate
                        ? formatDate(stats.registrationDate)
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-3 border-t border-nss-200">
                    <span className="text-gray-600">Status</span>
                    <Badge
                      variant={getStatusVariant(stats.volunteerStatus)}
                      className="gap-1"
                    >
                      {getStatusIcon(stats.volunteerStatus)}
                      {stats.volunteerStatus?.toUpperCase()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
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
}
