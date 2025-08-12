import { FileText } from 'lucide-react';
import SubmissionCard from './SubmissionCard';

interface SubmissionsListProps {
    submissions: any[];
    type: 'blood' | 'tree';
    title: string;
    onApprove: (type: 'blood' | 'tree', id: string) => void;
    onReject: (type: 'blood' | 'tree', id: string) => void;
}

export default function SubmissionsList({
    submissions,
    type,
    title,
    onApprove,
    onReject
}: SubmissionsListProps) {
    const pendingCount = submissions.filter(sub => sub.status === 'pending').length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <span className="text-sm text-gray-500">
                    {pendingCount} pending reviews
                </span>
            </div>

            {submissions.length === 0 ? (
                <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No submissions yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                        {type === 'blood' ? 'Blood donation' : 'Tree tagging'} submissions will appear here
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {submissions.map((submission) => (
                        <SubmissionCard
                            key={submission.id}
                            submission={submission}
                            type={type}
                            onApprove={onApprove}
                            onReject={onReject}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
