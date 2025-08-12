import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline';
    icon?: boolean;
    fullRounded?: boolean;
}

const styles = {
    // Added min-w to keep hero buttons visually aligned regardless of label length
    base: 'group inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-nss-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed min-w-[160px]',
    variants: {
        primary: 'bg-nss-600 hover:bg-nss-700 text-white',
        outline: 'border-2 border-gray-300 text-gray-800 hover:border-gray-400 hover:bg-gray-50'
    },
    rounded: 'rounded-full'
};

const HeroButton: React.FC<HeroButtonProps> = ({
    children,
    variant = 'primary',
    icon = false,
    fullRounded = true,
    className = '',
    ...props
}) => {
    return (
        <button
            className={`${styles.base} ${styles.variants[variant]} ${fullRounded ? styles.rounded : 'rounded-lg'} px-8 py-4 text-md ${className}`}
            {...props}
        >
            <span className="flex items-center">
                {children}
                {icon && <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />}
            </span>
        </button>
    );
};

export default HeroButton;
