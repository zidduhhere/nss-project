import { ReactNode } from 'react';

interface ListTileCardWithIconProps {
    title: string;
    description: string;
    icon: ReactNode; // Already sized icon element
    iconBackground?: string; // Tailwind classes applied to icon container
    className?: string; // Additional card classes
}

export const ListTileCardWithIcon = ({
    title,
    description,
    icon,
    iconBackground = 'bg-nss-200',
    className = '',
}: ListTileCardWithIconProps) => {
    return (
        <div className={`p-6 rounded-xl  bg-nss-50 hover:bg-white hover:shadow-lg transition group ${className}`}>
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-nss-700 mb-4 group-hover:shadow ${iconBackground}`}>
                {icon}
            </div>
            <h3 className="font-medium text-secondary-900 mb-2">{title}</h3>
            <p className="text-sm text-secondary-600 leading-relaxed">{description}</p>
        </div>
    );
};

export default ListTileCardWithIcon;
