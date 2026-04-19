import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, CheckCircle, Clock, XCircle, Droplets, TreePine, Users, ChevronRight } from "lucide-react";
import DashboardNavigation from "@/components/common/DashboardNavigation";
import { Footer } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/shadcn/card";
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Skeleton } from "@/components/shadcn/skeleton";
import { UseAuthContext } from "@/context/AuthContext";
import { flagshipAdminService } from "@/services/flagshipAdminService";

const FlagshipAdminDashboard = () => {
  const { role } = UseAuthContext();
  const navigate = useNavigate();
  const certificateType =
    role?.role === "flagship_admin" ? role.certificate_type : "";

  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [rcoCount, setRcoCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!certificateType) return;
    const load = async () => {
      try {
        const [submissions, rcos] = await Promise.all([
          flagshipAdminService.getSubmissions(
            certificateType as "Blood Donation" | "Tree Tagging"
          ),
          flagshipAdminService.listRCOs(),
        ]);
        setStats({
          total: submissions.length,
          pending: submissions.filter((s) => s.status === "pending").length,
          approved: submissions.filter((s) => s.status === "approved").length,
          rejected: submissions.filter((s) => s.status === "rejected").length,
        });
        setRcoCount(rcos.length);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [certificateType]);

  const TypeIcon = certificateType === "Blood Donation" ? Droplets : TreePine;
  const typeColor =
    certificateType === "Blood Donation"
      ? "text-blood-600 bg-blood-50 border-blood-200"
      : "text-tree-600 bg-tree-50 border-tree-200";

  const statCards = [
    { label: "Total Submissions", value: stats.total, icon: FileText, color: "text-nss-500", bg: "bg-nss-50" },
    { label: "Pending Review", value: stats.pending, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Approved", value: stats.approved, icon: CheckCircle, color: "text-tree-500", bg: "bg-tree-50" },
    { label: "Rejected", value: stats.rejected, icon: XCircle, color: "text-blood-500", bg: "bg-blood-50" },
  ];

  return (
    <div className="font-isans min-h-screen bg-gray-50 flex flex-col">
      <DashboardNavigation mode="flagship-admin" />

      <div className="flex-1 container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Flagship Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Manage and verify certificates for your assigned programme.</p>
          </div>
          <Badge className={`border text-sm px-3 py-1.5 gap-1.5 ${typeColor}`}>
            <TypeIcon className="h-4 w-4" />
            {certificateType}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}><CardContent className="p-6"><Skeleton className="h-4 w-24 mb-2" /><Skeleton className="h-8 w-16" /></CardContent></Card>
              ))
            : statCards.map((stat, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/dashboard/flagship-admin/submissions")}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2"><FileText className="h-5 w-5 text-nss-500" /> Review Submissions</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
              <CardDescription>
                {stats.pending > 0
                  ? `${stats.pending} submission${stats.pending > 1 ? "s" : ""} awaiting your review`
                  : "All submissions reviewed"}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/dashboard/flagship-admin/manage-rco")}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2"><Users className="h-5 w-5 text-primary-500" /> Manage RCOs</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
              <CardDescription>
                {isLoading ? "Loading…" : `${rcoCount} Regional Coordinator${rcoCount !== 1 ? "s" : ""} active`}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FlagshipAdminDashboard;
