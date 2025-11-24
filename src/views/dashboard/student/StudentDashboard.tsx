import Footer from '@/components/ui/Footer';
import DashboardHeader from './sections/DashboardHeader';
interface StudentDashboardProps {
    onLogout: () => void;
}

export default function StudentDashboard({ }: StudentDashboardProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader />

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className='flex justify-center items-center'>
                    <h1>Dashboard feature coming soon</h1>
                </div>
            </div>

            {/* Section 3: Footer */}
            <div className="mt-16">
                <Footer />
            </div>
        </div>
    );
}