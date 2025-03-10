import LoginForm from "../components/LoginForm";
import { useUser } from '../context/UserContext'; 

/**
 * `Login` Component
 * 
 * The `Login` component is responsible for rendering the login screen of the application. It checks if a user is already logged in 
 * using the `useUser` hook and conditionally renders content based on the user's authentication state.
 * 
 * - If the user is logged in (i.e., the `user` object is available in the context), a simple message is displayed indicating 
 *   that the user is already logged in.
 * - If the user is not logged in, the component renders the `LoginForm` component, which handles the user input for logging in.
 * 
 * @returns {JSX.Element} The rendered JSX element:
 * - If logged in, a message "You are logged in!" is shown.
 * - If not logged in, the `LoginForm` component is displayed for the user to input their credentials.
 */
const Login: React.FC = () => {
    const { user } = useUser(); 

    return (
      <div>
        {user ? (
          <h2>You are logged in!</h2> 
        ) : (
          <LoginForm /> 
        )}
      </div>
    );
};

export default Login;