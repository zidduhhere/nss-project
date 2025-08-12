import React, { forwardRef } from 'react';

interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: string[];
    placeholder?: string;
}

const Dropdown = forwardRef<HTMLSelectElement, DropdownProps>(
    (
        {
            label,
            error,
            options,
            placeholder,
            className = '',
            ...props
        },
        ref
    ) => {
        const selectStyles = 'w-full px-4 py-4 bg-white/80 border focus:outline-2 focus:outline-blue-500 rounded-lg transition-all duration-200 text-gray-700';
        const labelStyles = 'block text-sm font-medium font-isans text-black mb-2';

        const selectClasses = `${selectStyles} ${className}`;

        return (
            <div >
                {label && (
                    <label className={labelStyles}>
                        {label}
                    </label>
                )}

                <select
                    ref={ref}
                    className={selectClasses}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option, index) => (
                        <option key={index} value={option.toLowerCase()}>
                            {option}
                        </option>
                    ))}
                </select>

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

Dropdown.displayName = 'Dropdown';

export default Dropdown;
