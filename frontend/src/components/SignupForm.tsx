import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { useSignup } from "../hooks/useSignup"; // Use signup hook

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    pnr: "",
    username: "",
    email: "",
    password: "",
  });

  const { signup, error, loading } = useSignup(); // Signup logic

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value.trim() }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    signup(formData); // Calls hook function
  };

  return (
    <Box sx={{ width: 320, mx: "auto", mt: 5, p: 3, borderRadius: 2, boxShadow: 3, textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>Sign up</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        {[
          { name: "name", label: "First Name" },
          { name: "surname", label: "Last Name" },
          { name: "pnr", label: "Personal Number" },
          { name: "username", label: "Username" },
          { name: "email", label: "Email" },
          { name: "password", label: "Password", type: "password" }
        ].map(({ name, label, type = "text" }) => (
          <TextField
            key={name}
            name={name}
            label={label}
            variant="outlined"
            fullWidth
            margin="normal"
            type={type}
            value={formData[name as keyof typeof formData]} // Ensure this matches formData structure
            onChange={handleChange}
            autoComplete="off"
          />
        ))}
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
          {loading ? "Signing up..." : "Sign up"}
        </Button>
      </form>
    </Box>
  );
};

export default SignupForm;
