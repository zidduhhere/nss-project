import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log the error to console or an error reporting service
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
        this.setState({ errorInfo });
    }

    render(): ReactNode {
        if (this.state.hasError) {
            // If a custom fallback is provided, use it
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Otherwise, render a default error UI
            return (
                <div className="min-h-screen bg-white flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 border border-red-100">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-50">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-center text-gray-800 mb-2">Something went wrong</h2>
                        <p className="text-gray-600 text-center mb-6">
                            We're sorry, but an error occurred while rendering this page.
                        </p>
                        <div className="bg-gray-50 p-4 rounded overflow-auto max-h-40 mb-4">
                            <p className="text-sm font-mono text-red-600">
                                {this.state.error?.toString() || 'Unknown error'}
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-nss-600 hover:bg-nss-700 text-white rounded transition-colors"
                            >
                                Reload Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        // If no error, render children as normal
        return this.props.children;
    }
}

export default ErrorBoundary;