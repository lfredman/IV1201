import { useState } from "react";
import { signupUser } from "../utils/signup"; // API call
import { useNavigate } from "react-router-dom";
import { useUser } from '../context/UserContext'; // Import the context
import { useValidation } from "../hooks/useValidation";

export const useSignup = () => {
  const { loginUser: updateUserContext } = useUser(); // Renamed for clarity
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { validateEmail } = useValidation();
  const { validatePnr } = useValidation();
  const { validatePassword } = useValidation();

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
   
      const res = await signupUser(formData);
      const { message, accessToken, refreshToken, userData } = res;

      console.log(message);
      console.log("User Data:", userData); // Debugging to ensure userData is correct

      // Set user globally in context and save the tokens to localStorage
      updateUserContext(userData, accessToken, refreshToken); // Update global context with the new user data
      localStorage.setItem('accessToken', accessToken); // Store access token in localStorage
      localStorage.setItem('refreshToken', refreshToken); // Store refresh token in localStorage
      // navigate to home screen
      navigate("/");
      return userData; // Return user or token if needed elsewhere
    } catch (err) {
      const errMsg: string = "Sign up failed! " + err.message;
      setError(errMsg);
    } finally {
      
      setLoading(false);
    }
  };

  return { signup, error, loading };
};
