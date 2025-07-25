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
  HomeIcon,
  ChartBarIcon,
  BellIcon,
  CogIcon,
  FireIcon,
  TrendingUpIcon,
  UsersIcon,
  DocumentTextIcon,
  PhotoIcon,
  GlobeAltIcon,
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
  const [activeTab, setActiveTab] = useState('listings');

  // New listing form state
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    address: '',
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
        listing.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.verified !== undefined) {
      filtered = filtered.filter(listing => listing.verified === filters.verified);
    }

    setFilteredListings(filtered);
  }, [myListings, searchTerm, filters]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch listings
      const listingsRes = await API.get('/listings');
      const allListings = listingsRes.data || [];
      
      // Filter listings for current user (in production, this would be done on backend)
      const userListings = allListings.filter(listing => 
        listing.landlord && listing.landlord._id === user.id
      );
      
      setMyListings(userListings);
      setFilteredListings(userListings);

      // Calculate dashboard stats
      const totalListings = userListings.length;
      const verifiedListings = userListings.filter(l => l.verified).length;
      const pendingListings = userListings.filter(l => !l.verified).length;
      const totalViews = totalListings * 45; // Mock data
      const totalInquiries = totalListings * 8; // Mock data

      setDashboardStats({
        totalListings,
        verifiedListings,
        pendingListings,
        totalViews,
        totalInquiries,
        occupancyRate: totalListings > 0 ? (verifiedListings / totalListings) * 100 : 0,
        averageRating: 4.2, // Mock data
        monthlyRevenue: totalListings * 1200, // Mock data
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
      setListingReviews(reviewsRes.value?.data || []);
      
      // Fetch forum posts
      const forumRes = await API.get(`/forum/${listingId}`);
      setForumPosts(forumRes.value?.data || []);
    } catch (error) {
      console.error('Failed to fetch listing details:', error);
      setListingReviews([]);
      setForumPosts([]);
    }
  };

  const handleAddListing = async () => {
    try {
      if (!newListing.title || !newListing.description || !newListing.address) {
        toast.error('Please fill in all required fields');
        return;
      }

      const response = await API.post('/listings', {
        ...newListing,
        landlord: user.id
      });
      
      setMyListings(prev => [...prev, response.data]);
      setShowAddListingDialog(false);
      setNewListing({
        title: '',
        description: '',
        address: '',
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

  const getStatusBadge = (verified) => {
    return verified ? 
      <Badge variant="success" className="gap-1">
        <CheckCircleIcon className="h-3 w-3" />
        Verified
      </Badge> : 
      <Badge variant="warning" className="gap-1">
        <ClockIcon className="h-3 w-3" />
        Pending
      </Badge>;
  };

  const ListingForm = ({ listing, onChange, onSubmit, onCancel, title }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">Property Title *</Label>
          <Input
            id="title"
            value={listing.title}
            onChange={(e) => onChange({ ...listing, title: e.target.value })}
            placeholder="e.g., Modern 2BR Apartment in Downtown"
            className="h-11"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-medium">Address *</Label>
          <Input
            id="address"
            value={listing.address}
            onChange={(e) => onChange({ ...listing, address: e.target.value })}
            placeholder="e.g., 123 Main Street, City, State"
            className="h-11"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">Description *</Label>
          <Textarea
            id="description"
            value={listing.description}
            onChange={(e) => onChange({ ...listing, description: e.target.value })}
            placeholder="Describe your property, amenities, and key features..."
            rows={4}
            className="resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <PhotoIcon className="h-4 w-4" />
            Property Images
          </Label>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <PhotoIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Drag and drop images here, or click to select files
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG, GIF up to 10MB each
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit} className="gap-2">
          <CheckCircleIcon className="h-4 w-4" />
          {title}
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Loading Dashboard</h3>
            <p className="text-muted-foreground">Fetching your property data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-chart-1/10 to-chart-2/10 p-8 border border-border/50">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                  <BuildingOffice2Icon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold gradient-text">Landlord Dashboard</h1>
                  <p className="text-muted-foreground text-lg">
                    Welcome back, <span className="font-semibold text-foreground">{user?.username}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="gap-2 glass">
                <BellIcon className="h-4 w-4" />
                Notifications
                {dashboardStats.pendingListings > 0 && (
                  <Badge variant="warning" className="ml-1 px-1.5 py-0.5 text-xs">
                    {dashboardStats.pendingListings}
                  </Badge>
                )}
              </Button>
              <Button variant="outline" onClick={logout} className="glass">
                Logout
              </Button>
              <Dialog open={showAddListingDialog} onOpenChange={setShowAddListingDialog}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90">
                    <PlusIcon className="h-4 w-4" />
                    Add Listing
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <PlusIcon className="h-5 w-5" />
                      Add New Property Listing
                    </DialogTitle>
                  </DialogHeader>
                  <ListingForm
                    listing={newListing}
                    onChange={setNewListing}
                    onSubmit={handleAddListing}
                    onCancel={() => setShowAddListingDialog(false)}
                    title="Create Listing"
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Properties"
            value={dashboardStats.totalListings}
            change={12}
            changeType="positive"
            icon={BuildingOffice2Icon}
            subtitle={`${dashboardStats.verifiedListings} verified`}
            loading={loading}
            className="hover:scale-105 transition-transform duration-300"
          />
          <StatCard
            title="Total Views"
            value={dashboardStats.totalViews}
            change={18}
            changeType="positive"
            icon={EyeIcon}
            subtitle="This month"
            loading={loading}
            className="hover:scale-105 transition-transform duration-300"
          />
          <StatCard
            title="Inquiries"
            value={dashboardStats.totalInquiries}
            change={8}
            changeType="positive"
            icon={ChatBubbleLeftRightIcon}
            subtitle="Pending responses"
            loading={loading}
            className="hover:scale-105 transition-transform duration-300"
          />
          <StatCard
            title="Avg. Rating"
            value={`${dashboardStats.averageRating}/5`}
            change={3}
            changeType="positive"
            icon={StarIcon}
            subtitle="From tenant reviews"
            loading={loading}
            className="hover:scale-105 transition-transform duration-300"
            trend={dashboardStats.averageRating * 20}
          />
        </div>

        {/* Enhanced Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12 p-1 bg-muted/50 backdrop-blur-sm">
            <TabsTrigger value="listings" className="gap-2">
              <BuildingOffice2Icon className="h-4 w-4" />
              My Properties
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2">
              <StarIcon className="h-4 w-4" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="forum" className="gap-2">
              <ChatBubbleLeftRightIcon className="h-4 w-4" />
              Discussions
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <ChartBarIcon className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Enhanced Listings Tab */}
          <TabsContent value="listings" className="space-y-6 animate-fade-in">
            {/* Search and Filters */}
            <SearchFilter
              onSearch={setSearchTerm}
              onFilter={setFilters}
              filters={{
                verified: [true, false],
                amenities: ['parking', 'gym', 'pool', 'laundry', 'pets-allowed']
              }}
              activeFilters={filters}
              placeholder="Search your properties..."
            />

            {/* Listings Grid/Table */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BuildingOffice2Icon className="h-5 w-5 text-primary" />
                  Your Properties ({filteredListings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredListings.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <BuildingOffice2Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                    <p className="text-muted-foreground mb-6">
                      {myListings.length === 0 
                        ? "You haven't created any property listings yet."
                        : "No properties match your current search criteria."
                      }
                    </p>
                    <Button onClick={() => setShowAddListingDialog(true)} className="gap-2">
                      <PlusIcon className="h-4 w-4" />
                      Add Your First Property
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border/50 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead className="font-semibold">Property</TableHead>
                          <TableHead className="font-semibold">Location</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                          <TableHead className="font-semibold">Views</TableHead>
                          <TableHead className="font-semibold">Created</TableHead>
                          <TableHead className="text-right font-semibold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredListings.map((listing) => (
                          <TableRow key={listing._id} className="group hover:bg-muted/20 transition-colors">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <HomeIcon className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                  <div className="font-medium">{listing.title}</div>
                                  <div className="text-sm text-muted-foreground">
                                    Property listing
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{listing.address}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(listing.verified)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <EyeIcon className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                  {Math.floor(Math.random() * 100) + 20}
                                </span>
                              </div>
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
                                  className="gap-2 hover:bg-primary/10"
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
                                  className="gap-2 hover:bg-blue-50"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteListing(listing._id)}
                                  className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
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
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6 animate-fade-in">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <StarIcon className="h-5 w-5 text-primary" />
                  Property Reviews & Ratings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedListing ? (
                  <div className="space-y-4">
                    {listingReviews.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
                          <StarIcon className="h-8 w-8 text-yellow-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                        <p className="text-muted-foreground">This property hasn't received any reviews from tenants.</p>
                      </div>
                    ) : (
                      listingReviews.map((review) => (
                        <div key={review._id} className="border border-border/50 rounded-lg p-6 space-y-4 hover:bg-muted/20 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <StarIcon
                                    key={star}
                                    className={`h-5 w-5 ${
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
                          <p className="text-sm leading-relaxed">{review.comment}</p>
                          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border/30">
                            <div className="text-center">
                              <div className="text-lg font-semibold text-primary">{review.safety || 'N/A'}</div>
                              <div className="text-xs text-muted-foreground">Safety</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-primary">{review.water || 'N/A'}</div>
                              <div className="text-xs text-muted-foreground">Water</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-primary">{review.landlordReliability || 'N/A'}</div>
                              <div className="text-xs text-muted-foreground">Landlord</div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <StarIcon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Select a property</h3>
                    <p className="text-muted-foreground">Choose a property from your listings to view its reviews and ratings.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Forum Tab */}
          <TabsContent value="forum" className="space-y-6 animate-fade-in">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-primary" />
                  Community Discussions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedListing ? (
                  <div className="space-y-4">
                    {forumPosts.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                          <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No discussions yet</h3>
                        <p className="text-muted-foreground">No community discussions have been started for this property.</p>
                      </div>
                    ) : (
                      forumPosts.map((post) => (
                        <div key={post._id} className="border border-border/50 rounded-lg p-6 space-y-3 hover:bg-muted/20 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-semibold text-primary">
                                  {(post.author || 'A').charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="font-medium">{post.author || 'Anonymous'}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed pl-11">{post.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <ChatBubbleLeftRightIcon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Select a property</h3>
                    <p className="text-muted-foreground">Choose a property from your listings to view community discussions.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUpIcon className="h-5 w-5 text-primary" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { label: 'Total Views', value: dashboardStats.totalViews || 0, progress: 80, color: 'bg-primary' },
                    { label: 'Inquiries', value: dashboardStats.totalInquiries || 0, progress: 60, color: 'bg-chart-2' },
                    { label: 'Response Rate', value: '92%', progress: 92, color: 'bg-chart-3' },
                  ].map((metric, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{metric.label}</span>
                        <span className="font-bold text-lg">{typeof metric.value === 'string' ? metric.value : metric.value}</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-3 ${metric.color} rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${metric.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClockIcon className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: 'inquiry', message: 'New inquiry received', detail: 'Downtown Apartment', time: '2 hours ago', color: 'bg-green-500' },
                      { type: 'view', message: 'Property viewed 15 times', detail: 'Modern Loft', time: '5 hours ago', color: 'bg-blue-500' },
                      { type: 'review', message: 'New review posted', detail: '4.5 stars rating', time: '1 day ago', color: 'bg-yellow-500' },
                      { type: 'forum', message: 'Forum discussion started', detail: 'Maintenance request', time: '2 days ago', color: 'bg-purple-500' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                        <div className={`w-2 h-2 ${activity.color} rounded-full mt-2 flex-shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.detail}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Performance */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartBarIcon className="h-5 w-5 text-primary" />
                  Monthly Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Avg. Response Time', value: '2.3h', icon: ClockIcon, color: 'text-primary' },
                    { label: 'Occupancy Rate', value: `${dashboardStats.occupancyRate?.toFixed(1) || 0}%`, icon: HomeIcon, color: 'text-chart-2' },
                    { label: 'Tenant Satisfaction', value: '4.2/5', icon: StarIcon, color: 'text-chart-3' },
                    { label: 'Monthly Revenue', value: `$${(dashboardStats.monthlyRevenue || 0).toLocaleString()}`, icon: CurrencyDollarIcon, color: 'text-chart-4' },
                  ].map((metric, index) => (
                    <div key={index} className="text-center p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                      <metric.icon className={`h-8 w-8 mx-auto mb-2 ${metric.color}`} />
                      <div className="text-2xl font-bold mb-1">{metric.value}</div>
                      <div className="text-sm text-muted-foreground">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Listing Dialog */}
        <Dialog open={showEditListingDialog} onOpenChange={setShowEditListingDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <PencilIcon className="h-5 w-5" />
                Edit Property Listing
              </DialogTitle>
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