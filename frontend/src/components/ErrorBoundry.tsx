import React, { Component, ErrorInfo } from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }
  
  handleRetry = () => {
    window.location.reload(); // Reload the page
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <h2>Something went wrong. Try refreshing the page.</h2>
          <p style={styles.errorText}>{this.state.error?.message}</p>
          <button onClick={this.handleRetry} style={styles.button}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const styles = {
  container: {
    textAlign: "center" as const,
    padding: "20px",
    marginTop: "50px",
    backgroundColor: "white",
  },
  errorText: {
    color: "red",
    fontSize: "14px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    marginTop: "10px",
  },
};

export default ErrorBoundary;
