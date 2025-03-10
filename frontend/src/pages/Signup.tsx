import SignupForm from '../components/SignupForm';
import { useUser } from '../context/UserContext';  

/**
 * `Login` Component
 * 
 * The `Login` component determines whether the user is logged in or not by checking the `user` object from the context.
 * - If the user is logged in (`user` is truthy), it displays a message informing them that they are logged in and 
 *   provides an option to log out if they want to sign up.
 * - If the user is not logged in (`user` is falsy), the component renders the `SignupForm` to allow the user to sign up.
 * 
 * This component is useful for scenarios where you want to handle both login and signup on the same page, 
 * depending on whether the user is already authenticated or not.
 * 
 * @returns {JSX.Element} A message for logged-in users or a signup form for users who are not logged in.
 */
const Login: React.FC = () => {
    const { user } = useUser(); 

    return (
      <div>
        {user ? (
          <h2>You are logged in! Log out if you want to sign up</h2> 
        ) : (
          <SignupForm /> 
        )}
      </div>
    );
};

export default Login;