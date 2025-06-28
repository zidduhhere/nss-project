import React, { useState } from 'react';
import { Users, Droplets, TreePine, CheckCircle, XCircle, Clock, Award } from 'lucide-react';
import Layout from '../Layout';
import { useApp } from '../../context/AppContext';

export default function FacultyDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'blood' | 'tree'>('overview');
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [points, setPoints] = useState('');
  const { bloodDonationSubmissions, treeTaggingSubmissions, approveSubmission, rejectSubmission } = useApp();

  const pendingBloodSubmissions = bloodDonationSubmissions.filter(sub => sub.status === 'pending');
  const pendingTreeSubmissions = treeTaggingSubmissions.filter(sub => sub.status === 'pending');
  const totalPending = pendingBloodSubmissions.length + pendingTreeSubmissions.length;

  const stats = [
    {
      title: 'Pending Reviews',
      value: totalPending,
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Blood Donations',
      value: bloodDonationSubmissions.length,
      icon: Droplets,
      color: 'bg-red-500'
    },
    {
      title: 'Tree Tagging',
      value: treeTaggingSubmissions.length,
      icon: TreePine,
      color: 'bg-green-500'
    },
    {
      title: 'Total Approved',
      value: [...bloodDonationSubmissions, ...treeTaggingSubmissions].filter(sub => sub.status === 'approved').length,
      icon: CheckCircle,
      color: 'bg-blue-500'
    }
  ];

  const handleApprove = (type: 'blood' | 'tree', id: string) => {
    const pointsValue = parseInt(points) || 10;
    approveSubmission(type, id, pointsValue);
    setSelectedSubmission(null);
    setPoints('');
  };

  const handleReject = (type: 'blood' | 'tree', id: string) => {
    rejectSubmission(type, id);
    setSelectedSubmission(null);
  };

  const renderSubmissionCard = (submission: any, type: 'blood' | 'tree') => (
    <div key={submission.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
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
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          submission.status === 'approved' 
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
            onClick={() => setSelectedSubmission({ ...submission, type })}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Approve
          </button>
          <button
            onClick={() => handleReject(type, submission.id)}
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'blood':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Blood Donation Submissions</h3>
              <span className="text-sm text-gray-500">
                {pendingBloodSubmissions.length} pending reviews
              </span>
            </div>
            {bloodDonationSubmissions.length === 0 ? (
              <div className="text-center py-8">
                <Droplets className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No blood donation submissions yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bloodDonationSubmissions.map(submission => 
                  renderSubmissionCard(submission, 'blood')
                )}
              </div>
            )}
          </div>
        );
      case 'tree':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Tree Tagging Submissions</h3>
              <span className="text-sm text-gray-500">
                {pendingTreeSubmissions.length} pending reviews
              </span>
            </div>
            {treeTaggingSubmissions.length === 0 ? (
              <div className="text-center py-8">
                <TreePine className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No tree tagging submissions yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {treeTaggingSubmissions.map(submission => 
                  renderSubmissionCard(submission, 'tree')
                )}
              </div>
            )}
          </div>
        );
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
          </div>
        );
    }
  };

  return (
    <Layout title="Faculty Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white p-6">
          <h2 className="text-2xl font-bold mb-2">Faculty Review Panel</h2>
          <p className="text-indigo-100">Review and approve student NSS activity submissions.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-indigo-500 text-indigo-600'
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
                <span>Blood Donations</span>
                {pendingBloodSubmissions.length > 0 && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    {pendingBloodSubmissions.length}
                  </span>
                )}
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
                {pendingTreeSubmissions.length > 0 && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {pendingTreeSubmissions.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>

        {/* Approval Modal */}
        {selectedSubmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Approve Submission</h3>
              <p className="text-gray-600 mb-4">
                Assign points for this {selectedSubmission.type === 'blood' ? 'blood donation' : 'tree tagging'} submission.
              </p>
              <div className="mb-4">
                <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-2">
                  Points to Award
                </label>
                <input
                  type="number"
                  id="points"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter points (default: 10)"
                  min="1"
                  max="100"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleApprove(selectedSubmission.type, selectedSubmission.id)}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}