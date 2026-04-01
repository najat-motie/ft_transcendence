import React from "react";
import { frostedPanelStrong, goldButton, slabHeading } from "../lib/ui";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 px-4 text-slate-200">
          <div className={`${frostedPanelStrong} w-full max-w-[600px] p-6 text-center`}>
            <div className="mb-4 text-5xl leading-none">💥</div>
            <h2 className={`${slabHeading} mb-2 text-[1.5rem] text-yellow-300`}>Application Error</h2>
            <p className="mb-6 text-slate-400">
              We're sorry, but something went wrong in the application.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mb-6 max-h-[200px] overflow-auto rounded-xl bg-slate-950 p-4 text-left font-mono text-[0.85rem] text-slate-400">
                <summary className="mb-2 cursor-pointer font-semibold text-slate-200">
                  Stack Trace
                </summary>
                <pre>{this.state.error.toString()}</pre>
                <pre>{this.state.errorInfo?.componentStack}</pre>
              </details>
            )}
            <button className={`${goldButton} uppercase tracking-[1px]`} onClick={this.handleRestart}>
              Restart Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
