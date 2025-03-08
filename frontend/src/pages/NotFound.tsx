/**
 * `NotFound` Component
 * 
 * The `NotFound` component is a simple page that is displayed when a user navigates to a route that does not exist in the application.
 * It serves as a 404 error page, indicating that the requested page is unavailable.
 * 
 * - It renders a message: "404 - Page Not Found" to inform the user that the page they are looking for cannot be found.
 * 
 * @returns {JSX.Element} The rendered JSX element showing a 404 error message.
 */
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '90vh',
        textAlign: 'center',
      }}
    >
      <Typography variant="h1" sx={{ fontSize: '8rem', fontWeight: 'bold', color: 'white' }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ marginBottom: 2, color: 'white' }}>
        Whoops! This ride is temporarily out of order! 🎢
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3, color: 'white' }}>
        Looks like you've taken a wrong turn! The page you're looking for is lost somewhere in the funhouse. 😜
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        component={Link} 
        to="/" 
        sx={{ fontSize: '1.2rem', padding: '10px 20px' }}
      >
        Take Me Back to the Park!
      </Button>
    </Box>
  );
};

export default NotFound;
