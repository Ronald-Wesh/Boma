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
  const [showReportsDialog, setShowReportsDialog] = useState(false);

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
        l.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filters.listingStatus) {
      filteredListingsList = filteredListingsList.filter(l => l.status === filters.listingStatus);
    }
    setFilteredListings(filteredListingsList);
  }, [users, listings, searchTerm, filters]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [usersRes, listingsRes, reportsRes] = await Promise.allSettled([
        API.get('/admin/users'),
        API.get('/admin/listings'),
        API.get('/admin/reports')
      ]);

      const usersData = usersRes.status === 'fulfilled' ? usersRes.value.data : [];
      const listingsData = listingsRes.status === 'fulfilled' ? listingsRes.value.data : [];
      const reportsData = reportsRes.status === 'fulfilled' ? reportsRes.value.data : [];

      setUsers(usersData);
      setListings(listingsData);
      setReports(reportsData);

      // Calculate admin dashboard stats
      const totalUsers = usersData.length;
      const totalLandlords = usersData.filter(u => u.role === 'landlord').length;
      const totalTenants = usersData.filter(u => u.role === 'tenant').length;
      const totalListings = listingsData.length;
      const activeListings = listingsData.filter(l => l.status === 'active').length;
      const pendingListings = listingsData.filter(l => l.status === 'pending').length;
      const totalRevenue = listingsData.reduce((sum, l) => sum + (l.price || 0), 0);
      const pendingReports = reportsData.filter(r => r.status === 'pending').length;

      setDashboardStats({
        totalUsers,
        totalLandlords,
        totalTenants,
        totalListings,
        activeListings,
        pendingListings,
        totalRevenue,
        pendingReports,
        userGrowthRate: 12.5, // Mock data
        listingGrowthRate: 8.3, // Mock data
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
      let endpoint = '';
      let method = 'PUT';
      let successMessage = '';

      switch (action) {
        case 'suspend':
          endpoint = `/admin/users/${userId}/suspend`;
          successMessage = 'User suspended successfully';
          break;
        case 'activate':
          endpoint = `/admin/users/${userId}/activate`;
          successMessage = 'User activated successfully';
          break;
        case 'verify':
          endpoint = `/admin/users/${userId}/verify`;
          successMessage = 'User verified successfully';
          break;
        case 'delete':
          endpoint = `/admin/users/${userId}`;
          method = 'DELETE';
          successMessage = 'User deleted successfully';
          break;
        default:
          throw new Error('Invalid action');
      }

      if (action === 'delete' && !confirm('Are you sure you want to delete this user?')) {
        return;
      }

      await API[method.toLowerCase()](endpoint, additionalData);
      
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
      let endpoint = '';
      let successMessage = '';

      switch (action) {
        case 'approve':
          endpoint = `/admin/listings/${listingId}/approve`;
          successMessage = 'Listing approved successfully';
          break;
        case 'reject':
          endpoint = `/admin/listings/${listingId}/reject`;
          successMessage = 'Listing rejected successfully';
          break;
        case 'feature':
          endpoint = `/admin/listings/${listingId}/feature`;
          successMessage = 'Listing featured successfully';
          break;
        case 'delete':
          endpoint = `/admin/listings/${listingId}`;
          successMessage = 'Listing deleted successfully';
          break;
        default:
          throw new Error('Invalid action');
      }

      if (action === 'delete' && !confirm('Are you sure you want to delete this listing?')) {
        return;
      }

      if (action === 'delete') {
        await API.delete(endpoint);
        setListings(prev => prev.filter(l => l._id !== listingId));
      } else {
        const response = await API.put(endpoint);
        setListings(prev => prev.map(l => 
          l._id === listingId ? response.data : l
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

  const getListingStatusBadge = (status) => {
    const statusConfig = {
      active: { variant: 'success', label: 'Active' },
      pending: { variant: 'warning', label: 'Pending' },
      rejected: { variant: 'destructive', label: 'Rejected' },
      featured: { variant: 'info', label: 'Featured' },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const UserDetailsDialog = ({ user, onClose }) => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>User Details</DialogTitle>
      </DialogHeader>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Username</Label>
            <p className="font-medium">{user.username}</p>
          </div>
          <div>
            <Label>Email</Label>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <Label>Role</Label>
            <Badge variant="outline">{user.role}</Badge>
          </div>
          <div>
            <Label>Status</Label>
            {getUserStatusBadge(user.status, user.isVerified)}
          </div>
          <div>
            <Label>Joined</Label>
            <p className="text-sm text-muted-foreground">
              {new Date(user.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
          <div>
            <Label>Last Active</Label>
            <p className="text-sm text-muted-foreground">
              {new Date(user.lastActive || Date.now()).toLocaleDateString()}
            </p>
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
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
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
            <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              System overview and management • <span className="font-semibold text-foreground">{user?.username}</span>
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm" className="gap-2">
              <BellIcon className="h-4 w-4" />
              Notifications
              {dashboardStats.pendingReports > 0 && (
                <Badge variant="destructive" className="ml-1 px-1 py-0 text-xs">
                  {dashboardStats.pendingReports}
                </Badge>
              )}
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <CogIcon className="h-4 w-4" />
              Settings
            </Button>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={dashboardStats.totalUsers}
            change={dashboardStats.userGrowthRate}
            changeType="positive"
            icon={UsersIcon}
            subtitle={`${dashboardStats.totalLandlords} landlords, ${dashboardStats.totalTenants} tenants`}
            loading={loading}
          />
          <StatCard
            title="Total Listings"
            value={dashboardStats.totalListings}
            change={dashboardStats.listingGrowthRate}
            changeType="positive"
            icon={BuildingOffice2Icon}
            subtitle={`${dashboardStats.activeListings} active, ${dashboardStats.pendingListings} pending`}
            loading={loading}
          />
          <StatCard
            title="Platform Revenue"
            value={`$${(dashboardStats.totalRevenue * 0.05)?.toFixed(0) || 0}`}
            change={15.2}
            changeType="positive"
            icon={CurrencyDollarIcon}
            subtitle="5% commission from listings"
            loading={loading}
          />
          <StatCard
            title="Pending Reports"
            value={dashboardStats.pendingReports}
            change={-12}
            changeType="positive"
            icon={ExclamationTriangleIcon}
            subtitle="Requiring admin attention"
            loading={loading}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClockIcon className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">New user registered</p>
                        <p className="text-xs text-muted-foreground">john.doe@example.com • 2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Listing approved</p>
                        <p className="text-xs text-muted-foreground">Modern Apartment in Downtown • 15 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Report submitted</p>
                        <p className="text-xs text-muted-foreground">Inappropriate content reported • 1 hour ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Verification completed</p>
                        <p className="text-xs text-muted-foreground">Landlord verification approved • 2 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CogIcon className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <UserPlusIcon className="h-4 w-4" />
                    Manage User Verifications
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <BuildingOffice2Icon className="h-4 w-4" />
                    Review Pending Listings
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    Handle Reports
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <DocumentTextIcon className="h-4 w-4" />
                    Generate System Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <ChartBarIcon className="h-4 w-4" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheckIcon className="h-5 w-5" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Server Uptime</span>
                      <span className="text-sm font-medium text-green-500">99.9%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-green-500 rounded-full w-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Database Performance</span>
                      <span className="text-sm font-medium text-blue-500">95.2%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-blue-500 rounded-full w-11/12" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">API Response Time</span>
                      <span className="text-sm font-medium text-yellow-500">125ms</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-yellow-500 rounded-full w-3/4" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UsersIcon className="h-5 w-5" />
                  User Management ({filteredUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Listings</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((userItem) => (
                      <TableRow key={userItem._id} className="group">
                        <TableCell>
                          <div>
                            <div className="font-medium">{userItem.username}</div>
                            <div className="text-sm text-muted-foreground">{userItem.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{userItem.role}</Badge>
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
                          <span className="text-sm">
                            {userItem.role === 'landlord' ? (userItem.listingsCount || 0) : '-'}
                          </span>
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
                              className="gap-2"
                            >
                              <EyeIcon className="h-4 w-4" />
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUserAction(userItem._id, 'delete')}
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Listings Tab */}
          <TabsContent value="listings" className="space-y-6">
            <SearchFilter
              onSearch={setSearchTerm}
              onFilter={setFilters}
              filters={{
                listingStatuses: ['active', 'pending', 'rejected', 'featured'],
                propertyTypes: ['apartment', 'house', 'condo', 'studio', 'townhouse']
              }}
              activeFilters={filters}
              placeholder="Search listings by title or location..."
            />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BuildingOffice2Icon className="h-5 w-5" />
                  Listing Management ({filteredListings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Landlord</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
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
                          <div className="text-sm">{listing.landlordName || 'Unknown'}</div>
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
                          {getListingStatusBadge(listing.status || 'pending')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {listing.status === 'pending' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleListingAction(listing._id, 'approve')}
                                  className="gap-2 text-green-600 hover:text-green-700"
                                >
                                  <CheckCircleIcon className="h-4 w-4" />
                                  Approve
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleListingAction(listing._id, 'reject')}
                                  className="gap-2 text-red-600 hover:text-red-700"
                                >
                                  <XCircleIcon className="h-4 w-4" />
                                  Reject
                                </Button>
                              </>
                            )}
                            {listing.status === 'active' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleListingAction(listing._id, 'feature')}
                                className="gap-2"
                              >
                                <StarIcon className="h-4 w-4" />
                                Feature
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleListingAction(listing._id, 'delete')}
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlagIcon className="h-5 w-5" />
                  User Reports & Moderation
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reports.length === 0 ? (
                  <div className="text-center py-12">
                    <FlagIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No reports found</h3>
                    <p className="text-muted-foreground">All clear! No user reports requiring attention.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div key={report._id} className="border border-border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant={report.severity === 'high' ? 'destructive' : 'warning'}>
                              {report.severity || 'medium'} priority
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {report.category || 'General'}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(report.createdAt || Date.now()).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">Report: {report.title || 'Untitled'}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {report.description || 'No description provided'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Reported by: {report.reporterEmail || 'Anonymous'}
                          </p>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            Investigate
                          </Button>
                          <Button variant="outline" size="sm">
                            Dismiss
                          </Button>
                          <Button size="sm">
                            Take Action
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChartBarIcon className="h-5 w-5" />
                    User Growth
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">New Users (30 days)</span>
                      <span className="font-medium">+{dashboardStats.totalUsers * 0.1 || 0}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-primary rounded-full w-4/5" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Active Users</span>
                      <span className="font-medium">{Math.round(dashboardStats.totalUsers * 0.7) || 0}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-chart-2 rounded-full w-3/4" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">User Retention</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-chart-3 rounded-full w-5/6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CurrencyDollarIcon className="h-5 w-5" />
                    Revenue Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Monthly Revenue</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">$12,450</span>
                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-green-500 rounded-full w-4/5" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Commission Earned</span>
                      <span className="font-medium">$622.50</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-chart-4 rounded-full w-3/4" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Average Listing Price</span>
                      <span className="font-medium">$1,245</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-chart-5 rounded-full w-2/3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Platform Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">98.5%</div>
                    <div className="text-sm text-muted-foreground">User Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-chart-2">2.3s</div>
                    <div className="text-sm text-muted-foreground">Avg. Page Load</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-chart-3">94%</div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-chart-4">15K</div>
                    <div className="text-sm text-muted-foreground">Monthly Visits</div>
                  </div>
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