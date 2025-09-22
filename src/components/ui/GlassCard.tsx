import React from 'react';
import { LucideIcon } from 'lucide-react';

interface GlassCardProps {
    key?: string | number;
    icon: LucideIcon;
    title: string;
    message: string;
    className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({
    icon: Icon,
    title,
    message,
    className = ''
}) => {
    return (
        <div className={`
      bg-white/10 backdrop-blur-md 
      rounded-xl p-6
      border border-white/20
      shadow-lg
      transition-all duration-300 ease-in-out
      hover:bg-white/15 hover:shadow-xl
      ${className}
    `}>
            <div className="flex flex-col items-center text-white">
                <div className="bg-white/20 p-4 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="text-xl font-bold mb-2 text-center">
                    {title}
                </h3>

                <p className="text-white/80 text-center">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default GlassCard;