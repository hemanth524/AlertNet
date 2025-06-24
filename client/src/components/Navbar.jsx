import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { token, user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className=" bg-slate-500 text-white shadow-md w-full z-50 relative">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide">
          AlertNet 🚨
        </Link>

        {/* Desktop Links */}
        <div className="hidden sm:flex flex-wrap items-center gap-6 text-sm md:text-base">
          {!token ? (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/signup" className="hover:underline">Signup</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <Link to="/report" className="hover:underline">Report Incident</Link>
              <Link to="/notifications" className="hover:underline">Notifications</Link>
              <Link to="/my-incidents" className="hover:underline">My Incidents</Link>
              <Link to="/help" className="hover:underline">Help Others</Link>
              <Link to="/profile" className="hover:underline">Profile</Link>
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

        {/* Mobile Menu Icon & Logout */}
        <div className="sm:hidden flex items-center gap-3">
          {token && (
            <button
              onClick={handleLogout}
              className="bg-white text-blue-700 text-sm font-semibold px-3 py-1 rounded hover:bg-gray-200 transition"
            >
              Logout
            </button>
          )}
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && token && (
        <div className="sm:hidden bg-blue-800 text-white absolute w-full left-0 shadow-lg z-40">
          <div className="flex flex-col items-start gap-3 px-6 py-4 text-sm">
            <Link to="/dashboard" onClick={toggleMenu}>Dashboard</Link>
            <Link to="/report" onClick={toggleMenu}>Report Incident</Link>
            <Link to="/notifications" onClick={toggleMenu}>Notifications</Link>
            <Link to="/my-incidents" onClick={toggleMenu}>My Incidents</Link>
            <Link to="/help" onClick={toggleMenu}>Help Others</Link>
            <Link to="/profile" onClick={toggleMenu}>Profile</Link>
            <span className="font-semibold">👤 {user?.name || "User"}</span>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
