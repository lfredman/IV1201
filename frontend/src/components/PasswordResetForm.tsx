import React, { useState, useEffect } from "react";
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validate password before calling API
    if (!password) {
      setError("Password cannot be empty.");
      return;
    }

    try {
      // Call password reset API with the token and new password
      await passwordReset(password);
    } catch (err) {
      setError("Password reset failed. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        width: 300,
        mx: "auto",
        mt: 5,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        textAlign: "center",
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
        />

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          {loading ? <CircularProgress size={24} /> : "Reset Password"}
        </Button>
      </form>
    </Box>
  );
};

export default PasswordResetForm;
