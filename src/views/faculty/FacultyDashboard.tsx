import { useState } from 'react';
import { Users, Droplets, TreePine, CheckCircle, Clock, Award } from 'lucide-react';
import { User, SubmissionType } from '../../models';
import { useFacultyViewModel } from '../../viewmodels';
import { Layout, StatCard, LoadingSpinner, ErrorMessage } from '../common';
import { SubmissionReviewPanel, SubmissionHistory } from './components';

interface FacultyDashboardProps {
    user: User;
    onLogout: () => void;
}

export default function FacultyDashboard({ user, onLogout }: FacultyDashboardProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'blood' | 'tree' | 'history'>('overview');
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
    const [points, setPoints] = useState('');
    const viewModel = useFacultyViewModel(user.id);

    const stats = [
        {
            title: 'Pending Reviews',
            value: viewModel.stats.pendingReviews,
            icon: Clock,
            color: 'bg-yellow-500'
        },
        {
            title: 'Blood Donations',
            value: viewModel.stats.totalBloodDonations,
            icon: Droplets,
            color: 'bg-red-500'
        },
        {
            title: 'Tree Tagging',
            value: viewModel.stats.totalTreeTagging,
            icon: TreePine,
            color: 'bg-green-500'
        },
        {
            title: 'Total Approved',
            value: viewModel.stats.totalApproved,
            icon: CheckCircle,
            color: 'bg-blue-500'
        }
    ];

    const handleApprove = async (type: SubmissionType, id: string) => {
        const pointsValue = parseInt(points) || 10;
        const success = await viewModel.approveSubmission(type, id, pointsValue);
        if (success) {
            setSelectedSubmission(null);
            setPoints('');
        }
    };

    const handleReject = async (type: SubmissionType, id: string) => {
        const success = await viewModel.rejectSubmission(type, id);
        if (success) {
            setSelectedSubmission(null);
            setPoints('');
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <StatCard
                                    key={index}
                                    title={stat.title}
                                    value={stat.value}
                                    icon={stat.icon}
                                    color={stat.color}
                                />
                            ))}
                        </div>

                        {/* Pending Submissions Summary */}
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Pending Reviews</h3>
                            </div>
                            <div className="p-6">
                                {viewModel.stats.pendingReviews === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No pending submissions</p>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-sm text-gray-600">
                                            You have {viewModel.pendingBloodSubmissions.length} blood donation(s) and{' '}
                                            {viewModel.pendingTreeSubmissions.length} tree tagging submission(s) pending review.
                                        </p>
                                        <div className="flex space-x-4">
                                            <button
                                                onClick={() => setActiveTab('blood')}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                                            >
                                                <Droplets className="h-4 w-4 mr-2" />
                                                Review Blood Donations
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('tree')}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                                            >
                                                <TreePine className="h-4 w-4 mr-2" />
                                                Review Tree Tagging
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 'blood':
                return (
                    <SubmissionReviewPanel
                        type="blood"
                        submissions={viewModel.pendingBloodSubmissions}
                        selectedSubmission={selectedSubmission}
                        points={points}
                        onSelectSubmission={setSelectedSubmission}
                        onPointsChange={setPoints}
                        onApprove={handleApprove}
                        onReject={handleReject}
                    />
                );

            case 'tree':
                return (
                    <SubmissionReviewPanel
                        type="tree"
                        submissions={viewModel.pendingTreeSubmissions}
                        selectedSubmission={selectedSubmission}
                        points={points}
                        onSelectSubmission={setSelectedSubmission}
                        onPointsChange={setPoints}
                        onApprove={handleApprove}
                        onReject={handleReject}
                    />
                );

            case 'history':
                return (
                    <SubmissionHistory
                        bloodSubmissions={viewModel.bloodSubmissions}
                        treeSubmissions={viewModel.treeSubmissions}
                    />
                );

            default:
                return null;
        }
    };

    if (viewModel.isLoading) {
        return (
            <Layout title="Faculty Dashboard" user={user} onLogout={onLogout}>
                <LoadingSpinner size="lg" message="Loading dashboard..." />
            </Layout>
        );
    }

    return (
        <Layout title="Faculty Dashboard" user={user} onLogout={onLogout}>
            {viewModel.error && (
                <div className="mb-6">
                    <ErrorMessage message={viewModel.error} type="error" onClose={viewModel.clearError} />
                </div>
            )}

            {/* Tab Navigation */}
            <div className="mb-6">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <Users className="inline h-5 w-5 mr-2" />
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('blood')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'blood'
                            ? 'border-red-500 text-red-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <Droplets className="inline h-5 w-5 mr-2" />
                        Blood Donations {viewModel.pendingBloodSubmissions.length > 0 && (
                            <span className="ml-1 px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">
                                {viewModel.pendingBloodSubmissions.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('tree')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'tree'
                            ? 'border-green-500 text-green-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <TreePine className="inline h-5 w-5 mr-2" />
                        Tree Tagging {viewModel.pendingTreeSubmissions.length > 0 && (
                            <span className="ml-1 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                                {viewModel.pendingTreeSubmissions.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'history'
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <Award className="inline h-5 w-5 mr-2" />
                        History
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            {renderTabContent()}
        </Layout>
    );
}
