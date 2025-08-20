import { Layout } from '../common';
import { useMasterAuth } from '../../context/MasterAuthContext';

interface FacultyDashboardProps {
  user?: { name?: string; role?: string } | null;
  onLogout?: () => void;
}

export default function FacultyDashboard({ user: propUser, onLogout }: FacultyDashboardProps) {
  const { currentUser } = useMasterAuth();
  const currentUserResolved = propUser || currentUser;

  return (
    <Layout title="Faculty Dashboard" user={currentUserResolved as any} onLogout={onLogout || (() => { })}>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white p-6">
          <h2 className="text-2xl font-bold mb-2">Faculty Dashboard</h2>
          <p className="text-indigo-100">Activity submission features have been removed for this simplified view.</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-2">Overview</h3>
          <p className="text-gray-600 text-sm">This area previously displayed submission statistics and moderation tools. Those have now been stripped out as requested.</p>
        </div>
      </div>
    </Layout>
  );
}