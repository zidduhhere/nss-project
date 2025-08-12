import React from 'react';
import { User } from 'lucide-react';

interface PlaceholderProps {
    width?: string;            // Tailwind width class (overrides size token)
    height?: string;           // Tailwind height class (overrides size token)
    size?: 'hero' | 'avatar' | 'logo' | 'card' | 'auto'; // Consistent sizing tokens
    shadow?: boolean;
    variant?: 'person' | 'generic' | 'logo';
    className?: string;
    rounded?: string;
    label?: string;
}

// Generic placeholder block for replacing images during development
export const Placeholder: React.FC<PlaceholderProps> = ({
    width,
    height,
    size = 'auto',
    shadow = false,
    variant = 'generic',
    className = '',
    rounded = 'rounded-2xl',
    label,
}) => {
    const sizeMap: Record<string, { w: string; h: string; rounded?: string }> = {
        hero: { w: 'w-full', h: 'h-[500px]' },
        avatar: { w: 'w-36', h: 'h-36', rounded: 'rounded-2xl' },
        logo: { w: 'w-16', h: 'h-16', rounded: 'rounded-xl' },
        card: { w: 'w-full', h: 'h-40' },
        auto: { w: 'w-full', h: 'h-40' },
    };
    const token = sizeMap[size] || sizeMap.auto;
    const finalW = width || token.w;
    const finalH = height || token.h;
    const finalRounded = rounded || token.rounded || 'rounded-2xl';
    const base = `relative flex items-center justify-center ${finalW} ${finalH} ${finalRounded} bg-nss-100 border border-nss-200 text-secondary-400 text-xs select-none overflow-hidden`;
    const withShadow = shadow ? 'shadow-2xl' : '';
    const iconColor = 'text-nss-300';

    return (
        <div className={[base, withShadow, className].join(' ')}>
            {variant === 'person' && <User className={`h-12 w-12 ${iconColor}`} strokeWidth={1.25} />}
            {variant === 'logo' && <User className={`h-10 w-10 ${iconColor}`} strokeWidth={1.25} />} {/* Adjust later for real logo placeholder */}
            {variant === 'generic' && !label && <span className="opacity-70">Image Placeholder</span>}
            {label && <span className="font-medium text-secondary-500 text-[11px] tracking-wide">{label}</span>}
        </div>
    );
};

export default Placeholder;
