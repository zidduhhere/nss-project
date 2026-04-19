import { useState, useEffect, useCallback, useRef } from 'react';
import DOMPurify from 'dompurify';
import {
  Search,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Eye,
  Loader2,
  Calendar,
  Users,
  MapPin,
  Clock,
  Building,
  ChevronDown,
  Activity as ActivityIcon,
} from 'lucide-react';
import DashboardNavigation from '@/components/common/DashboardNavigation';
import { Footer, FilledButton } from '@/components/ui';
import { Card, CardContent } from '@/components/shadcn/card';
import { Badge } from '@/components/shadcn/badge';
import { Skeleton } from '@/components/shadcn/skeleton';
import {
  activitiesService,
  Activity,
  ActivityType,
  ApprovalStatus,
  ActivityFilters,
} from '@/services/activitiesService';
import { getAllDistricts } from '@/utils/data/taluks';
import jsPDF from 'jspdf';

type ActivityWithUnit = Activity & {
  unit_number?: string;
  college_name?: string;
  college_district?: string;
};

const typeLabels: Record<string, string> = {
  camp: 'Camp',
  blood_donation: 'Blood Donation',
  tree_planting: 'Tree Planting',
  workshop: 'Workshop',
  awareness: 'Awareness Program',
  other: 'Other',
};

const approvalColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-tree-100 text-tree-800',
  rejected: 'bg-blood-100 text-blood-800',
  changes_requested: 'bg-orange-100 text-orange-800',
};

const approvalLabels: Record<string, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  changes_requested: 'Changes Requested',
};

export default function AdminActivities() {
  const [activities, setActivities] = useState<ActivityWithUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<ActivityWithUnit | null>(null);
  const [remarksInput, setRemarksInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const [filters, setFilters] = useState<ActivityFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const districts = getAllDistricts();

  const fetchActivities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await activitiesService.getFilteredActivities(
        { ...filters, search: searchTerm || undefined },
        { pageSize: 200 }
      );
      setActivities(result.items as ActivityWithUnit[]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch activities');
    } finally {
      setIsLoading(false);
    }
  }, [filters, searchTerm]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleStatusUpdate = async (activityId: string, status: ApprovalStatus) => {
    setIsUpdating(true);
    try {
      const updated = await activitiesService.updateApprovalStatus(
        activityId,
        status,
        status === 'rejected' || status === 'changes_requested' ? remarksInput : undefined
      );
      setActivities((prev) =>
        prev.map((a) => (a.id === activityId ? { ...a, ...updated } : a))
      );
      if (selectedActivity?.id === activityId) {
        setSelectedActivity({ ...selectedActivity, ...updated });
      }
      setRemarksInput('');
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const generatePDF = async (activity: ActivityWithUnit) => {
    setGeneratingPdf(true);
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      // Helper to check page break
      const checkPage = (needed: number) => {
        if (y + needed > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          y = margin;
        }
      };

      // Title Header
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('NSS Activity Report', pageWidth / 2, y, { align: 'center' });
      y += 12;

      doc.setDrawColor(0, 120, 80);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;

      // Activity Details
      const addField = (label: string, value: string) => {
        checkPage(12);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(label + ':', margin, y);
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(value, contentWidth - 40);
        doc.text(lines, margin + 40, y);
        y += lines.length * 5 + 3;
      };

      addField('Title', activity.title);
      addField('Type', activity.custom_type_name || typeLabels[activity.activity_type] || activity.activity_type);
      if (activity.unit_number) addField('Unit', activity.unit_number);
      if (activity.college_name) addField('College', activity.college_name);
      if (activity.college_district) addField('District', activity.college_district);
      addField('Date', new Date(activity.start_date).toLocaleDateString() + (activity.end_date ? ' - ' + new Date(activity.end_date).toLocaleDateString() : ''));
      if (activity.location) addField('Location', activity.location);
      if (activity.duration_hours) addField('Duration', `${activity.duration_hours} hours`);
      if (activity.students_attended) addField('Students', String(activity.students_attended));
      if (activity.organizer) addField('Organizer', activity.organizer);
      addField('Status', approvalLabels[activity.approval_status] || activity.approval_status);

      if (activity.description) {
        y += 5;
        checkPage(20);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Description:', margin, y);
        y += 6;
        doc.setFont('helvetica', 'normal');
        const descLines = doc.splitTextToSize(activity.description, contentWidth);
        doc.text(descLines, margin, y);
        y += descLines.length * 5 + 5;
      }

      // Report (strip HTML tags for PDF)
      if (activity.report) {
        y += 5;
        checkPage(20);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Activity Report', margin, y);
        y += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const plainReport = activity.report.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
        const reportLines = doc.splitTextToSize(plainReport, contentWidth);
        for (const line of reportLines) {
          checkPage(6);
          doc.text(line, margin, y);
          y += 5;
        }
        y += 5;
      }

      // Images
      if (activity.image_urls && activity.image_urls.length > 0) {
        checkPage(20);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Activity Images', margin, y);
        y += 10;

        for (const url of activity.image_urls) {
          try {
            const response = await fetch(url);
            const blob = await response.blob();
            const dataUrl = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            });

            const imgWidth = contentWidth;
            const imgHeight = 80;
            checkPage(imgHeight + 10);
            doc.addImage(dataUrl, 'JPEG', margin, y, imgWidth, imgHeight);
            y += imgHeight + 8;
          } catch {
            // Skip failed images
            checkPage(8);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'italic');
            doc.text('[Image could not be loaded]', margin, y);
            y += 8;
          }
        }
      }

      // Footer
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150);
        doc.text(
          `NSS APJKTU | Generated on ${new Date().toLocaleDateString()} | Page ${i} of ${totalPages}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
        doc.setTextColor(0);
      }

      doc.save(`activity_${activity.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
    } catch (err: any) {
      setError('Failed to generate PDF: ' + (err.message || ''));
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-isans">
      <DashboardNavigation mode="admin" />

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Activity Submissions</h1>
        <p className="text-sm text-gray-500 mb-6">Review and manage activity reports from NSS units</p>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-nss-500/20 focus:border-nss-500"
              />
            </div>

            {/* District */}
            <select
              value={filters.district || ''}
              onChange={(e) => setFilters((f) => ({ ...f, district: e.target.value || undefined }))}
              className="w-full appearance-none text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-nss-500/20 focus:border-nss-500"
            >
              <option value="">All Districts</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Activity Type */}
            <select
              value={filters.activity_type || ''}
              onChange={(e) => setFilters((f) => ({ ...f, activity_type: (e.target.value || undefined) as any }))}
              className="w-full appearance-none text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-nss-500/20 focus:border-nss-500"
            >
              <option value="">All Types</option>
              {Object.entries(typeLabels).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>

            {/* Approval Status */}
            <select
              value={filters.approval_status || ''}
              onChange={(e) => setFilters((f) => ({ ...f, approval_status: (e.target.value || undefined) as any }))}
              className="w-full appearance-none text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-nss-500/20 focus:border-nss-500"
            >
              <option value="">All Statuses</option>
              {Object.entries(approvalLabels).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-blood-50 border border-blood-200 rounded-xl p-4 mb-6 text-sm text-blood-800">
            {error}
            <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button>
          </div>
        )}

        {/* Activity List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="py-16 text-center">
            <ActivityIcon className="size-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-500">No activities found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedActivity(activity)}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="text-base font-semibold text-gray-900">{activity.title}</h3>
                      <Badge className={`${approvalColors[activity.approval_status]} border-0 text-xs`}>
                        {approvalLabels[activity.approval_status]}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {activity.custom_type_name || typeLabels[activity.activity_type]}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      {activity.unit_number && (
                        <span className="flex items-center gap-1"><Building className="size-3" />{activity.unit_number}</span>
                      )}
                      {activity.college_district && (
                        <span className="flex items-center gap-1"><MapPin className="size-3" />{activity.college_district}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {new Date(activity.start_date).toLocaleDateString()}
                      </span>
                      {activity.students_attended && (
                        <span className="flex items-center gap-1"><Users className="size-3" />{activity.students_attended} students</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); generatePDF(activity); }}
                      disabled={generatingPdf}
                      className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Download PDF"
                    >
                      {generatingPdf ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSelectedActivity(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-lg font-bold text-gray-900">Activity Details</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => generatePDF(selectedActivity)}
                  disabled={generatingPdf}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {generatingPdf ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
                  PDF
                </button>
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="text-gray-400 hover:text-gray-700 text-xl px-2"
                >
                  &times;
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Title + Badges */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedActivity.title}</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge className={`${approvalColors[selectedActivity.approval_status]} border-0`}>
                    {approvalLabels[selectedActivity.approval_status]}
                  </Badge>
                  <Badge variant="outline">
                    {selectedActivity.custom_type_name || typeLabels[selectedActivity.activity_type]}
                  </Badge>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                {selectedActivity.unit_number && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Unit</p>
                    <p className="text-sm font-medium">{selectedActivity.unit_number}</p>
                  </div>
                )}
                {selectedActivity.college_name && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">College</p>
                    <p className="text-sm font-medium">{selectedActivity.college_name}</p>
                  </div>
                )}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm font-medium">
                    {new Date(selectedActivity.start_date).toLocaleDateString()}
                    {selectedActivity.end_date && ` - ${new Date(selectedActivity.end_date).toLocaleDateString()}`}
                  </p>
                </div>
                {selectedActivity.location && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-medium">{selectedActivity.location}</p>
                  </div>
                )}
                {selectedActivity.duration_hours && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-sm font-medium">{selectedActivity.duration_hours} hours</p>
                  </div>
                )}
                {selectedActivity.students_attended && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Students Attended</p>
                    <p className="text-sm font-medium">{selectedActivity.students_attended}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              {selectedActivity.description && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
                  <p className="text-sm text-gray-600">{selectedActivity.description}</p>
                </div>
              )}

              {/* Report */}
              {selectedActivity.report && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Report</h4>
                  <div
                    className="prose prose-sm max-w-none text-gray-600 bg-gray-50 rounded-xl p-4"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedActivity.report) }}
                  />
                </div>
              )}

              {/* Images */}
              {selectedActivity.image_urls && selectedActivity.image_urls.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Images ({selectedActivity.image_urls.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedActivity.image_urls.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block">
                        <img
                          src={url}
                          alt={`Activity image ${i + 1}`}
                          className="w-full aspect-square object-cover rounded-xl border border-gray-200 hover:opacity-90 transition-opacity"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Remarks */}
              {selectedActivity.admin_remarks && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-yellow-800 mb-1">Admin Remarks</h4>
                  <p className="text-sm text-yellow-700">{selectedActivity.admin_remarks}</p>
                </div>
              )}

              {/* Status Actions */}
              <div className="border-t border-gray-100 pt-5">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Update Status</h4>

                <textarea
                  value={remarksInput}
                  onChange={(e) => setRemarksInput(e.target.value)}
                  placeholder="Add remarks (required for rejection/change request)..."
                  rows={2}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-nss-500/20 focus:border-nss-500 mb-3"
                />

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatusUpdate(selectedActivity.id, 'approved')}
                    disabled={isUpdating}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-tree-100 text-tree-700 hover:bg-tree-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <CheckCircle2 className="size-4" /> Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedActivity.id, 'changes_requested')}
                    disabled={isUpdating || !remarksInput.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <MessageSquare className="size-4" /> Request Changes
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedActivity.id, 'rejected')}
                    disabled={isUpdating || !remarksInput.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-blood-100 text-blood-700 hover:bg-blood-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <XCircle className="size-4" /> Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
}
