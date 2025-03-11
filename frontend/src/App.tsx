import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/profile";
import ApplyForJob from "./pages/ApplyForJob";
import ResetPassword from "./pages/ResetPassword"
import "./styles/App.css";
import { AvailabilityProvider } from "./context/AvailabilityContext";

import { UserProvider } from './context/UserContext'; 
import { ProfileProvider } from './context/ProfileContext';
import Navbar from "./components/Navbar";
import ApplicationsList from "./components/ApplicationsList";
import ErrorBoundary from "./components/ErrorBoundry";
import rollercoasterVideo from './assets/rollercoaster.mp4';
import './styles/video.css';
/**
 * Main entry point of the application.
 * 
 * The `App` component serves as the central hub for routing and rendering different pages of the app. 
 * It is wrapped with `UserProvider` and `ProfileProvider` to provide global state management for user and profile data throughout the application. 
 * The routes define public, protected, and error-handling paths that allow users to navigate through the app.
 * 
 * The app consists of the following routes:
 * - signup: Displays the signup page for new users.
 * - login: Displays the login page for returning users.
 * - profile: Displays the user's profile (requires authentication).
 * - apply: Displays the job application page (requires authentication).
 * - reset: Displays the password reset page for password recovery.
 * - (Home): Displays the homepage of the app.
 * - *editprofile*: Allows the user to edit their profile (requires authentication).
 * - *applications*: Displays a list of job applications (requires authentication).
 * - *404 (NotFound)*: Displays a 404 page for invalid routes.
 * 
 * The Navbar component is visible on all pages and allows easy navigation between the app's sections. 
 * Protected routes (such as profile, applications, etc.) ensure that only authenticated users can access them.
 * 
 * @component
 */
const App: React.FC = () => {
  return (
    <UserProvider>
      <div className="video-container">
        <video autoPlay loop muted id='video'>
          <source src={rollercoasterVideo} type="video/mp4" />
        </video>
      </div>
      <ProfileProvider>
      <Navbar></Navbar>
      <ErrorBoundary>
      <AvailabilityProvider>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/apply" element={<ApplyForJob/>} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/applications" element={<ApplicationsList />} />
      </Routes>
      </AvailabilityProvider>
      </ErrorBoundary>
      </ProfileProvider>
    </UserProvider>
  );
};

export default App;