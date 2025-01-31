import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import { UserProvider } from './context/UserContext';  // Import UserProvider
import Userstatus from "./components/Userstatus";


const App: React.FC = () => {
  return (
    <>
      <UserProvider>
        <Userstatus></Userstatus>
        <Navbar />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </UserProvider>
    </>
  );
};

export default App;