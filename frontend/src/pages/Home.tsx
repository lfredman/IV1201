import Box from '@mui/material/Box';
import { useUser } from '../context/UserContext';  // Import the useUser hook

const Home: React.FC = () => {
  const { user } = useUser();

  return (
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
        <h1>Welcome to Home</h1>
        {user ? <p>Hello, {user.name}!</p> : <p>Please log in to access more features.</p>}
      </div>
    </Box>
  );
};

export default Home;