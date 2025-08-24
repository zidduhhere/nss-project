import { Calendar, MapPin, User, CheckCircle, Clock, XCircle, Plus, ExternalLink, Box, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Certificate {
    id: string;
    type: 'Blood Donation' | 'Tree Plantation' | 'Community Service' | 'Environmental';
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    verifiedBy?: string;
    submissionDate: string;
    college: string;
    details: string;
    points?: number;
    percentageChange?: number;
}

interface CertificatesSectionProps {
    certificates: Certificate[];
}

const statusConfig = {
    pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    approved: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
};

function CertificateCard({ certificate }: { certificate: Certificate }) {
    const StatusIcon = statusConfig[certificate.status].icon;
    const points = certificate.points || Math.floor(Math.random() * 50000) + 10000; // Random points for demo
    const percentageChange = certificate.percentageChange || (Math.random() > 0.5 ? Math.floor(Math.random() * 100) + 1 : -(Math.floor(Math.random() * 100) + 1));
    const isPositiveChange = percentageChange > 0;

    return (
        <div className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Box className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-gray-900 font-medium text-sm">{certificate.type}</h3>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusConfig[certificate.status].bg}`}>
                        <StatusIcon className={`h-3 w-3 ${statusConfig[certificate.status].color}`} />
                        <span className={statusConfig[certificate.status].color}>{certificate.status}</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mb-6">
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-gray-900 text-2xl font-bold">
                            {points.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-1 text-sm">
                            {isPositiveChange ? (
                                <TrendingUp className="w-3 h-3 text-green-500" />
                            ) : (
                                <TrendingDown className="w-3 h-3 text-red-500" />
                            )}
                            <span className={isPositiveChange ? 'text-green-500' : 'text-red-500'}>
                                {Math.abs(percentageChange)}%
                            </span>
                        </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{certificate.reason}</p>
                    <p className="text-gray-500 text-xs">{certificate.details}</p>
                </div>

                {/* Footer */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(certificate.submissionDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span>{certificate.college}</span>
                    </div>
                    {certificate.verifiedBy && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <User className="h-3 w-3" />
                            <span>Verified by {certificate.verifiedBy}</span>
                        </div>
                    )}
                </div>

                {/* View Report Button */}
                <button className="w-full text-left text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors border-t border-gray-200 pt-4">
                    View report
                </button>
            </div>
        </div>
    );
}

const CertificatesSection = ({ certificates }: CertificatesSectionProps) => {
    const navigate = useNavigate();

    return (
        <section className="mb-20">
            {/* Dark themed container matching the image */}
            <div className="bg-gray-900 rounded-3xl p-8 border border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-4xl font-thin text-white mb-2">Recent Activity</h2>
                        <p className="text-gray-400 text-sm max-w-2xl">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.
                        </p>
                    </div>

                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.slice(0, 3).map((certificate) => (
                        <CertificateCard key={certificate.id} certificate={certificate} />
                    ))}
                </div>

                {/* Additional action buttons */}
                <div className="mt-8 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/dashboard/student/submit')}
                        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-600"
                    >
                        <Plus className="h-4 w-4" />
                        Submit Activity
                    </button>
                    <button className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium">
                        View All Activities
                        <ExternalLink className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CertificatesSection;
