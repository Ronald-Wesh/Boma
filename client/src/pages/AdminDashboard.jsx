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
  UsersIcon,
  BuildingOffice2Icon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  CogIcon,
  BellIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  MapPinIcon,
  StarIcon,
  FlagIcon,
  HomeIcon,
  UserGroupIcon,
  ChartPieIcon,
  ServerIcon,
  GlobeAltIcon,
  LockClosedIcon,
  FireIcon,
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({});
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [reports, setReports] = useState([]);
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      fetchAdminData();
    }
  }, [user]);

  // Filter data based on search and filters
  useEffect(() => {
    // Filter users
    let filteredUsersList = users;
    if (searchTerm) {
      filteredUsersList = filteredUsersList.filter(u =>
        u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filters.userRole) {
      filteredUsersList = filteredUsersList.filter(u => u.role === filters.userRole);
    }
    setFilteredUsers(filteredUsersList);

    // Filter listings
    let filteredListingsList = listings;
    if (searchTerm) {
      filteredListingsList = filteredListingsList.filter(l =>
        l.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filters.listingStatus) {
      filteredListingsList = filteredListingsList.filter(l => l.verified === (filters.listingStatus === 'verified'));
    }
    setFilteredListings(filteredListingsList);
  }, [users, listings, searchTerm, filters]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [usersRes, listingsRes, reviewsRes, forumRes] = await Promise.allSettled([
        API.get('/auth/profile'), // Get current user info
        API.get('/listings'),
        API.get('/reviews/all'),
        API.get('/forum/all')
      ]);

      // Mock users data for demo (in production, you'd have an admin endpoint)
      const mockUsers = [
        { _id: '1', username: 'john_doe', email: 'john@example.com', role: 'tenant', status: 'active', isVerified: true, createdAt: new Date() },
        { _id: '2', username: 'jane_landlord', email: 'jane@example.com', role: 'landlord', status: 'active', isVerified: false, createdAt: new Date() },
        { _id: '3', username: 'admin_user', email: 'admin@example.com', role: 'admin', status: 'active', isVerified: true, createdAt: new Date() },
      ];

      const listingsData = listingsRes.status === 'fulfilled' ? listingsRes.value.data : [];
      const reviewsData = reviewsRes.status === 'fulfilled' ? reviewsRes.value.data : [];
      const forumData = forumRes.status === 'fulfilled' ? forumRes.value.data : [];

      setUsers(mockUsers);
      setListings(listingsData);
      setReports([]); // Mock empty reports

      // Calculate admin dashboard stats
      const totalUsers = mockUsers.length;
      const totalLandlords = mockUsers.filter(u => u.role === 'landlord').length;
      const totalTenants = mockUsers.filter(u => u.role === 'tenant').length;
      const totalListings = listingsData.length;
      const verifiedListings = listingsData.filter(l => l.verified).length;
      const pendingListings = listingsData.filter(l => !l.verified).length;
      const totalReviews = reviewsData.length;
      const totalForumPosts = forumData.length;

      setDashboardStats({
        totalUsers,
        totalLandlords,
        totalTenants,
        totalListings,
        verifiedListings,
        pendingListings,
        totalReviews,
        totalForumPosts,
        userGrowthRate: 12.5,
        listingGrowthRate: 8.3,
        systemHealth: 98.5,
        activeUsers: Math.round(totalUsers * 0.75),
      });

    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      toast.error('Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action, additionalData = {}) => {
    try {
      // Mock API calls for demo
      let successMessage = '';

      switch (action) {
        case 'suspend':
          successMessage = 'User suspended successfully';
          break;
        case 'activate':
          successMessage = 'User activated successfully';
          break;
        case 'verify':
          successMessage = 'User verified successfully';
          break;
        case 'delete':
          if (!confirm('Are you sure you want to delete this user?')) return;
          successMessage = 'User deleted successfully';
          break;
        default:
          throw new Error('Invalid action');
      }

      // Update local state
      if (action === 'delete') {
        setUsers(prev => prev.filter(u => u._id !== userId));
      } else {
        setUsers(prev => prev.map(u => 
          u._id === userId ? { ...u, ...additionalData } : u
        ));
      }
      
      toast.success(successMessage);
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
      toast.error(`Failed to ${action} user`);
    }
  };

  const handleListingAction = async (listingId, action) => {
    try {
      let successMessage = '';

      switch (action) {
        case 'verify':
          await API.put(`/listings/${listingId}`, { verified: true });
          successMessage = 'Listing verified successfully';
          break;
        case 'unverify':
          await API.put(`/listings/${listingId}`, { verified: false });
          successMessage = 'Listing verification removed';
          break;
        case 'delete':
          if (!confirm('Are you sure you want to delete this listing?')) return;
          await API.delete(`/listings/${listingId}`);
          successMessage = 'Listing deleted successfully';
          break;
        default:
          throw new Error('Invalid action');
      }

      // Update local state
      if (action === 'delete') {
        setListings(prev => prev.filter(l => l._id !== listingId));
      } else {
        setListings(prev => prev.map(l => 
          l._id === listingId ? { ...l, verified: action === 'verify' } : l
        ));
      }
      
      toast.success(successMessage);
    } catch (error) {
      console.error(`Failed to ${action} listing:`, error);
      toast.error(`Failed to ${action} listing`);
    }
  };

  const getUserStatusBadge = (status, isVerified) => {
    if (status === 'suspended') {
      return <Badge variant="destructive">Suspended</Badge>;
    }
    if (isVerified) {
      return <Badge variant="success">Verified</Badge>;
    }
    return <Badge variant="warning">Unverified</Badge>;
  };

  const getListingStatusBadge = (verified) => {
    return verified ? 
      <Badge variant="success">Verified</Badge> : 
      <Badge variant="warning">Pending</Badge>;
  };

  const UserDetailsDialog = ({ user, onClose }) => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <UserCircleIcon className="h-6 w-6" />
          User Details
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Username</Label>
            <p className="font-medium text-lg">{user.username}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Email</Label>
            <p className="font-medium">{user.email}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Role</Label>
            <Badge variant="outline" className="w-fit">{user.role}</Badge>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Status</Label>
            {getUserStatusBadge(user.status, user.isVerified)}
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Joined</Label>
            <div className="flex items-center gap-1 text-sm">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              {new Date(user.createdAt || Date.now()).toLocaleDateString()}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Last Active</Label>
            <div className="flex items-center gap-1 text-sm">
              <ClockIcon className="h-4 w-4 text-muted-foreground" />
              {new Date(user.lastActive || Date.now()).toLocaleDateString()}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {user.status !== 'suspended' && (
            <Button 
              variant="destructive" 
              onClick={() => {
                handleUserAction(user._id, 'suspend', { status: 'suspended' });
                onClose();
              }}
            >
              Suspend User
            </Button>
          )}
          {user.status === 'suspended' && (
            <Button 
              onClick={() => {
                handleUserAction(user._id, 'activate', { status: 'active' });
                onClose();
              }}
            >
              Activate User
            </Button>
          )}
          {!user.isVerified && (
            <Button 
              onClick={() => {
                handleUserAction(user._id, 'verify', { isVerified: true });
                onClose();
              }}
            >
              Verify User
            </Button>
          )}
        </div>
      </div>
    </DialogContent>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Loading Admin Dashboard</h3>
            <p className="text-muted-foreground">Fetching system data...</p>
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
                  <ShieldCheckIcon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold gradient-text">Admin Control Center</h1>
                  <p className="text-muted-foreground text-lg">
                    System overview and management • <span className="font-semibold text-foreground">{user?.username}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="gap-2 glass">
                <BellIcon className="h-4 w-4" />
                Notifications
                {dashboardStats.pendingListings > 0 && (
                  <Badge variant="destructive" className="ml-1 px-1.5 py-0.5 text-xs">
                    {dashboardStats.pendingListings}
                  </Badge>
                )}
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
            title="Total Users"
            value={dashboardStats.totalUsers}
            change={dashboardStats.userGrowthRate}
            changeType="positive"
            icon={UsersIcon}
            subtitle={`${dashboardStats.totalLandlords} landlords, ${dashboardStats.totalTenants} tenants`}
            loading={loading}
            className="hover:scale-105 transition-transform duration-300"
          />
          <StatCard
            title="Total Listings"
            value={dashboardStats.totalListings}
            change={dashboardStats.listingGrowthRate}
            changeType="positive"
            icon={BuildingOffice2Icon}
            subtitle={`${dashboardStats.verifiedListings} verified, ${dashboardStats.pendingListings} pending`}
            loading={loading}
            className="hover:scale-105 transition-transform duration-300"
          />
          <StatCard
            title="System Health"
            value={`${dashboardStats.systemHealth}%`}
            change={2.1}
            changeType="positive"
            icon={ServerIcon}
            subtitle="All systems operational"
            loading={loading}
            className="hover:scale-105 transition-transform duration-300"
          />
          <StatCard
            title="Active Users"
            value={dashboardStats.activeUsers}
            change={5.2}
            changeType="positive"
            icon={UserGroupIcon}
            subtitle="Last 24 hours"
            loading={loading}
            className="hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Enhanced Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-12 p-1 bg-muted/50 backdrop-blur-sm">
            <TabsTrigger value="overview" className="gap-2">
              <ChartPieIcon className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <UsersIcon className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="listings" className="gap-2">
              <BuildingOffice2Icon className="h-4 w-4" />
              Listings
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <FlagIcon className="h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <ChartBarIcon className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Enhanced Overview Tab */}
          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClockIcon className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {[
                      { type: 'user', message: 'New user registered', detail: 'john.doe@example.com', time: '2 minutes ago', color: 'bg-green-500' },
                      { type: 'listing', message: 'Listing verified', detail: 'Modern Apartment in Downtown', time: '15 minutes ago', color: 'bg-blue-500' },
                      { type: 'report', message: 'Report submitted', detail: 'Inappropriate content reported', time: '1 hour ago', color: 'bg-yellow-500' },
                      { type: 'verification', message: 'Verification completed', detail: 'Landlord verification approved', time: '2 hours ago', color: 'bg-purple-500' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className={`w-2 h-2 ${activity.color} rounded-full mt-2 flex-shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{activity.message}</p>
                          <p className="text-xs text-muted-foreground truncate">{activity.detail}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FireIcon className="h-5 w-5 text-primary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { icon: UserPlusIcon, label: 'Manage User Verifications', action: () => setActiveTab('users') },
                    { icon: BuildingOffice2Icon, label: 'Review Pending Listings', action: () => setActiveTab('listings') },
                    { icon: ExclamationTriangleIcon, label: 'Handle Reports', action: () => setActiveTab('reports') },
                    { icon: DocumentTextIcon, label: 'Generate System Report', action: () => toast.info('Feature coming soon') },
                    { icon: ChartBarIcon, label: 'View Analytics', action: () => setActiveTab('analytics') },
                  ].map((item, index) => (
                    <Button 
                      key={index}
                      variant="outline" 
                      className="w-full justify-start gap-3 h-12 hover:bg-primary/5 hover:border-primary/20 transition-all duration-200"
                      onClick={item.action}
                    >
                      <item.icon className="h-5 w-5 text-primary" />
                      {item.label}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* System Health */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ServerIcon className="h-5 w-5 text-primary" />
                  System Health & Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Server Uptime', value: '99.9%', progress: 100, color: 'bg-green-500' },
                    { label: 'Database Performance', value: '95.2%', progress: 95, color: 'bg-blue-500' },
                    { label: 'API Response Time', value: '125ms', progress: 75, color: 'bg-yellow-500' },
                  ].map((metric, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{metric.label}</span>
                        <span className="text-sm font-bold text-primary">{metric.value}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-2 ${metric.color} rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${metric.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Users Tab */}
          <TabsContent value="users" className="space-y-6 animate-fade-in">
            <SearchFilter
              onSearch={setSearchTerm}
              onFilter={setFilters}
              filters={{
                userRoles: ['landlord', 'tenant', 'admin'],
                userStatuses: ['active', 'suspended', 'pending']
              }}
              activeFilters={filters}
              placeholder="Search users by name or email..."
            />

            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UsersIcon className="h-5 w-5 text-primary" />
                  User Management ({filteredUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="font-semibold">User</TableHead>
                        <TableHead className="font-semibold">Role</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Joined</TableHead>
                        <TableHead className="font-semibold">Activity</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((userItem) => (
                        <TableRow key={userItem._id} className="group hover:bg-muted/20 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-semibold text-primary">
                                  {userItem.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">{userItem.username}</div>
                                <div className="text-sm text-muted-foreground">{userItem.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">{userItem.role}</Badge>
                          </TableCell>
                          <TableCell>
                            {getUserStatusBadge(userItem.status, userItem.isVerified)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <CalendarIcon className="h-4 w-4" />
                              {new Date(userItem.createdAt || Date.now()).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              <span className="text-sm text-muted-foreground">Online</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(userItem);
                                  setShowUserDialog(true);
                                }}
                                className="gap-2 hover:bg-primary/10"
                              >
                                <EyeIcon className="h-4 w-4" />
                                View
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUserAction(userItem._id, 'delete')}
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Listings Tab */}
          <TabsContent value="listings" className="space-y-6 animate-fade-in">
            <SearchFilter
              onSearch={setSearchTerm}
              onFilter={setFilters}
              filters={{
                listingStatuses: ['verified', 'pending'],
                propertyTypes: ['apartment', 'house', 'condo', 'studio', 'townhouse']
              }}
              activeFilters={filters}
              placeholder="Search listings by title or location..."
            />

            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BuildingOffice2Icon className="h-5 w-5 text-primary" />
                  Listing Management ({filteredListings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="font-semibold">Property</TableHead>
                        <TableHead className="font-semibold">Landlord</TableHead>
                        <TableHead className="font-semibold">Location</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
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
                            <div className="text-sm">{listing.landlord?.username || 'Unknown'}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{listing.address}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getListingStatusBadge(listing.verified)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <CalendarIcon className="h-4 w-4" />
                              {new Date(listing.createdAt || Date.now()).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!listing.verified ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleListingAction(listing._id, 'verify')}
                                  className="gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                  <CheckCircleIcon className="h-4 w-4" />
                                  Verify
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleListingAction(listing._id, 'unverify')}
                                  className="gap-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                                >
                                  <XCircleIcon className="h-4 w-4" />
                                  Unverify
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleListingAction(listing._id, 'delete')}
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Reports Tab */}
          <TabsContent value="reports" className="space-y-6 animate-fade-in">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlagIcon className="h-5 w-5 text-primary" />
                  User Reports & Moderation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircleIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">All Clear!</h3>
                  <p className="text-muted-foreground mb-6">No user reports requiring attention at this time.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <div className="p-4 rounded-lg bg-muted/30">
                      <div className="text-2xl font-bold text-green-600">0</div>
                      <div className="text-sm text-muted-foreground">Pending Reports</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30">
                      <div className="text-2xl font-bold text-blue-600">12</div>
                      <div className="text-sm text-muted-foreground">Resolved This Week</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30">
                      <div className="text-2xl font-bold text-purple-600">98%</div>
                      <div className="text-sm text-muted-foreground">Resolution Rate</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Analytics */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChartBarIcon className="h-5 w-5 text-primary" />
                    User Growth Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { label: 'New Users (30 days)', value: Math.round(dashboardStats.totalUsers * 0.1) || 0, progress: 80, color: 'bg-primary' },
                    { label: 'Active Users', value: dashboardStats.activeUsers || 0, progress: 70, color: 'bg-chart-2' },
                    { label: 'User Retention', value: '85%', progress: 85, color: 'bg-chart-3' },
                  ].map((metric, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{metric.label}</span>
                        <span className="font-bold text-lg">{typeof metric.value === 'string' ? metric.value : `+${metric.value}`}</span>
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

              {/* Platform Analytics */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GlobeAltIcon className="h-5 w-5 text-primary" />
                    Platform Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { label: 'Total Listings', value: dashboardStats.totalListings || 0, progress: 90, color: 'bg-green-500' },
                    { label: 'Verified Properties', value: dashboardStats.verifiedListings || 0, progress: 75, color: 'bg-chart-4' },
                    { label: 'User Engagement', value: '92%', progress: 92, color: 'bg-chart-5' },
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
            </div>

            {/* Platform Performance Metrics */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartPieIcon className="h-5 w-5 text-primary" />
                  Platform Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: 'User Satisfaction', value: '98.5%', icon: StarIcon, color: 'text-primary' },
                    { label: 'Avg. Page Load', value: '2.3s', icon: ClockIcon, color: 'text-chart-2' },
                    { label: 'System Uptime', value: '99.9%', icon: ServerIcon, color: 'text-chart-3' },
                    { label: 'Monthly Visits', value: '15K', icon: GlobeAltIcon, color: 'text-chart-4' },
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

        {/* User Details Dialog */}
        {selectedUser && (
          <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
            <UserDetailsDialog
              user={selectedUser}
              onClose={() => {
                setShowUserDialog(false);
                setSelectedUser(null);
              }}
            />
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;