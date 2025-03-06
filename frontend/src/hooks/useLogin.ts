// src/hooks/useLogin.ts
import { useState } from 'react';
import { useUser } from '../context/UserContext'; // Import the context
import { loginUser } from '../utils/auth'; // Import model function (API call)
import { getProfile } from '../utils/profile'; // Import model function (API call)
import { useValidation } from './useValidation';

/**
 * Custom hook for handling user login.
 * 
 * This hook is used to handle the login process by validating the password, making an API request to
 * authenticate the user, and updating the global user context with the returned user data and tokens.
 * It also provides an error message if the login attempt fails.
 * 
 * - Validates the password on the client side before making the API request.
 * - Calls the login API to retrieve the authentication tokens and user data.
 * - Updates the user context with the user data and tokens upon successful login.
 * - Handles login errors by setting an error message to be displayed.
 * 
 * @returns {Object} The login function and error state.
 * 
 */
export const useLogin = () => {
  const { loginUser: updateUserContext } = useUser(); // Renamed for clarity
  const [error, setError] = useState('');

  //client side validation
  const { validatePassword } = useValidation();

  const login = async (username: string, password: string) => {
    try {

      if(!validatePassword(password)){
        setError("Too weak to be password");
      }

      // Call the login API to get the tokens and userData
      const res = await loginUser(username, password); // Model function (API request)
      const { message, accessToken, refreshToken, userData } = res;

      console.log(message);
      console.log("User Data:", userData); // Debugging to ensure userData is correct

      // Set user globally in context and save the tokens to localStorage
      updateUserContext(userData, accessToken, refreshToken); // Update global context with the new user data

      return userData; // Return user or token if needed elsewhere
    } catch (err: any) {
      const errMsg = `Login failed. Please try again. ${err?.message || "An unknown error occurred."}`;
      setError(errMsg)
      throw err; // Propagate error
    }
  };

  return { login, error, setError };
};
