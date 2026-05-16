import { Component } from "react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("OHSE 360 ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-amber-500/30 rounded-xl p-8 max-w-lg w-full text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-slate-400 mb-2 text-sm font-mono bg-slate-900 rounded p-2 text-left overflow-auto max-h-32">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <p className="text-slate-500 text-sm mb-6">
              Please reload the page. If the problem persists, contact your
              system administrator.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
