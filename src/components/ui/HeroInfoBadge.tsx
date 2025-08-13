import { ReactNode } from 'react';

interface HeroInfoBadgeProps {
    icon: ReactNode;
    title: string;
    subtitle: string;
    iconBackground?: string;
    titleColor?: string;
    subtitleColor?: string;
    iconBackgroundRadius?: string;
    className?: string;
}

export const HeroInfoBadge = ({
    icon,
    title,
    subtitle,
    iconBackground = 'bg-neutral-800',
    titleColor = 'text-secondary-900',
    subtitleColor = 'text-secondary-600',
    iconBackgroundRadius = 'rounded-lg',
    className = ''
}: HeroInfoBadgeProps) => (
    <div className={`bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-lg flex items-center gap-3 ${className}`}>
        <div className={`${iconBackground} p-2 ${iconBackgroundRadius}`}>{icon}</div>
        <div>
            <div className={`font-semibold ${titleColor}`}>{title}</div>
            <div className={`text-xs ${subtitleColor}`}>{subtitle}</div>
        </div>
    </div>
);

export default HeroInfoBadge;
