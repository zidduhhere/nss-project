import React, { forwardRef } from 'react';

interface FilledButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    loadingText?: string;
    variant?: 'primary' | 'secondary';
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
        const baseStyles = 'font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

        const sizeStyles = {
            sm: 'px-4 py-2 text-sm rounded-md',
            md: 'px-6 py-2 text-sm rounded-md',
            lg: 'px-8 py-4 text-lg rounded-md'
        };

        const variantStyles = {
            primary: 'bg-blue-600 hover:bg-blue-700 text-white',
            secondary: 'bg-gray-600 hover:bg-gray-700 text-white'
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
