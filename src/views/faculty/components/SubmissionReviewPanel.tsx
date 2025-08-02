import { BloodDonationSubmission, TreeTaggingSubmission, SubmissionType } from '../../../models';
import { formatDate } from '../../../utils';
import { Droplets, TreePine, CheckCircle, XCircle, Clock, Award } from 'lucide-react';

interface SubmissionReviewPanelProps {
    type: SubmissionType;
    submissions: (BloodDonationSubmission | TreeTaggingSubmission)[];
    selectedSubmission: any;
    points: string;
    onSelectSubmission: (submission: any) => void;
    onPointsChange: (points: string) => void;
    onApprove: (type: SubmissionType, id: string) => Promise<void>;
    onReject: (type: SubmissionType, id: string) => Promise<void>;
}

export default function SubmissionReviewPanel({
    type,
    submissions,
    selectedSubmission,
    points,
    onSelectSubmission,
    onPointsChange,
    onApprove,
    onReject
}: SubmissionReviewPanelProps) {
    const isBloodType = type === 'blood';
    const icon = isBloodType ? Droplets : TreePine;
    const color = isBloodType ? 'red' : 'green';
    const title = isBloodType ? 'Blood Donation Submissions' : 'Tree Tagging Submissions';

    if (submissions.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center">
                        {icon({ className: `h-6 w-6 text-${color}-500 mr-3` })}
                        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                    </div>
                </div>
                <div className="p-6 text-center">
                    <p className="text-gray-500">No pending submissions</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Submissions List */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center">
                        {icon({ className: `h-6 w-6 text-${color}-500 mr-3` })}
                        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                        <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                            {submissions.length} pending
                        </span>
                    </div>
                </div>
                <div className="p-6">
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {submissions.map((submission) => (
                            <div
                                key={submission.id}
                                onClick={() => onSelectSubmission(submission)}
                                className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedSubmission?.id === submission.id
                                        ? `border-${color}-500 bg-${color}-50`
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-gray-900">
                                            {isBloodType
                                                ? (submission as BloodDonationSubmission).hospitalName
                                                : (submission as TreeTaggingSubmission).treeName
                                            }
                                        </h4>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Submitted on {formatDate(submission.submittedAt)}
                                        </p>
                                        {isBloodType && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                Units: {(submission as BloodDonationSubmission).unitsdonated}
                                            </p>
                                        )}
                                        {!isBloodType && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                Location: {(submission as TreeTaggingSubmission).location}
                                            </p>
                                        )}
                                    </div>
                                    <Clock className="h-5 w-5 text-yellow-500" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Submission Details & Review */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Review Submission</h3>
                </div>
                <div className="p-6">
                    {selectedSubmission ? (
                        <div className="space-y-6">
                            {/* Submission Details */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Submission Details</h4>
                                <div className="space-y-2">
                                    {isBloodType ? (
                                        <>
                                            <p><span className="font-medium">Hospital:</span> {selectedSubmission.hospitalName}</p>
                                            <p><span className="font-medium">Date:</span> {formatDate(selectedSubmission.donationDate)}</p>
                                            <p><span className="font-medium">Units:</span> {selectedSubmission.unitsdonated}</p>
                                            {selectedSubmission.donationCase && (
                                                <p><span className="font-medium">Case:</span> {selectedSubmission.donationCase}</p>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <p><span className="font-medium">Tree Name:</span> {selectedSubmission.treeName}</p>
                                            <p><span className="font-medium">Scientific Name:</span> {selectedSubmission.scientificName}</p>
                                            <p><span className="font-medium">Location:</span> {selectedSubmission.location}</p>
                                            <p><span className="font-medium">Student:</span> {selectedSubmission.studentName}</p>
                                        </>
                                    )}
                                    <p><span className="font-medium">Submitted:</span> {formatDate(selectedSubmission.submittedAt)}</p>
                                </div>
                            </div>

                            {/* Points Input */}
                            <div>
                                <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-2">
                                    <Award className="inline h-4 w-4 mr-1" />
                                    Points to Award
                                </label>
                                <input
                                    type="number"
                                    id="points"
                                    value={points}
                                    onChange={(e) => onPointsChange(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter points (1-100)"
                                    min="1"
                                    max="100"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => onApprove(type, selectedSubmission.id)}
                                    className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                </button>
                                <button
                                    onClick={() => onReject(type, selectedSubmission.id)}
                                    className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Select a submission to review</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
