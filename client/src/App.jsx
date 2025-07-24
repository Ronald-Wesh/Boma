// import { Routes, Route, Navigate } from 'react-router-dom';
// import Login from './pages/Login.jsx';
// import Register from './pages/Register.jsx';
// import Listings from './pages/Listings.jsx';
// import Dashboard from './pages/Dashboard.jsx';
// import Navbar from './components/NavBar.jsx';
// import { useAuth } from './context/AuthContext.jsx';
// import { Toaster } from 'react-hot-toast';

// function ProtectedRoute({ children }) {
//   const { isAuthenticated, loading } = useAuth();
//   if (loading) return <div>Loading...</div>;
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// }

// function App() {
//   return (
//     <>
//       <Toaster />
//       <Navbar />
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route
//           path="/"
//           element={
//             <ProtectedRoute>
//               <Listings />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </>
//   );
// }

// export default App;
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Listings from './pages/Listings.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Navbar from './components/NavBar.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Navbar />
      <Routes>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;