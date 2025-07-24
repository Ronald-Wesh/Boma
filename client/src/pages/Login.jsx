import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
// import Login from './pages/Login.jsx';
import Register from './Register.jsx';
import Listings from './Listings.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import LandlordDashboard from './LandlordDashboard.jsx'; 
import TenantDashboard from './TenantDashboard.jsx';
import Navbar from '../components/NavBar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function DashboardRouter() {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role === 'admin') return <AdminDashboard />;
  if (user.role === 'landlord') return <LandlordDashboard />;
  return <TenantDashboard />;
}

function App() {
  const { isAuthenticated } = useAuth();
  return (
    <BrowserRouter>
      <Toaster />
      {isAuthenticated && <Navbar />}
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
              <DashboardRouter />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
