import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

/**
 * Navbar Component
 *
 * A responsive navigation bar for the Recruitment System.
 * Displays different navigation options based on the user's authentication status and role.
 *
 * Features:
 * - If logged in:
 *   - Shows "Profile" and "Log out" buttons
 *   - Displays "Apply for a Job" for regular users (role_id ≠ 1)
 *   - Displays "Applications" for admins (role_id === 1)
 * - If not logged in:
 *   - Shows "Log in" button
 * - Implements smooth hover effects for buttons
 *
 * @returns {JSX.Element} A navigation bar with conditional rendering based on user state.
 */
const Navbar: React.FC = () => {
  const { user, logoutUser } = useUser();
  const buttonStyle = {
    mx: 1,
    color: "white",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      color: "#FFD700"
    }
  };

  return (

    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Recruitment System
        </Typography>
        <Button color="inherit" component={Link} to="/" sx={buttonStyle}>
          Home
        </Button>
        {user ? (
          <>
            <Button color="inherit" component={Link} to="/profile" sx={buttonStyle}>
              Profile
            </Button>
            {user.role_id != 1 ? (<Button color="inherit" component={Link} to="/apply" sx={buttonStyle}>
              Apply for a Job
            </Button>) : <div></div>}
            {user.role_id == 1 ? (<Button color="inherit" component={Link} to="/applications" sx={buttonStyle}>
              Applications
            </Button>) : <div></div>}

            <Button color="inherit" onClick={logoutUser} sx={buttonStyle}>
              Log out
            </Button>
          </>
        ) : (
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
