import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/profile"
import EditProfile from "./pages/EditProfile"
import ApplyForJob from "./pages/ApplyForJob";
import ResetPassword from "./pages/ResetPassword"
import "./styles/App.css"; // Import global styles here
import { AvailabilityProvider } from "./context/AvailabilityContext";



import { UserProvider } from './context/UserContext';  // Import UserProvider
import { ProfileProvider } from './context/ProfileContext';  // Import ProfileProvider
import Userstatus from "./components/Userstatus";
import Navbar from "./components/Navbar";
import ApplicationsList from "./components/ApplicationsList";


const App: React.FC = () => {
  return (
    <UserProvider>
      <ProfileProvider>
      <Userstatus></Userstatus>
      <Navbar></Navbar>
      <AvailabilityProvider>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/apply" element={<ApplyForJob/>} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/applications" element={<ApplicationsList />} />
      </Routes>
      </AvailabilityProvider>
      </ProfileProvider>
    </UserProvider>
  );
};

export default App;