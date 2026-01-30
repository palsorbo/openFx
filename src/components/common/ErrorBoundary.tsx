import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.setState({
            error,
            errorInfo
        });

        // Log error to console in development
        if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
            console.error('ErrorBoundary caught an error:', error, errorInfo);
        }

        // In production, you would send this to your error tracking service
        // e.g., Sentry, LogRocket, etc.
    }

    render(): ReactNode {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="error-boundary">
                    <div className="error-content">
                        <h2>Something went wrong</h2>
                        <p>We're sorry, but something unexpected happened. Please try refreshing the page.</p>

                        {typeof process !== 'undefined' && process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="error-details">
                                <summary>Error Details (Development)</summary>
                                <pre>{this.state.error.toString()}</pre>
                                {this.state.errorInfo && (
                                    <pre>{this.state.errorInfo.componentStack}</pre>
                                )}
                            </details>
                        )}

                        <div className="error-actions">
                            <button
                                className="retry-button"
                                onClick={() => window.location.reload()}
                            >
                                Refresh Page
                            </button>
                            <button
                                className="back-button"
                                onClick={() => window.history.back()}
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}