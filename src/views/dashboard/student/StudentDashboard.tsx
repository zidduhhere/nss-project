import { Navbar } from '@/components/common';

interface StudentDashboardProps {
    onLogout: () => void;
}

export default function StudentDashboard({ onLogout }: StudentDashboardProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
        </div>
    );
}