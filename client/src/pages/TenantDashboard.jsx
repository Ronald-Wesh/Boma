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
  HomeIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  MapPinIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  BellIcon,
  CogIcon,
  FireIcon,
  TrendingUpIcon,
  UsersIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  BuildingOffice2Icon,
  UserIcon,
  ChartBarIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const TenantDashboard = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [myForumPosts, setMyForumPosts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const [selectedListing, setSelectedListing] = useState(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showForumDialog, setShowForumDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [activeTab, setActiveTab] = useState('browse');

  // Review form state
  const [newReview, setNewReview] = useState({
    safety: 5,
    water: 5,
    landlordReliability: 5,
    comment: ''
  });

  // Forum post form state
  const [newForumPost, setNewForumPost] = useState({
    content: ''
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Filter listings based on search and filters
  useEffect(() => {
    let filtered = listings;

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

    if (filters.priceMin) {
      filtered = filtered.filter(listing => (listing.price || 0) >= parseFloat(filters.priceMin));
    }

    if (filters.priceMax) {
      filtered = filtered.filter(listing => (listing.price || 0) <= parseFloat(filters.priceMax));
    }

    setFilteredListings(filtered);
  }, [listings, searchTerm, filters]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all listings
      const listingsRes = await API.get('/listings');
      const allListings = listingsRes.data || [];
      setListings(allListings);
      setFilteredListings(allListings);

      // Mock user-specific data (in production, these would be separate API calls)
      const mockReviews = [
        { _id: '1', listing: { title: 'Downtown Apartment' }, safety: 4, water: 5, landlordReliability: 4, comment: 'Great place to live!', createdAt: new Date() },
        { _id: '2', listing: { title: 'Suburban House' }, safety: 5, water: 4, landlordReliability: 5, comment: 'Very satisfied with the property.', createdAt: new Date() },
      ];

      const mockForumPosts = [
        { _id: '1', listing: { title: 'Downtown Apartment' }, content: 'Anyone else having issues with the elevator?', createdAt: new Date() },
        { _id: '2', listing: { title: 'Suburban House' }, content: 'Great community here!', createdAt: new Date() },
      ];

      const mockFavorites = allListings.slice(0, 3); // First 3 listings as favorites

      setMyReviews(mockReviews);
      setMyForumPosts(mockForumPosts);
      setFavorites(mockFavorites);

      // Calculate dashboard stats
      const totalListings = allListings.length;
      const verifiedListings = allListings.filter(l => l.verified).length;
      const myReviewsCount = mockReviews.length;
      const myForumPostsCount = mockForumPosts.length;
      const favoritesCount = mockFavorites.length;

      setDashboardStats({
        totalListings,
        verifiedListings,
        myReviewsCount,
        myForumPostsCount,
        favoritesCount,
        averageRating: 4.3,
        savedSearches: 3,
        recentViews: 12,
      });

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    try {
      if (!selectedListing) {
        toast.error('Please select a listing first');
        return;
      }

      const response = await API.post(`/reviews/${selectedListing}`, newReview);
      
      setMyReviews(prev => [...prev, response.data]);
      setShowReviewDialog(false);
      setNewReview({
        safety: 5,
        water: 5,
        landlordReliability: 5,
        comment: ''
      });
      toast.success('Review submitted successfully!');
    } catch (error) {
      console.error('Failed to submit review:', error);
      toast.error('Failed to submit review');
    }
  };

  const handleSubmitForumPost = async () => {
    try {
      if (!selectedListing) {
        toast.error('Please select a listing first');
        return;
      }

      const response = await API.post(`/forum/${selectedListing}`, newForumPost);
      
      setMyForumPosts(prev => [...prev, response.data]);
      setShowForumDialog(false);
      setNewForumPost({ content: '' });
      toast.success('Forum post submitted successfully!');
    } catch (error) {
      console.error('Failed to submit forum post:', error);
      toast.error('Failed to submit forum post');
    }
  };

  const handleToggleFavorite = (listing) => {
    const isFavorite = favorites.some(fav => fav._id === listing._id);
    
    if (isFavorite) {
      setFavorites(prev => prev.filter(fav => fav._id !== listing._id));
      toast.success('Removed from favorites');
    } else {
      setFavorites(prev => [...prev, listing]);
      toast.success('Added to favorites');
    }
  };

  const getStatusBadge = (verified) => {
    return verified ? 
      <Badge variant="success" className="gap-1">
        <CheckCircleIcon className="h-3 w-3" />
        Verified
      </Badge> : 
      <Badge variant="outline" className="gap-1">
        <ClockIcon className="h-3 w-3" />
        Unverified
      </Badge>;
  };

  const getRatingStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-muted-foreground'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Loading Dashboard</h3>
            <p className="text-muted-foreground">Fetching your personalized data...</p>
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
                  <UserIcon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold gradient-text">Tenant Dashboard</h1>
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
                <Badge variant="info" className="ml-1 px-1.5 py-0.5 text-xs">
                  3
                </Badge>
              </Button>
              <Button variant="outline" size="sm" className="gap-2 glass">
                <CogIcon className="h-4 w-4" />
                Settings
              </Button>
              <Button variant="outline" onClick={logout} className="glass">
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Available Properties"
            value={dashboardStats.totalListings}
            change={8}
            changeType="positive"
            icon={BuildingOffice2Icon}
            subtitle={`${dashboardStats.verifiedListings} verified`}
            loading={loading}
            className="hover:scale-105 transition-transform duration-300"
          />
          <StatCard
            title="My Reviews"
            value={dashboardStats.myReviewsCount}
            change={2}
            changeType="positive"
            icon={StarIcon}
            subtitle="Properties reviewed"
            loading={loading}
            className="hover:scale-105 transition-transform duration-300"
          />
          <StatCard
            title="Forum Posts"
            value={dashboardStats.myForumPostsCount}
            change={1}
            changeType="positive"
            icon={ChatBubbleLeftRightIcon}
            subtitle="Community contributions"
            loading={loading}
            className="hover:scale-105 transition-transform duration-300"
          />
          <StatCard
            title="Favorites"
            value={dashboardStats.favoritesCount}
            change={5}
            changeType="positive"
            icon={HeartIcon}
            subtitle="Saved properties"
            loading={loading}
            className="hover:scale-105 transition-transform duration-300"
            trend={dashboardStats.favoritesCount * 10}
          />
        </div>

        {/* Enhanced Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-12 p-1 bg-muted/50 backdrop-blur-sm">
            <TabsTrigger value="browse" className="gap-2">
              <MagnifyingGlassIcon className="h-4 w-4" />
              Browse
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-2">
              <HeartIcon className="h-4 w-4" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2">
              <StarIcon className="h-4 w-4" />
              My Reviews
            </TabsTrigger>
            <TabsTrigger value="forum" className="gap-2">
              <ChatBubbleLeftRightIcon className="h-4 w-4" />
              Forum Posts
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <ChartBarIcon className="h-4 w-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          {/* Enhanced Browse Tab */}
          <TabsContent value="browse" className="space-y-6 animate-fade-in">
            {/* Search and Filters */}
            <SearchFilter
              onSearch={setSearchTerm}
              onFilter={setFilters}
              filters={{
                verified: [true, false],
                priceRanges: ['0-1000', '1000-2000', '2000-3000', '3000+'],
                amenities: ['parking', 'gym', 'pool', 'laundry', 'pets-allowed']
              }}
              activeFilters={filters}
              placeholder="Search properties by location, amenities, or features..."
            />

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <Card key={listing._id} className="glass group hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="relative">
                    {listing.images && listing.images.length > 0 ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-chart-1/20 rounded-t-lg flex items-center justify-center">
                        <HomeIcon className="h-16 w-16 text-primary/50" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-2">
                      {getStatusBadge(listing.verified)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleFavorite(listing)}
                        className={`p-2 rounded-full backdrop-blur-sm ${
                          favorites.some(fav => fav._id === listing._id)
                            ? 'bg-red-500/20 text-red-500'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        <HeartIcon className={`h-4 w-4 ${
                          favorites.some(fav => fav._id === listing._id) ? 'fill-current' : ''
                        }`} />
                      </Button>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold line-clamp-1">
                      {listing.title}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPinIcon className="h-4 w-4" />
                      <span className="line-clamp-1">{listing.address}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {listing.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarIcon className="h-3 w-3" />
                        <span>Listed {new Date(listing.createdAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedListing(listing._id)}
                              className="gap-1"
                            >
                              <StarIcon className="h-3 w-3" />
                              Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <StarIcon className="h-5 w-5" />
                                Write a Review
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label>Safety (1-5)</Label>
                                  <Input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={newReview.safety}
                                    onChange={(e) => setNewReview({...newReview, safety: parseInt(e.target.value)})}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Water Quality (1-5)</Label>
                                  <Input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={newReview.water}
                                    onChange={(e) => setNewReview({...newReview, water: parseInt(e.target.value)})}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Landlord (1-5)</Label>
                                  <Input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={newReview.landlordReliability}
                                    onChange={(e) => setNewReview({...newReview, landlordReliability: parseInt(e.target.value)})}
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Comment (Optional)</Label>
                                <Textarea
                                  value={newReview.comment}
                                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                  placeholder="Share your experience..."
                                  rows={3}
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleSubmitReview}>
                                  Submit Review
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedListing(listing._id)}
                              className="gap-1"
                            >
                              <ChatBubbleLeftRightIcon className="h-3 w-3" />
                              Discuss
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                                Start a Discussion
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Your Message</Label>
                                <Textarea
                                  value={newForumPost.content}
                                  onChange={(e) => setNewForumPost({...newForumPost, content: e.target.value})}
                                  placeholder="Start a conversation about this property..."
                                  rows={4}
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setShowForumDialog(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleSubmitForumPost}>
                                  Post Message
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredListings.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <MagnifyingGlassIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search criteria or filters to find more properties.
                </p>
                <Button onClick={() => {
                  setSearchTerm('');
                  setFilters({});
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Enhanced Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6 animate-fade-in">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HeartIcon className="h-5 w-5 text-primary" />
                  Your Favorite Properties ({favorites.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favorites.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                      <HeartIcon className="h-8 w-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Start browsing properties and add them to your favorites for quick access.
                    </p>
                    <Button onClick={() => setActiveTab('browse')}>
                      Browse Properties
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((listing) => (
                      <Card key={listing._id} className="group hover:shadow-lg transition-all duration-300">
                        <div className="relative">
                          {listing.images && listing.images.length > 0 ? (
                            <img
                              src={listing.images[0]}
                              alt={listing.title}
                              className="w-full h-32 object-cover rounded-t-lg"
                            />
                          ) : (
                            <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-chart-1/20 rounded-t-lg flex items-center justify-center">
                              <HomeIcon className="h-8 w-8 text-primary/50" />
                            </div>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleFavorite(listing)}
                            className="absolute top-2 right-2 p-2 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500/30"
                          >
                            <HeartIcon className="h-4 w-4 fill-current" />
                          </Button>
                        </div>
                        
                        <CardContent className="p-4">
                          <h3 className="font-semibold line-clamp-1 mb-1">{listing.title}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                            <MapPinIcon className="h-3 w-3" />
                            <span className="line-clamp-1">{listing.address}</span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {listing.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
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
                  Your Property Reviews ({myReviews.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {myReviews.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
                      <StarIcon className="h-8 w-8 text-yellow-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Share your experiences by reviewing properties you've lived in or visited.
                    </p>
                    <Button onClick={() => setActiveTab('browse')}>
                      Browse & Review Properties
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myReviews.map((review) => (
                      <div key={review._id} className="border border-border/50 rounded-lg p-6 space-y-4 hover:bg-muted/20 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold">{review.listing?.title || 'Property'}</h3>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <CalendarIcon className="h-4 w-4" />
                              <span>Reviewed on {new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="gap-1">
                              <PencilIcon className="h-3 w-3" />
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1 text-destructive">
                              <TrashIcon className="h-3 w-3" />
                              Delete
                            </Button>
                          </div>
                        </div>
                        
                        {review.comment && (
                          <p className="text-sm leading-relaxed bg-muted/30 p-3 rounded-lg">
                            "{review.comment}"
                          </p>
                        )}
                        
                        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border/30">
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              {getRatingStars(review.safety)}
                            </div>
                            <div className="text-lg font-semibold text-primary">{review.safety}/5</div>
                            <div className="text-xs text-muted-foreground">Safety</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              {getRatingStars(review.water)}
                            </div>
                            <div className="text-lg font-semibold text-primary">{review.water}/5</div>
                            <div className="text-xs text-muted-foreground">Water Quality</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              {getRatingStars(review.landlordReliability)}
                            </div>
                            <div className="text-lg font-semibold text-primary">{review.landlordReliability}/5</div>
                            <div className="text-xs text-muted-foreground">Landlord</div>
                          </div>
                        </div>
                      </div>
                    ))}
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
                  Your Forum Contributions ({myForumPosts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {myForumPosts.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                      <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No forum posts yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Join the community discussion by posting questions, tips, or experiences.
                    </p>
                    <Button onClick={() => setActiveTab('browse')}>
                      Browse & Join Discussions
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myForumPosts.map((post) => (
                      <div key={post._id} className="border border-border/50 rounded-lg p-6 space-y-3 hover:bg-muted/20 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold">{post.listing?.title || 'Property Discussion'}</h3>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <CalendarIcon className="h-4 w-4" />
                              <span>Posted on {new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="gap-1">
                              <PencilIcon className="h-3 w-3" />
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1 text-destructive">
                              <TrashIcon className="h-3 w-3" />
                              Delete
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-sm leading-relaxed bg-muted/30 p-4 rounded-lg">
                          {post.content}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border/30">
                          <div className="flex items-center gap-1">
                            <EyeIcon className="h-4 w-4" />
                            <span>{Math.floor(Math.random() * 50) + 10} views</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ChatBubbleLeftRightIcon className="h-4 w-4" />
                            <span>{Math.floor(Math.random() * 10)} replies</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Activity Tab */}
          <TabsContent value="activity" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUpIcon className="h-5 w-5 text-primary" />
                    Activity Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { label: 'Properties Viewed', value: dashboardStats.recentViews || 0, progress: 80, color: 'bg-primary' },
                    { label: 'Reviews Written', value: dashboardStats.myReviewsCount || 0, progress: 60, color: 'bg-chart-2' },
                    { label: 'Forum Contributions', value: dashboardStats.myForumPostsCount || 0, progress: 40, color: 'bg-chart-3' },
                  ].map((metric, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{metric.label}</span>
                        <span className="font-bold text-lg">{metric.value}</span>
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
                      { type: 'view', message: 'Viewed property', detail: 'Downtown Apartment', time: '2 hours ago', color: 'bg-blue-500' },
                      { type: 'favorite', message: 'Added to favorites', detail: 'Modern Loft', time: '5 hours ago', color: 'bg-red-500' },
                      { type: 'review', message: 'Posted a review', detail: '4.5 stars rating', time: '1 day ago', color: 'bg-yellow-500' },
                      { type: 'forum', message: 'Joined discussion', detail: 'Maintenance inquiry', time: '2 days ago', color: 'bg-green-500' },
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

            {/* Personal Stats */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartBarIcon className="h-5 w-5 text-primary" />
                  Your Platform Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Avg. Rating Given', value: `${dashboardStats.averageRating}/5`, icon: StarIcon, color: 'text-primary' },
                    { label: 'Properties Saved', value: dashboardStats.favoritesCount, icon: HeartIcon, color: 'text-chart-2' },
                    { label: 'Saved Searches', value: dashboardStats.savedSearches, icon: MagnifyingGlassIcon, color: 'text-chart-3' },
                    { label: 'Community Rank', value: 'Top 25%', icon: TrendingUpIcon, color: 'text-chart-4' },
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
      </div>
    </div>
  );
};

export default TenantDashboard;