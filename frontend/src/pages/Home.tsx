import Box from '@mui/material/Box';
import { useUser } from '../context/UserContext';
import rollercoasterVideo from '../assets/rollercoaster.mp4';
//import '../styles/video.css';
import { Button } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';

/**
 * `Home` Component
 * 
 * The `Home` component represents the landing page of the application. It displays a video background and a dynamic welcome message 
 * based on whether the user is logged in or not.
 * 
 * The component checks if the user is logged in through the `useUser` hook and conditionally renders content:
 * - If the user is logged in:
 *   - A personalized greeting message is shown with the user's name.
 *   - If the user has a role other than "1" (admin), they are prompted to fill in their profile and submit an application.
 *   - If the user is an admin, they are prompted to go to the applications page to start reviewing applications.
 * - If the user is not logged in:
 *   - A generic message inviting the user to log in is displayed, along with a login button that navigates to the login page.
 * 
 * The background of the page features a looping video to create a dynamic and visually appealing effect.
 * 
 * @returns {JSX.Element} The rendered JSX element:
 * - Displays a video background with a dynamic welcome message and call to action.
 * - If logged in, the message is personalized with the user's name and role-based instructions.
 * - If not logged in, a message encouraging the user to log in and a login button are displayed.
 */
const Home: React.FC = () => {
  const { user } = useUser();
  

 

  return (
    <Box sx={{color: 'black'}}>
      {/* Video Background 
      <div className="video-container">
        <video autoPlay loop muted id='video'>
          <source src={rollercoasterVideo} type="video/mp4" />
        </video>
      </div>*/}


      <Box
        component="section"
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
          position: 'relative',
          color: 'white',
          textAlign: 'center',
        }}
      >
      <div>
        {user ? (
          <div>
            <h1>Welcome {user.name}!</h1>
            {user.role_id !== 1 ? (
              <p>Kickstart your career with us, fill in your profile and send in an application.</p>
            ): <p>Go to applications page to start reviewing!</p>}
          </div>
        ) : (
          <>
            <h1>Kickstart Your Career with Us</h1>
            <p>Ready to take the next step in your career? Log in to get started today!</p>
            
            <Button 
              variant="contained" 
              color="primary" 
              endIcon={<AccountCircleIcon />}
              component={Link} 
              to="/login"
            >
              Login Here
            </Button>
          </>
        )}
      </div>

      </Box>
    </Box>
  );
};

export default Home;
