import { Component, type ReactNode } from "react";

type LazyRenderBoundaryProps = {
  fallback: ReactNode;
  children: ReactNode;
};

type LazyRenderBoundaryState = {
  hasError: boolean;
};

export default class LazyRenderBoundary extends Component<LazyRenderBoundaryProps, LazyRenderBoundaryState> {
  constructor(props: LazyRenderBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Lazy render failed:", error);
  }

  render() {
    const { fallback, children } = this.props;

    if (this.state.hasError) {
      return fallback;
    }

    return children;
  }
}
