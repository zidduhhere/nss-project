import { BloodDonationSubmission, TreeTaggingSubmission } from '../../../models';
import { formatDate } from '../../../utils';
import { Droplets, TreePine, Clock, CheckCircle, XCircle } from 'lucide-react';

interface SubmissionsListProps {
    bloodSubmissions: BloodDonationSubmission[];
    treeSubmissions: TreeTaggingSubmission[];
    showActions?: boolean;
}

export default function SubmissionsList({
    bloodSubmissions,
    treeSubmissions
}: SubmissionsListProps) {
    const allSubmissions = [
        ...bloodSubmissions.map(sub => ({ ...sub, type: 'blood' as const })),
        ...treeSubmissions.map(sub => ({ ...sub, type: 'tree' as const }))
    ].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'rejected':
                return <XCircle className="h-5 w-5 text-red-500" />;
            default:
                return <Clock className="h-5 w-5 text-yellow-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    if (allSubmissions.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No submissions found</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {allSubmissions.map((submission) => (
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
                                <p className="text-sm text-gray-500 mt-1">
                                    Submitted on {formatDate(submission.submittedAt)}
                                </p>
                                {submission.type === 'blood' && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        Units: {(submission as BloodDonationSubmission).unitsdonated}
                                    </p>
                                )}
                                {submission.type === 'tree' && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        Scientific Name: {(submission as TreeTaggingSubmission).scientificName}
                                    </p>
                                )}
                                {submission.points && (
                                    <p className="text-sm font-medium text-blue-600 mt-1">
                                        Points Awarded: {submission.points}
                                    </p>
                                )}
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
    );
}
