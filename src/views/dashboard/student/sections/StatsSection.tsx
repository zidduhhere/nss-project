import { Award, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Certificate } from './mockData';

interface StatsSectionProps {
    certificates: Certificate[];
}

const StatsSection = ({ certificates }: StatsSectionProps) => {
    const totalCertificates = certificates.length;
    const approvedCertificates = certificates.filter(cert => cert.status === 'approved').length;
    const pendingCertificates = certificates.filter(cert => cert.status === 'pending').length;

    const stats = [
        {
            title: 'Total Submissions',
            value: totalCertificates,
            icon: Award,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            borderColor: 'border-blue-200'
        },
        {
            title: 'Approved',
            value: approvedCertificates,
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            borderColor: 'border-green-200'
        },
        {
            title: 'Pending Review',
            value: pendingCertificates,
            icon: Clock,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100',
            borderColor: 'border-yellow-200'
        },
        {
            title: 'NSS Points',
            value: approvedCertificates * 20, // Assuming 20 points per approved certificate
            icon: TrendingUp,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
            borderColor: 'border-purple-200'
        }
    ];

    return (
        <section className="mb-16">
            <h2 className="text-4xl lg:text-6xl font-light text-gray-900 mb-6">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.title}
                            className={`bg-white rounded-xl shadow-sm border-2 ${stat.borderColor} p-6 hover:shadow-md transition-shadow`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default StatsSection;
