import Box from '@mui/material/Box';
import { useUser } from '../context/UserContext';  // Import the useUser hook
import Navbar from '../components/Navbar';

const Home: React.FC = () => {
  const { user } = useUser();

  return (

    <Box>

      {user && user.role_id == -1 ? <Navbar /> : <></>}
      <Box 
        component="section" 
        sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh'  // Full viewport height to vertically center content
        }}
      >
        <div>
        <h1>Welcome to Home Page</h1>
          {user ? (
              <div>
              
              <p>Hello, {user.name}!</p>
              </div>
            ) 
            : 
            <p>Please log in to access more features.</p>}
          
        </div>

      </Box>
    </Box>
  );
};

export default Home;