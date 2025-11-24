import React, { forwardRef } from 'react';

interface FilledButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    loadingText?: string;
    variant?: 'primary' | 'secondary' | 'lightNss';
}

const FilledButton = forwardRef<HTMLButtonElement, FilledButtonProps>(
    (
        {
            children,
            size = 'md',
            variant = 'primary',
            isLoading = false,
            loadingText = 'Loading...',
            className = '',
            disabled,
            ...props
        },
        ref
    ) => {
        const baseStyles = 'font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed justify-center items-center';

        const sizeStyles = {
            sm: 'px-4 py-2 text-sm rounded-full',
            md: 'px-6 py-2 text-sm rounded-full',
            lg: 'px-8 py-4 text-lg rounded-full'
        };

        const variantStyles: Record<string, string> = {
            primary: 'bg-primary-600 hover:bg-primary-700 text-white',
            secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
            lightNss: 'bg-nss-100 text-nss-700 hover:bg-nss-200 border border-nss-200'
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

FilledButton.displayName = 'FilledButton';

export default FilledButton;
