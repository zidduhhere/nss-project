import { useState } from 'react';
import { Droplets, TreePine, CheckCircle, Clock } from 'lucide-react';
import { Layout } from '../common';
import { useApp } from '../../context/AppContext';
import StatsGrid from './StatsGrid';
import RecentSubmissions from './RecentSubmissions';
import SubmissionsList from './SubmissionsList';
import ApprovalModal from './ApprovalModal';

interface FacultyDashboardProps {
  user: {
    id: string;
    name: string;
    role: string;
  } | null;
  onLogout: () => void;
}

export default function FacultyDashboard({ user: propUser, onLogout }: FacultyDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'blood' | 'tree'>('overview');
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const { user, bloodDonationSubmissions, treeTaggingSubmissions, approveSubmission, rejectSubmission } = useApp();

  // Use propUser if available, otherwise fallback to context user
  const currentUser = propUser || user;

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
      title: 'Approved',
      value: [...bloodDonationSubmissions, ...treeTaggingSubmissions].filter(sub => sub.status === 'approved').length,
      icon: CheckCircle,
      color: 'bg-blue-500'
    }
  ];

  const handleApproveWithPoints = async (type: 'blood' | 'tree', id: string, points: number) => {
    try {
      await approveSubmission(type, id, points);
      setSelectedSubmission(null);
    } catch (error) {
      console.error('Error approving submission:', error);
    }
  };

  const handleReject = async (type: 'blood' | 'tree', id: string) => {
    try {
      await rejectSubmission(type, id);
    } catch (error) {
      console.error('Error rejecting submission:', error);
    }
  };

  const handleApprove = (type: 'blood' | 'tree', id: string) => {
    const submission = type === 'blood'
      ? bloodDonationSubmissions.find(sub => sub.id === id)
      : treeTaggingSubmissions.find(sub => sub.id === id);

    if (submission) {
      setSelectedSubmission({ ...submission, type });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'blood':
        return (
          <SubmissionsList
            submissions={bloodDonationSubmissions}
            type="blood"
            title="Blood Donation Submissions"
            onApprove={handleApprove}
            onReject={handleReject}
          />
        );
      case 'tree':
        return (
          <SubmissionsList
            submissions={treeTaggingSubmissions}
            type="tree"
            title="Tree Tagging Submissions"
            onApprove={handleApprove}
            onReject={handleReject}
          />
        );
      default:
        return (
          <div className="space-y-8">
            <StatsGrid stats={stats} />
            <RecentSubmissions
              pendingBloodSubmissions={pendingBloodSubmissions}
              pendingTreeSubmissions={pendingTreeSubmissions}
            />
          </div>
        );
    }
  };

  return (
    <Layout title="Faculty Dashboard" user={currentUser} onLogout={onLogout}>
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
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('blood')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === 'blood'
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
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === 'tree'
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
      </div>

      {/* Approval Modal */}
      {selectedSubmission && (
        <ApprovalModal
          submission={selectedSubmission}
          type={selectedSubmission.type}
          onClose={() => setSelectedSubmission(null)}
          onApprove={handleApproveWithPoints}
        />
      )}
    </Layout>
  );
}