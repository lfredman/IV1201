import Box from '@mui/material/Box';
import { useUser } from '../context/UserContext';  // Import the useUser hook
import AccountInfoForm from '../components/AccountInfoForm';
import UserCompetences from '../components/UserCompetences'
import PasswordResetForm from '../components/PasswordResetForm';

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
          height: '100vh',
        }}
      >
        {user ? (
          <>
            <AccountInfoForm />
            {user.role_id !== 1 && <UserCompetences editable={false} />}
            <PasswordResetForm />
            </>
        ) : (
          <p>You can't be here! Please log in.</p>
        )}
      </Box>
    </Box>
  );
};

export default Profile;