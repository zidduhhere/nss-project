import { Droplets, TreePine, Award } from 'lucide-react';

interface SubmissionCardProps {
    submission: any;
    type: 'blood' | 'tree';
    onApprove: (type: 'blood' | 'tree', id: string) => void;
    onReject: (type: 'blood' | 'tree', id: string) => void;
}

export default function SubmissionCard({ submission, type, onApprove, onReject }: SubmissionCardProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    {type === 'blood' ? (
                        <Droplets className="h-6 w-6 text-red-500" />
                    ) : (
                        <TreePine className="h-6 w-6 text-green-500" />
                    )}
                    <div>
                        <h3 className="font-semibold text-gray-900">
                            {type === 'blood' ? 'Blood Donation' : 'Tree Tagging'}
                        </h3>
                        <p className="text-sm text-gray-500">
                            Submitted on {new Date(submission.submittedAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${submission.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : submission.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
                {type === 'blood' ? (
                    <>
                        <p><span className="font-medium">Hospital:</span> {submission.hospitalName}</p>
                        <p><span className="font-medium">Date:</span> {submission.donationDate}</p>
                        <p><span className="font-medium">Units:</span> {submission.unitsdonated}</p>
                        {submission.donationCase && (
                            <p><span className="font-medium">Case:</span> {submission.donationCase}</p>
                        )}
                    </>
                ) : (
                    <>
                        <p><span className="font-medium">Student:</span> {submission.studentName}</p>
                        <p><span className="font-medium">Tree:</span> {submission.treeName}</p>
                        <p><span className="font-medium">Scientific Name:</span> {submission.scientificName}</p>
                        <p><span className="font-medium">Location:</span> {submission.location}</p>
                    </>
                )}
            </div>

            {submission.status === 'pending' && (
                <div className="flex space-x-2">
                    <button
                        onClick={() => onApprove(type, submission.id)}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                        Approve
                    </button>
                    <button
                        onClick={() => onReject(type, submission.id)}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                        Reject
                    </button>
                </div>
            )}

            {submission.status === 'approved' && submission.points && (
                <div className="flex items-center space-x-2 text-green-600">
                    <Award className="h-4 w-4" />
                    <span className="text-sm font-medium">Awarded {submission.points} points</span>
                </div>
            )}
        </div>
    );
}
