// src/hooks/useLogin.ts
import { useState } from 'react';
import { useUser } from '../context/UserContext'; // Import the context
import { loginUser } from '../utils/auth'; // Import model function (API call)

// Custom hook for login
export const useLogin = () => {
  const { loginUser: setUser } = useUser(); // Use `loginUser` from context to update the global state
  const [error, setError] = useState('');

  const login = async (username: string, password: string) => {
    try {
      // Call the login API to get the token and userData
      const res = await loginUser(username, password); // Model function (API request)
      const { message, token, userData } = res;

      console.log("User Data:", userData); // Debugging to ensure userData is correct

      // Set user globally in context and save the token to localStorage
      setUser(userData); // Update global context with the new user data
      localStorage.setItem('token', token); // Store token in localStorage

      return userData; // Return user or token if needed elsewhere
    } catch (err) {
      setError('Login failed. Please try again.');
      console.log(err);
      throw err; // Propagate error
    }
  };

  return { login, error };
};
