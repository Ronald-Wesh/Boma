  import { Routes, Route, Navigate } from 'react-router-dom';
  import { useAuth } from './context/AuthContext';
  import Login from './pages/Login';
  import Register from './pages/Register.jsx';
  import Listings from './pages/Listings';
  import { Button } from "../components/ui/button";

  function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  }

  function App() {
    return (
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
        {/* Add more protected routes as needed */}
      </Routes>
    );
  }
