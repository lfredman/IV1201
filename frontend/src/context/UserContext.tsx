import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { useNavigate } from "react-router-dom";

// User type definition (without the tokens)
export interface User {
  username: string;
  person_id: number;
  role_id: number;
  name: string;
  surname: string;
  email: string;
  pnr: number;
}

interface UserContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loginUser: (user: User, accessToken: string, refreshToken: string) => void;
  logoutUser: () => void;
  updateAccessToken: (accessToken: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem("accessToken"));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem("refreshToken"));
  const navigate = useNavigate(); // Hook for redirection

  // Load user from localStorage when the app starts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Function to log in and store user data, access token, and refresh token
  const loginUser = (user: User, accessToken: string, refreshToken: string) => {
    setUser(user);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    localStorage.setItem("user", JSON.stringify(user));  // Store user data
    localStorage.setItem("accessToken", accessToken); // Store access token
    localStorage.setItem("refreshToken", refreshToken); // Store refresh token
  };

  // Function to log out and ensure the token and user data are removed
  const logoutUser = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("user"); // Remove user data
    localStorage.removeItem("accessToken"); // Remove access token
    localStorage.removeItem("refreshToken"); // Remove refresh token
    sessionStorage.clear(); // Optionally clear session storage
    navigate("/"); // Redirect if needed
  };

  // Function to update the access token
  const updateAccessToken = async (newAccessToken: string) => {
    setAccessToken(newAccessToken);
    localStorage.setItem("accessToken", newAccessToken); // Store updated access token
    // We simulate the async behavior by resolving here
    return new Promise<void>((resolve) => {
      resolve();
    });
  };

  return (
    <UserContext.Provider value={{ user, accessToken, refreshToken, loginUser, logoutUser, updateAccessToken }}>
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