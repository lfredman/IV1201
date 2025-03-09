import React, { Component, ErrorInfo } from "react";
import { Container, Typography, Button, Paper } from "@mui/material";

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