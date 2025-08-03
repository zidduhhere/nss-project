import React, { forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    showPasswordToggle?: boolean;
    showPassword?: boolean;
    onTogglePassword?: () => void;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
    (
        {
            label,
            error,
            showPasswordToggle = false,
            showPassword = false,
            onTogglePassword,
            className = '',
            ...props
        },
        ref
    ) => {
        const inputStyles = 'w-full px-4 py-4 bg-white/80 border focus:outline-2 focus:outline-blue-500 rounded-lg transition-all duration-200 placeholder-gray-500';
        const labelStyles = 'block text-sm font-medium font-isans text-black mb-2';

        const inputClasses = `${inputStyles} ${className} ${showPasswordToggle ? 'pr-12' : ''}`;

        return (
            <div>
                {label && (
                    <label className={labelStyles}>
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
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors p-1 text-black hover:text-gray-700"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    )}
                </div>

                {error && (
                    <div className="mt-2 text-sm bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                        <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
                        <span>{error}</span>
                    </div>
                )}
            </div>
        );
    }
);

TextField.displayName = 'TextField';

export default TextField;
