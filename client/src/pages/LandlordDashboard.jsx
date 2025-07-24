import { useAuth } from '../context/AuthContext.jsx';
import { Button } from '../components/ui/button.jsx';

const LandlordDashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-2">
          Landlord Dashboard
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Welcome, <span className="font-semibold text-blue-600">{user?.username}</span>
        </p>
        <p className="text-center text-gray-500 mb-4">Email: {user?.email}</p>
        <Button className="w-full" onClick={logout}>
          Logout
        </Button>
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Manage Listings</h3>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Add, edit, or remove your listings (coming soon)</li>
            <li>View verification status (coming soon)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard; 