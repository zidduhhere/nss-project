import { useState } from 'react';
import { ArrowLeft, Droplets, TreePine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardNavigation from '@/components/common/DashboardNavigation';
import { Footer } from '@/components/ui';
import BloodDonationSubmission from '@/components/forms/BloodDonationSubmission';
import TreeTaggingSubmission from '@/components/forms/TreeTaggingSubmission';

type SubmissionType = 'blood-donation' | 'tree-tagging';

const ActivitySubmissionPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<SubmissionType>('blood-donation');

    const tabs = [
        {
            id: 'blood-donation' as const,
            label: 'Blood Donation',
            icon: Droplets,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-500',
            description: 'Submit your blood donation certificate'
        },
        {
            id: 'tree-tagging' as const,
            label: 'Tree Tagging',
            icon: TreePine,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-500',
            description: 'Submit your tree plantation photos'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <DashboardNavigation mode="student" />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <button
                        onClick={() => navigate('/dashboard/student')}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
                    >
                        <ArrowLeft className="w-5 h-5 mr-1" />
                        Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Submit Activity</h1>
                </div>

                {/* Tab Selection */}
                <div className="max-w-4xl mx-auto mb-8">
                    <div className="flex space-x-4 bg-white rounded-xl p-2 shadow-lg">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center p-4 rounded-lg transition-all duration-200 ${isActive
                                        ? `${tab.bgColor} ${tab.borderColor} border-2 ${tab.color}`
                                        : 'text-gray-600 hover:bg-gray-50 border-2 border-transparent'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 mr-3 ${isActive ? tab.color : 'text-gray-400'}`} />
                                    <div className="text-left">
                                        <div className="font-semibold">{tab.label}</div>
                                        <div className="text-sm opacity-75">{tab.description}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Active Tab Content */}
                <div className="max-w-4xl mx-auto">
                    {activeTab === 'blood-donation' && (
                        <div className="transform transition-all duration-300 ease-in-out">
                            <BloodDonationSubmission />
                        </div>
                    )}

                    {activeTab === 'tree-tagging' && (
                        <div className="transform transition-all duration-300 ease-in-out">
                            <TreeTaggingSubmission />
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-16">
                <Footer />
            </div>
        </div>
    );
};

export default ActivitySubmissionPage;
