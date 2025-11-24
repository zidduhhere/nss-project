import { LucideIcon } from 'lucide-react';

interface DashboardHeaderProps {
    title: string;
    subtitle: string;
    icon: LucideIcon;
    badges?: Array<{
        icon: LucideIcon;
        text: string;
    }>;
    className?: string;
}

export default function DashboardHeader({
    title,
    subtitle,
    icon: Icon,
    badges,
    className = ''
}: DashboardHeaderProps) {
    return (
        <div className={`bg-nss-gradient rounded-2xl text-white p-6 sm:p-8 flex-1 shadow-xl ${className}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2">{title}</h2>
                    <p className="text-nss-100 text-base sm:text-lg">{subtitle}</p>
                    {badges && badges.length > 0 && (
                        <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-nss-200">
                            {badges.map((badge, index) => {
                                const BadgeIcon = badge.icon;
                                return (
                                    <div key={index} className="flex items-center">
                                        <span className="flex items-center gap-2">
                                            <BadgeIcon className="h-4 w-4" />
                                            {badge.text}
                                        </span>
                                        {index < badges.length - 1 && (
                                            <span className="hidden sm:inline ml-2 sm:ml-4">•</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
