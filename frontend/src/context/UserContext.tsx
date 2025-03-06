import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { useNavigate } from "react-router-dom";

/**
 * User interface
 * 
 * This interface defines the structure of the user object. It contains the following properties:
 * - username: The username of the user.
 * - person_id: A unique identifier for the user.
 * - role_id: The role identifier, indicating the user's role.
 * - name: The user's first name.
 * - surname: The user's last name.
 * - email: The user's email address.
 * - pnr: A unique personal number for the user.
 * 
 * @interface User
 */
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
  updateAccessToken: (accessToken: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * UserProvider component
 * 
 * This provider component manages user authentication state and provides the functionality 
 * to log in, log out, and update the access token. It stores user data and tokens in localStorage 
 * and ensures they are available across sessions. It also loads the user data from localStorage
 * when the app is initialized.
 * 
 * @component
 * @param {Object} props - The component's props.
 * @param {ReactNode} props.children - The children components to be wrapped by this provider.
 * 
 * @returns {JSX.Element} The wrapped children components with user context provided.
 */
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
    localStorage.removeItem("competences");
    localStorage.removeItem("availabilities");
    sessionStorage.clear(); // Optionally clear session storage
    navigate("/"); // Redirect if needed
  };

  // Function to update the access token
  const updateAccessToken = (newAccessToken: string) => {
    setAccessToken(newAccessToken);
    localStorage.setItem("accessToken", newAccessToken); // Store updated access token
  };

  return (
    <UserContext.Provider value={{ user, accessToken, refreshToken, loginUser, logoutUser, updateAccessToken }}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * useUser hook
 * 
 * This custom hook allows any component to easily access the user context. It provides 
 * a convenient way to use the context's state (user, accessToken, refreshToken) and functions 
 * (loginUser, logoutUser, updateAccessToken).
 * 
 * @hook
 * @returns {UserContextType} The context value with user data and functions.
 * 
 * @throws {Error} If used outside of the UserProvider component.
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};