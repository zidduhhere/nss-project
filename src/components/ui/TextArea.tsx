import React, { forwardRef } from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    (
        {
            label,
            error,
            className = '',
            ...props
        },
        ref
    ) => {
        const textareaStyles = 'w-full px-4 py-4 bg-white/80 focus:outline-2 focus:outline-blue-500 rounded-lg transition-all duration-200 placeholder-gray-500 resize-vertical';
        const labelStyles = 'block text-sm font-medium font-isans text-black mb-2';

        const textareaClasses = `${textareaStyles} ${className}`;

        return (
            <div>
                {label && (
                    <label className={labelStyles}>
                        {label}
                    </label>
                )}

                <textarea
                    ref={ref}
                    className={textareaClasses}
                    {...props}
                />

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

TextArea.displayName = 'TextArea';

export default TextArea;
