import React, { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    loadingText?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            loadingText = 'Loading...',
            className = '',
            disabled,
            ...props
        },
        ref
    ) => {
        const baseStyles = ' font-isans w-full font-medium focus:ring-2 focus:ring-nss-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-[1.02] active:scale-[0.98]';

        const variantStyles = {
            primary: 'bg-gradient-to-r from-nss-500 to-nss-600 hover:from-nss-600 hover:to-nss-700 text-white',
            secondary: 'bg-white border-2 border-nss-500 text-nss-600 hover:bg-nss-50',
            ghost: 'bg-transparent text-nss-600 hover:bg-nss-50'
        };

        const sizeStyles = {
            sm: 'py-2 px-3 text-sm rounded-full',
            md: 'py-3 px-4 text-base rounded-full',
            lg: 'py-4 px-6 text-lg rounded-full'
        };

        const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

        return (
            <button
                ref={ref}
                className={buttonClasses}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center space-x-2 font-isans">
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

Button.displayName = 'Button';

export default Button;
