import PasswordResetForm from "../components/PasswordResetForm";
import PasswordEmailResetForm from "../components/PasswordEmailResetForm";
import { usePasswordReset } from "../hooks/usePasswordReset";

/**
 * `ResetPasswordPage` Component
 * 
 * The `ResetPasswordPage` component is responsible for managing the password reset process. It checks if a valid token
 * is present in the URL or in the localStorage to determine whether the user is attempting to reset their password 
 * through a form or if they need to provide their email to initiate the reset process.
 * 
 * - If a token is found (either in the URL or in localStorage), the user is shown the `PasswordResetForm` to reset their password.
 * - If no token is found, the `PasswordEmailResetForm` is displayed to allow the user to submit their email for a password reset request.
 * 
 * This component relies on the `usePasswordReset` hook to extract the token from the URL, and checks the localStorage for a fallback token.
 * 
 * @returns {JSX.Element} A form for either resetting the password or requesting a reset email.
 */
const ResetPasswordPage: React.FC = () => {
  const { tokenFromUrl } = usePasswordReset();

  const tokenInLocalStorage = localStorage.getItem('resetToken');

  const token = tokenFromUrl || tokenInLocalStorage;

  return (
    <>
      {token ? <PasswordResetForm /> : <PasswordEmailResetForm />}
    </>
  );
};

export default ResetPasswordPage;
