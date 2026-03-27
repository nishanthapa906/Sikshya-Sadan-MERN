// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { authAPI } from '../services/api';

// const AuthContext = createContext();

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error('useAuth must be used within AuthProvider');
//     }
//     return context;
// };

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [token, setToken] = useState(localStorage.getItem('token'));

//     useEffect(() => {
//         const loadUser = async () => {
//             try {
//                 const response = await authAPI.getMe();
//                 setUser(response.data.user);
//                 localStorage.setItem('user', JSON.stringify(response.data.user)); // force sync live data locally
//             } catch (error) {
//                 console.error('Failed to load user:', error);
//                 logout();
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (token) {
//             loadUser();
//         } else {
//             setLoading(false);
//         }
//     }, [token]);

//     const login = async (email, password) => {
//         try {
//             const response = await authAPI.login({ email, password });
//             const { token, user } = response.data;

//             localStorage.setItem('token', token);
//             localStorage.setItem('user', JSON.stringify(user));

//             setToken(token);
//             setUser(user);

//             return { success: true, user };
//         } catch (error) {
//             return {
//                 success: false,
//                 message: error.response?.data?.message || 'Login failed'
//             };
//         }
//     };

//     const register = async (userData) => {
//         try {
//             const response = await authAPI.register(userData);
//             const { token, user } = response.data;

//             localStorage.setItem('token', token);
//             localStorage.setItem('user', JSON.stringify(user));

//             setToken(token);
//             setUser(user);

//             return { success: true, user };
//         } catch (error) {
//             return {
//                 success: false,
//                 message: error.response?.data?.message || 'Registration failed'
//             };
//         }
//     };

//     const logout = () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         setToken(null);
//         setUser(null);
//     };

//     const value = {
//         user,
//         token,
//         loading,
//         login,
//         register,
//         logout,
//         setUser: (newUser) => {
//             setUser(newUser);
//             localStorage.setItem('user', JSON.stringify(newUser));
//         },
//         isAuthenticated: !!user,
//         isStudent: user?.role === 'student',
//         isInstructor: user?.role === 'instructor',
//         isAdmin: user?.role === 'admin'
//     };

//     return (
//         <AuthContext.Provider value={value}>
//             {children}
//         </AuthContext.Provider>
//     );
// };
