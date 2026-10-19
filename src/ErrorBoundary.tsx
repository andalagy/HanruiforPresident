import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

/** A failed render must leave a usable page rather than an empty root. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Hanrui Chen portal failed to render.', error, info.componentStack);
  }
  render() {
    if (this.state.failed) return (
      <main className="startup-shell" role="alert">
        <p>CENTRAL INFORMATION BUREAU</p>
        <h1>SUPREME LEADER HANRUI CHEN</h1>
        <p>The interactive portal encountered a problem. Reload the page to reopen the command center.</p>
        <button onClick={() => window.location.reload()}>Reload the portal</button>
      </main>
    );
    return this.props.children;
  }
}
