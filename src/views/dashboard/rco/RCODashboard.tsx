import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, CheckCircle, Clock, XCircle, Droplets, TreePine, Building2, ChevronRight } from "lucide-react";
import DashboardNavigation from "@/components/common/DashboardNavigation";
import { Footer } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/shadcn/card";
import { Badge } from "@/components/shadcn/badge";
import { Skeleton } from "@/components/shadcn/skeleton";
import { UseAuthContext } from "@/context/AuthContext";
import { rcoService } from "@/services/rcoService";
import { useGeneralServices } from "@/hooks/useGeneralHook";

const RCODashboard = () => {
  const { role } = UseAuthContext();
  const navigate = useNavigate();
  const { colleges } = useGeneralServices();

  const allowedColleges = role?.role === "rco" ? role.allowed_colleges : [];
  const createdBy = role?.role === "rco" ? role.created_by : "";

  const [certificateType, setCertificateType] = useState("");
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const collegeMap = Object.fromEntries(colleges.map((c) => [c.id, c.name]));

  useEffect(() => {
    if (!createdBy || !allowedColleges.length) { setIsLoading(false); return; }
    const load = async () => {
      try {
        const ct = await rcoService.getCertificateType(createdBy);
        setCertificateType(ct);
        if (ct) {
          const submissions = await rcoService.getSubmissions(
            allowedColleges,
            ct as "Blood Donation" | "Tree Tagging"
          );
          setStats({
            total: submissions.length,
            pending: submissions.filter((s) => s.status === "pending").length,
            approved: submissions.filter((s) => s.status === "approved").length,
            rejected: submissions.filter((s) => s.status === "rejected").length,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [createdBy, allowedColleges.join(",")]);

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
      <DashboardNavigation mode="rco" />

      <div className="flex-1 container mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Regional Coordinator Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Review and approve certificates from your assigned colleges.</p>
          </div>
          {certificateType && (
            <Badge className={`border text-sm px-3 py-1.5 gap-1.5 ${typeColor}`}>
              <TypeIcon className="h-4 w-4" />
              {certificateType}
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <Card key={i}><CardContent className="p-6"><Skeleton className="h-4 w-24 mb-2" /><Skeleton className="h-8 w-16" /></CardContent></Card>)
            : statCards.map((s, i) => (
                <Card key={i}><CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div><p className="text-sm font-medium text-muted-foreground">{s.label}</p><p className="text-2xl font-bold mt-1">{s.value}</p></div>
                    <div className={`h-10 w-10 rounded-lg ${s.bg} flex items-center justify-center`}><s.icon className={`h-5 w-5 ${s.color}`} /></div>
                  </div>
                </CardContent></Card>
              ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/dashboard/rco/submissions")}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2"><FileText className="h-5 w-5 text-nss-500" />Review Submissions</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
              <CardDescription>
                {stats.pending > 0 ? `${stats.pending} submission${stats.pending > 1 ? "s" : ""} awaiting review` : "All submissions reviewed"}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="h-5 w-5 text-primary-500" />
                Assigned Colleges
              </CardTitle>
              <CardDescription className="space-y-1 mt-1">
                {isLoading
                  ? <Skeleton className="h-4 w-32" />
                  : allowedColleges.length === 0
                  ? <span className="text-muted-foreground">No colleges assigned</span>
                  : allowedColleges.map((cid) => (
                      <span key={cid} className="block text-sm">{collegeMap[cid] || cid}</span>
                    ))}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RCODashboard;
