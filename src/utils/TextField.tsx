import React, { forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    showPasswordToggle?: boolean;
    showPassword?: boolean;
    onTogglePassword?: () => void;
    variant?: 'default' | 'nss';
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
    (
        {
            label,
            error,
            showPasswordToggle = false,
            showPassword = false,
            onTogglePassword,
            variant = 'default',
            className = '',
            ...props
        },
        ref
    ) => {
        const baseStyles = 'w-full px-4 py-2 bg-white/80 focus:outline-2 focus:outline-blue-500 rounded-lg transition-all duration-200 placeholder-gray-500';

        const variantStyles = {
            default: '',
            nss: 'bg-nss-50/50 border-nss-200 rounded-xl border-2 placeholder-nss-400 text-nss-800 font-medium focus:outline-nss-500'
        };

        const labelStyles = {
            default: 'block text-sm font-medium font-isans text-black mb-2',
            nss: 'block text-sm font-semibold text-nss-700 mb-3'
        };

        const inputClasses = `${baseStyles} ${variantStyles[variant]} ${className} ${showPasswordToggle ? 'pr-12' : ''
            }`;

        return (
            <div>
                {label && (
                    <label className={labelStyles[variant]}>
                        {label}
                    </label>
                )}

                <div className="relative">
                    <input
                        ref={ref}
                        className={inputClasses}
                        {...props}
                    />

                    {showPasswordToggle && onTogglePassword && (
                        <button
                            type="button"
                            onClick={onTogglePassword}
                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors p-1 ${variant === 'default'
                                ? 'text-black hover:text-gray-700'
                                : 'text-nss-500 hover:text-nss-700'
                                }`}
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    )}
                </div>

                {error && (
                    <div className={`mt-2 text-sm ${variant === 'default'
                        ? 'bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2'
                        : 'bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl font-medium'
                        }`}>
                        {variant === 'default' ? (
                            <>
                                <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
                                <span>{error}</span>
                            </>
                        ) : (
                            error
                        )}
                    </div>
                )}
            </div>
        );
    }
);

TextField.displayName = 'TextField';

export default TextField;
