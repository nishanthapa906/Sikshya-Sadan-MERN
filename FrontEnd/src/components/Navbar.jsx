import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UPLOAD_URL } from "../services/api";

import {
  FaGraduationCap,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaUser,
  FaTachometerAlt,
  FaSignOutAlt,
} from "react-icons/fa";

function Navbar() {
  const auth = useAuth();
  const user = auth?.user || null;
  const logout = auth?.logout || (() => {});
  const isAuthenticated = !!auth?.isAuthenticated;
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Blog", path: "/blog" },
    { name: "Jobs", path: "/jobs" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
  ];

  const hideNavbar = ["/login", "/register"].includes(location.pathname);
  const isHeroPage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (hideNavbar) return null;

  const isTransparent = isHeroPage && !scrolled;

  return (
    <>
      {/* NAVBAR */}
      <div
        className={`${isHeroPage ? 'fixed' : 'sticky'} top-0 w-full z-50 transition-all ${
          isTransparent
            ? "bg-transparent"
            : "bg-white shadow border-b border-gray-200"
        }`}
      >
        <div className="flex justify-between items-center px-4 sm:px-6 lg:px-10 h-16">

          {/* LOGO */}
          <NavLink to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <FaGraduationCap className="text-white" />
            </div>

            <div>
              <p
                className={`font-black text-lg ${
                  isTransparent ? "text-white" : "text-black"
                }`}
              >
                SIKSHYA
              </p>
              <p
                className={`text-[10px] font-bold tracking-widest ${
                  isTransparent ? "text-indigo-300" : "text-indigo-600"
                }`}
              >
                SADAN
              </p>
            </div>
          </NavLink>

         
          <div className="hidden lg:flex gap-8 font-semibold text-sm">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={`hover:text-indigo-600 ${
                  location.pathname === link.path
                    ? "text-indigo-600"
                    : isTransparent
                    ? "text-white"
                    : "text-gray-700"
                }`}
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* DESKTOP AUTH */}
          <div className="hidden lg:flex items-center gap-4">

            {isAuthenticated ? (
              <div className="relative group">

                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer ${
                    isTransparent
                      ? "bg-white/10 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="h-7 w-7 rounded bg-indigo-600 text-white flex items-center justify-center overflow-hidden text-xs font-bold">
                    {user?.avatar ? (
                      <img
                        src={`${UPLOAD_URL}/${user.avatar}`}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      user?.name?.charAt(0).toUpperCase()
                    )}
                  </div>

                  <span>{user?.name}</span>
                  <FaChevronDown size={10} />
                </div>

                {/* DROPDOWN */}
                <div className="hidden group-hover:flex flex-col absolute right-0 top-full pt-2 w-52">
                  <div className="bg-white shadow-lg border rounded-xl p-2 flex flex-col w-full text-black">
                    <NavLink
                      to={`/${user?.role}/dashboard`}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded"
                  >
                    <FaTachometerAlt /> Dashboard
                  </NavLink>

                  <NavLink
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded"
                  >
                    <FaUser /> Profile
                  </NavLink>

                  {(user?.role === "instructor" || user?.role === "admin") && (
                    <>
                      <NavLink
                        to="/instructor/blogs"
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded"
                      >
                        Blogs
                      </NavLink>
                      <NavLink
                        to="/instructor/verify-completion"
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded"
                      >
                        Verify Completion
                      </NavLink>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-red-100 text-red-600 rounded"
                  >
                    <FaSignOutAlt /> Logout
                  </button>

                  </div>
                </div>
              </div>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={`font-semibold ${
                    isTransparent ? "text-white" : "text-gray-700"
                  }`}
                >
                  Sign In
                </NavLink>

                <NavLink
                  to="/register"
                  className="bg-black text-white px-5 py-2 rounded-lg"
                >
                  Enroll Free
                </NavLink>
              </>
            )}

          </div>

          {/* MOBILE BUTTON */}
          <button
            className={`lg:hidden text-2xl ${
              isTransparent ? "text-white" : "text-black"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 bg-slate-900 text-white p-6 pt-20 lg:hidden flex flex-col gap-4 overflow-y-auto">

          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className="text-xl font-bold py-1 border-b border-white/10"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <>
              <NavLink to={`/${user?.role}/dashboard`} className="py-1 border-b border-white/10">Dashboard</NavLink>
              <NavLink to="/profile" className="py-1 border-b border-white/10">Profile</NavLink>
              {(user?.role === "instructor" || user?.role === "admin") && (
                <>
                  <NavLink to="/instructor/blogs" className="py-1 border-b border-white/10">Blogs</NavLink>
                  <NavLink to="/instructor/verify-completion" className="py-1 border-b border-white/10">Verify Completion</NavLink>
                </>
              )}
              <button onClick={handleLogout} className="text-left py-1 border-b border-white/10">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="py-1 border-b border-white/10">Sign In</NavLink>
              <NavLink to="/register" className="py-1 border-b border-white/10">Create Account</NavLink>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Navbar;