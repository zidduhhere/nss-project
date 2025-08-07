import React, { forwardRef } from 'react';

interface OutlinedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    loadingText?: string;
}

const OutlinedButton = forwardRef<HTMLButtonElement, OutlinedButtonProps>(
    (
        {
            children,
            size = 'md',
            isLoading = false,
            loadingText = 'Loading...',
            className = '',
            disabled,
            ...props
        },
        ref
    ) => {
        const baseStyles = 'font-semibold border-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

        const sizeStyles = {
            sm: 'px-4 py-2 text-sm rounded-md',
            md: 'px-6 py-2 text-sm rounded-md',
            lg: 'px-8 py-4 text-lg rounded-md'
        };

        const outlinedStyles = 'border-white/20 text-white hover:border-white/30 hover:bg-white/10 backdrop-blur-sm';

        const buttonClasses = `${baseStyles} ${outlinedStyles} ${sizeStyles[size]} ${className}`;

        return (
            <button
                ref={ref}
                className={buttonClasses}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        <span>{loadingText}</span>
                    </div>
                ) : (
                    children
                )}
            </button>
        );
    }
);

OutlinedButton.displayName = 'OutlinedButton';

export default OutlinedButton;
