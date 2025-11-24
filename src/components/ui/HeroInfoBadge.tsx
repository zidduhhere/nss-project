import React from 'react';

interface HeroInfoBadgeProps {
    className?: string;
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    iconBackground?: string;
    titleColor?: string;
    subtitleColor?: string;
    iconBackgroundRadius?: string;
}

export const HeroInfoBadge: React.FC<HeroInfoBadgeProps> = ({
    className = '',
    icon,
    title,
    subtitle,
    iconBackground = 'bg-nss-500',
    titleColor = 'text-gray-900',
    subtitleColor = 'text-gray-600',
    iconBackgroundRadius = 'rounded-lg',
}) => {
    return (
        <div className={`flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/20 ${className}`}>
            <div className={`${iconBackground} ${iconBackgroundRadius} p-2.5 flex items-center justify-center`}>
                {icon}
            </div>
            <div>
                <div className={`font-semibold text-sm ${titleColor}`}>{title}</div>
                <div className={`text-xs ${subtitleColor}`}>{subtitle}</div>
            </div>
        </div>
    );
};

export default HeroInfoBadge;
