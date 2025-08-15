import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Try to get user data from localStorage on app load
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Modify this login function to add isAdmin flag
  const login = (userData) => {
    const adminEmail = "admin123@gmail.com";
    const isAdmin = userData.email === adminEmail;

    // Add isAdmin property to userData before setting state and localStorage
    const userWithAdmin = { ...userData, isAdmin };

    setUser(userWithAdmin);
    localStorage.setItem("user", JSON.stringify(userWithAdmin));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Keep localStorage in sync with user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
