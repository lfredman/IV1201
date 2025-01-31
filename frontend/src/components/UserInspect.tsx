import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useUserdata } from '../hooks/useUserdata'; // Import the custom hook

const UserInspect: React.FC = () => {
  const { getUserData, userData } = useUserdata();  // Using the hook to get the data and function

  return (
    <div>
      <Box> 
        <Button
          variant="contained"
          color="primary"
          onClick={getUserData}  // Trigger the fetch when the button is clicked
          sx={{ textTransform: "none" }}>
          Parse Userdata
        </Button>

        {/* Optionally display user data if available */}
        {userData && (
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="h6">User Data:</Typography>
            <pre>{JSON.stringify(userData, null, 2)}</pre>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default UserInspect;
