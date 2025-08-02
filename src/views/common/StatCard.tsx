import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: number;
    icon: LucideIcon;
    color: string;
}

export default function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
                <div className={`flex-shrink-0 ${color} rounded-md p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                        <dd className="text-2xl font-bold text-gray-900">{value}</dd>
                    </dl>
                </div>
            </div>
        </div>
    );
}
