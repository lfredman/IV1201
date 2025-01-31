import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { useNavigate } from "react-router-dom";

// User type definition
export interface User {
  username: string;
  token: string;
  person_id: number;
  role_id: number;
  name: string;
  surname: string;
  email: string;
  pnr: number;
}

interface UserContextType {
  user: User | null;
  loginUser: (user: User) => void;
  logoutUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate(); // Hook for redirection

  // Load user from localStorage when the app starts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Function to log in and store user data securely
  const loginUser = (user: User) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  // ✅ Function to log out and ensure the token is removed
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user"); // Remove user data
    localStorage.removeItem("token"); // Ensure token is deleted
    sessionStorage.clear(); // Optionally clear session storage
    //navigate("/"); // Redirect 
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
