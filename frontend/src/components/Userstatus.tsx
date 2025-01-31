import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useUser } from "../context/UserContext"; // Import the UserContext hook

 
const Navbar: React.FC = () => {
  const { user, logoutUser } = useUser();  // Get user and logout function from context
  
  return (
    <div>
    <Box 
      sx={{
        position: "fixed",
        top: 0,
        right: 0,
        padding: "10px 20px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        width: "auto",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {/* Conditional rendering: if user is logged in, show their username */}
        {user ? (
          <>
            <Typography variant="body1" sx={{ marginRight: 2 }}>
              Logged in as: <strong>{user.username} {user.role_id}</strong>
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={logoutUser}  // Call logout on button click
              sx={{ textTransform: "none" }} // Keep text in normal case
            >
              Logout
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.href = '/login'}  // Navigate to login
            sx={{ textTransform: "none" }}
          >
            Login
          </Button>
        )}
      </Box>
    </Box>
    
    </div>
  );
};

export default Navbar;
