import React, { useState, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { NewsManagement } from './NewsManagement';
import { EventsManagement } from './EventsManagement';
import { 
  ChevronLeft, 
  Search, 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Eye,
  RefreshCw,
  BarChart3,
  Filter,
  LogOut,
  Check,
  X,
  Newspaper,
  Calendar,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

interface Request {
  id: string;
  firstName: string;
  fatherName?: string;
  email: string;
  mobileNumber?: string;
  submittedDate: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Rejected';
  type: string;
  [key: string]: any;
}

export function AdminDashboard() {
  const { navigateTo } = useNavigation();
  const { logout } = useAuth();
  const [allRequests, setAllRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'requests' | 'news' | 'events'>('requests');

  // Load all requests from backend on mount
  useEffect(() => {
    fetchAllRequests();
    fetchStats();
  }, []);

  // Filter requests when filters change
  useEffect(() => {
    filterRequests();
  }, [allRequests, searchQuery, statusFilter, typeFilter]);

  // Fetch all requests from backend admin endpoint
  const fetchAllRequests = async (params = {}) => {
    try {
      const { adminAPI } = await import('../../services/api.js');
      const res = await adminAPI.getAllRequests(params);
      const requestsData = res?.data || [];

      const mapped = requestsData.map((r: any) => ({
        id: r.id || r.trackingNumber,
        firstName: r.firstName,
        fatherName: r.fatherName,
        email: r.email,
        mobileNumber: r.mobileNumber,
        submittedDate: r.requestDate || r.submittedDate,
        status: r.requestStatus || r.status || 'Pending',
        type: r.documentType || r.type || 'Unknown',
        studentName: r.person?.firstName,
        bitsId: r.person?.bitsId || r.person?.user?.bitsId,
      }));

      // Sort newest first
      mapped.sort((a: any, b: any) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime());

      setAllRequests(mapped);
    } catch (err) {
      console.error('Failed to fetch admin requests', err);
    }
  };

  const fetchStats = async () => {
    try {
      const { adminAPI } = await import('../../services/api.js');
      const res = await adminAPI.getStats();
      if (res && res.data) {
        // If the API returns stats, we could map them to local UI; for now rely on computed stats from `allRequests`.
        // Optionally update state if the backend provides explicit counts.
      }
    } catch (err) {
      // ignore stats errors for now
    }
  };

  const filterRequests = () => {
    let filtered = [...allRequests];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(req => 
        req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === statusFilter);
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(req => req.type === typeFilter);
    }

    setFilteredRequests(filtered);
  };

  const updateRequestStatus = async (requestId: string, newStatus: 'Pending' | 'Processing' | 'Completed' | 'Rejected') => {
    try {
      const { requestsAPI } = await import('../../services/api.js');
      await requestsAPI.updateStatus(requestId, newStatus, 'Updated by admin');
      await fetchAllRequests();
      toast.success(`Request ${requestId} status updated to ${newStatus}`);
    } catch (err) {
      console.error('Failed to update request status', err);
      toast.error('Failed to update request status');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'Processing':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'Completed':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'Rejected':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-4 h-4" />;
      case 'Processing':
        return <RefreshCw className="w-4 h-4" />;
      case 'Completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // Calculate statistics
  const stats = {
    total: allRequests.length,
    pending: allRequests.filter(r => r.status === 'Pending').length,
    processing: allRequests.filter(r => r.status === 'Processing').length,
    completed: allRequests.filter(r => r.status === 'Completed').length,
    rejected: allRequests.filter(r => r.status === 'Rejected').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigateTo('home')}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Home
              </Button>
              <div className="h-8 w-px bg-gray-300" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => fetchAllRequests()}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  logout();
                  toast.success('Logged out successfully');
                  navigateTo('home');
                }}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex gap-8">
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  activeTab === 'requests'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="w-5 h-5" />
                Document Requests
              </button>
              <button
                onClick={() => setActiveTab('news')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  activeTab === 'news'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Newspaper className="w-5 h-5" />
                News Management
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  activeTab === 'events'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Calendar className="w-5 h-5" />
                Events Management
              </button>
            </nav>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'requests' && (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
                    <Clock className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Processing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-blue-600">{stats.processing}</div>
                    <RefreshCw className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Rejected</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
                    <XCircle className="w-8 h-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-green-600" />
                  <CardTitle>Filters</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="search" className="mb-2 block">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="search"
                        placeholder="Search by ID, name, or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="status-filter" className="mb-2 block">Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger id="status-filter">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="type-filter" className="mb-2 block">Request Type</Label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger id="type-filter">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Official Transcript">Official Transcript</SelectItem>
                        <SelectItem value="Original Degree">Original Degree</SelectItem>
                        <SelectItem value="Student Copy">Student Copy</SelectItem>
                        <SelectItem value="Temporary Degree">Temporary Degree</SelectItem>
                        <SelectItem value="Supporting Letter">Supporting Letter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Requests Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Requests</CardTitle>
                    <CardDescription>
                      Showing {filteredRequests.length} of {allRequests.length} requests
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Request ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Student Info</TableHead>
                        <TableHead>Applicant Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Submitted Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                            No requests found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell className="font-mono text-sm">{request.id}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-normal">
                                {request.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {request.studentName ? (
                                <div className="text-sm">
                                  <div className="text-gray-900">{request.studentName}</div>
                                  <div className="text-xs text-gray-500">{request.bitsId}</div>
                                </div>
                              ) : (
                                <div className="text-xs text-gray-400">No account</div>
                              )}
                            </TableCell>
                            <TableCell>
                              {request.firstName} {request.fatherName || ''}
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">{request.email}</TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {new Date(request.submittedDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusBadgeColor(request.status)}>
                                <span className="flex items-center gap-1">
                                  {getStatusIcon(request.status)}
                                  {request.status}
                                </span>
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                {request.status === 'Pending' && (
                                  <>
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                      onClick={() => {
                                        updateRequestStatus(request.id, 'Completed');
                                      }}
                                      title="Approve Request"
                                    >
                                      <Check className="w-4 h-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => {
                                        updateRequestStatus(request.id, 'Rejected');
                                      }}
                                      title="Reject Request"
                                    >
                                      <X className="w-4 h-4 mr-1" />
                                      Reject
                                    </Button>
                                  </>
                                )}
                                {request.status === 'Processing' && (
                                  <>
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                      onClick={() => {
                                        updateRequestStatus(request.id, 'Completed');
                                      }}
                                      title="Approve Request"
                                    >
                                      <Check className="w-4 h-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => {
                                        updateRequestStatus(request.id, 'Rejected');
                                      }}
                                      title="Reject Request"
                                    >
                                      <X className="w-4 h-4 mr-1" />
                                      Reject
                                    </Button>
                                  </>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setShowDetailsDialog(true);
                                  }}
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* News Management Tab */}
        {activeTab === 'news' && (
          <NewsManagement />
        )}

        {/* Events Management Tab */}
        {activeTab === 'events' && (
          <EventsManagement />
        )}
      </div>

      {/* Request Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              View and manage request information
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Quick Actions - Approve/Reject */}
              {(selectedRequest.status === 'Pending' || selectedRequest.status === 'Processing') && (
                <Card className="border-2 border-green-200 bg-green-50/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <Button
                        size="lg"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => {
                          updateRequestStatus(selectedRequest.id, 'Completed');
                          setShowDetailsDialog(false);
                        }}
                      >
                        <Check className="w-5 h-5 mr-2" />
                        Approve Request
                      </Button>
                      <Button
                        size="lg"
                        variant="destructive"
                        className="flex-1"
                        onClick={() => {
                          updateRequestStatus(selectedRequest.id, 'Rejected');
                          setShowDetailsDialog(false);
                        }}
                      >
                        <X className="w-5 h-5 mr-2" />
                        Reject Request
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Status Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Update Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Button
                      variant={selectedRequest.status === 'Pending' ? 'default' : 'outline'}
                      onClick={() => updateRequestStatus(selectedRequest.id, 'Pending')}
                      className="flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4" />
                      Pending
                    </Button>
                    <Button
                      variant={selectedRequest.status === 'Processing' ? 'default' : 'outline'}
                      onClick={() => updateRequestStatus(selectedRequest.id, 'Processing')}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Processing
                    </Button>
                    <Button
                      variant={selectedRequest.status === 'Completed' ? 'default' : 'outline'}
                      onClick={() => updateRequestStatus(selectedRequest.id, 'Completed')}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Completed
                    </Button>
                    <Button
                      variant={selectedRequest.status === 'Rejected' ? 'default' : 'outline'}
                      onClick={() => updateRequestStatus(selectedRequest.id, 'Rejected')}
                      className="flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Rejected
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Request Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Request Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Request ID</p>
                      <p className="font-mono text-sm font-medium">{selectedRequest.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Request Type</p>
                      <p className="font-medium">{selectedRequest.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Submitted Date</p>
                      <p className="font-medium">
                        {new Date(selectedRequest.submittedDate).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Current Status</p>
                      <Badge className={getStatusBadgeColor(selectedRequest.status)}>
                        {selectedRequest.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Applicant Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Applicant Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Full Name</p>
                      <p className="font-medium">
                        {selectedRequest.firstName} {selectedRequest.fatherName || ''} {selectedRequest.grandfatherName || ''}
                      </p>
                    </div>
                    {selectedRequest.idNo && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">ID Number</p>
                        <p className="font-medium">{selectedRequest.idNo}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Email</p>
                      <p className="font-medium">{selectedRequest.email}</p>
                    </div>
                    {selectedRequest.mobileNumber && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Mobile Number</p>
                        <p className="font-medium">{selectedRequest.mobileNumber}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Additional Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Additional Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(selectedRequest)
                      .filter(([key]) => !['id', 'firstName', 'fatherName', 'grandfatherName', 'email', 'mobileNumber', 'idNo', 'status', 'submittedDate', 'type'].includes(key))
                      .map(([key, value]) => {
                        if (value === null || value === undefined || value === '' || value === false) return null;
                        
                        return (
                          <div key={key}>
                            <p className="text-sm text-gray-600 mb-1 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <p className="font-medium">
                              {typeof value === 'boolean' ? 'Yes' : String(value)}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}