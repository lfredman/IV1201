import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { useLogin } from "../hooks/useLogin";  // Custom login hook
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


/**
 * LoginForm Component
 *
 * A form that allows users to log in using their username, email, or personal number.
 * Handles authentication via a custom login hook and navigates to the home page upon success.
 * 
 * Features:
 * - Input validation for required fields
 * - Displays error messages for invalid credentials
 * - Provides links for account signup and password reset
 *
 * @returns {JSX.Element} A styled login form with input fields, buttons, and navigation links.
 */
const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useLogin();  // Custom hook for API request
  const navigate = useNavigate(); // Create navigate function

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null); // Clear previous errors

    if (!username || !password) {
      setError("Both fields are required!");
      return;
    }

    try {
      await login(username, password);
      navigate("/");
    } catch (err: any) {
      if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
        console.error("Network error or server unreachable:", err);
        setError("Unable to connect to the server. Please check your internet connection or try again later.");
        return;
      }
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
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
        Login
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Username - Email - Personal number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?&nbsp;
            <Link to="/signup" style={{ textDecoration: 'underline', color: '#1976d2' }}>
              Sign up here
            </Link>
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <Link to="/reset" style={{ textDecoration: 'none', color: '#1976d2' }}>
              Forgot your password?
            </Link>
          </Typography>
        </Box>
      </form>
    </Box>
  );
};

export default LoginForm;
