import Box from '@mui/material/Box';
import { useUser } from '../context/UserContext';  // Import the useUser hook
import AccountInfoForm from '../components/AccountInfoForm';
import UserCompetences from '../components/UserCompetences'
import PasswordResetForm from '../components/PasswordResetForm';


/**
 * `Profile` Component
 * 
 * The `Profile` component displays the user's profile information, including account details, competences, 
 * and the option to reset the password, depending on the user's login status and role.
 * 
 * - If the user is logged in, it shows:
 *   - `AccountInfoForm`: A form that allows users to view or edit their account details.
 *   - `UserCompetences`: Displays the user's competences, but it is read-only for non-admin users.
 *   - `PasswordResetForm`: A form that allows the user to reset their password.
 * 
 * - If the user is not logged in, a message is displayed prompting them to log in.
 * 
 * @returns {JSX.Element} The rendered JSX element that displays the user's profile or a message to log in.
 */
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