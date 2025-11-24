import React, { useMemo } from 'react';

interface Column<T> {
    key: keyof T;
    header: string;
    width?: string;
    sortable?: boolean;
    render?: (value: any, item: T) => React.ReactNode;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    className?: string;
    loading?: boolean;
    emptyMessage?: string;
    maxHeight?: string;
}

export function Table<T>({
    data,
    columns,
    className = '',
    loading = false,
    emptyMessage = "No data available",
    maxHeight = "none"
}: TableProps<T>) {

    // Memoize the table body to prevent unnecessary re-renders
    const tableBody = useMemo(() => {
        if (loading) {
            return (
                <tbody>
                    <tr>
                        <td colSpan={columns.length} className="px-6 py-12 text-center">
                            <div className="flex items-center justify-center space-x-3">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                <span className="text-gray-500">Loading...</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            );
        }

        if (data.length === 0) {
            return (
                <tbody>
                    <tr>
                        <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                            {emptyMessage}
                        </td>
                    </tr>
                </tbody>
            );
        }

        return (
            <tbody className="divide-y divide-gray-200 bg-white">
                {data.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                        {columns.map((column) => (
                            <td
                                key={String(column.key)}
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                style={{ width: column.width }}
                            >
                                {column.render
                                    ? column.render(item[column.key], item)
                                    : String(item[column.key] || '-')
                                }
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        );
    }, [data, columns, loading, emptyMessage]);

    return (
        <div className={`overflow-hidden ${className}`}>
            <div
                className="overflow-x-auto overflow-y-auto"
                style={{ maxHeight }}
            >
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={String(column.key)}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    style={{ width: column.width }}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>{column.header}</span>
                                        {column.sortable && (
                                            <button className="ml-2 text-gray-400 hover:text-gray-600">
                                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M5 8l5-5 5 5H5zM5 12l5 5 5-5H5z" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    {tableBody}
                </table>
            </div>
        </div>
    );
}
