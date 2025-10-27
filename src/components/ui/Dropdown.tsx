import React, { forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: FieldError | null;
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
        const selectStyles = 'w-full px-4 py-4 bg-white/80 border focus:outline-2 focus:outline-blue-500 rounded-full transition-all duration-200 text-gray-700';
        const labelStyles = 'block text-sm font-medium font-isans text-black mb-2';

        const selectClasses = `${selectStyles} ${className}`;

        return (
            <div >
                {label && (
                    <label className={labelStyles}>
                        {label} {props.required && <span className="text-red-500"> *</span>}
                    </label>
                )}

                <div className='relative'>
                    <select
                        style={{ WebkitAppearance: 'none' }}
                        ref={ref}
                        className={selectClasses}
                        {...props}
                    >
                        {placeholder && (
                            <option value={placeholder} defaultChecked>
                                {placeholder}
                            </option>
                        )}
                        {

                            options.map((option, index) => {

                                return (

                                    <option key={index} value={option.split(' ')[0]}>
                                        {option}
                                    </option>
                                );
                            })}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>

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

Dropdown.displayName = 'Dropdown';

export default Dropdown;
