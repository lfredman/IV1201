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
      {token ? <PasswordResetForm /> : <PasswordEmailResetForm /> }
    </>
  );
};

export default ResetPasswordPage;
