import Box from '@mui/material/Box';
import { useUser } from '../context/UserContext';
import AccountInfoForm from '../components/AccountInfoForm';
import PasswordResetForm from '../components/PasswordResetForm';
import { Container } from '@mui/system';
import { Typography } from '@mui/material';


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
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        p: 2,
      }}
    >
      {user ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap', // Ensures wrapping of components on smaller screens
            justifyContent: 'center',
            gap: 3,
            width: '100%',
            backgroundColor: 'transparent',
          }}
        >
          <AccountInfoForm />
          <PasswordResetForm />
        </Box>
      ) : (
        <Typography variant="h6" sx={{ textAlign: 'center', color: 'gray' }}>
          You can't be here! Please log in.
        </Typography>
      )}
    </Container>
  );
};

export default Profile;