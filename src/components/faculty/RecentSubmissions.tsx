import { CheckCircle, Clock, Droplets, TreePine } from 'lucide-react';

interface RecentSubmissionsProps {
    pendingBloodSubmissions: any[];
    pendingTreeSubmissions: any[];
}

export default function RecentSubmissions({ pendingBloodSubmissions, pendingTreeSubmissions }: RecentSubmissionsProps) {
    const totalPending = pendingBloodSubmissions.length + pendingTreeSubmissions.length;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Submissions</h3>
            </div>
            <div className="p-6">
                {totalPending === 0 ? (
                    <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                        <p className="text-gray-500">All submissions reviewed</p>
                        <p className="text-sm text-gray-400 mt-1">Great job staying on top of reviews!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {[...pendingBloodSubmissions.map(sub => ({ ...sub, type: 'blood' })),
                        ...pendingTreeSubmissions.map(sub => ({ ...sub, type: 'tree' }))]
                            .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
                            .slice(0, 5)
                            .map((submission, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                    <div className="flex items-center space-x-3">
                                        {submission.type === 'blood' ? (
                                            <Droplets className="h-5 w-5 text-red-500" />
                                        ) : (
                                            <TreePine className="h-5 w-5 text-green-500" />
                                        )}
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {submission.type === 'blood' ? 'Blood Donation' : 'Tree Tagging'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Submitted {new Date(submission.submittedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Clock className="h-4 w-4 text-yellow-600" />
                                        <span className="text-sm font-medium text-yellow-800">Pending Review</span>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}
