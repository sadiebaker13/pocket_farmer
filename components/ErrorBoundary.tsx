import React, { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-stone-50 rounded-xl border border-stone-200 m-4">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-xl font-bold text-stone-800 mb-2">Something went wrong</h2>
          <p className="text-stone-500 mb-6 max-w-md text-sm">
            {this.state.error?.message || "An unexpected error occurred while rendering this component."}
          </p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="px-6 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-900 transition-colors font-medium text-sm"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}