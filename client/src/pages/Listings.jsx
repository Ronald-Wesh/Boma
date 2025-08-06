import { useState, useEffect } from 'react';
import {listingsAPI} from '../utils/api.js';
import useAuth  from '../hooks/useAuth.js';
import {useNavigate} from 'react-router-dom';
import ListingCard from '../components/ListingCard.jsx';
import ListingDialog from '@/components/ListingDialog.jsx';
import {toast} from "react-hot-toast"


export default function Listings({ onSelect }) {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(""); // type filter: 'campus' | 'job'
  const [verifiedOnly, setVerifiedOnly] = useState(false); // ✅ New state for verified toggle
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { user } = useAuth();

  //Fetech Listings
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
 
        const params = [];
        if (search) params.push(`search=${search}`);
        if (filter) params.push(`type=${filter}`);
        if (verifiedOnly) params.push(`verified=true`);
        if (params.length > 0) url += `?${params.join("&")}`;

        const response = await listingsAPI.getAll(params);
        setListings(response.data);
      } catch (err) {
        console.error("Error fetching listings:", err);
        toast.error("Failed to load listings.");
      }  finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [search, filter, verifiedOnly]);

  const handleVerify = async (id) => {
    try {
      await API.patch(`/listings/${id}/verify`);
      setListings((prev) =>
        prev.map((l) => (l._id === id ? { ...l, verified: !l.verified } : l))
      );
    } catch (error) {
      console.error("Error toggling verification:", error);
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await API.delete(`/listings/${id}`);
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };
return (
  <div className="p-4">
    {/* Search input */}
    <div className="mb-4 flex flex-wrap gap-4 items-center">
      <input
        type="text"
        placeholder="Search by location, campus, job..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 p-2 rounded w-full sm:w-1/3"
      />

      {/* Filter by type (campus/job) */}
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border border-gray-300 p-2 rounded"
      >
        <option value="">All</option>
        <option value="campus">Campus</option>
        <option value="job">Job</option>
      </select>

      {/* ✅ Verified Only Toggle */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={verifiedOnly}
          onChange={(e) => setVerifiedOnly(e.target.checked)}
        />
        <span className="text-sm">Verified Only</span>
      </label>

      {/* 📍 Optional Distance Filter UI (future use) */}
      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Use My Location
      </button>
    </div>


    <h2 className="text-2xl font-semibold">Property Listings</h2>
        {user?.role === "agent" && (
          <ListingDialog onSubmit={handleCreate} />
        )}



        
    {/* Listings Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {listings.length === 0 ? (
        <p className="text-gray-500">No listings found.</p>
      ) : (
        listings.map((listing) => (
          <div
            key={listing._id}
            onClick={() =>
              onSelect ? onSelect(listing) : navigate(`/listings/${listing._id}`)
            }
            className="cursor-pointer border p-4 rounded shadow hover:shadow-lg transition-all"
          >

          {/* <ListingCard key={listing._id} listing={listing}
          
          onVerify={user?.role === 'admin' ? handleVerify:null}
          onDelete={user?.role === 'admin' ? handleDelete:null}
          showActions={user?.role === 'admin'} /> */}

<ListingCard
  key={listing._id}
  listing={listing}
  {...(user?.role === 'admin' && {
    onVerify: handleVerify,
    onDelete: handleDelete,
    showActions: true,
  })}
/>




            {/* <h2 className="text-lg font-bold">{listing.title}</h2>
            <p className="text-gray-600">{listing.location}</p> */}

            ✅ Listing Type Tag
            {/* <span className="inline-block mt-1 text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
              {listing.type}
            </span> */}

            {/* ✅ Verified Badge */}
            {/* {listing.verified && (
              <span className="ml-2 text-green-600 text-sm font-medium">
                ✔ Verified
              </span>
            )} */}

            {/* <p className="text-sm mt-2">{listing.description?.slice(0, 80)}...</p> */}
          </div>
        ))
      )}
    </div>
  </div>
);
}




//  {/* 🏠 Listings Grid */}
//  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//  {listings.length === 0 ? (
//    <p className="text-gray-500">No listings found.</p>
//  ) : (
//    listings.map((listing) => (
//      <ListingCard
//        key={listing._id}
//        listing={listing}
//        onSelect={() =>
//          onSelect ? onSelect(listing) : navigate(`/listings/${listing._id}`)
//        }
//        {...(user?.role === 'admin' && {
//          onVerify: handleVerify,
//          onDelete: handleDelete,
//          showActions: true,
//        })}
//      />
//    ))
//  )}
// </div>
