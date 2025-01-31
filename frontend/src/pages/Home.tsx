import LoginForm from "../components/LoginForm"
import UserInspect from "../components/UserInspect"

import { useUser } from '../context/UserContext';  // Import the useUser hook

const Home: React.FC = () => {
  const { user } = useUser();

    return (
      <div>
        <h1>Home Page</h1>
        <UserInspect/>
        {user?(
          <h3>Here you can apply for a clean job</h3>
        ):(
          <>
          <h2>You have to login or create an account to apply for a job!</h2>
          <LoginForm />
          
          </>
        )}
        
      </div>
    );
  };
  
  export default Home;