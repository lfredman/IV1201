import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert, CircularProgress } from "@mui/material";
import { usePasswordReset } from "../hooks/usePasswordReset";

/**
 * PasswordEmailResetForm Component
 *
 * A form that allows users to request a password reset link via email.
 *
 * Features:
 * - Uses a custom hook (`usePasswordReset`) to handle API requests.
 * - Displays success or error messages based on the response.
 * - Disables the submit button and shows a loading spinner while processing.
 * - Validates the email input to prevent empty submissions.
 *
 * @returns {JSX.Element} A password reset form with email input and submission handling.
 */
const PasswordEmailResetForm: React.FC = () => {
  const [email, setEmail] = useState("");

  // Use the custom hook to handle password reset logic
  const { passwordResetByEmail, loading, error, success, setError } = usePasswordReset();

  /**
   * Handles the form submission for requesting a password reset.
   *
   * Validates the email input, clears previous errors, and sends a password reset request.
   * Displays error messages in case of failure and success message upon successful request.
   *
   * @param {React.FormEvent} event - The submit event of the form.
   * @returns {Promise<void>} Resolves when the password reset request has been processed.
   */

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Email cannot be empty.");
      return;
    }

    try {
      await passwordResetByEmail(email);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes("Failed to fetch")) {
          console.error("Network error or server unreachable:", err);
          setError("Unable to connect to the server. Please check your internet connection or try again later.");
          return;
        }

        if (err instanceof Error && err.message) {
          setError(err.message);
        } else {
          setError("Password reset failed. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh"
      }}
    >
      <Box
        sx={{
          width: 300,
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          textAlign: "center",
          backgroundColor: "white",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Reset Password By Email
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}
        {success && (
          <Alert severity="success">
            Reset link sent to {email}!
            <div>Please check your email</div>
            <div>Redirecting to login...</div>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Reset Password"}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default PasswordEmailResetForm;
