// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // ✅ Login and save to localStorage
  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    toast.success(`Welcome, ${userData.username}!`, { autoClose: 2000 });
  };

  // ✅ Logout and clear localStorage
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast.info("Logged out successfully!", { autoClose: 2000 });
  };

  // ✅ Load user from localStorage when app reloads
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
