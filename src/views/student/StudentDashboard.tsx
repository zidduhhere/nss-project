import { useState } from 'react';
import { Calendar, Droplets, TreePine, Award, FileText, Plus } from 'lucide-react';
import { User } from '../../models';
import { useStudentViewModel } from '../../viewmodels';
import { Layout, StatCard, LoadingSpinner, ErrorMessage } from '../common';
import { BloodDonationForm, TreeTaggingForm, SubmissionsList } from './components';

interface StudentDashboardProps {
    user: User;
    onLogout: () => void;
}

export default function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'blood' | 'tree'>('overview');
    const viewModel = useStudentViewModel(user.id);

    const stats = [
        {
            title: 'Total Points',
            value: viewModel.stats.totalPoints,
            icon: Award,
            color: 'bg-yellow-500'
        },
        {
            title: 'Blood Donations',
            value: viewModel.stats.bloodDonations,
            icon: Droplets,
            color: 'bg-red-500'
        },
        {
            title: 'Tree Tagging',
            value: viewModel.stats.treeTagging,
            icon: TreePine,
            color: 'bg-green-500'
        },
        {
            title: 'Pending Reviews',
            value: viewModel.stats.pendingReviews,
            icon: FileText,
            color: 'bg-blue-500'
        }
    ];

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

                        {/* Recent Submissions */}
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Recent Submissions</h3>
                            </div>
                            <div className="p-6">
                                <SubmissionsList
                                    bloodSubmissions={viewModel.bloodSubmissions.slice(0, 5)}
                                    treeSubmissions={viewModel.treeSubmissions.slice(0, 5)}
                                    showActions={false}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'blood':
                return <BloodDonationForm onSubmit={viewModel.submitBloodDonation} />;

            case 'tree':
                return <TreeTaggingForm onSubmit={viewModel.submitTreeTagging} studentName={user.name} />;

            default:
                return null;
        }
    };

    if (viewModel.isLoading) {
        return (
            <Layout title="Student Dashboard" user={user} onLogout={onLogout}>
                <LoadingSpinner size="lg" message="Loading dashboard..." />
            </Layout>
        );
    }

    return (
        <Layout title="Student Dashboard" user={user} onLogout={onLogout}>
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
                        <Calendar className="inline h-5 w-5 mr-2" />
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('blood')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'blood'
                            ? 'border-red-500 text-red-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <Plus className="inline h-5 w-5 mr-2" />
                        Submit Blood Donation
                    </button>
                    <button
                        onClick={() => setActiveTab('tree')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'tree'
                            ? 'border-green-500 text-green-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <Plus className="inline h-5 w-5 mr-2" />
                        Submit Tree Tagging
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            {renderTabContent()}
        </Layout>
    );
}
