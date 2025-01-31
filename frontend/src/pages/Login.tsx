import LoginForm from "../components/LoginForm";
import { useUser } from '../context/UserContext';  // Import the useUser hook

const Login: React.FC = () => {
    const { user } = useUser();  // Access user from the context

    return (
      <div>
        <h1>Login Page</h1>
        {user ? (
          <h2>You are logged in!</h2> 
        ) : (
          <LoginForm /> 
        )}
      </div>
    );
};

export default Login;