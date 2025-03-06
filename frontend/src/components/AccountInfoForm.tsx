import React, { useState } from "react";
import { TextField, Button, Box, Typography} from "@mui/material";
import { useUser } from '../context/UserContext';  // Import the useUser hook


/**
 * A component that displays a user's account information.
 * 
 * This component fetches user details from the `useUser` context and renders 
 * them in a styled box layout. It currently displays:
 * - Username
 * - First name
 * - Surname
 * - Personal number
 * - Email
 *
 * @component
 * @returns {JSX.Element} The rendered account information form.
 */
const AccountInfoForm: React.FC = () => {
    const {user} = useUser();
    
  return (
    <Box 
      sx={{
        width: 300,
        mx: "auto",
        mt: 5,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        textAlign: "center",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Profile info
      </Typography>
      <div>
        <p><strong> Username: </strong> {user?.username} </p>
        <p> <strong> First name: </strong> {user?.name} </p>
        <p> <strong> Surname: </strong> {user?.surname} </p>
        <p> <strong> Personal number: </strong> {user?.pnr} </p>
        <p> <strong> Email: </strong> {user?.email} </p>
      </div>
      {/*<Button >
        Edit  
      </Button>*/}
    </Box>
  );
};

export default AccountInfoForm;
