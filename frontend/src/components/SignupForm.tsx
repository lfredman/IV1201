import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { useSignup } from "../hooks/useSignup"; // Use signup hook


/**
 * SignupForm Component
 *
 * A form that allows users to sign up by providing personal and account information.
 * 
 * Features:
 * - Collects user's first name, last name, personal number, username, email, and password.
 * - Uses a custom `useSignup` hook for handling the signup logic.
 * - Displays loading state while the signup request is being processed.
 * - Displays error messages if signup fails.
 * - Form fields are validated and trimmed before submission.
 *
 * @returns {JSX.Element} A signup form with inputs for user details and a submit button.
 */
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

  /**
   * Handles input change for each form field.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event for the input fields.
   * Updates the state for the corresponding input field with trimmed value.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value.trim() }));
  };

  /**
   * Handles the form submission for user signup.
   * 
   * - Calls the `signup` function from the custom hook to send the user data.
   * 
   * @param {React.FormEvent} event - The submit event for the form.
   * @returns {void}
   */

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    signup(formData);
  };

  return (
    <Box sx={{ width: 320, mx: "auto", mt: 5, p: 3, borderRadius: 2, boxShadow: 3, textAlign: "center", backgroundColor: "white", }}>
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
            value={formData[name as keyof typeof formData]}
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
