import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';
import { requestsAPI } from '../../services/api.js';

export function SupportingLetterRequest() {
  const { navigateTo } = useNavigation();
  const [formData, setFormData] = useState({
    firstName: '',
    fatherName: '',
    grandfatherName: '',
    idNo: '',
    mobileNumber: '',
    email: '',
    department: '',
    yearOfGraduationEC: '',
    yearOfGraduationGC: '',
    letterType: '',
    recipientName: '',
    recipientAddress: '',
    purposeOfLetter: '',
    additionalInfo: '',
  });
  const [showTrackingDialog, setShowTrackingDialog] = useState(false);
  const [lastTracking, setLastTracking] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.firstName || !formData.fatherName || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const payload: any = {
        documentType: 'Supporting Letter',
        firstName: formData.firstName,
        fatherName: formData.fatherName,
        grandfatherName: formData.grandfatherName,
        idNo: formData.idNo,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        department: formData.department,
        yearOfGraduationEC: formData.yearOfGraduationEC,
        yearOfGraduationGC: formData.yearOfGraduationGC,
        letterType: formData.letterType,
        recipientName: formData.recipientName,
        recipientAddress: formData.recipientAddress,
        purpose: formData.purposeOfLetter,
        additionalInfo: formData.additionalInfo,
      };

      const response = await requestsAPI.create(payload);
      const trackingNumber = response?.data?.trackingNumber || response?.data?.tracking || '';

      toast.success('Request submitted successfully!');
      if (trackingNumber) sessionStorage.setItem('lastTrackingNumber', trackingNumber);
      setLastTracking(trackingNumber);
      setShowTrackingDialog(true);
    } catch (err: any) {
      console.error('Submit supporting letter error', err);
      toast.error(err?.message || 'Failed to submit supporting letter');
    }
  };

  const handleCopyTracking = async () => {
    try {
      await navigator.clipboard.writeText(lastTracking);
      toast.success('Tracking number copied to clipboard');
    } catch (err) {
      console.error('Copy failed', err);
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleClear = () => {
    setFormData({
      firstName: '',
      fatherName: '',
      grandfatherName: '',
      idNo: '',
      mobileNumber: '',
      email: '',
      department: '',
      yearOfGraduationEC: '',
      yearOfGraduationGC: '',
      letterType: '',
      recipientName: '',
      recipientAddress: '',
      purposeOfLetter: '',
      additionalInfo: '',
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
              className="w-full text-left px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Supporting Letter
            </button>
            <button
              onClick={() => navigateTo('official-status')}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
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

          {/* Form Card */}
          <Card className="p-8">
            <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-8">
              <p className="text-blue-900">
                <strong>Note:</strong> Supporting letters are typically issued for employment verification, further studies, visa applications, or other official purposes. Processing time is 3-5 business days.
              </p>
            </div>

            <h1 className="text-3xl mb-8 text-center">Supporting Letter Request Form</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="fatherName">Father Name *</Label>
                  <Input
                    id="fatherName"
                    placeholder="Father Name"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="grandfatherName">Grandfather Name</Label>
                  <Input
                    id="grandfatherName"
                    placeholder="Grandfather Name"
                    value={formData.grandfatherName}
                    onChange={(e) => setFormData({ ...formData, grandfatherName: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="idNo">ID No.</Label>
                  <Input
                    id="idNo"
                    placeholder="ID No"
                    value={formData.idNo}
                    onChange={(e) => setFormData({ ...formData, idNo: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="mobileNumber">Mobile Number *</Label>
                  <Input
                    id="mobileNumber"
                    placeholder="Mobile No."
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                <Label htmlFor="department">Department *</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="---Select Department---" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cs">Software Engineering</SelectItem>
                    <SelectItem value="ee">Information Technology</SelectItem>
                    <SelectItem value="me">Information Technology Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Year of Graduation */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label>Year Of Graduation *</Label>
                  <div className="grid grid-cols-2 gap-4 mt-1">
                    <div>
                      <Input
                        placeholder="YYYY"
                        value={formData.yearOfGraduationEC}
                        onChange={(e) =>
                          setFormData({ ...formData, yearOfGraduationEC: e.target.value })
                        }
                      />
                      <span className="text-xs text-gray-500 mt-1 block">E.C.</span>
                    </div>
                    <div>
                      <Input
                        placeholder="YYYY"
                        value={formData.yearOfGraduationGC}
                        onChange={(e) =>
                          setFormData({ ...formData, yearOfGraduationGC: e.target.value })
                        }
                      />
                      <span className="text-xs text-gray-500 mt-1 block">G.C.</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="letterType">Letter Type *</Label>
                  <Select
                    value={formData.letterType}
                    onValueChange={(value) => setFormData({ ...formData, letterType: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="---Select Letter Type---" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employment">Employment Verification</SelectItem>
                      <SelectItem value="further-studies">Further Studies</SelectItem>
                      <SelectItem value="visa">Visa Application</SelectItem>
                      <SelectItem value="scholarship">Scholarship Application</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Recipient Information */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="recipientName">Recipient Name</Label>
                  <Input
                    id="recipientName"
                    placeholder="To whom the letter should be addressed"
                    value={formData.recipientName}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="recipientAddress">Recipient Organization/Institution</Label>
                  <Input
                    id="recipientAddress"
                    placeholder="Organization or institution name"
                    value={formData.recipientAddress}
                    onChange={(e) => setFormData({ ...formData, recipientAddress: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Purpose */}
              <div>
                <Label htmlFor="purposeOfLetter">Purpose of Letter *</Label>
                <Textarea
                  id="purposeOfLetter"
                  placeholder="Please explain the purpose and what should be included in the supporting letter"
                  value={formData.purposeOfLetter}
                  onChange={(e) => setFormData({ ...formData, purposeOfLetter: e.target.value })}
                  className="mt-1"
                  rows={4}
                  required
                />
              </div>

              {/* Additional Information */}
              <div>
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Any other relevant information or special requests"
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClear}
                  className="px-8"
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  className="px-8 bg-blue-600 hover:bg-blue-700"
                >
                  Submit
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
      {/* Tracking Dialog */}
      {showTrackingDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Request Submitted</h3>
            <p className="mb-4">Your tracking number:</p>
            <div className="flex items-center justify-between bg-gray-100 p-3 rounded mb-4">
              <code className="font-mono text-sm">{lastTracking}</code>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleCopyTracking}>Copy</Button>
                <Button size="sm" variant="outline" onClick={() => { setShowTrackingDialog(false); navigateTo('official-status'); }}>Track</Button>
              </div>
            </div>
            <div className="text-right">
              <Button variant="ghost" onClick={() => setShowTrackingDialog(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}