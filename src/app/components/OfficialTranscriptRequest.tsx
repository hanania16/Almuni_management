import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { ChevronLeft, Upload } from 'lucide-react';
import { requestsAPI } from '../../services/api.js';

export function OfficialTranscriptRequest() {
  const { navigateTo } = useNavigation();
  const [formData, setFormData] = useState({
    firstName: '',
    fatherName: '',
    grandfatherName: '',
    idNo: '',
    mobileNumber: '',
    email: '',
    admissionType: 'Regular',
    degreeType: 'Degree',
    department: '',
    otherDepartment: false,
    otherDepartmentText: '',
    studentStatus: 'Graduated',
    orderType: 'Local',
    sendWithinBITS: false,
    institutionName: '',
    institutionAddress: '',
    mailingAgent: '',
    country: '',
    costSharingLetter: null as File | null,
    otherDocuments: null as File | null,
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
      // Build payload (exclude File objects)
      const payload: any = {
        documentType: 'Official Transcript',
        firstName: formData.firstName,
        fatherName: formData.fatherName,
        grandfatherName: formData.grandfatherName,
        idNo: formData.idNo,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        admissionType: formData.admissionType,
        degreeType: formData.degreeType,
        department: formData.department,
        otherDepartment: formData.otherDepartment,
        otherDepartmentText: formData.otherDepartmentText,
        studentStatus: formData.studentStatus,
        orderType: formData.orderType,
        sendWithinBITS: formData.sendWithinBITS,
        institutionName: formData.institutionName,
        institutionAddress: formData.institutionAddress,
        mailingAgent: formData.mailingAgent,
        country: formData.country,
      };

      // Prepare files (attach a fieldName property so the API can identify them)
      const files: File[] = [] as any;
      if (formData.costSharingLetter) {
        // @ts-ignore - attach a custom property to the File object
        formData.costSharingLetter.fieldName = 'costSharingLetter';
        files.push(formData.costSharingLetter);
      }
      if (formData.otherDocuments) {
        // @ts-ignore
        formData.otherDocuments.fieldName = 'otherDocuments';
        files.push(formData.otherDocuments);
      }

      const response = await requestsAPI.create(payload, files);

      const trackingNumber = response?.data?.trackingNumber || response?.data?.tracking || '';

      // Store last tracking number for the status page to pick up
      if (trackingNumber) {
        sessionStorage.setItem('lastTrackingNumber', trackingNumber);
      }

      // Show tracking dialog and copy option
      setLastTracking(trackingNumber);
      setShowTrackingDialog(true);
      toast.success('Request submitted successfully!');
    } catch (err: any) {
      console.error('Submit request error:', err);
      toast.error(err?.message || 'Failed to submit request');
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
      admissionType: 'Regular',
      degreeType: 'Degree',
      department: '',
      otherDepartment: false,
      otherDepartmentText: '',
      studentStatus: 'Graduated',
      orderType: 'Local',
      sendWithinBITS: false,
      institutionName: '',
      institutionAddress: '',
      mailingAgent: '',
      country: '',
      costSharingLetter: null,
      otherDocuments: null,
    });
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg pt-32">
        <div className="p-4">
          <h3 className="text-lg mb-4 text-green-700">Alumni Records</h3>
          <div className="space-y-2">
            <button
              onClick={() => navigateTo('official-request')}
              className="w-full text-left px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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
            <h1 className="text-3xl mb-8 text-center">Official Transcript Request Form</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="fatherName">Father Name</Label>
                  <Input
                    id="fatherName"
                    placeholder="Father Name"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="grandfatherName">Grandfather Name (Optional)</Label>
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
                  <Label htmlFor="idNo">ID No. (Optional)</Label>
                  <Input
                    id="idNo"
                    placeholder="ID No"
                    value={formData.idNo}
                    onChange={(e) => setFormData({ ...formData, idNo: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="mobileNumber">Mobile Number</Label>
                  <Input
                    id="mobileNumber"
                    placeholder="Mobile No."
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Admission Type */}
              <div>
                <Label>Admission Type</Label>
                <RadioGroup
                  value={formData.admissionType}
                  onValueChange={(value) => setFormData({ ...formData, admissionType: value })}
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Regular" id="regular" />
                    <Label htmlFor="regular">Regular</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Evening" id="evening" />
                    <Label htmlFor="evening">Evening</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Summer" id="summer" />
                    <Label htmlFor="summer">Summer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Distance" id="distance" />
                    <Label htmlFor="distance">Distance</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Degree Type */}
              <div>
                <Label>Degree Type</Label>
                <RadioGroup
                  value={formData.degreeType}
                  onValueChange={(value) => setFormData({ ...formData, degreeType: value })}
                  className="flex gap-6 mt-2"
                >                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Degree" id="degree" />
                    <Label htmlFor="degree">Degree</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Master's" id="masters" />
                    <Label htmlFor="masters">Master's</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Department */}
              <div>
                <Label htmlFor="department">Department</Label>
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

                <div className="flex items-center space-x-2 mt-3">
                  <Checkbox
                    id="otherDepartment"
                    checked={formData.otherDepartment}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, otherDepartment: checked as boolean })
                    }
                  />
                  <Label htmlFor="otherDepartment">Other Department</Label>
                </div>

                {formData.otherDepartment && (
                  <Input
                    placeholder="Other"
                    value={formData.otherDepartmentText}
                    onChange={(e) =>
                      setFormData({ ...formData, otherDepartmentText: e.target.value })
                    }
                    className="mt-2"
                  />
                )}
              </div>

              {/* Student Status and Order Type */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label>Student Status</Label>
                  <RadioGroup
                    value={formData.studentStatus}
                    onValueChange={(value) => setFormData({ ...formData, studentStatus: value })}
                    className="flex gap-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Inactive" id="inactive" />
                      <Label htmlFor="inactive">Inactive</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Graduated" id="graduated" />
                      <Label htmlFor="graduated">Graduated</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Order Type</Label>
                  <RadioGroup
                    value={formData.orderType}
                    onValueChange={(value) => setFormData({ ...formData, orderType: value })}
                    className="flex gap-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Local" id="local" />
                      <Label htmlFor="local">Local</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="International" id="international" />
                      <Label htmlFor="international">International</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Legal delegate" id="legal" />
                      <Label htmlFor="legal">Legal delegate</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Send within BITS College */}
              <div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sendWithinBITS"
                    checked={formData.sendWithinBITS}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, sendWithinBITS: checked as boolean })
                    }
                  />
                  <Label htmlFor="sendWithinBITS">Official Transcript to be sent within BITS College</Label>
                </div>
              </div>

              {/* Institution Details */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="institutionName">Name of Institution</Label>
                  <Input
                    id="institutionName"
                    placeholder="Name of Institution"
                    value={formData.institutionName}
                    onChange={(e) =>
                      setFormData({ ...formData, institutionName: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="institutionAddress">Address of Institution</Label>
                  <Textarea
                    id="institutionAddress"
                    placeholder="Delivery Address"
                    value={formData.institutionAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, institutionAddress: e.target.value })
                    }
                    className="mt-1"
                    rows={1}
                  />
                </div>
                <div>
                  <Label htmlFor="mailingAgent">Mailing Agent</Label>
                  <Select
                    value={formData.mailingAgent}
                    onValueChange={(value) => setFormData({ ...formData, mailingAgent: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="---Select Mailing Agent---" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dhl">DHL</SelectItem>
                      <SelectItem value="fedex">FedEx</SelectItem>
                      <SelectItem value="ups">UPS</SelectItem>
                      <SelectItem value="ethiopian">Ethiopian Postal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Country */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="Destination Country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* File Uploads */}
              <div className="grid grid-cols-2 gap-6">


                <div>
                  <Label htmlFor="otherDocuments" className="text-red-600">
                    Other documents
                  </Label>
                  <div className="mt-2 flex items-center gap-2">
                    <Input
                      id="otherDocuments"
                      type="file"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          otherDocuments: e.target.files?.[0] || null,
                        })
                      }
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('otherDocuments')?.click()}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                    <span className="text-sm text-gray-500">
                      {formData.otherDocuments?.name || 'No file chosen'}
                    </span>
                  </div>
                </div>
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