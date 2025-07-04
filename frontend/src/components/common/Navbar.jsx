import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaTachometerAlt,
  FaBookOpen,
  FaBell,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaBars,
  FaTimes,
  FaMoon,
  FaSignOutAlt,
  FaChevronDown,
  FaCog,
  FaBullseye,
} from "react-icons/fa";
import ThemeToggle from "../ui/ThemeToggle";

const Navbar = ({ minimal = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDashboardDropdown, setShowDashboardDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleProtectedClick = (route) => {
    if (!isAuthenticated) {
      navigate("/register");
    } else {
      navigate(route);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const navLink = (Icon, label, route) => (
    <button
      onClick={() => handleProtectedClick(route)}
      className="group flex items-center gap-2 px-4 py-2 rounded-lg transition font-semibold text-white/90 hover:bg-gradient-to-r hover:from-[#1db954]/80 hover:to-[#1e90ff]/80 hover:text-white"
    >
      <Icon className="text-xl group-hover:scale-110 transition-transform" />
      <span className="inline-block">{label}</span>
    </button>
  );

  // Add dashboard dropdown links
  const dashboardLinks = [
    { label: "Overview", route: "/dashboard", icon: FaTachometerAlt },
    { label: "Spending Coach", route: "/dashboard/spending-coach", icon: FaUser },
    { label: "Micro Investor", route: "/dashboard/micro-investor", icon: FaUserPlus },
    { label: "Loan Eligibility", route: "/dashboard/loan-eligibility", icon: FaBookOpen },
    { label: "Settings", route: "/dashboard/settings", icon: FaCog },
  ];

  if (minimal) {
    // Minimal topbar for dashboard pages
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0a0f1c]/80 backdrop-blur-lg border-b border-gray-200 dark:border-white/10 shadow-md flex items-center justify-end px-6 py-3 transition-colors">
        {isAuthenticated && (
          <div className="relative flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-semibold hover:bg-gray-200 dark:hover:bg-white/20 transition"
            >
              <FaUser className="text-xl" />
              <span className="inline-block">Profile</span>
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 bg-white dark:bg-[#181f2a] text-gray-900 dark:text-white rounded-lg shadow-lg w-40 z-10 overflow-hidden transition-colors">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  disabled
                >
                  <ThemeToggle /> Dark/Light Mode
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    window.dispatchEvent(new Event('openOnboarding'));
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <FaUserPlus /> Complete Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-[#0a0f1c]/80 border-b border-gray-200 dark:border-white/10 shadow-md transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text drop-shadow-lg">
          FinZen
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-2 items-center">
          <div className="relative">
            <button
              onClick={() => setShowDashboardDropdown((v) => !v)}
              className="group flex items-center gap-2 px-4 py-2 rounded-lg transition font-semibold text-gray-900 dark:text-white hover:bg-gradient-to-r hover:from-[#1db954]/80 hover:to-[#1e90ff]/80 hover:text-white"
            >
              <FaTachometerAlt className="text-xl group-hover:scale-110 transition-transform" />
              <span className="inline-block">Dashboard</span>
              <FaChevronDown className="ml-1 text-xs" />
            </button>
            {showDashboardDropdown && (
              <div className="absolute left-0 mt-2 bg-white dark:bg-[#0a0f1c] text-gray-900 dark:text-white rounded-lg shadow-lg w-56 z-20 overflow-hidden border border-gray-200 dark:border-white/10 transition-colors">
                {dashboardLinks.map((item) => (
                  <Link
                    key={item.label}
                    to={item.route}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/10 text-base font-medium"
                    onClick={() => setShowDashboardDropdown(false)}
                  >
                    <item.icon className="text-lg" /> {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {navLink(FaBullseye, "Goals", "/goals")}
          {navLink(FaBookOpen, "Resources", "/resources")}
          {navLink(FaBell, "Notifications", "/notifications")}
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-semibold hover:bg-gray-200 dark:hover:bg-white/20 transition"
              >
                <FaUser className="text-xl" />
                <span className="inline-block">Profile</span>
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 bg-white dark:bg-[#181f2a] text-gray-900 dark:text-white rounded-lg shadow-lg w-40 z-10 overflow-hidden transition-colors">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    disabled
                  >
                    <ThemeToggle /> Dark/Light Mode
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      window.dispatchEvent(new Event('openOnboarding'));
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <FaUserPlus /> Complete Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-white/20 transition"
              >
                <FaSignInAlt /> Login
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1db954] to-[#1e90ff] rounded-lg text-white font-semibold hover:from-[#1db954]/80 hover:to-[#1e90ff]/80 transition"
              >
                <FaUserPlus /> Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-[#0a0f1c]/95 text-white px-6 py-4 space-y-3 rounded-b-xl shadow-lg">
          <div className="relative">
            <button
              onClick={() => setShowDashboardDropdown((v) => !v)}
              className="group flex items-center gap-2 px-4 py-2 rounded-lg transition font-semibold text-white/90 hover:bg-gradient-to-r hover:from-[#1db954]/80 hover:to-[#1e90ff]/80 hover:text-white w-full"
            >
              <FaTachometerAlt className="text-xl group-hover:scale-110 transition-transform" />
              <span className="inline-block">Dashboard</span>
              <FaChevronDown className="ml-1 text-xs" />
            </button>
            {showDashboardDropdown && (
              <div className="mt-2 bg-white text-[#0a0f1c] rounded-lg shadow-lg w-full z-20 overflow-hidden">
                {dashboardLinks.map((item) => (
                  <Link
                    key={item.label}
                    to={item.route}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-base font-medium"
                    onClick={() => { setShowDashboardDropdown(false); setMenuOpen(false); }}
                  >
                    <item.icon className="text-lg" /> {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {navLink(FaBullseye, "Goals", "/goals")}
          {navLink(FaBookOpen, "Resources", "/resources")}
          {navLink(FaBell, "Notifications", "/notifications")}
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <button
                onClick={() => alert("Dark mode toggle placeholder")}
                className="flex items-center gap-2 w-full px-4 py-2 rounded-lg hover:bg-white/10"
              >
                <ThemeToggle /> Dark Mode
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  window.dispatchEvent(new Event('openOnboarding'));
                }}
                className="flex items-center gap-2 w-full px-4 py-2 rounded-lg hover:bg-white/10"
              >
                <FaUserPlus /> Complete Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 rounded-lg hover:bg-white/10"
              >
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 w-full px-4 py-2 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20"
              >
                <FaSignInAlt /> Login
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 w-full px-4 py-2 rounded-lg bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-white font-semibold hover:from-[#1db954]/80 hover:to-[#1e90ff]/80"
              >
                <FaUserPlus /> Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
