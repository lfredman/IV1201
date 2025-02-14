import React from "react";
import { Button } from "@mui/material";
import { useTEST } from "../hooks/useLogin"; // Use signup hook
import { useUser } from '../context/UserContext';  // Import the useUser hook


const Test: React.FC = () => {
  const { test } = useTEST(); // Importing the test logic
  const user = useUser();

  const handleClick = () => {
    test(); // Call the test function
  };

  return (
    <>
    <Button
      type="button" // Button type changed to "button" (optional for clarity)
      variant="contained"
      color="primary"
      fullWidth
      sx={{ mt: 2 }}
      onClick={handleClick} // Attach the event handler here
    >
      Parse
    </Button>
    <h6>{user.accessToken}</h6>
    </>
  );
};

export default Test;

