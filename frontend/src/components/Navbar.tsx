// src/components/Navbar.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';  // Import the useUser hook
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

const Navbar: React.FC = () => {
  const { user, logoutUser } = useUser();  // Get user and logout function from context

  const buttonStyle = {
    mx: 1, 
    color: "white", // Default text color
    transition: "background-color 0.3s ease", // Smooth transition
    "&:hover": { 
      backgroundColor: "rgba(255, 255, 255, 0.1)", // Light white overlay on hover
      color: "#FFD700" // Optional: Gold text on hover
    }
  };

  return (

      <AppBar position = "sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Recruitment System 
          </Typography>
          <Button color="inherit" component={Link} to="/" sx = {buttonStyle}>
            Home
          </Button>
          {user ? (
          // If logged in, show profile, applications, and logout
          <>
            <Button color="inherit" component={Link} to="/profile" sx={buttonStyle}>
              Profile
            </Button>
            <Button color="inherit" component={Link} to="/apply" sx={buttonStyle}>
              Apply for a Job
            </Button>
            {user.role_id == 1 ? (<Button color="inherit" component={Link} to="/applications" sx={buttonStyle}>
              Applications
            </Button>): <div></div> }
            
            <Button color="inherit" onClick={logoutUser} sx={buttonStyle}>
              Log out
            </Button>
          </>
        ) : (
          // If NOT logged in, show login and signup
          <>
            <Button color="inherit" component={Link} to="/login" sx={buttonStyle}>
              Log in
            </Button>
          </>
          )}
        </Toolbar>
      </AppBar>
    
  );
};

export default Navbar;
