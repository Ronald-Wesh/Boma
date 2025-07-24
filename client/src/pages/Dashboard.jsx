import { useAuth } from '../context/AuthContext.jsx';
import { Button } from '../components/ui/button';

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-2">
          Welcome, {user?.username}!
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Role: <span className="font-semibold text-blue-600">{user?.role}</span>
        </p>
        <p className="text-center text-gray-500 mb-4">Email: {user?.email}</p>
        <Button className="w-full" onClick={logout}>
          Logout
        </Button>
        <div className="mt-6">
          {(isAdmin || user?.role === 'landlord') && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Manage Listings</h3>
              <p className="text-gray-500">(Coming soon: Add, edit, or remove your listings.)</p>
            </div>
          )}
          {user?.role === 'tenant' && (
            <>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">My Reviews</h3>
                <p className="text-gray-500">(Coming soon: View and manage your reviews.)</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">My Forum Posts</h3>
                <p className="text-gray-500">(Coming soon: View and manage your forum posts.)</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
