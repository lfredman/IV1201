import { useState, useEffect } from "react";
import useAuthFetch from "../hooks/useAuthFetch";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useValidation } from "./useValidation";


/**
 * Custom hook for handling password reset functionality.
 * 
 * This hook provides two methods for resetting a user's password:
 * 1. **passwordReset**: Resets the password using a token retrieved from the URL.
 * 2. **passwordResetByEmail**: Sends a password reset request via email, with the token passed from the URL if available.
 * 
 * It includes client-side validation for passwords and emails, shows loading and error states, 
 * and manages success feedback by logging out the user after a successful reset. After logging out, 
 * the user is optionally redirected to the login page after a short delay.
 * 
 * The hook also provides an `error` state for handling and displaying any errors during the process,
 * a `loading` state for showing a loading spinner, and a `success` state to indicate successful reset.
 * 
 * @returns {Object} - An object containing:
 *   - `passwordReset`: Function to reset the password using the token from the URL.
 *   - `passwordResetByEmail`: Function to initiate a password reset via email.
 *   - `error`: The error message if an error occurs during password reset.
 *   - `loading`: Boolean indicating if the password reset process is in progress.
 *   - `success`: Boolean indicating if the password reset was successful.
 *   - `setError`: Function to manually set the error state.
 *   - `tokenFromUrl`: The token extracted from the URL (if available).
 * 
 */
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

      if (!validatePassword(newPassword)) {
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
        tokenFromUrl
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reset password");
      }

      setSuccess(true);

      setTimeout(() => {
        logoutUser();
        navigate("/login");
      }, 3000);
    } catch (err: unknown) {
      let errMsg = "Password reset failed! An unknown error occurred.";
      if (err instanceof Error) {
        errMsg = `Password reset failed! ${err.message}`;
      } else if (typeof err === "object" && err !== null && "message" in err) {
        errMsg = `Password reset failed! ${(err as { message: string }).message}`;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };


  const passwordResetByEmail = async (email: string) => {
    setError(null);
    setLoading(true);

    try {

      if (!validateEmail(email)) {
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
        navigate("/login");
      }, 3000);
    } catch (err: unknown) {
      let errMsg = "Password reset failed! An unknown error occurred.";
      if (err instanceof Error) {
        errMsg = `Password reset failed! ${err.message}`;
      } else if (typeof err === "object" && err !== null && "message" in err) {
        errMsg = `Password reset failed! ${(err as { message: string }).message}`;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };


  return { passwordReset, error, loading, success, setError, passwordResetByEmail, tokenFromUrl };
};
