import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { useLogin } from "../hooks/useLogin";  // Custom login hook
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

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
      await login(username, password);  // Call API
      navigate('/');
      // Handle success (redirect, show message, update context, etc.)
    } catch (err) {
      setError("Invalid username or password");
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
          label="Username"
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
        
        <Typography gutterBottom> dont have an account?</Typography>
        <Link to="/signup">Sign up</Link>

      </form>
    </Box>
  );
};

export default LoginForm;
