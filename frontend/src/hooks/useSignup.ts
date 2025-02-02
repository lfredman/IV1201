import { useState } from "react";
import { signupUser } from "../utils/signup"; // API call
import { useNavigate } from "react-router-dom";
import { useUser } from '../context/UserContext'; // Import the context


export const useSignup = () => {
  const { loginUser: updateUserContext } = useUser(); // Renamed for clarity
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signup = async (formData: {
    name: string;
    surname: string;
    pnr: string;
    username: string;
    email: string;
    password: string;
  }) => {
    setError(null);
    setLoading(true);

    try {
        const res = await signupUser(formData);
        const { message, accessToken, refreshToken, userData } = res;

        console.log(message);
        console.log("User Data:", userData); // Debugging to ensure userData is correct

        // Set user globally in context and save the tokens to localStorage
        updateUserContext(userData, accessToken, refreshToken); // Update global context with the new user data
        localStorage.setItem('accessToken', accessToken); // Store access token in localStorage
        localStorage.setItem('refreshToken', refreshToken); // Store refresh token in localStorage

        return userData; // Return user or token if needed elsewhere
    } catch (err) {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { signup, error, loading };
};
