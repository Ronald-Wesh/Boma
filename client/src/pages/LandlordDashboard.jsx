import { useAuth } from '../context/AuthContext.jsx';
import { Button } from '../components/ui/button.jsx';
import { useState, useEffect } from 'react';
import API from '../utils/api.js';

const LandlordDashboard = () => {
  const { user, logout } = useAuth();
  const [myListings, setMyListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [listingReviews, setListingReviews] = useState([]);
  const [forumPosts, setForumPosts] = useState([]);

  // Fetch landlord's listings
  useEffect(() => {
    if (user) {
      API.get(`/listings?landlord=${user.id}`)
        .then(res => setMyListings(res.data))
        .catch(() => setMyListings([]));
    }
  }, [user]);

  // Fetch reviews and forum posts for selected listing
  useEffect(() => {
    if (selectedListing) {
      API.get(`/reviews/${selectedListing}`)
        .then(res => setListingReviews(res.data))
        .catch(() => setListingReviews([]));
      API.get(`/forum/${selectedListing}`)
        .then(res => setForumPosts(res.data))
        .catch(() => setForumPosts([]));
    }
  }, [selectedListing]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">Landlord Dashboard</h2>
          <p>Welcome, <span className="font-semibold text-blue-600">{user?.username}</span></p>
          <Button className="mt-4" onClick={logout}>Logout</Button>
        </div>
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">My Listings</h3>
          <ul className="bg-gray-50 rounded p-2">
            {myListings.map(listing => (
              <li key={listing._id} className="border-b py-1 flex justify-between items-center">
                <span onClick={() => setSelectedListing(listing._id)} className="cursor-pointer hover:underline">
                  {listing.title}
                </span>
                {/* Add edit/delete buttons here */}
              </li>
            ))}
          </ul>
        </div>
        {selectedListing && (
          <>
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Reviews for Selected Listing</h3>
              <ul className="bg-gray-50 rounded p-2">
                {listingReviews.map(r => (
                  <li key={r._id} className="border-b py-1">
                    Safety: {r.safety}, Water: {r.water}, Landlord: {r.landlordReliability}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Forum for Selected Listing</h3>
              <ul className="bg-gray-50 rounded p-2">
                {forumPosts.map(post => (
                  <li key={post._id} className="border-b py-1">{post.content}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LandlordDashboard; 