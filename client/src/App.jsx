import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Profile from './pages/Profile.jsx';
import ReportIncidentForm from "./components/ReportIncidentForm.jsx";
import Notifications from "./pages/Notifications.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
       <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notifications" element={<Notifications/>}/>
        <Route path="/report" element={<ReportIncidentForm/>} />
        <Route path="/profile" element={< Profile/>}/>
      </Routes>
    </>
  );
}

export default App;
