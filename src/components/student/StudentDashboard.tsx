import React, { useState } from 'react';
import { Calendar, Droplets, TreePine, Award, FileText, Plus } from 'lucide-react';
import Layout from '../Layout';
import { useApp } from '../../context/AppContext';
import BloodDonationForm from './BloodDonationForm';
import TreeTaggingForm from './TreeTaggingForm';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'blood' | 'tree'>('overview');
  const { user, bloodDonationSubmissions, treeTaggingSubmissions } = useApp();

  const userSubmissions = {
    blood: bloodDonationSubmissions.filter(sub => sub.studentId === user?.id),
    tree: treeTaggingSubmissions.filter(sub => sub.studentId === user?.id)
  };

  const totalPoints = [
    ...userSubmissions.blood.filter(sub => sub.status === 'approved'),
    ...userSubmissions.tree.filter(sub => sub.status === 'approved')
  ].reduce((sum, sub) => sum + (sub.points || 0), 0);

  const stats = [
    {
      title: 'Total Points',
      value: totalPoints,
      icon: Award,
      color: 'bg-yellow-500'
    },
    {
      title: 'Blood Donations',
      value: userSubmissions.blood.length,
      icon: Droplets,
      color: 'bg-red-500'
    },
    {
      title: 'Tree Tagging',
      value: userSubmissions.tree.length,
      icon: TreePine,
      color: 'bg-green-500'
    },
    {
      title: 'Pending Reviews',
      value: [...userSubmissions.blood, ...userSubmissions.tree].filter(sub => sub.status === 'pending').length,
      icon: FileText,
      color: 'bg-blue-500'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'blood':
        return <BloodDonationForm />;
      case 'tree':
        return <TreeTaggingForm />;
      default:
        return (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Submissions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Submissions</h3>
              </div>
              <div className="p-6">
                {[...userSubmissions.blood, ...userSubmissions.tree].length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No submissions yet</p>
                    <p className="text-sm text-gray-400 mt-1">Start by submitting your first activity</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[...userSubmissions.blood.map(sub => ({ ...sub, type: 'blood' })), 
                      ...userSubmissions.tree.map(sub => ({ ...sub, type: 'tree' }))]
                      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
                      .slice(0, 5)
                      .map((submission, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
                                {new Date(submission.submittedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              submission.status === 'approved' 
                                ? 'bg-green-100 text-green-800'
                                : submission.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                            </span>
                            {submission.status === 'approved' && submission.points && (
                              <span className="text-sm font-medium text-gray-600">
                                +{submission.points} pts
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout title="Student Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white p-6">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
          <p className="text-blue-100">Track your NSS activities and earn points for your contributions.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('blood')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'blood'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Droplets className="h-4 w-4" />
                <span>Blood Donation</span>
                <Plus className="h-3 w-3" />
              </button>
              <button
                onClick={() => setActiveTab('tree')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'tree'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <TreePine className="h-4 w-4" />
                <span>Tree Tagging</span>
                <Plus className="h-3 w-3" />
              </button>
            </nav>
          </div>
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </Layout>
  );
}