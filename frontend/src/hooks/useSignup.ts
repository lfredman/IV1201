import { useState } from "react";
import { signupUser } from "../utils/signup"; 
import { useNavigate } from "react-router-dom";
import { useUser } from '../context/UserContext';
import { useValidation } from "../hooks/useValidation";
import { isCustomError } from "../utils/error";

/**
 * Custom hook for managing the user signup process.
 * 
 * This hook handles the user registration, performs client-side validation for fields (like name, surname, PNR, email, and password), 
 * and interacts with the backend to create a new user. It provides loading and error states to track the signup process.
 * 
 * On successful signup, the hook stores the access and refresh tokens in localStorage, updates the global user context, 
 * and navigates the user to the home screen.
 * 
 * @returns {Object} - An object containing:
 *   - `signup`: Function to handle the signup process. Takes a `formData` object with the user's details (name, surname, pnr, username, email, password).
 *   - `error`: The error message, if any, that occurred during the signup process.
 *   - `loading`: Boolean indicating if the signup process is ongoing.
 */
export const useSignup = () => {
  const { loginUser: updateUserContext } = useUser(); // Renamed for clarity
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { validateEmail } = useValidation();
  const { validatePnr } = useValidation();
  const { validatePassword } = useValidation();
  const { validateUsername } = useValidation();

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

      if(!formData.name || !formData.surname || !formData.pnr || !formData.email || !formData.password){
        setError("All fields are required!!")
        return;
      }
      if(!validatePnr(formData.pnr)){
        setError("Invalid Person number")
        return;
      }
      if(!validateEmail(formData.email)){
        setError("Invalid Email")
        return;
      }
      if(!validatePassword(formData.password)){
        setError("Password must include at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character ")
        return;
      }
      if(!validateUsername(formData.username)){
        setError("Invalid characters in username!");
        return;
      }
      if(!validateUsername(formData.name)||!validateUsername(formData.surname)){ //checks so that no crazy characters occur
        setError("Invalid characters in your name!?");
        return;
      }
   
      const res = await signupUser(formData);
      const { accessToken, refreshToken, userData } = res;


      updateUserContext(userData, accessToken, refreshToken);
      localStorage.setItem('accessToken', accessToken); 
      localStorage.setItem('refreshToken', refreshToken); 
      navigate("/");
      return userData; 
    } catch (err: unknown) {
      if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
        console.error("Network error or server unreachable:", err);
        setError("Unable to connect to the server. Please check your internet connection or try again later.");
        return;
      }

      if (isCustomError(err)) {
        if (err.response?.data?.message) {
          setError(`Sign up failed! ${err.response.data.message}`);
        } else {
          setError("Sign up failed! Please try again!!");
        }
      } else if (err instanceof Error) {
        setError("Sign up failed! "+ err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { signup, error, loading };
};
