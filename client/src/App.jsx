import { Routes, Route, Navigate,BrowserRouter } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Listings from './pages/Listings';
import Dashboard from './pages/Dashboard';
import NavBar from './components/NavBar';
import ProtectedRoute from './utils/ProtectedRoute';
import { Toaster } from 'react-hot-toast';


// function ProtectedRoute({ children }) {
//   const { isAuthenticated, loading } = useAuth();
//   if (loading) return <div>Loading...</div>;
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// }

export default function App() {
  return (
    <BrowserRouter>
      <Toaster  richColors position="top-right"/>
      {/* <Navbar /> */}
      <Routes>
      {/* <Route path="/" element={<Navigate to="/dashboard" />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Listings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Add more protected routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}


// import { BrowserRouter, Routes, Route } from "react-router-dom";
// //import { ThemeProvider } from "./context/ThemeContext";

// // Layouts
// import HomeLayout from "./pages/Home";
// import DashboardLayout from "./pages/Dashboard";

// // Public Pages
// // import Landing from "./pages/Landing";
// import Login from "./pages/Login";
// import Register from "./pages/Register";

// // Dashboard Pages
// import Dashboard from "./pages/Dashboard";
// //import Profile from "./pages/Profile"; // example additional dashboard route

// function App() {
//   return (
//     <ThemeProvider>
//       <BrowserRouter>
//         <Routes>
//           {/* PUBLIC ROUTES */}
//           <Route path="/" element={<HomeLayout />}>
//             <Route index element={<Landing />} />
//             <Route path="login" element={<Login />} />
//             <Route path="register" element={<Register />} />
//           </Route>

//           {/* DASHBOARD ROUTES (Will add role-based logic later) */}
//           <Route path="/dashboard" element={<DashboardLayout />}>
//             <Route index element={<Dashboard />} />
//             <Route path="profile" element={<Profile />} />
//           </Route>
//         </Routes>
//       </BrowserRouter>
//     </ThemeProvider>
//   );
// }

// export default App;
