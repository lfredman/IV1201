import Box from '@mui/material/Box';
import { useUser } from '../context/UserContext';
import rollercoasterVideo from '../assets/rollercoaster.mp4';
import '../styles/video.css';
import { Button } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { user } = useUser();
  

 

  return (
    <Box sx={{color: 'black'}}>
      {/* Video Background */}
      <div className="video-container">
        <video autoPlay loop muted id='video'>
          <source src={rollercoasterVideo} type="video/mp4" />
        </video>
      </div>


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
