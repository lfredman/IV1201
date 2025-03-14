import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert, CircularProgress } from "@mui/material";
import { usePasswordReset } from "../hooks/usePasswordReset"; // Custom hook for API request

/**
 * PasswordResetForm Component
 *
 * A form that allows users to reset their password using a new one.
 *
 * Features:
 * - Uses a custom hook (`usePasswordReset`) to handle password reset logic.
 * - Displays success or error messages based on the outcome of the reset operation.
 * - Validates the password input to ensure it's not empty before submitting.
 * - Shows a loading spinner while the password reset is being processed.
 *
 * @returns {JSX.Element} A password reset form with input for a new password and submission handling.
 */
const PasswordResetForm: React.FC = () => {
  const [password, setPassword] = useState("");

  // Use the custom hook to handle password reset logic
  const { passwordReset, loading, error, success, setError } = usePasswordReset();

  /**
   * Handles the form submission for resetting the password.
   * 
   * - Validates the password input to ensure it is not empty.
   * - Calls the password reset API with the new password.
   * - Displays success or error messages based on the response.
   * 
   * @param {React.FormEvent} event - The submit event of the form.
   * @returns {Promise<void>} Resolves when the password reset request has been processed.
   */

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!password.trim()) {
      setError("Password cannot be empty.");
      return;
    }

    try {
      await passwordReset(password);
    } catch (err: unknown) {
      if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
        console.error("Network error or server unreachable:", err);
        setError("Unable to connect to the server. Please check your internet connection or try again later.");
        return;
      }

      if (err instanceof Error && err.message) {
        setError(err.message);
      } else if (err && typeof err === 'object' && 'response' in err) {
        const error = (err as { response?: { data?: { message?: string } } }).response;
        if (error?.data?.message) {
          setError(error.data.message);
        } else {
          setError("Password reset failed. Please try again.");
        }
      } else {
        setError("Password reset failed. Please try again.");
      }
    }
  }


  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        //minHeight: "80vh"
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
          Change Password
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">Password changed successfully! Redirecting to login...</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

export default PasswordResetForm;
