// client/src/components/Listings.jsx
import { useState, useEffect } from 'react';
import API from '../utils/api.js';

const Listings = ({ onSelect }) => {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    let url = '/listings';
    const params = [];
    if (search) params.push(`search=${search}`);
    if (filter) params.push(`filter=${filter}`);
    if (params.length) url += '?' + params.join('&');
    API.get(url)
      .then(res => setListings(res.data))
      .catch(() => setListings([]));
  }, [search, filter]);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          className="border border-zinc-300 bg-zinc-50 rounded px-2 py-1 text-zinc-700"
          placeholder="Search by location, campus, job..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border border-zinc-300 bg-zinc-50 rounded px-2 py-1 text-zinc-700"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="campus">Campus</option>
          <option value="job">Job</option>
        </select>
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {listings.map(listing => (
          <div
            key={listing._id}
            className="bg-zinc-100 dark:bg-zinc-800 rounded-lg shadow p-4 flex flex-col justify-between hover:shadow-lg transition cursor-pointer"
            onClick={() => onSelect && onSelect(listing._id)}
          >
            <h2 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-100">{listing.title}</h2>
            <p className="text-zinc-600 dark:text-zinc-300 mb-2">{listing.description}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">{listing.address}</p>
            <div className="flex items-center gap-2 mt-auto">
              {listing.verified && (
                <span className="inline-block px-2 py-1 text-xs bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">Verified</span>
              )}
              <span className="inline-block px-2 py-1 text-xs bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                {listing.landlord?.username || 'Landlord'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Listings;