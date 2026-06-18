import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Top-level error boundary so a render-time throw shows a friendly fallback and
 * a recovery action instead of unmounting React to a blank white screen.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log for diagnostics (could be wired to a monitoring service in production).
    console.error("Unhandled UI error:", error, info);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-brand-base text-brand-contrast px-6 text-center">
          <h1 className="font-serif text-3xl md:text-4xl mb-4">Qualcosa è andato storto</h1>
          <p className="max-w-md mb-8 text-brand-contrast/80">
            Si è verificato un errore imprevisto. Ricarica la pagina per riprovare.
          </p>
          <button
            onClick={this.handleReload}
            className="bg-brand-primary text-white hover:bg-brand-primary/90 transition-all px-8 py-3 rounded-full font-medium"
          >
            Ricarica la pagina
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
