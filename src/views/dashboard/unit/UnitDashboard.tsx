import DashboardNavigation from '../../../components/common/DashboardNavigation';

interface UnitDashboardProps {
    user?: { name?: string; role?: string } | null;
}

export default function UnitDashboard({ }: UnitDashboardProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardNavigation mode="unit" />
            <div className="space-y-6 mt-24 px-6">
                {/* Dashboard content will be added here */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Welcome to NSS Unit Dashboard
                        </h2>
                        <p className="text-gray-600">
                            Dashboard content will be available soon.
                            Use the navigation to access volunteers, activities, and other unit features.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
