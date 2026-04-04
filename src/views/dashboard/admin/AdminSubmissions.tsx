import { useState, useEffect } from "react";
import DashboardNavigation from "@/components/common/DashboardNavigation";
import { Footer } from "@/components/ui";
import {
  FileText,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  ExternalLink,
  RefreshCw,
  ShieldAlert,
  Undo2,
  Droplets,
  TreePine,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/shadcn/card";
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Alert, AlertDescription } from "@/components/shadcn/alert";
import { Separator } from "@/components/shadcn/separator";
import { useAdminSubmissions } from "@/hooks/useAdminSubmissions";
import type { AdminSubmission } from "@/services/adminService";
import SuccessModal from "@/components/common/SuccessModal";

const AdminSubmissions = () => {
  const {
    submissions,
    isLoading,
    error,
    successMessage,
    stats,
    filters,
    setFilters,
    overrideStatus,
    clearMessages,
    refetch,
  } = useAdminSubmissions();

  const [selectedSubmission, setSelectedSubmission] = useState<AdminSubmission | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => clearMessages(), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, clearMessages]);

  const handleOverride = async (
    submission: AdminSubmission,
    newStatus: "approved" | "rejected" | "pending"
  ) => {
    setActionLoading(submission.id);
    await overrideStatus(submission.id, submission.submission_type, newStatus);
    setActionLoading(null);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-tree-100 text-tree-800 hover:bg-tree-200 border-0">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-blood-100 text-blood-800 hover:bg-blood-200 border-0">Rejected</Badge>;
      default:
        return <Badge className="bg-nss-100 text-nss-800 hover:bg-nss-200 border-0">Pending</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-tree-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-blood-500" />;
      default:
        return <Clock className="h-4 w-4 text-nss-500" />;
    }
  };

  const getTypeBadge = (type: "Blood Donation" | "Tree Tagging") => {
    if (type === "Blood Donation") {
      return (
        <Badge variant="outline" className="border-blood-300 text-blood-700 gap-1">
          <Droplets className="h-3 w-3" />
          Blood Donation
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="border-tree-300 text-tree-700 gap-1">
        <TreePine className="h-3 w-3" />
        Tree Tagging
      </Badge>
    );
  };

  const statCards = [
    { label: "Total Submissions", value: stats.total, icon: FileText, color: "text-nss-500", bg: "bg-nss-50" },
    { label: "Pending Review", value: stats.pending, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Approved", value: stats.approved, icon: CheckCircle, color: "text-tree-500", bg: "bg-tree-50" },
    { label: "Rejected", value: stats.rejected, icon: XCircle, color: "text-blood-500", bg: "bg-blood-50" },
  ];

  return (
    <div className="font-isans min-h-screen bg-gray-50">
      <DashboardNavigation mode="admin" />

      {successMessage && (
        <SuccessModal title="Success" message={successMessage} />
      )}

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
              <ShieldAlert className="h-7 w-7 text-primary-600" />
              Activity Submissions
            </h1>
            <p className="text-gray-500 mt-1">
              Review and override blood donation & tree tagging submissions across all units
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
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
                      <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, KTU ID, unit, or details..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
              <Select
                value={filters.type || "all"}
                onValueChange={(val) => setFilters({ ...filters, type: val === "all" ? "" : val })}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Blood Donation">Blood Donation</SelectItem>
                  <SelectItem value="Tree Tagging">Tree Tagging</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.status || "all"}
                onValueChange={(val) => setFilters({ ...filters, status: val === "all" ? "" : val })}
              >
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
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

        {/* Submissions Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Submissions</CardTitle>
            <CardDescription>
              Approve or reject submissions across all units. Admin actions override unit decisions.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : submissions.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">No submissions found</p>
                <p className="text-sm mt-1">
                  {filters.search || filters.type || filters.status
                    ? "Try adjusting your filters."
                    : "Blood donation and tree tagging submissions will appear here."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="hidden md:table-cell">Unit</TableHead>
                      <TableHead className="hidden sm:table-cell">Details</TableHead>
                      <TableHead className="hidden lg:table-cell">Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={`${submission.submission_type}-${submission.id}`}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{submission.student_name}</p>
                            <p className="text-sm text-muted-foreground">{submission.student_ktu_id}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(submission.submission_type)}</TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {submission.unit_number || "N/A"}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell max-w-[200px] truncate text-sm">
                          {submission.details}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                          {new Date(submission.submitted_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {getStatusIcon(submission.status)}
                            {getStatusBadge(submission.status)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedSubmission(submission)}
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {submission.certificate_url && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(submission.certificate_url!, "_blank")}
                                title="Download certificate"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                            {submission.status !== "approved" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-tree-600 hover:text-tree-800 hover:bg-tree-50"
                                disabled={actionLoading === submission.id}
                                onClick={() => handleOverride(submission, "approved")}
                                title="Approve (admin override)"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                <span className="hidden xl:inline">Approve</span>
                              </Button>
                            )}
                            {submission.status !== "rejected" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blood-600 hover:text-blood-800 hover:bg-blood-50"
                                disabled={actionLoading === submission.id}
                                onClick={() => handleOverride(submission, "rejected")}
                                title="Reject (admin override)"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                <span className="hidden xl:inline">Reject</span>
                              </Button>
                            )}
                            {submission.status !== "pending" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-nss-600 hover:text-nss-800 hover:bg-nss-50"
                                disabled={actionLoading === submission.id}
                                onClick={() => handleOverride(submission, "pending")}
                                title="Reset to pending"
                              >
                                <Undo2 className="h-4 w-4 mr-1" />
                                <span className="hidden xl:inline">Reset</span>
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

      {/* Submission Detail Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg">{selectedSubmission.student_name}</p>
                  <p className="text-sm text-muted-foreground">{selectedSubmission.student_ktu_id}</p>
                </div>
                {getStatusBadge(selectedSubmission.status)}
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium">{selectedSubmission.submission_type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {new Date(selectedSubmission.submitted_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Unit</p>
                  <p className="font-medium">{selectedSubmission.unit_number || "N/A"}</p>
                </div>
                {selectedSubmission.hospital_name && (
                  <div>
                    <p className="text-muted-foreground">Hospital</p>
                    <p className="font-medium">{selectedSubmission.hospital_name}</p>
                  </div>
                )}
                {selectedSubmission.type_donated && (
                  <div>
                    <p className="text-muted-foreground">Type Donated</p>
                    <p className="font-medium">{selectedSubmission.type_donated}</p>
                  </div>
                )}
                {selectedSubmission.trees_planted && (
                  <div>
                    <p className="text-muted-foreground">Trees Planted</p>
                    <p className="font-medium">{selectedSubmission.trees_planted}</p>
                  </div>
                )}
              </div>
              {selectedSubmission.donation_case && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Case Description</p>
                    <p className="text-sm">{selectedSubmission.donation_case}</p>
                  </div>
                </>
              )}
              {selectedSubmission.tagged_tree_links && selectedSubmission.tagged_tree_links.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Tagged Tree Links</p>
                    <div className="space-y-1">
                      {selectedSubmission.tagged_tree_links.map((link, i) => (
                        <a
                          key={i}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-primary-600 hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Tree {i + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {selectedSubmission.certificate_url && (
                <>
                  <Separator />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(selectedSubmission.certificate_url!, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Certificate
                  </Button>
                </>
              )}

              {/* Admin Override Actions */}
              <Separator />
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Admin Override Actions
                </p>
                <div className="flex gap-3">
                  {selectedSubmission.status !== "approved" && (
                    <Button
                      className="flex-1 bg-tree-600 hover:bg-tree-700"
                      disabled={actionLoading === selectedSubmission.id}
                      onClick={() => {
                        handleOverride(selectedSubmission, "approved");
                        setSelectedSubmission(null);
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  )}
                  {selectedSubmission.status !== "rejected" && (
                    <Button
                      variant="destructive"
                      className="flex-1"
                      disabled={actionLoading === selectedSubmission.id}
                      onClick={() => {
                        handleOverride(selectedSubmission, "rejected");
                        setSelectedSubmission(null);
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  )}
                  {selectedSubmission.status !== "pending" && (
                    <Button
                      variant="outline"
                      className="flex-1"
                      disabled={actionLoading === selectedSubmission.id}
                      onClick={() => {
                        handleOverride(selectedSubmission, "pending");
                        setSelectedSubmission(null);
                      }}
                    >
                      <Undo2 className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
};

export default AdminSubmissions;
