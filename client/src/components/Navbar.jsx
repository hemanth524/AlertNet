import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-700 text-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide">
          AlertNet 🚨
        </Link>

        {/* Navigation links */}
        <div className="flex flex-wrap items-center gap-6 text-sm md:text-base">
          {!token ? (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/signup" className="hover:underline">
                Signup
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <Link to="/report" className="hover:underline">
                Report Incident
              </Link>
              <Link to="/notifications" className="text-white hover:underline">
                Notifications
              </Link>
              <Link to="/my-incidents" className="hover:underline">
                My Incidents
              </Link>
              <Link to="/help" className="hover:underline">
                Help Others
              </Link>
              <Link to="/profile" className="hover:underline">
                Profile
              </Link>
              <span className="font-semibold">👤 {user?.name || "User"}</span>
              <button
                onClick={handleLogout}
                className="bg-white text-blue-700 font-medium px-3 py-1 rounded hover:bg-gray-200 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
