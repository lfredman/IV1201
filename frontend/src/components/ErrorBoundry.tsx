import React, { Component, ErrorInfo } from "react";
import { Container, Typography, Button, Paper } from "@mui/material";

/**
 * ErrorBoundary Component
 *
 * A React error boundary component that catches JavaScript errors in its child component tree,
 * logs the errors, and displays a user-friendly message.
 *
 * Features:
 * - Captures JavaScript errors anywhere in the component tree.
 * - Displays a fallback UI when an error occurs.
 * - Logs error details to the console.
 * - Allows users to retry by refreshing the page.
 *
 * Props:
 * @param {React.ReactNode} children - The child components wrapped by the error boundary.
 *
 * State:
 * @property {boolean} hasError - Indicates whether an error has been caught.
 * @property {Error | undefined} error - Stores the caught error for display.
 *
 * Methods:
 * - `static getDerivedStateFromError(error: Error)`: Updates state when an error is caught.
 * - `componentDidCatch(error: Error, errorInfo: ErrorInfo)`: Logs error details.
 * - `handleRetry()`: Resets the state and reloads the page when the user clicks "Try Again".
 *
 * Usage:
 * Wrap this component around any section of the application where you want to catch errors.
 *
 * @returns {JSX.Element} Either the child components or an error message UI.
 */

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
    console.error("An unexpected error occurred:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
          <Paper elevation={3} sx={{ padding: 4, textAlign: "center" }}>
            <Typography variant="h5" color="error" gutterBottom>
              Oops! Something went wrong.
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              {this.state.error?.message || "An unexpected error has occurred."}
            </Typography>
            <Button variant="contained" color="primary" onClick={this.handleRetry} sx={{ marginTop: 2 }}>
              Try Again
            </Button>
          </Paper>
        </Container>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;