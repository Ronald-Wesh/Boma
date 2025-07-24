import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs.jsx';
import { StatCard } from '../components/ui/stat-card.jsx';
import { SearchFilter } from '../components/ui/search-filter.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Textarea } from '../components/ui/textarea.jsx';
import API from '../utils/api.js';
import toast from 'react-hot-toast';
import {
  BuildingOffice2Icon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  StarIcon,
  MapPinIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';

const LandlordDashboard = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [myListings, setMyListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [listingReviews, setListingReviews] = useState([]);
  const [forumPosts, setForumPosts] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const [showAddListingDialog, setShowAddListingDialog] = useState(false);
  const [showEditListingDialog, setShowEditListingDialog] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  // New listing form state
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    propertyType: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    amenities: [],
    images: []
  });

  // Fetch landlord's data
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Filter listings based on search and filters
  useEffect(() => {
    let filtered = myListings;

    if (searchTerm) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.propertyType) {
      filtered = filtered.filter(listing => listing.propertyType === filters.propertyType);
    }

    if (filters.priceMin) {
      filtered = filtered.filter(listing => listing.price >= parseFloat(filters.priceMin));
    }

    if (filters.priceMax) {
      filtered = filtered.filter(listing => listing.price <= parseFloat(filters.priceMax));
    }

    setFilteredListings(filtered);
  }, [myListings, searchTerm, filters]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch listings
      const listingsRes = await API.get(`/listings?landlord=${user.id}`);
      const listings = listingsRes.data || [];
      setMyListings(listings);
      setFilteredListings(listings);

      // Calculate dashboard stats
      const totalListings = listings.length;
      const activeListings = listings.filter(l => l.status === 'active').length;
      const totalRevenue = listings.reduce((sum, l) => sum + (l.price || 0), 0);
      const averagePrice = totalListings > 0 ? totalRevenue / totalListings : 0;

      setDashboardStats({
        totalListings,
        activeListings,
        totalRevenue,
        averagePrice,
        occupancyRate: totalListings > 0 ? (activeListings / totalListings) * 100 : 0,
      });

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchListingDetails = async (listingId) => {
    try {
      setSelectedListing(listingId);
      
      // Fetch reviews
      const reviewsRes = await API.get(`/reviews/${listingId}`);
      setListingReviews(reviewsRes.data || []);
      
      // Fetch forum posts
      const forumRes = await API.get(`/forum/${listingId}`);
      setForumPosts(forumRes.data || []);
    } catch (error) {
      console.error('Failed to fetch listing details:', error);
      setListingReviews([]);
      setForumPosts([]);
    }
  };

  const handleAddListing = async () => {
    try {
      const response = await API.post('/listings', {
        ...newListing,
        landlord: user.id
      });
      
      setMyListings(prev => [...prev, response.data]);
      setShowAddListingDialog(false);
      setNewListing({
        title: '',
        description: '',
        price: '',
        location: '',
        propertyType: 'apartment',
        bedrooms: 1,
        bathrooms: 1,
        amenities: [],
        images: []
      });
      toast.success('Listing added successfully!');
    } catch (error) {
      console.error('Failed to add listing:', error);
      toast.error('Failed to add listing');
    }
  };

  const handleEditListing = async () => {
    try {
      const response = await API.put(`/listings/${editingListing._id}`, editingListing);
      
      setMyListings(prev => prev.map(listing => 
        listing._id === editingListing._id ? response.data : listing
      ));
      setShowEditListingDialog(false);
      setEditingListing(null);
      toast.success('Listing updated successfully!');
    } catch (error) {
      console.error('Failed to update listing:', error);
      toast.error('Failed to update listing');
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      await API.delete(`/listings/${listingId}`);
      setMyListings(prev => prev.filter(listing => listing._id !== listingId));
      toast.success('Listing deleted successfully!');
    } catch (error) {
      console.error('Failed to delete listing:', error);
      toast.error('Failed to delete listing');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { variant: 'success', label: 'Active' },
      pending: { variant: 'warning', label: 'Pending' },
      inactive: { variant: 'secondary', label: 'Inactive' },
      rented: { variant: 'info', label: 'Rented' }
    };
    
    const config = statusConfig[status] || statusConfig.inactive;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const ListingForm = ({ listing, onChange, onSubmit, onCancel, title }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={listing.title}
            onChange={(e) => onChange({ ...listing, title: e.target.value })}
            placeholder="Property title"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price">Price (per month)</Label>
          <Input
            id="price"
            type="number"
            value={listing.price}
            onChange={(e) => onChange({ ...listing, price: e.target.value })}
            placeholder="0"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={listing.location}
            onChange={(e) => onChange({ ...listing, location: e.target.value })}
            placeholder="Property location"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="propertyType">Property Type</Label>
          <select
            id="propertyType"
            value={listing.propertyType}
            onChange={(e) => onChange({ ...listing, propertyType: e.target.value })}
            className="w-full p-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="studio">Studio</option>
            <option value="townhouse">Townhouse</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input
            id="bedrooms"
            type="number"
            min="0"
            value={listing.bedrooms}
            onChange={(e) => onChange({ ...listing, bedrooms: parseInt(e.target.value) })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input
            id="bathrooms"
            type="number"
            min="0"
            step="0.5"
            value={listing.bathrooms}
            onChange={(e) => onChange({ ...listing, bathrooms: parseFloat(e.target.value) })}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={listing.description}
          onChange={(e) => onChange({ ...listing, description: e.target.value })}
          placeholder="Describe your property..."
          rows={4}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          {title}
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Landlord Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, <span className="font-semibold text-foreground">{user?.username}</span>
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
            <Dialog open={showAddListingDialog} onOpenChange={setShowAddListingDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <PlusIcon className="h-4 w-4" />
                  Add Listing
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Listing</DialogTitle>
                </DialogHeader>
                <ListingForm
                  listing={newListing}
                  onChange={setNewListing}
                  onSubmit={handleAddListing}
                  onCancel={() => setShowAddListingDialog(false)}
                  title="Add Listing"
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Listings"
            value={dashboardStats.totalListings}
            change={12}
            changeType="positive"
            icon={BuildingOffice2Icon}
            loading={loading}
          />
          <StatCard
            title="Active Listings"
            value={dashboardStats.activeListings}
            change={8}
            changeType="positive"
            icon={CheckCircleIcon}
            loading={loading}
          />
          <StatCard
            title="Average Price"
            value={`$${dashboardStats.averagePrice?.toFixed(0) || 0}`}
            change={5}
            changeType="positive"
            icon={CurrencyDollarIcon}
            loading={loading}
          />
          <StatCard
            title="Occupancy Rate"
            value={`${dashboardStats.occupancyRate?.toFixed(1) || 0}%`}
            change={3}
            changeType="positive"
            icon={UserGroupIcon}
            loading={loading}
            trend={dashboardStats.occupancyRate}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="forum">Forum Posts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Listings Tab */}
          <TabsContent value="listings" className="space-y-6">
            {/* Search and Filters */}
            <SearchFilter
              onSearch={setSearchTerm}
              onFilter={setFilters}
              filters={{
                propertyTypes: ['apartment', 'house', 'condo', 'studio', 'townhouse'],
                amenities: ['parking', 'gym', 'pool', 'laundry', 'pets-allowed']
              }}
              activeFilters={filters}
              placeholder="Search your listings..."
            />

            {/* Listings Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BuildingOffice2Icon className="h-5 w-5" />
                  Your Listings ({filteredListings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredListings.length === 0 ? (
                  <div className="text-center py-12">
                    <BuildingOffice2Icon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No listings found</h3>
                    <p className="text-muted-foreground mb-4">
                      {myListings.length === 0 
                        ? "You haven't created any listings yet."
                        : "No listings match your current search criteria."
                      }
                    </p>
                    <Button onClick={() => setShowAddListingDialog(true)} className="gap-2">
                      <PlusIcon className="h-4 w-4" />
                      Add Your First Listing
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredListings.map((listing) => (
                        <TableRow key={listing._id} className="group">
                          <TableCell>
                            <div>
                              <div className="font-medium">{listing.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {listing.propertyType} • {listing.bedrooms}br/{listing.bathrooms}ba
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                              {listing.location}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-semibold">${listing.price}/mo</div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(listing.status || 'active')}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <CalendarIcon className="h-4 w-4" />
                              {new Date(listing.createdAt || Date.now()).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => fetchListingDetails(listing._id)}
                                className="gap-2"
                              >
                                <EyeIcon className="h-4 w-4" />
                                View
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingListing(listing);
                                  setShowEditListingDialog(true);
                                }}
                                className="gap-2"
                              >
                                <PencilIcon className="h-4 w-4" />
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteListing(listing._id)}
                                className="gap-2 text-destructive hover:text-destructive"
                              >
                                <TrashIcon className="h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <StarIcon className="h-5 w-5" />
                  Property Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedListing ? (
                  <div className="space-y-4">
                    {listingReviews.length === 0 ? (
                      <div className="text-center py-8">
                        <StarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No reviews yet for this property.</p>
                      </div>
                    ) : (
                      listingReviews.map((review) => (
                        <div key={review._id} className="border border-border rounded-lg p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <StarIcon
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= (review.rating || 0)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-muted-foreground'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <Badge variant="outline">{review.category || 'General'}</Badge>
                          </div>
                          <p className="text-sm">{review.comment}</p>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>Safety: <span className="font-medium">{review.safety || 'N/A'}</span></div>
                            <div>Water: <span className="font-medium">{review.water || 'N/A'}</span></div>
                            <div>Landlord: <span className="font-medium">{review.landlordReliability || 'N/A'}</span></div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <StarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Select a listing to view its reviews.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forum Tab */}
          <TabsContent value="forum" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                  Forum Discussions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedListing ? (
                  <div className="space-y-4">
                    {forumPosts.length === 0 ? (
                      <div className="text-center py-8">
                        <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No forum posts yet for this property.</p>
                      </div>
                    ) : (
                      forumPosts.map((post) => (
                        <div key={post._id} className="border border-border rounded-lg p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{post.author || 'Anonymous'}</span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm">{post.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Select a listing to view its forum discussions.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Views</span>
                      <span className="font-medium">1,234</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-primary rounded-full w-3/4" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Inquiries</span>
                      <span className="font-medium">89</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-chart-2 rounded-full w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Applications</span>
                      <span className="font-medium">23</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-chart-3 rounded-full w-1/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">New inquiry received</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Listing viewed 15 times</p>
                        <p className="text-xs text-muted-foreground">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Review posted</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Listing Dialog */}
        <Dialog open={showEditListingDialog} onOpenChange={setShowEditListingDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Listing</DialogTitle>
            </DialogHeader>
            {editingListing && (
              <ListingForm
                listing={editingListing}
                onChange={setEditingListing}
                onSubmit={handleEditListing}
                onCancel={() => {
                  setShowEditListingDialog(false);
                  setEditingListing(null);
                }}
                title="Update Listing"
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LandlordDashboard; 