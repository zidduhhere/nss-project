import { useState } from 'react';
import { X } from 'lucide-react';

interface ApprovalModalProps {
    submission: any;
    type: 'blood' | 'tree';
    onClose: () => void;
    onApprove: (type: 'blood' | 'tree', id: string, points: number) => void;
}

export default function ApprovalModal({ submission, type, onClose, onApprove }: ApprovalModalProps) {
    const [points, setPoints] = useState('');

    const handleApprove = () => {
        const pointsValue = parseInt(points);
        if (pointsValue > 0) {
            onApprove(type, submission.id, pointsValue);
            onClose();
        }
    };

    if (!submission) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Approve Submission</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-600 mb-2">
                            {type === 'blood' ? 'Blood Donation' : 'Tree Tagging'} Submission
                        </p>
                        <div className="bg-gray-50 p-3 rounded-lg text-sm">
                            {type === 'blood' ? (
                                <>
                                    <p><strong>Hospital:</strong> {submission.hospitalName}</p>
                                    <p><strong>Date:</strong> {submission.donationDate}</p>
                                    <p><strong>Units:</strong> {submission.unitsdonated}</p>
                                </>
                            ) : (
                                <>
                                    <p><strong>Tree:</strong> {submission.treeName}</p>
                                    <p><strong>Location:</strong> {submission.location}</p>
                                    <p><strong>Date:</strong> {new Date(submission.submittedAt).toLocaleDateString()}</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Award Points
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={points}
                            onChange={(e) => setPoints(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter points (1-100)"
                        />
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApprove}
                            disabled={!points || parseInt(points) <= 0}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Approve & Award Points
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
