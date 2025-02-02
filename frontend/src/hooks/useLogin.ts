// src/hooks/useLogin.ts
import { useState } from 'react';
import { useUser } from '../context/UserContext'; // Import the context
import { loginUser } from '../utils/auth'; // Import model function (API call)

// Custom hook for login
export const useLogin = () => {
  const { loginUser: updateUserContext } = useUser(); // Renamed for clarity
  const [error, setError] = useState('');

  const login = async (username: string, password: string) => {
    try {
      // Call the login API to get the tokens and userData
      const res = await loginUser(username, password); // Model function (API request)
      const { message, accessToken, refreshToken, userData } = res;

      console.log(message);
      console.log("User Data:", userData); // Debugging to ensure userData is correct

      // Set user globally in context and save the tokens to localStorage
      updateUserContext(userData, accessToken, refreshToken); // Update global context with the new user data
      localStorage.setItem('accessToken', accessToken); // Store access token in localStorage
      localStorage.setItem('refreshToken', refreshToken); // Store refresh token in localStorage

      return userData; // Return user or token if needed elsewhere
    } catch (err) {
      setError('Login failed. Please try again.');
      console.log(err);
      throw err; // Propagate error
    }
  };

  return { login, error };
};
