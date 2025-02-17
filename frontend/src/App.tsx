import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/profile"
import ResetPassword from "./pages/ResetPassword"
import "./styles/App.css"; // Import global styles here



import { UserProvider } from './context/UserContext';  // Import UserProvider
import Userstatus from "./components/Userstatus";


const App: React.FC = () => {
  return (
    <UserProvider>
      <Userstatus></Userstatus>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </UserProvider>
  );
};

export default App;