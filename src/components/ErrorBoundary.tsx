'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch() {
    // Log error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error monitoring service
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[var(--background)] to-[var(--background-secondary)] p-6">
          <div className="max-w-md w-full">
            <div className="card-medieval p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-[var(--error)]/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="text-[var(--error)]" size={32} />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                Oops! Something went wrong
              </h1>

              <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
                We encountered an unexpected error. Don&apos;t worry, your progress is safe.
                Try refreshing the page or return to the home screen.
              </p>

              <div className="space-y-4">
                <button
                  onClick={this.handleReset}
                  className="btn-medieval w-full flex items-center justify-center gap-2"
                >
                  <RefreshCw size={20} />
                  Try Again
                </button>

                <button
                  onClick={this.handleGoHome}
                  className="btn-medieval-secondary w-full flex items-center justify-center gap-2"
                >
                  <Home size={20} />
                  Go Home
                </button>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="text-sm text-[var(--text-muted)] cursor-pointer">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 text-xs text-[var(--error)] bg-[var(--error)]/5 p-3 rounded overflow-auto">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
