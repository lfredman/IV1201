// src/hooks/useLogin.ts
import { useState } from 'react';
import { getUsers } from '../utils/api'
import { useUser } from '../context/UserContext'; // Import the context


// Custom hook for login
export const useUserdata = () => {

  const { user } = useUser();  // Custom hook for API request
    
  const [userData, setUserData] = useState(null); // Assuming you want to store the user data in the state

  const getUserData = async () => {
    try {
      // Call the login API to get the token and userData
      if (user){
        const res = await getUsers(user.token,"16"); // Model function (API request)
        console.log(res)
      }
      

      return; // Return user or token if needed elsewhere
    } catch (err) {
      console.log(err);
      throw err; // Propagate error
    }
  };

  return { getUserData, userData };
};
