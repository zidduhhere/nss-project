import Footer from '@/components/ui/Footer';
import { CertificatesSection, ActivitiesSection, DashboardHeader, StatsSection } from './sections';
import { mockCertificates, mockActivities } from './sections/mockData';

interface StudentDashboardProps {
    onLogout: () => void;
}

export default function StudentDashboard({ }: StudentDashboardProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader />

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Section 0: Stats Overview */}
                <StatsSection certificates={mockCertificates} />

                {/* Section 1: Certificates Grid */}
                <CertificatesSection certificates={mockCertificates} />

                {/* Section 2: Activities List */}
                <ActivitiesSection activities={mockActivities} />
            </div>

            {/* Section 3: Footer */}
            <Footer />
        </div>
    );
}