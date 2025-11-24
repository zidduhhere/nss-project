import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    titleStat: string; // main numeric/stat value
    subtitle: string; // label beneath the stat value
    description?: string; // small helper / delta / qualifier
    className?: string; // optional style overrides
    icon?: LucideIcon; // optional icon
    iconColor?: string; // icon color
    iconBgColor?: string; // icon background color
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export const StatCard: React.FC<StatCardProps> = ({
    titleStat,
    subtitle,
    description,
    className = '',
    icon: Icon,
    iconColor = 'text-white',
    iconBgColor = 'bg-nss-500',
    trend
}) => {
    return (
        <div className={`p-6 bg-white rounded-xl border border-gray-200 hover:shadow-md transition duration-300 ${className}`}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="text-sm font-medium text-gray-600 mb-2">{subtitle}</div>
                    <div className="flex items-center space-x-2">
                        <div className="text-3xl font-semibold text-gray-900">{titleStat}</div>
                        {trend && (
                            <span
                                className={`text-xs font-medium px-2 py-1 rounded-full ${trend.isPositive
                                        ? 'text-tree-600 bg-tree-100'
                                        : 'text-blood-600 bg-blood-100'
                                    }`}
                            >
                                {trend.isPositive ? '+' : ''}{trend.value}%
                            </span>
                        )}
                    </div>
                    {description && (
                        <div className="text-xs text-gray-500 mt-1">{description}</div>
                    )}
                </div>
                {Icon && (
                    <div className={`h-12 w-12 ${iconBgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`h-6 w-6 ${iconColor}`} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
