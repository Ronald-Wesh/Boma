import { useEffect, useState } from 'react';
import API from '../utils/api';

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    API.get('/listings')
      .then((res) => setListings(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load listings'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">Available Listings</h1>
      {listings.length === 0 ? (
        <p className="text-center text-gray-500">No listings found.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="bg-white rounded-lg shadow p-4 flex flex-col justify-between hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-2 text-blue-800">{listing.title}</h2>
              <p className="text-gray-700 mb-2">{listing.description}</p>
              <p className="text-sm text-gray-500 mb-2">{listing.address}</p>
              <div className="flex items-center gap-2 mt-auto">
                {listing.verified && (
                  <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Verified</span>
                )}
                <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                  {listing.landlord?.username || 'Landlord'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Listings;
