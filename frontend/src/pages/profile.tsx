import Box from '@mui/material/Box';
import { useUser } from '../context/UserContext';  // Import the useUser hook
import Navbar from '../components/Navbar';
import AccountInfoForm from '../components/AccountInfoForm';

const Profile: React.FC = () => {
  const { user } = useUser();

  return (
    <Box>
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
        <h1>Profile Page</h1>
          {user ? <AccountInfoForm /> : <p>You cant be here</p>}
        </div>
      </Box>
    </Box>
  );
};

export default Profile;