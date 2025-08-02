import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';

interface ErrorMessageProps {
    message: string;
    type?: 'error' | 'success' | 'warning' | 'info';
    onClose?: () => void;
}

export default function ErrorMessage({ message, type = 'error', onClose }: ErrorMessageProps) {
    const config = {
        error: {
            icon: XCircle,
            bgColor: 'bg-red-50',
            textColor: 'text-red-800',
            iconColor: 'text-red-400'
        },
        success: {
            icon: CheckCircle,
            bgColor: 'bg-green-50',
            textColor: 'text-green-800',
            iconColor: 'text-green-400'
        },
        warning: {
            icon: AlertCircle,
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-800',
            iconColor: 'text-yellow-400'
        },
        info: {
            icon: Info,
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-800',
            iconColor: 'text-blue-400'
        }
    };

    const { icon: Icon, bgColor, textColor, iconColor } = config[type];

    return (
        <div className={`rounded-md p-4 ${bgColor}`}>
            <div className="flex">
                <div className="flex-shrink-0">
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
                <div className="ml-3 flex-1">
                    <p className={`text-sm font-medium ${textColor}`}>{message}</p>
                </div>
                {onClose && (
                    <div className="ml-auto pl-3">
                        <button
                            onClick={onClose}
                            className={`inline-flex rounded-md ${bgColor} ${textColor} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                        >
                            <XCircle className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
