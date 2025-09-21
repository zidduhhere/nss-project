

import { useState } from 'react';
import { ArrowLeft, Droplets, TreePine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardNavigation from '@/components/common/DashboardNavigation';
import BloodDonationSubmission from '@/components/forms/BloodDonationSubmission';
import TreeTaggingSubmission from '@/components/forms/TreeTaggingSubmission';

type SubmissionType = 'blood-donation' | 'tree-tagging' | null;

const CertificateSubmission = () => {
    const navigate = useNavigate();
    const [selectedType, setSelectedType] = useState<SubmissionType>(null);

    const submissionTypes = [
        {
            id: 'blood-donation' as const,
            title: 'Blood Donation Certificate',
            description: 'Submit your blood donation certificate for NSS points',
            icon: Droplets,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-500',
            hoverColor: 'hover:bg-red-100'
        },
        {
            id: 'tree-tagging' as const,
            title: 'Tree Plantation Photos',
            description: 'Submit your tree plantation photos for NSS points',
            icon: TreePine,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-500',
            hoverColor: 'hover:bg-green-100'
        }
    ];

    // If a type is selected, show the corresponding form
    if (selectedType === 'blood-donation') {
        return (
            <div className="min-h-screen bg-gray-50">
                <DashboardNavigation mode="student" />
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Blood Donation Submission</h1>
                    <BloodDonationSubmission
                        onSuccess={() => navigate('/dashboard/student')}
                    />
                </div>
            </div>
        );
    }

    if (selectedType === 'tree-tagging') {
        return (
            <div className="min-h-screen bg-gray-50">
                <DashboardNavigation mode="student" />
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Tree Plantation Submission</h1>
                    <TreeTaggingSubmission
                        onSuccess={() => navigate('/dashboard/student')}
                    />
                </div>
            </div>
        );
    }

    // Default view - type selection
    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardNavigation mode="student" />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Submit Certificate</h1>
                </div>

                {/* Selection Cards */}
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Choose Submission Type</h2>
                        <p className="text-gray-600">Select the type of activity you want to submit for NSS points</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {submissionTypes.map((type) => {
                            const Icon = type.icon;

                            return (
                                <div
                                    key={type.id}
                                    onClick={() => setSelectedType(type.id)}
                                    className={`bg-white rounded-2xl shadow-lg p-8 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${type.hoverColor} border-2 border-transparent hover:${type.borderColor}`}
                                >
                                    <div className="text-center">
                                        <div className={`inline-flex items-center justify-center w-16 h-16 ${type.bgColor} rounded-full mb-6`}>
                                            <Icon className={`w-8 h-8 ${type.color}`} />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">{type.title}</h3>
                                        <p className="text-gray-600 mb-6">{type.description}</p>
                                        <button className={`inline-flex items-center px-6 py-3 ${type.bgColor} ${type.color} rounded-lg font-medium transition-colors hover:opacity-80`}>
                                            Select This Option
                                            <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Additional Info */}
                    <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Blood Donation Requirements:</h4>
                                <ul className="space-y-1 list-disc list-inside">
                                    <li>Official blood donation certificate</li>
                                    <li>Photo from the donation event (optional)</li>
                                    <li>Valid donation date and location</li>
                                    <li>Hospital or blood bank details</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Tree Plantation Requirements:</h4>
                                <ul className="space-y-1 list-disc list-inside">
                                    <li>Photo of planted tree with tag</li>
                                    <li>Photo of yourself with the tree</li>
                                    <li>Location and plantation date</li>
                                    <li>Tree species information</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificateSubmission;
