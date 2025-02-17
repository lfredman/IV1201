import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import { useUser } from '../context/UserContext';
import Navbar from '../components/Navbar';
import rollercoasterVideo from '../assets/rollercoaster.mp4';
import ferriswheelVideo from '../assets/ferriswheel.mp4';
import '../styles/video.css';

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

      {/* Navbar */}
      {user && user.role_id == -1 ? <Navbar /> : null}

      {/* Content */}
      <Box
        component="section"
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          position: 'relative',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <div>
          {user ? (
            <div>
              <h1>Welcome {user.name}!</h1>
              <p>Kickstart your career with us, fill in your profile and send in an application.</p>
            </div>
          ) : (
            <p>Please log in to access more features.</p>
          )}
        </div>
      </Box>
    </Box>
  );
};

export default Home;
