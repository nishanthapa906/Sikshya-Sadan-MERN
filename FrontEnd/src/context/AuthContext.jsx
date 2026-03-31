import { createContext, useState, useContext, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  return (
    useContext(AuthContext) || {
      user: null,
      isLoading: false,
      login: async () => ({ success: false, message: "Auth context unavailable" }),
      register: async () => ({ success: false, message: "Auth context unavailable" }),
      logout: () => {},
      updateUser: () => {},
      isAuthenticated: false,
      isStudent: false,
      isInstructor: false,
      isAdmin: false,
    }
  );
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        let res = await authAPI.getMe();
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } catch (error) {
        console.log("Token invalid, logging out:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      let res = await authAPI.login({ email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      let res = await authAPI.register(userData);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      return { success: true, user };
    } catch (error) {
      const backendErrors = error.response?.data?.errors;
      const detailedMessage = Array.isArray(backendErrors) && backendErrors.length > 0
        ? backendErrors.map((e) => e.msg || e.message).join(", ")
        : (error.response?.data?.message || error.response?.data?.error || "Registration failed");
      return {
        success: false,
        message: detailedMessage,
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isStudent: user?.role === "student",
    isInstructor: user?.role === "instructor",
    isAdmin: user?.role === "admin",
  };

  // No JSX loading here - handled in App.jsx below
  return (
    <AuthContext.Provider value={value}>
      {isLoading ? (
        <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Loading...</h1>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};