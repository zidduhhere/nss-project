import { useState } from 'react';
import { ArrowLeft, Droplets, TreePine, Heart, Leaf, Info, CheckCircle, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardNavigation from '@/components/common/DashboardNavigation';
import { Footer } from '@/components/ui';
import BloodDonationSubmission from '@/components/forms/BloodDonationSubmission';
import TreeTaggingSubmission from '@/components/forms/TreeTaggingSubmission';
import { DashboardHeader as CommonDashboardHeader } from '@/components/common';

type SubmissionType = 'blood-donation' | 'tree-tagging';

const ActivitySubmissionPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<SubmissionType>('blood-donation');

    const tabs = [
        {
            id: 'blood-donation' as const,
            label: 'Blood Donation',
            icon: Droplets,
            color: 'text-blood-600',
            bgColor: 'bg-blood-50',
            gradientFrom: 'from-blood-500',
            gradientTo: 'to-blood-600',
            borderColor: 'border-blood-500',
            hoverBg: 'hover:bg-blood-50',
            description: 'Submit your blood donation certificate',
            detailedDescription: 'Save lives by donating blood and earn recognition for your contribution',
            requirements: [
                'Official blood donation certificate',
                'Valid donation date and location',
                'Hospital or blood bank details',
                'Donation event photo (optional)'
            ]
        },
        {
            id: 'tree-tagging' as const,
            label: 'Tree Tagging',
            icon: TreePine,
            color: 'text-tree-600',
            bgColor: 'bg-tree-50',
            gradientFrom: 'from-tree-500',
            gradientTo: 'to-tree-600',
            borderColor: 'border-tree-500',
            hoverBg: 'hover:bg-tree-50',
            description: 'Submit your tree plantation documentation',
            detailedDescription: 'Contribute to environmental conservation through tree planting initiatives',
            requirements: [
                'Photo of planted tree with tag',
                'Photo of yourself with the tree',
                'Location and plantation date',
                'Tree species information'
            ]
        }
    ];

    const activeTabData = tabs.find(tab => tab.id === activeTab)!;
    const Icon = activeTabData.icon;

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardNavigation mode="student" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/dashboard/student')}
                    className="flex items-center text-gray-600 hover:text-nss-600 transition-colors mb-6 group"
                >
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Dashboard</span>
                </button>

                {/* Page Header */}
                <CommonDashboardHeader
                    title="Submit Activity"
                    subtitle="Document your NSS contributions and earn recognition"
                    icon={Upload}
                    className="mb-8"
                />

                {/* Modern Tab Selection */}
                <div className="mb-8">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {tabs.map((tab) => {
                                const TabIcon = tab.icon;
                                const isActive = activeTab === tab.id;

                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`relative flex items-center gap-4 p-5 rounded-xl transition-all duration-300 ${
                                            isActive
                                                ? `bg-gradient-to-br ${tab.gradientFrom} ${tab.gradientTo} text-white shadow-lg scale-[1.02]`
                                                : `${tab.hoverBg} text-gray-700 hover:shadow-md`
                                        }`}
                                    >
                                        <div className={`p-3 rounded-lg ${
                                            isActive ? 'bg-white/20' : tab.bgColor
                                        }`}>
                                            <TabIcon className={`w-7 h-7 ${
                                                isActive ? 'text-white' : tab.color
                                            }`} />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <div className={`font-bold text-lg mb-1 ${
                                                isActive ? 'text-white' : 'text-gray-900'
                                            }`}>
                                                {tab.label}
                                            </div>
                                            <div className={`text-sm ${
                                                isActive ? 'text-white/90' : 'text-gray-600'
                                            }`}>
                                                {tab.description}
                                            </div>
                                        </div>
                                        {isActive && (
                                            <CheckCircle className="w-6 h-6 text-white flex-shrink-0" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Main Form - 2 columns on large screens */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
                            {/* Form Header */}
                            <div className={`flex items-center gap-3 mb-6 pb-6 border-b`}>
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${activeTabData.gradientFrom} ${activeTabData.gradientTo}`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {activeTabData.label} Submission
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {activeTabData.detailedDescription}
                                    </p>
                                </div>
                            </div>

                            {/* Active Tab Content */}
                            {activeTab === 'blood-donation' && (
                                <div className="animate-fadeIn">
                                    <BloodDonationSubmission />
                                </div>
                            )}

                            {activeTab === 'tree-tagging' && (
                                <div className="animate-fadeIn">
                                    <TreeTaggingSubmission />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar - Info & Requirements */}
                    <div className="space-y-6">
                        {/* Requirements Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Info className="w-5 h-5 text-nss-600" />
                                <h3 className="font-bold text-lg text-gray-900">
                                    Requirements
                                </h3>
                            </div>
                            <ul className="space-y-3">
                                {activeTabData.requirements.map((requirement, index) => (
                                    <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                                        <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                                            activeTab === 'blood-donation' ? 'text-blood-500' : 'text-tree-500'
                                        }`} />
                                        <span>{requirement}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Impact Card */}
                        <div className={`bg-gradient-to-br ${activeTabData.gradientFrom} ${activeTabData.gradientTo} rounded-2xl shadow-lg p-6 text-white`}>
                            <div className="flex items-center gap-2 mb-4">
                                {activeTab === 'blood-donation' ? (
                                    <Heart className="w-6 h-6" />
                                ) : (
                                    <Leaf className="w-6 h-6" />
                                )}
                                <h3 className="font-bold text-lg">Your Impact</h3>
                            </div>
                            <p className="text-sm text-white/90 mb-4">
                                {activeTab === 'blood-donation' 
                                    ? 'One blood donation can save up to 3 lives. Your contribution makes a real difference in emergency care and medical treatments.'
                                    : 'Trees absorb CO₂, provide oxygen, and support biodiversity. Each tree planted contributes to a healthier planet for future generations.'
                                }
                            </p>
                            <div className="bg-white/20 rounded-lg p-4">
                                <div className="text-3xl font-bold mb-1">
                                    {activeTab === 'blood-donation' ? '3' : '22'}
                                </div>
                                <div className="text-sm text-white/80">
                                    {activeTab === 'blood-donation' 
                                        ? 'Lives saved per donation'
                                        : 'kg of CO₂ absorbed yearly'
                                    }
                                </div>
                            </div>
                        </div>

                        {/* Tips Card */}
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Info className="w-5 h-5 text-blue-600" />
                                Quick Tips
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 font-bold">•</span>
                                    <span>Ensure all documents are clear and readable</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 font-bold">•</span>
                                    <span>Upload files in JPG, PNG, or PDF format</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 font-bold">•</span>
                                    <span>Double-check all information before submitting</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 font-bold">•</span>
                                    <span>Your submission will be reviewed within 2-3 days</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-16">
                <Footer />
            </div>
        </div>
    );
};

export default ActivitySubmissionPage;
