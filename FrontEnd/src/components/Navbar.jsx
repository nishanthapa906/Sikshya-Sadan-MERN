import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const imageUrl = "http://localhost:9000/uploads";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get user from localStorage 
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!localStorage.getItem("token");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Hide navbar on login/register pages
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  // Transparent navbar only on home page when not scrolled
  const isHomePage = location.pathname === "/";
  const isTransparent = isHomePage && !scrolled;

  // Close mobile menu when page changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  // Nav links list
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Blog", path: "/blog" },
    { name: "Jobs", path: "/jobs" },
    { name: "Contact", path: "/contact" },
  ];

  if (hideNavbar) return null;

  return (
    <>
      {/* ===== MAIN NAVBAR ===== */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isTransparent
            ? "bg-transparent"
            : "bg-white border-b border-gray-200 shadow-sm"
        }`}
      >
        <div className="w-[90%] m-auto flex items-center justify-between h-16">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <p className={`text-lg font-black leading-none ${isTransparent ? "text-white" : "text-gray-900"}`}>
                SIKSHYA
              </p>
              <p className={`text-[9px] font-bold uppercase tracking-widest ${isTransparent ? "text-blue-300" : "text-blue-600"}`}>
                SADAN
              </p>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold transition-colors ${
                  location.pathname === link.path
                    ? "text-blue-600"
                    : isTransparent
                    ? "text-white/80 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* DESKTOP RIGHT SIDE */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoggedIn ? (
              // User is logged in - show dropdown
              <div className="relative group">
                {/* User Button */}
                <button
                  className={`flex items-center gap-2 py-2 px-4 rounded-xl font-semibold text-sm ${
                    isTransparent
                      ? "bg-white/10 text-white hover:bg-white/20"
                      : "bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {/* User Photo or Initial */}
                  <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                    {user?.photo ? (
                      <img
                        src={`${imageUrl}/${user.photo}`}
                        alt={user?.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{user?.name?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <span>{user?.name}</span>
                  <span className="text-xs opacity-60">▼</span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 w-52 space-y-1">
                    {/* User info */}
                    <div className="px-3 py-2 border-b border-gray-100 mb-1">
                      <p className="text-xs font-bold text-gray-400 uppercase">Signed in as</p>
                      <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                    </div>

                    {/* Dashboard link based on role */}
                    <Link
                      to={`/${user?.role}/dashboard`}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 text-gray-700 font-semibold text-sm"
                    >
                      📊 Dashboard
                    </Link>

                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 text-gray-700 font-semibold text-sm"
                    >
                      👤 My Profile
                    </Link>

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 font-semibold text-sm"
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // User is NOT logged in - show login/register
              <div className="flex items-center gap-5">
                <Link
                  to="/login"
                  className={`text-sm font-semibold ${
                    isTransparent ? "text-white/90 hover:text-white" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-6 py-2.5 rounded-lg"
                >
                  Enroll Free
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            className={`lg:hidden text-2xl ${isTransparent ? "text-white" : "text-gray-800"}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* ===== MOBILE MENU ===== */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-gray-900 z-40 lg:hidden flex flex-col p-8 pt-20">

          {/* Mobile Nav Links */}
          <div className="flex flex-col gap-2 mb-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-white text-2xl font-black py-3 border-b border-white/10 hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Auth Buttons */}
          {isLoggedIn ? (
            <div className="space-y-3 mt-auto">
              <Link
                to={`/${user?.role}/dashboard`}
                className="w-full block py-4 bg-blue-600 text-white rounded-2xl text-center font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                My Dashboard
              </Link>
              <Link
                to="/profile"
                className="w-full block py-4 bg-white/10 text-white rounded-2xl text-center font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full py-4 text-red-400 font-bold text-center"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mt-auto">
              <Link
                to="/login"
                className="w-full block py-4 border-2 border-white/20 text-white rounded-2xl text-center font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="w-full block py-4 bg-blue-600 text-white rounded-2xl text-center font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Navbar;