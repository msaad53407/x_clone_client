/**
 * Error Boundary Component
 * Catches JavaScript errors in child components and displays a fallback UI
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/home';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black px-4">
          <div className="text-center max-w-md">
            {/* Error Icon */}
            <div className="mb-6 flex justify-center">
              <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-neutral-500 mb-4">
              We're sorry, but something unexpected happened. Please try again or go back to the home page.
            </p>

            {/* Error Details (only in development) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6 p-4 bg-neutral-100 dark:bg-neutral-900 rounded-lg text-left">
                <p className="text-sm font-mono text-red-500 break-all">{this.state.error.message}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={this.handleReset} variant="outline" className="rounded-full font-bold px-6">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try again
              </Button>
              <Button
                onClick={this.handleGoHome}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full font-bold px-6"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Error Fallback Component
 * A simpler error display for use within page sections
 */
interface ErrorFallbackProps {
  error?: Error | null;
  resetError?: () => void;
  message?: string;
}

export function ErrorFallback({ error, resetError, message }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-4">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{message || 'Something went wrong'}</h3>
      {error && import.meta.env.DEV && <p className="text-sm text-neutral-500 mb-4 font-mono">{error.message}</p>}
      {resetError && (
        <Button onClick={resetError} variant="outline" size="sm" className="rounded-full">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try again
        </Button>
      )}
    </div>
  );
}
