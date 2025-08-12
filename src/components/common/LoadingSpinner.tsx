interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    message?: string;
}

export default function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}></div>
            {message && <p className="mt-2 text-gray-600 text-sm">{message}</p>}
        </div>
    );
}
