import PasswordResetForm from "../components/PasswordResetForm";
import PasswordEmailResetForm from "../components/PasswordEmailResetForm";
import { usePasswordReset } from "../hooks/usePasswordReset";

const ResetPasswordPage: React.FC = () => {
  // Destructure the tokenFromUrl from the usePasswordReset hook
  const { tokenFromUrl } = usePasswordReset();

  // Check for token either in URL or in localStorage (whichever you prefer)
  const tokenInLocalStorage = localStorage.getItem('resetToken'); // Example of getting token from localStorage

  const token = tokenFromUrl || tokenInLocalStorage;

  return (
    <>
      <h1>Dynamically rendered reset-page</h1>
      <p>Depending on if the user has a token in localStorage or in the URL, or none</p>
      <p>{tokenFromUrl}</p>
      {token ? <PasswordResetForm /> : <PasswordEmailResetForm /> }
    </>
  );
};

export default ResetPasswordPage;
