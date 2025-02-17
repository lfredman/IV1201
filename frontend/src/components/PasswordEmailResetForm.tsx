import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Alert, CircularProgress } from "@mui/material";
import { usePasswordReset } from "../hooks/usePasswordReset";

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const PasswordEmailResetForm: React.FC = () => {
  const [email, setEmail] = useState("");

  // Use the custom hook to handle password reset logic
  const { passwordResetByEmail, loading, error, success, setError } = usePasswordReset();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validate password before calling API
    if (!email) {
      setError("Email cannot be empty.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Invalid email format");
      return;
    }

    try {
      // Call password reset API with the token and new password
      await passwordResetByEmail(email);
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
        />

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          {loading ? <CircularProgress size={24} /> : "Reset Password"}
        </Button>
      </form>
    </Box>
  );
};

export default PasswordEmailResetForm;
