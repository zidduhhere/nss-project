import { BloodDonationSubmission, TreeTaggingSubmission } from '../../../models';
import { formatDate } from '../../../utils';
import { Droplets, TreePine, CheckCircle, XCircle, Award, Calendar } from 'lucide-react';

interface SubmissionHistoryProps {
    bloodSubmissions: BloodDonationSubmission[];
    treeSubmissions: TreeTaggingSubmission[];
}

export default function SubmissionHistory({ bloodSubmissions, treeSubmissions }: SubmissionHistoryProps) {
    const reviewedSubmissions = [
        ...bloodSubmissions.filter(sub => sub.status !== 'pending').map(sub => ({ ...sub, type: 'blood' as const })),
        ...treeSubmissions.filter(sub => sub.status !== 'pending').map(sub => ({ ...sub, type: 'tree' as const }))
    ].sort((a, b) => {
        const dateA = new Date(a.reviewedAt || a.submittedAt).getTime();
        const dateB = new Date(b.reviewedAt || b.submittedAt).getTime();
        return dateB - dateA;
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'rejected':
                return <XCircle className="h-5 w-5 text-red-500" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (reviewedSubmissions.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center">
                        <Calendar className="h-6 w-6 text-purple-500 mr-3" />
                        <h3 className="text-lg font-medium text-gray-900">Submission History</h3>
                    </div>
                </div>
                <div className="p-6 text-center">
                    <p className="text-gray-500">No reviewed submissions</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Calendar className="h-6 w-6 text-purple-500 mr-3" />
                        <h3 className="text-lg font-medium text-gray-900">Submission History</h3>
                    </div>
                    <span className="text-sm text-gray-500">
                        {reviewedSubmissions.length} reviewed submissions
                    </span>
                </div>
            </div>

            <div className="p-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {reviewedSubmissions.map((submission) => (
                        <div key={`${submission.type}-${submission.id}`} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        {submission.type === 'blood' ? (
                                            <Droplets className="h-6 w-6 text-red-500" />
                                        ) : (
                                            <TreePine className="h-6 w-6 text-green-500" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-gray-900">
                                            {submission.type === 'blood'
                                                ? `Blood Donation - ${(submission as BloodDonationSubmission).hospitalName}`
                                                : `Tree Tagging - ${(submission as TreeTaggingSubmission).treeName}`
                                            }
                                        </h4>
                                        <div className="mt-1 space-y-1">
                                            <p className="text-sm text-gray-500">
                                                Submitted: {formatDate(submission.submittedAt)}
                                            </p>
                                            {submission.reviewedAt && (
                                                <p className="text-sm text-gray-500">
                                                    Reviewed: {formatDate(submission.reviewedAt)}
                                                </p>
                                            )}
                                            {submission.type === 'blood' && (
                                                <p className="text-sm text-gray-600">
                                                    Units: {(submission as BloodDonationSubmission).unitsdonated}
                                                </p>
                                            )}
                                            {submission.type === 'tree' && (
                                                <p className="text-sm text-gray-600">
                                                    Scientific Name: {(submission as TreeTaggingSubmission).scientificName}
                                                </p>
                                            )}
                                            {submission.points && submission.status === 'approved' && (
                                                <p className="text-sm font-medium text-blue-600 flex items-center">
                                                    <Award className="h-4 w-4 mr-1" />
                                                    Points Awarded: {submission.points}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {getStatusIcon(submission.status)}
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(submission.status)}`}>
                                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
