import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ChevronLeft } from 'lucide-react';
import { requestsAPI } from '../../services/api.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface TranscriptRequest {
  id: string;
  fullName: string;
  submittedDate: string;
  status: string;
  documentType?: string;
}

export function OfficialTranscriptStatus() {
  const { navigateTo } = useNavigation();
  const [trackNo, setTrackNo] = useState('');
  const [searchResults, setSearchResults] = useState<TranscriptRequest[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleShowStatus = () => {
    setHasSearched(true);

    const effectiveTrack = trackNo || sessionStorage.getItem('lastTrackingNumber') || '';
    if (!effectiveTrack) {
      setSearchResults([]);
      return;
    }

    // First check localStorage for requests
    const localRequests = [
      ...JSON.parse(localStorage.getItem('transcriptRequests') || '[]'),
      ...JSON.parse(localStorage.getItem('degreeRequests') || '[]'),
      ...JSON.parse(localStorage.getItem('studentCopyRequests') || '[]'),
      ...JSON.parse(localStorage.getItem('temporaryDegreeRequests') || '[]'),
    ];

    const localRequest = localRequests.find(req => req.trackingNumber === effectiveTrack || req.id === effectiveTrack);

    if (localRequest) {
      setSearchResults([
        {
          id: localRequest.trackingNumber || localRequest.id,
          documentType: localRequest.type || 'Unknown',
          fullName: `${localRequest.firstName} ${localRequest.fatherName}`,
          submittedDate: localRequest.submittedDate,
          status: localRequest.status,
        },
      ]);
      return;
    }

    // If not found locally, call backend tracking endpoint
    requestsAPI
      .track(effectiveTrack)
      .then((res) => {
        const d = res?.data;
        if (d) {
          setSearchResults([
            {
              id: d.trackingNumber,
              documentType: d.documentType,
              fullName: d.applicantName || '',
              submittedDate: d.submittedDate,
              status: d.status,
            },
          ]);
        } else {
          setSearchResults([]);
        }
      })
      .catch((err) => {
        console.error('Track request error', err);
        setSearchResults([]);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg pt-32">
        <div className="p-4">
          <h3 className="text-lg mb-4 text-green-700">Alumni Records</h3>
          <div className="space-y-2">
            <button
              onClick={() => navigateTo('official-request')}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
            >
              Official Transcript
            </button>
            <button
              onClick={() => navigateTo('original-degree')}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
            >
              Original Degree
            </button>
            <button
              onClick={() => navigateTo('student-copy')}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
            >
              Student Copy
            </button>
            <button
              onClick={() => navigateTo('temporary-degree')}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
            >
              Temporary Degree
            </button>
            <button
              onClick={() => navigateTo('supporting-letter')}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
            >
              Supporting Letter
            </button>
            <button
              onClick={() => navigateTo('official-status')}
              className="w-full text-left px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Track Request
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-8">
          {/* Back Button */}
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Home
          </button>

          {/* Status Card */}
          <Card className="p-8">
            <h1 className="text-3xl mb-8 text-center">
              Document Request Tracking
            </h1>

            {/* Search Section */}
            <div className="mb-8">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <Label htmlFor="trackNo">Tracking Number</Label>
                  <Input
                    id="trackNo"
                    placeholder="Enter your tracking number (e.g., TRK-ABC123, DEG-XYZ789)"
                    value={trackNo}
                    onChange={(e) => setTrackNo(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={handleShowStatus}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Show Status
                </Button>
              </div>
            </div>

            {/* Results Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-green-100">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-900">Tracking ID</TableHead>
                    <TableHead className="font-semibold text-gray-900">Document Type</TableHead>
                    <TableHead className="font-semibold text-gray-900">Full Name</TableHead>
                    <TableHead className="font-semibold text-gray-900">Submitted Date</TableHead>
                    <TableHead className="font-semibold text-gray-900">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.length > 0 ? (
                    searchResults.map((request, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="font-mono text-sm">{request.id}</TableCell>
                        <TableCell>
                          <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                            {request.documentType}
                          </span>
                        </TableCell>
                        <TableCell>{request.fullName}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(request.submittedDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm ${
                              request.status === 'Approved' || request.status === 'Completed'
                                ? 'bg-green-100 text-green-800'
                                : request.status === 'Processing'
                                ? 'bg-yellow-100 text-yellow-800'
                                : request.status === 'Rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {request.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                        {hasSearched ? 'No records found for this tracking number' : 'Enter a tracking number and click "Show Status"'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}