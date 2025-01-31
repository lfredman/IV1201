// src/components/Navbar.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';  // Import the useUser hook

const Navbar: React.FC = () => {
  const { user } = useUser();  // Access user from the context

  return (
    <nav>
      <Link to="/">Home</Link> | <Link to="/about">About</Link> | 
      
      {/* Conditionally display 'Logged in as: USER' if user is logged in */}
      {user ? ( <span> Logged in as: {user.username} </span> ):( <Link to="/login"> login </Link>)}
    </nav>
  );
};

export default Navbar;
