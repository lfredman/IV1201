import React from "react";
import { Button } from "@mui/material";
import { useTEST } from "../hooks/useLogin"; // Use signup hook
import { useUser } from '../context/UserContext';  // Import the useUser hook

/**
 * Test Component
 * 
 * This component provides a button that, when clicked, triggers a test function from the `useTEST` hook.
 * It also displays the current user's access token fetched from the `useUser` hook.
 * 
 * Features:
 * - Calls a custom `test` function from the `useTEST` hook upon button click.
 * - Displays the `accessToken` from the user context.
 *
 * @returns {JSX.Element} A button that triggers the test function, along with displaying the user's access token.
 */
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

