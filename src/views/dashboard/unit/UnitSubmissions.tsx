import DashboardNavigation from "../../../components/common/DashboardNavigation";
import { UnitInfoCard } from "../../../components/common";
import { Footer } from "../../../components/ui";
import {
  FileText,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  ExternalLink,
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
import { useUnitSubmissions, UnitSubmission } from "@/hooks/useUnitSubmissions";
import { useState } from "react";

interface UnitSubmissionsProps {
  user?: { name?: string; role?: string } | null;
}

export default function UnitSubmissions({}: UnitSubmissionsProps) {
  const {
    submissions,
    isLoading,
    error,
    stats,
    filters,
    setFilters,
    approveSubmission,
    rejectSubmission,
  } = useUnitSubmissions();

  const [selectedSubmission, setSelectedSubmission] = useState<UnitSubmission | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleApprove = async (submission: UnitSubmission) => {
    setActionLoading(submission.id);
    await approveSubmission(submission.id, submission.submission_type);
    setActionLoading(null);
  };

  const handleReject = async (submission: UnitSubmission) => {
    setActionLoading(submission.id);
    await rejectSubmission(submission.id, submission.submission_type);
    setActionLoading(null);
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

  const statCards = [
    { label: "Total Submissions", value: stats.total, icon: FileText, color: "text-nss-500" },
    { label: "Pending Review", value: stats.pending, icon: Clock, color: "text-amber-500" },
    { label: "Approved", value: stats.approved, icon: CheckCircle, color: "text-tree-500" },
    { label: "Rejected", value: stats.rejected, icon: XCircle, color: "text-blood-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavigation mode="unit" />
      <div className="space-y-6 px-4 sm:px-6 pb-6">
        {/* Header */}
        <div className="hidden lg:flex items-end justify-end gap-6">
          <UnitInfoCard className="w-full lg:w-80 flex-shrink-0" />
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
                      <div className={`h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center`}>
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
                  placeholder="Search by name, KTU ID, or details..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
              <Select
                value={filters.type}
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
                value={filters.status}
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
            <CardTitle>Student Submissions</CardTitle>
            <CardDescription>Review and approve certificate submissions</CardDescription>
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
                <p className="text-sm mt-1">Submissions from your unit's volunteers will appear here.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{submission.student_name}</p>
                          <p className="text-sm text-muted-foreground">{submission.student_ktu_id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            submission.submission_type === "Blood Donation"
                              ? "border-blood-300 text-blood-700"
                              : "border-tree-300 text-tree-700"
                          }
                        >
                          {submission.submission_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {submission.details}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
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
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {submission.certificate_url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(submission.certificate_url!, "_blank")}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          {submission.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-tree-600 hover:text-tree-800 hover:bg-tree-50"
                                disabled={actionLoading === submission.id}
                                onClick={() => handleApprove(submission)}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blood-600 hover:text-blood-800 hover:bg-blood-50"
                                disabled={actionLoading === submission.id}
                                onClick={() => handleReject(submission)}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
              {selectedSubmission.status === "pending" && (
                <div className="flex gap-3 pt-2">
                  <Button
                    className="flex-1 bg-tree-600 hover:bg-tree-700"
                    onClick={() => {
                      handleApprove(selectedSubmission);
                      setSelectedSubmission(null);
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      handleReject(selectedSubmission);
                      setSelectedSubmission(null);
                    }}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
}
