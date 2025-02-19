import Box from '@mui/material/Box';
import { useUser } from '../context/UserContext';  // Import the useUser hook
import Navbar from '../components/Navbar';
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
          height: 'felx',  // Full viewport height to vertically center content
        }}
      >
        <div>
          {user ?
            <Box sx={{mx: 'auto', display: 'flex', }}>
              <AccountInfoForm />
              <UserCompetences editable={false} />
            </Box>
            :
            <p>You cant be here</p>}
        <h1>Profile Page</h1>
          {user ? <><AccountInfoForm />  <PasswordResetForm/> </>: <p>You cant be here</p>}
        </div>
      </Box>
    </Box>
  );
};

export default Profile;