// // used to manage login, registration, user session, and authorization state globally in your frontend app.
// // t creates a global Auth context that:

// // Checks if a user is already logged in when the app starts

// // Logs in a user and stores token + user info

// // Registers a user

// // Logs out a user

// // Shares the auth state (user, isAdmin, isAuthenticated, etc.) with the rest of your app


import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      // Verify token is still valid
      authAPI.getMe()
        .then(response => {
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, ...userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      toast.success('Logged in successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token, ...newUserData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUserData));
      setUser(newUserData);
      
      toast.success('Account created successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 
// import { Link } from "react-router-dom";
// import { Button } from "../components/ui/button.jsx";
// // import { useAuth } from "./AuthContext.jsx";

// export default function Navbar() {
//   const { user, logout } = useAuth();

//   return (
//     <nav className="sticky top-0 z-50 border-b border-zinc-200 px-4 py-2 flex items-center justify-between bg-white">
//       <Link to="/dashboard" className="font-bold text-lg">Boma</Link>
//       <div className="flex items-center gap-2">
//         {user?.role && (
//           <span className={`px-2 py-1 rounded text-xs font-medium ${
//             user.role === 'admin'
//               ? 'bg-blue-100 text-blue-800'
//               : 'bg-green-100 text-green-800'
//           }`}>
//             {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
//           </span>
//         )}
//         {user && (
//           <Button variant="outline" onClick={logout}>
//             Logout
//           </Button>
//         )}
//       </div>
//     </nav>
//   );
// }