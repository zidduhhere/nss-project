import { useState, useEffect } from "react";
import {
  FileText, Download, Eye, CheckCircle, XCircle, Clock,
  Search, ExternalLink, RefreshCw, Undo2, Droplets, TreePine,
} from "lucide-react";
import DashboardNavigation from "@/components/common/DashboardNavigation";
import { Footer } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/shadcn/card";
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Alert, AlertDescription } from "@/components/shadcn/alert";
import { Separator } from "@/components/shadcn/separator";
import { UseAuthContext } from "@/context/AuthContext";
import { useRCOSubmissions } from "@/hooks/useRCOSubmissions";
import type { AdminSubmission } from "@/services/adminService";
import SuccessModal from "@/components/common/SuccessModal";

const RCOSubmissions = () => {
  const { role } = UseAuthContext();
  const allowedColleges = role?.role === "rco" ? role.allowed_colleges : [];
  const createdBy = role?.role === "rco" ? role.created_by : "";

  const {
    submissions, certificateType, isLoading, error, successMessage,
    stats, filters, setFilters, updateStatus, clearMessages, refetch,
  } = useRCOSubmissions(allowedColleges, createdBy);

  const [selected, setSelected] = useState<AdminSubmission | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (successMessage) { const t = setTimeout(clearMessages, 3000); return () => clearTimeout(t); }
  }, [successMessage, clearMessages]);

  const handleAction = async (sub: AdminSubmission, status: "approved" | "rejected" | "pending") => {
    setActionLoading(sub.id);
    await updateStatus(sub.id, status);
    setActionLoading(null);
  };

  const handleRefresh = async () => { setIsRefreshing(true); await refetch(); setIsRefreshing(false); };

  const getStatusBadge = (status: string) => {
    if (status === "approved") return <Badge className="bg-tree-100 text-tree-800 border-0">Approved</Badge>;
    if (status === "rejected") return <Badge className="bg-blood-100 text-blood-800 border-0">Rejected</Badge>;
    return <Badge className="bg-nss-100 text-nss-800 border-0">Pending</Badge>;
  };

  const getStatusIcon = (status: string) => {
    if (status === "approved") return <CheckCircle className="h-4 w-4 text-tree-500" />;
    if (status === "rejected") return <XCircle className="h-4 w-4 text-blood-500" />;
    return <Clock className="h-4 w-4 text-nss-500" />;
  };

  const TypeIcon = certificateType === "Blood Donation" ? Droplets : TreePine;
  const typeLabel = certificateType || "Submissions";

  const statCards = [
    { label: "Total", value: stats.total, icon: FileText, color: "text-nss-500", bg: "bg-nss-50" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Approved", value: stats.approved, icon: CheckCircle, color: "text-tree-500", bg: "bg-tree-50" },
    { label: "Rejected", value: stats.rejected, icon: XCircle, color: "text-blood-500", bg: "bg-blood-50" },
  ];

  return (
    <div className="font-isans min-h-screen bg-gray-50">
      <DashboardNavigation mode="rco" />
      {successMessage && <SuccessModal title="Success" message={successMessage} />}

      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
              <TypeIcon className="h-7 w-7 text-primary-600" />
              {typeLabel} — My Colleges
            </h1>
            <p className="text-gray-500 mt-1">Approve or reject certificates from your assigned colleges.</p>
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing…" : "Refresh"}
          </Button>
        </div>

        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

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

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by name or KTU ID…" className="pl-10" value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
              </div>
              <Select value={filters.status || "all"}
                onValueChange={(v) => setFilters({ ...filters, status: v === "all" ? "" : v })}>
                <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="All Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{typeLabel} — My Colleges</CardTitle>
            <CardDescription>Submissions from students at your assigned colleges.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : submissions.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">No submissions found</p>
                <p className="text-sm mt-1">{filters.search || filters.status ? "Try adjusting your filters." : "Submissions from your colleges will appear here."}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead className="hidden sm:table-cell">Details</TableHead>
                      <TableHead className="hidden lg:table-cell">Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell>
                          <p className="font-medium">{sub.student_name}</p>
                          <p className="text-sm text-muted-foreground">{sub.student_ktu_id}</p>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell max-w-[200px] truncate text-sm">{sub.details}</TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{new Date(sub.submitted_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">{getStatusIcon(sub.status)}{getStatusBadge(sub.status)}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => setSelected(sub)}><Eye className="h-4 w-4" /></Button>
                            {sub.certificate_url && (
                              <Button variant="ghost" size="sm" onClick={() => window.open(sub.certificate_url!, "_blank")}><Download className="h-4 w-4" /></Button>
                            )}
                            {sub.status !== "approved" && (
                              <Button variant="ghost" size="sm" className="text-tree-600 hover:text-tree-800 hover:bg-tree-50"
                                disabled={actionLoading === sub.id} onClick={() => handleAction(sub, "approved")}>
                                <CheckCircle className="h-4 w-4 mr-1" /><span className="hidden xl:inline">Approve</span>
                              </Button>
                            )}
                            {sub.status !== "rejected" && (
                              <Button variant="ghost" size="sm" className="text-blood-600 hover:text-blood-800 hover:bg-blood-50"
                                disabled={actionLoading === sub.id} onClick={() => handleAction(sub, "rejected")}>
                                <XCircle className="h-4 w-4 mr-1" /><span className="hidden xl:inline">Reject</span>
                              </Button>
                            )}
                            {sub.status !== "pending" && (
                              <Button variant="ghost" size="sm" className="text-nss-600 hover:text-nss-800 hover:bg-nss-50"
                                disabled={actionLoading === sub.id} onClick={() => handleAction(sub, "pending")}>
                                <Undo2 className="h-4 w-4 mr-1" /><span className="hidden xl:inline">Reset</span>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Submission Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div><p className="font-semibold text-lg">{selected.student_name}</p><p className="text-sm text-muted-foreground">{selected.student_ktu_id}</p></div>
                {getStatusBadge(selected.status)}
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground">Type</p><p className="font-medium">{selected.submission_type}</p></div>
                <div><p className="text-muted-foreground">Date</p><p className="font-medium">{new Date(selected.submitted_date).toLocaleDateString()}</p></div>
                {selected.hospital_name && <div><p className="text-muted-foreground">Hospital</p><p className="font-medium">{selected.hospital_name}</p></div>}
                {selected.type_donated && <div><p className="text-muted-foreground">Type Donated</p><p className="font-medium">{selected.type_donated}</p></div>}
                {selected.trees_planted !== undefined && <div><p className="text-muted-foreground">Trees Planted</p><p className="font-medium">{selected.trees_planted}</p></div>}
              </div>
              {selected.certificate_url && (<><Separator /><Button variant="outline" className="w-full" onClick={() => window.open(selected.certificate_url!, "_blank")}><ExternalLink className="h-4 w-4 mr-2" />View Certificate</Button></>)}
              <Separator />
              <div className="flex gap-3">
                {selected.status !== "approved" && (
                  <Button className="flex-1 bg-tree-600 hover:bg-tree-700" disabled={actionLoading === selected.id}
                    onClick={() => { handleAction(selected, "approved"); setSelected(null); }}>
                    <CheckCircle className="h-4 w-4 mr-2" />Approve
                  </Button>
                )}
                {selected.status !== "rejected" && (
                  <Button variant="destructive" className="flex-1" disabled={actionLoading === selected.id}
                    onClick={() => { handleAction(selected, "rejected"); setSelected(null); }}>
                    <XCircle className="h-4 w-4 mr-2" />Reject
                  </Button>
                )}
                {selected.status !== "pending" && (
                  <Button variant="outline" className="flex-1" disabled={actionLoading === selected.id}
                    onClick={() => { handleAction(selected, "pending"); setSelected(null); }}>
                    <Undo2 className="h-4 w-4 mr-2" />Reset
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="mt-16"><Footer /></div>
    </div>
  );
};

export default RCOSubmissions;
