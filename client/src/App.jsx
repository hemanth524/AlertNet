import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Profile from './pages/Profile.jsx';
import ReportIncidentForm from "./components/ReportIncidentForm.jsx";
import Notifications from "./pages/Notifications.jsx";
import IncidentDetails from "./pages/IncidentDetails.jsx";
import MyIncidents from "./pages/MyIncidents.jsx";

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
          <Route path="/incident/:id" element={<IncidentDetails />} />
          <Route path="/my-incidents" element={<MyIncidents/>}/>
        <Route path="/profile" element={< Profile/>}/>
      </Routes>
    </>
  );
}

export default App;
