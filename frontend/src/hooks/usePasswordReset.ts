import { useState, useEffect } from "react";
import useAuthFetch from "../hooks/useAuthFetch";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useValidation } from "./useValidation";

export const usePasswordReset = () => {
  const { logoutUser } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const authFetch = useAuthFetch();
  const location = useLocation();
  const [tokenFromUrl, setTokenFromUrl] = useState<string | undefined>(undefined);

    //client side validation
    const { validatePassword, validateEmail } = useValidation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token") ?? undefined;
    setTokenFromUrl(token);
  }, [location]);


  const passwordReset = async (newPassword: string) => {
    setError(null);
    setLoading(true);

    try {

      if(!validatePassword(newPassword)){
        setError("password is too weak!")
      }

      // Get the reset token from URL params if available
      //const queryParams = new URLSearchParams(location.search);
      //const tokenFromUrl = queryParams.get("token") ?? undefined;
    
      // Make the request to reset the password, using the token from the URL if available
      const response = await authFetch(
        `/account/reset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: newPassword,
          }),
        },
        tokenFromUrl // Pass token only if it exists, otherwise authFetch will use accessToken
      );

      // If response is not OK, throw an error
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reset password");
      }

      // Successfully reset password
      setSuccess(true);

      // Logout after a short delay to give feedback
      setTimeout(() => {
        logoutUser();
        navigate("/login");  // Optionally redirect to login page
      }, 3000);
    } catch (err: any) {
      // Handle errors gracefully
      const errMsg = `Password reset failed! ${err?.message || "An unknown error occurred."}`;
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };


  const passwordResetByEmail = async (email: string) => {
    setError(null);
    setLoading(true);

    try {

      if(!validateEmail(email)){
        setError("no good email");
      } 

      // Get the reset token from URL params if available
      const queryParams = new URLSearchParams(location.search);
      const tokenFromUrl = queryParams.get("token") ?? undefined;
    
      // Make the request to reset the password, using the token from the URL if available
      const response = await authFetch(
        `/account/resetbyemail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        },
        tokenFromUrl // Pass token only if it exists, otherwise authFetch will use accessToken
      );

      // If response is not OK, throw an error
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reset password");
      }

      // Successfully reset password
      setSuccess(true);

      // Logout after a short delay to give feedback
      setTimeout(() => {
        logoutUser();
        navigate("/login");  // Optionally redirect to login page
      }, 3000);
    } catch (err: any) {
      // Handle errors gracefully
      const errMsg = `Password reset failed! ${err?.message || "An unknown error occurred."}`;
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };


  return { passwordReset, error, loading, success, setError, passwordResetByEmail, tokenFromUrl };
};
