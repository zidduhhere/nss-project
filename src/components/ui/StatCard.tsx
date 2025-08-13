import React from 'react';

interface StatCardProps {
    titleStat: string; // main numeric/stat value
    subtitle: string; // label beneath the stat value
    description: string; // small helper / delta / qualifier
    className?: string; // optional style overrides
}

export const StatCard: React.FC<StatCardProps> = ({ titleStat, subtitle, description, className = '' }) => {
    return (
        <div className={`p-6 bg-white rounded-xl  border-nss-200 hover:shadow-md transition duration-300 ${className}`}>
            <div className="text-3xl font-semibold text-secondary-900 mb-1">{titleStat}</div>
            <div className="text-sm font-medium text-secondary-600">{subtitle}</div>
            <div className="text-xs text-nss-600 mt-1">{description}</div>
        </div>
    );
};

export default StatCard;
