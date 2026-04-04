import { useNavigate } from "react-router-dom";
import DashboardNavigation from "../../../components/common/DashboardNavigation";
import { Footer, FilledButton } from "../../../components/ui";
import { Calendar, Users, MapPin, Clock, Activity as ActivityIcon, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/shadcn/card";
import { Badge } from "@/components/shadcn/badge";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Alert, AlertDescription } from "@/components/shadcn/alert";
import { Progress } from "@/components/shadcn/progress";
import { useUnitActivities } from "@/hooks/useUnitActivities";

interface UnitActivityProps {
  user?: { name?: string; role?: string } | null;
}

const typeLabels: Record<string, string> = {
  camp: "Camp",
  blood_donation: "Blood Donation",
  tree_planting: "Tree Planting",
  workshop: "Workshop",
  awareness: "Awareness Program",
  other: "Other",
};

const typeColors: Record<string, string> = {
  blood_donation: "border-l-blood-500 bg-blood-50/50",
  tree_planting: "border-l-tree-500 bg-tree-50/50",
  camp: "border-l-nss-500 bg-nss-50/50",
  workshop: "border-l-blue-500 bg-blue-50/50",
  awareness: "border-l-purple-500 bg-purple-50/50",
  other: "border-l-gray-500 bg-gray-50/50",
};

export default function UnitActivity({}: UnitActivityProps) {
  const navigate = useNavigate();
  const { activities, isLoading, error, stats } = useUnitActivities();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-0">Upcoming</Badge>;
      case "ongoing":
        return <Badge className="bg-tree-100 text-tree-800 hover:bg-tree-200 border-0">Ongoing</Badge>;
      case "completed":
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-0">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-blood-100 text-blood-800 hover:bg-blood-200 border-0">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const statCards = [
    { label: "Total Activities", value: stats.total, icon: ActivityIcon, color: "text-nss-500" },
    { label: "Upcoming", value: stats.upcoming, icon: Clock, color: "text-blue-500" },
    { label: "Ongoing", value: stats.ongoing, icon: Calendar, color: "text-tree-500" },
    { label: "Completed", value: stats.completed, icon: Users, color: "text-gray-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardNavigation mode="unit" />
      <div className="space-y-6 px-4 sm:px-6 pb-6 flex-grow">
        {/* Error */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Header with Create Button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Activities</h1>
            <p className="text-sm text-gray-500">Manage and track your NSS activities</p>
          </div>
          <FilledButton
            variant="primary"
            size="md"
            onClick={() => navigate('/dashboard/unit/activities/create')}
          >
            <div className="flex items-center gap-2">
              <Plus className="size-4" />
              Create Activity
            </div>
          </FilledButton>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </CardContent>
                </Card>
              ))
            : statCards.map((stat, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Activities List */}
        <Card>
          <CardHeader>
            <CardTitle>NSS Activities</CardTitle>
            <CardDescription>All scheduled and past NSS activities</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-lg" />
                ))}
              </div>
            ) : activities.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <ActivityIcon className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">No activities yet</p>
                <p className="text-sm mt-1">NSS activities will appear here once created.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`border-l-4 ${typeColors[activity.activity_type] || typeColors.other} p-5 rounded-r-lg`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h4 className="text-base font-semibold text-gray-900">{activity.title}</h4>
                          {getStatusBadge(activity.status)}
                          <Badge variant="outline" className="text-xs">
                            {typeLabels[activity.activity_type] || activity.activity_type}
                          </Badge>
                          {(activity as any).approval_status && (activity as any).approval_status !== 'pending' && (
                            <Badge className={`text-xs border-0 ${
                              (activity as any).approval_status === 'approved' ? 'bg-tree-100 text-tree-800' :
                              (activity as any).approval_status === 'rejected' ? 'bg-blood-100 text-blood-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {(activity as any).approval_status === 'changes_requested' ? 'Changes Requested' : (activity as any).approval_status}
                            </Badge>
                          )}
                        </div>

                        {activity.description && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {activity.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{new Date(activity.start_date).toLocaleDateString()}</span>
                            {activity.end_date && (
                              <span>- {new Date(activity.end_date).toLocaleDateString()}</span>
                            )}
                          </div>
                          {activity.location && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>{activity.location}</span>
                            </div>
                          )}
                          {activity.organizer && (
                            <div className="flex items-center gap-1.5">
                              <Users className="h-3.5 w-3.5" />
                              <span>{activity.organizer}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {activity.max_participants && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Capacity</span>
                          <span>{activity.max_participants} max participants</span>
                        </div>
                        <Progress value={70} className="h-1.5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
