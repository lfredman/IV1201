import SignupForm from '../components/SignupForm';
import { useUser } from '../context/UserContext';  // Import the useUser hook

const Login: React.FC = () => {
    const { user } = useUser();  // Access user from the context

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