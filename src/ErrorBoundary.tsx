import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

/** A failed render must leave a usable page rather than an empty root. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('陈汉瑞门户渲染失败。', error, info.componentStack);
  }
  render() {
    if (this.state.failed) return (
      <main className="startup-shell" role="alert">
        <p>中央新闻局</p>
        <h1>最高领袖陈汉瑞</h1>
        <p>互动门户遇到问题，请重新加载页面以重新打开指挥中心。</p>
        <button onClick={() => window.location.reload()}>重新加载门户</button>
      </main>
    );
    return this.props.children;
  }
}
