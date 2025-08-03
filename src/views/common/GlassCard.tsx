import { LucideIcon } from 'lucide-react';

interface GlassCardProps {
    icon: LucideIcon;
    title: string;
    message: string;
    className?: string;
}

export default function GlassCard({ icon: IconComponent, title, message, className = '' }: GlassCardProps) {
    return (
        <div className={`relative group ${className}`}>
            {/* Glass Card */}
            <div className=" relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 h-56 overflow-hidden transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:scale-105">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center  h-full">
                    <div className="flex items-center justify-center text-center mb-2">
                        <IconComponent className="h-10 w-10 text-white/90" />
                    </div>
                    <h3 className="text-white font-semibold text-lg text-center mb-1 font-isans">
                        {title}
                    </h3>
                    <p className="text-white/80 text-xs text-center leading-tight font-isans">
                        {message}
                    </p>
                </div>

                {/* Subtle inner glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
        </div>
    );
}
