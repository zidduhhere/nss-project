import React from 'react';

interface Column<T> {
    key: keyof T;
    header: string;
    width?: string;
    render?: (value: any, item: T) => React.ReactNode;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    className?: string;
}

export function Table<T>({ data, columns, className = '' }: TableProps<T>) {
    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={String(column.key)}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                                style={{ width: column.width }}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {data.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                            {columns.map((column) => (
                                <td
                                    key={String(column.key)}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
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
            </table>
        </div>
    );
}
