// import { useState, useEffect } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { UPLOAD_URL } from '../services/api';
// import { FaGraduationCap, FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaChevronDown, FaUser, FaTachometerAlt } from 'react-icons/fa';

// const Navbar = () => {
//     const { user, logout, isAuthenticated } = useAuth();
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const [scrolled, setScrolled] = useState(false);
//     const location = useLocation();
//     const navigate = useNavigate();

//     // Pages that have a hero/dark background — navbar can be transparent at top
//     const darkHeroPages = ['/'];
//     const isHeroPage = darkHeroPages.includes(location.pathname);
//     // Auth pages get no navbar
//     const hideNavbar = ['/login', '/register'].includes(location.pathname);

//     useEffect(() => {
//         const handleScroll = () => setScrolled(window.scrollY > 60);
//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, []);

//     useEffect(() => {
//         setIsMenuOpen(false);
//     }, [location.pathname]);

//     const navLinks = [
//         { name: 'Home', path: '/' },
//         { name: 'Courses', path: '/courses' },
//         { name: 'Blog', path: '/blog' },
//         { name: 'Jobs', path: '/jobs' },
//         { name: 'Contact', path: '/contact' },
//     ];

//     const handleLogout = () => {
//         logout();
//         navigate('/login');
//     };

//     if (hideNavbar) return null;

//     const isTransparent = isHeroPage && !scrolled;

//     return (
//         <>
//             <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
//                 isTransparent
//                     ? 'bg-transparent'
//                     : 'bg-white border-b border-slate-100 shadow-sm'
//             }`}>
//                 <div className="container mx-auto px-6">
//                     <div className="flex items-center justify-between h-16">

//                         {/* LOGO */}
//                         <Link to="/" className="flex items-center gap-2.5 shrink-0">
//                             <div className="h-9 w-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
//                                 <FaGraduationCap size={18} className="text-white" />
//                             </div>
//                             <div>
//                                 <span className={`block text-lg font-black leading-none tracking-tight ${isTransparent ? 'text-white' : 'text-slate-900'}`}>
//                                     SIKSHYA
//                                 </span>
//                                 <span className={`block text-[9px] font-bold uppercase tracking-[0.3em] leading-none ${isTransparent ? 'text-indigo-300' : 'text-indigo-600'}`}>
//                                     SADAN
//                                 </span>
//                             </div>
//                         </Link>

//                         {/* DESKTOP NAV LINKS */}
//                         <div className="hidden lg:flex items-center gap-8">
//                             {navLinks.map(link => (
//                                 <Link
//                                     key={link.path}
//                                     to={link.path}
//                                     className={`text-sm font-semibold transition-colors ${
//                                         location.pathname === link.path
//                                             ? 'text-indigo-600'
//                                             : isTransparent
//                                                 ? 'text-white/80 hover:text-white'
//                                                 : 'text-slate-600 hover:text-slate-900'
//                                     }`}
//                                 >
//                                     {link.name}
//                                 </Link>
//                             ))}
//                         </div>

//                         {/* DESKTOP AUTH */}
//                         <div className="hidden lg:flex items-center gap-3">
//                             {isAuthenticated ? (
//                                 <div className="relative group">
//                                     <button className={`flex items-center gap-2.5 py-2 px-4 rounded-xl font-semibold text-sm transition-all ${
//                                         isTransparent
//                                             ? 'bg-white/10 text-white hover:bg-white/20'
//                                             : 'bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200'
//                                     }`}>
//                                         <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden flex-shrink-0">
//                                             {user?.photo
//                                                 ? <img src={`${UPLOAD_URL}/${user.photo}`} alt={user?.name} className="h-full w-full object-cover" />
//                                                 : <span>{user?.name?.charAt(0).toUpperCase()}</span>
//                                             }
//                                         </div>
//                                         <span className="max-w-[120px] truncate">{user?.name}</span>
//                                         <FaChevronDown size={10} className="group-hover:rotate-180 transition-transform opacity-60" />
//                                     </button>

//                                     {/* DROPDOWN */}
//                                     <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
//                                         <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 w-52 space-y-0.5">
//                                             <div className="px-3 py-2 border-b border-slate-50 mb-1">
//                                                 <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Signed in as</p>
//                                                 <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
//                                             </div>
//                                             <Link to={`/${user?.role}/dashboard`} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors">
//                                                 <FaTachometerAlt size={13} className="text-indigo-500" /> Dashboard
//                                             </Link>
//                                             <Link to="/profile" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors">
//                                                 <FaUser size={13} className="text-purple-500" /> My Profile
//                                             </Link>
//                                             <div className="border-t border-slate-100 my-1"></div>
//                                             <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 font-semibold text-sm transition-colors">
//                                                 <FaSignOutAlt size={13} /> Sign Out
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <div className="flex items-center gap-5">
//                                     <Link to="/login" className={`text-[15px] font-semibold transition-colors ${isTransparent ? 'text-white/90 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
//                                         Sign In
//                                     </Link>
//                                     <Link to="/register" className="bg-slate-900 hover:bg-slate-800 text-white text-[15px] font-semibold px-6 py-2.5 rounded-lg transition-all active:scale-[0.98] shadow-sm shadow-slate-900/10 border border-slate-900">
//                                         Enroll Free
//                                     </Link>
//                                 </div>
//                             )}
//                         </div>

//                         {/* MOBILE HAMBURGER */}
//                         <button
//                             className={`lg:hidden p-2 rounded-xl ${isTransparent ? 'text-white' : 'text-slate-800'}`}
//                             onClick={() => setIsMenuOpen(!isMenuOpen)}
//                         >
//                             {isMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
//                         </button>
//                     </div>
//                 </div>
//             </nav>

//             {/* MOBILE MENU OVERLAY */}
//             {isMenuOpen && (
//                 <div className="fixed inset-0 bg-slate-900 z-40 lg:hidden flex flex-col p-8 pt-20">
//                     <div className="flex flex-col gap-2 mb-8">
//                         {navLinks.map(link => (
//                             <Link
//                                 key={link.path}
//                                 to={link.path}
//                                 className="text-white text-2xl font-black py-3 border-b border-white/5 hover:text-indigo-400 transition-colors"
//                                 onClick={() => setIsMenuOpen(false)}
//                             >
//                                 {link.name}
//                             </Link>
//                         ))}
//                     </div>

//                     {isAuthenticated ? (
//                         <div className="space-y-3 mt-auto">
//                             <Link to={`/${user?.role}/dashboard`} className="w-full block py-4 bg-indigo-600 text-white rounded-2xl text-center font-bold" onClick={() => setIsMenuOpen(false)}>
//                                 My Dashboard
//                             </Link>
//                             <Link to="/profile" className="w-full block py-4 bg-white/10 text-white rounded-2xl text-center font-bold" onClick={() => setIsMenuOpen(false)}>
//                                 My Profile
//                             </Link>
//                             <button onClick={handleLogout} className="w-full py-4 text-red-400 font-bold text-center">
//                                 Sign Out
//                             </button>
//                         </div>
//                     ) : (
//                         <div className="flex flex-col gap-3 mt-auto">
//                             <Link to="/login" className="w-full block py-4 border-2 border-white/20 text-white rounded-2xl text-center font-bold" onClick={() => setIsMenuOpen(false)}>
//                                 Sign In
//                             </Link>
//                             <Link to="/register" className="w-full block py-4 bg-indigo-600 text-white rounded-2xl text-center font-bold" onClick={() => setIsMenuOpen(false)}>
//                                 Create Account
//                             </Link>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </>
//     );
// };

// export default Navbar;
