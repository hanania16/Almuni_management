import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useNavigation } from '@/app/context/NavigationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { FileText, LogOut, User, Calendar, ChevronLeft } from 'lucide-react';

type DocumentRequest = {
  id: string;
  type: string;
  trackingNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  bitsId: string;
};

export function StudentDashboard() {
  const { user, logout } = useAuth();
  const { navigateTo } = useNavigation();
  const [requests, setRequests] = useState<DocumentRequest[]>([]);

  useEffect(() => {
    if (user) {
      loadStudentRequests();
    }
  }, [user]);

  const loadStudentRequests = () => {
    // Load all document requests for the current student
    const allRequests: DocumentRequest[] = [];
    
    const requestTypes = [
      { key: 'transcriptRequests', type: 'Official Transcript' },
      { key: 'degreeRequests', type: 'Original Degree' },
      { key: 'studentCopyRequests', type: 'Student Copy' },
      { key: 'temporaryDegreeRequests', type: 'Temporary Degree' },
      { key: 'supportingLetterRequests', type: 'Supporting Letter' }
    ];

    requestTypes.forEach(({ key, type }) => {
      const data = localStorage.getItem(key);
      if (data) {
        const items = JSON.parse(data);
        const studentItems = items.filter((item: any) => item.studentId === user?.id);
        allRequests.push(...studentItems.map((item: any) => ({
          ...item,
          type
        })));
      }
    });

    // Sort by date (newest first)
    allRequests.sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime());
    setRequests(allRequests);
  };

  const handleLogout = () => {
    logout();
    navigateTo('home');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">Approved</span>;
      case 'rejected':
        return <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-800">Rejected</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Pending</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateTo('home')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Home
              </button>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">
            Welcome, {user?.name}
          </h1>
          <p className="text-gray-600">
            View and manage your document requests
          </p>
        </div>

        {/* User Info Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="text-gray-900">{user?.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">BITS ID</p>
                  <p className="text-gray-900">{user?.bitsId}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Requests</p>
                  <p className="text-2xl text-gray-900">{requests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Document Requests */}
        <Card>
          <CardHeader>
            <CardTitle>My Document Requests</CardTitle>
            <CardDescription>
              Track the status of your document requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No document requests yet</p>
                <Button
                  onClick={() => navigateTo('home')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Request Documents
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="w-5 h-5 text-gray-600" />
                          <h3 className="text-gray-900">{request.type}</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Submitted: {new Date(request.submittedDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Tracking #: </span>
                            <span className="font-mono text-gray-900">{request.trackingNumber}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigateTo('home')}>
            <CardContent className="pt-6">
              <FileText className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="text-gray-900 mb-1">Request New Document</h3>
              <p className="text-sm text-gray-600">Submit a new document request</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigateTo('official-status')}>
            <CardContent className="pt-6">
              <FileText className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="text-gray-900 mb-1">Track by Number</h3>
              <p className="text-sm text-gray-600">Track request using tracking number</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigateTo('contact')}>
            <CardContent className="pt-6">
              <User className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="text-gray-900 mb-1">Contact Support</h3>
              <p className="text-sm text-gray-600">Get help with your requests</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}