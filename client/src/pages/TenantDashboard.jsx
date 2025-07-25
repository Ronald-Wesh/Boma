import { useAuth } from '../context/AuthContext.jsx';
import { Button } from '../components/ui/button.jsx';
import Listings from '../components/Listings.jsx';
import { useState, useEffect } from 'react';
import API from '../utils/api.js';

const TenantDashboard = () => {
  const { user, logout } = useAuth();
  const [myBuildings, setMyBuildings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [forumPosts, setForumPosts] = useState([]);
  const [newForumPost, setNewForumPost] = useState('');
  const [review, setReview] = useState({ safety: '', water: '', landlordReliability: '' });
  const [myReviews, setMyReviews] = useState([]);

  useEffect(() => {
    API.get('/listings').then(res => setMyBuildings(res.data));
  }, []);

  useEffect(() => {
    if (selectedListing) {
      API.get(`/forum/${selectedListing}`)
        .then(res => setForumPosts(res.data))
        .catch(() => setForumPosts([]));
      API.get(`/reviews/${selectedListing}`)
        .then(res => setMyReviews(res.data))
        .catch(() => setMyReviews([]));
    }
  }, [selectedListing]);

  const handleForumPost = async (e) => {
    e.preventDefault();
    if (!newForumPost.trim()) return;
    await API.post(`/forum/${selectedListing}`, { content: newForumPost });
    setNewForumPost('');
    const res = await API.get(`/forum/${selectedListing}`);
    setForumPosts(res.data);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    await API.post(`/reviews/${selectedListing}`, review);
    setReview({ safety: '', water: '', landlordReliability: '' });
    const res = await API.get(`/reviews/${selectedListing}`);
    setMyReviews(res.data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-slate-200 dark:from-zinc-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-zinc-50 dark:bg-zinc-800 p-8 rounded-2xl shadow mb-8 border border-zinc-200 dark:border-zinc-700">
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-100 mb-2">Tenant Dashboard</h2>
          <p>Welcome, <span className="font-semibold text-blue-600">{user?.username}</span></p>
          <Button className="mt-4" onClick={logout}>Logout</Button>
        </div>
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Browse Listings</h3>
          <Listings onSelect={setSelectedListing} />
        </div>
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">My Buildings</h3>
          <ul className="bg-zinc-100 dark:bg-zinc-900 rounded-xl p-2 border border-zinc-200 dark:border-zinc-700">
            {myBuildings.map(b => (
              <li key={b._id} className="border-b border-zinc-200 dark:border-zinc-700 py-1">
                <button className="text-blue-700 dark:text-blue-300 hover:underline" onClick={() => setSelectedListing(b._id)}>
                  {b.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {selectedListing && (
          <>
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Forum</h3>
              <form onSubmit={handleForumPost} className="flex gap-2 mb-2">
                <input
                  className="flex-1 border border-zinc-300 bg-zinc-50 rounded-lg px-2 py-1 text-zinc-700"
                  value={newForumPost}
                  onChange={e => setNewForumPost(e.target.value)}
                  placeholder="Post a message..."
                />
                <Button type="submit">Post</Button>
              </form>
              <ul className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-2 border border-zinc-200 dark:border-zinc-700">
                {forumPosts.map(post => (
                  <li key={post._id} className="border-b border-zinc-200 dark:border-zinc-700 py-1">{post.content}</li>
                ))}
              </ul>
            </div>
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Submit a Silent Review</h3>
              <form onSubmit={handleReview} className="flex flex-col gap-2">
                <input
                  type="number"
                  min="1"
                  max="5"
                  placeholder="Safety (1-5)"
                  value={review.safety}
                  onChange={e => setReview({ ...review, safety: e.target.value })}
                  className="border border-zinc-300 bg-zinc-50 rounded-lg px-2 py-1"
                  required
                />
                <input
                  type="number"
                  min="1"
                  max="5"
                  placeholder="Water (1-5)"
                  value={review.water}
                  onChange={e => setReview({ ...review, water: e.target.value })}
                  className="border border-zinc-300 bg-zinc-50 rounded-lg px-2 py-1"
                  required
                />
                <input
                  type="number"
                  min="1"
                  max="5"
                  placeholder="Landlord Reliability (1-5)"
                  value={review.landlordReliability}
                  onChange={e => setReview({ ...review, landlordReliability: e.target.value })}
                  className="border border-zinc-300 bg-zinc-50 rounded-lg px-2 py-1"
                  required
                />
                <Button type="submit">Submit Review</Button>
              </form>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">My Reviews</h3>
              <ul className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-2 border border-zinc-200 dark:border-zinc-700">
                {myReviews.map(r => (
                  <li key={r._id} className="border-b border-zinc-200 dark:border-zinc-700 py-1">
                    Safety: {r.safety}, Water: {r.water}, Landlord: {r.landlordReliability}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TenantDashboard;
