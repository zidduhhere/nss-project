import React, { forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { FieldError } from 'react-hook-form';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: FieldError | null;
    showPasswordToggle?: boolean;
    showPassword?: boolean;
    isDescriptive?: boolean;
    onTogglePassword?: () => void;
    required?: boolean;
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: FieldError | null;
    showPasswordToggle?: never;
    showPassword?: never;
    isDescriptive: true;
    onTogglePassword?: never;
    required?: boolean;
}

type CombinedProps = TextFieldProps | TextAreaProps;

const TextField = forwardRef<HTMLInputElement | HTMLTextAreaElement, CombinedProps>(
    (
        {
            label,
            error,
            showPasswordToggle = false,
            showPassword = false,
            onTogglePassword,
            isDescriptive = false,
            className = '',
            required = false,
            ...props
        },
        ref
    ) => {
        const inputStyles = 'w-full px-4 py-4 bg-white border focus:outline-2 focus:outline-blue-500 rounded-full transition-all duration-200 placeholder-gray-500';
        const textareaStyles = 'w-full px-4 py-4 bg-white border focus:outline-2 focus:outline-blue-500 rounded-full transition-all duration-200 placeholder-gray-500 h-32 resize-none align-top placeholder:align-top';
        const labelStyles = 'block text-sm font-medium font-isans text-black mb-2';

        const inputClasses = `${inputStyles} ${className} ${showPasswordToggle ? 'pr-12' : ''}`;
        const textareaClasses = `${textareaStyles} ${className}`;

        return (
            <div>
                {label && (
                    <label className={labelStyles}>
                        {label}
                        {required && <span className="text-red-500"> *</span>}
                    </label>
                )}

                <div className="relative">
                    {isDescriptive ? (
                        <textarea
                            ref={ref as React.Ref<HTMLTextAreaElement>}
                            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                            className={textareaClasses}
                            style={{ verticalAlign: 'top' }}
                        />
                    ) : (
                        <input
                            ref={ref as React.Ref<HTMLInputElement>}
                            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
                            type={
                                (props as React.InputHTMLAttributes<HTMLInputElement>).type === 'password' && !showPassword
                                    ? 'password'
                                    : (props as React.InputHTMLAttributes<HTMLInputElement>).type === 'password'
                                        ? 'text'
                                        : (props as React.InputHTMLAttributes<HTMLInputElement>).type
                            }
                            className={inputClasses}
                        />
                    )}

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
                        <span>{error.message}</span>
                    </div>
                )}
            </div>
        );
    }
);

TextField.displayName = 'TextField';

export default TextField;
