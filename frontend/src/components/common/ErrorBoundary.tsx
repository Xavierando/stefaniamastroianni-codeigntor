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

  componentDidMount() {
    // The boundary sits outside the Router, so it never resets on its own once
    // it has caught an error — leaving the app stuck on the fallback even after
    // the user presses browser back/forward. Recover on history navigation.
    window.addEventListener("popstate", this.handleRecover);
  }

  componentWillUnmount() {
    window.removeEventListener("popstate", this.handleRecover);
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log for diagnostics (could be wired to a monitoring service in production).
    console.error("Unhandled UI error:", error, info);
  }

  private handleRecover = () => {
    if (this.state.hasError) this.setState({ hasError: false });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-brand-base text-brand-contrast px-6 text-center">
          <h1 className="font-serif text-3xl md:text-4xl mb-4">Qualcosa è andato storto</h1>
          <p className="max-w-md mb-8 text-brand-contrast/80">
            Si è verificato un errore imprevisto. Torna al blog o alla home page per continuare la navigazione.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Full navigations (not client-side): they reload the app fresh,
                which reliably clears the error state. */}
            <a
              href="/blog"
              className="bg-brand-primary text-white hover:bg-brand-primary/90 transition-all px-8 py-3 rounded-full font-medium"
            >
              Torna al blog
            </a>
            <a
              href="/"
              className="border border-brand-primary/30 text-brand-primary hover:bg-brand-primary/5 transition-all px-8 py-3 rounded-full font-medium"
            >
              Torna alla home
            </a>
            <button
              onClick={this.handleReload}
              className="text-brand-contrast/70 hover:text-brand-primary transition-colors px-4 py-3 font-medium underline"
            >
              Ricarica la pagina
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
