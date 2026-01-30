import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';
import { ChevronLeft, Upload } from 'lucide-react';

export function OriginalDegreeRequest() {
  const { navigateTo } = useNavigation();
  const [showTrackingDialog, setShowTrackingDialog] = useState(false);
  const [lastTracking, setLastTracking] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    fatherName: '',
    grandfatherName: '',
    firstNameAmharic: '',
    fatherNameAmharic: '',
    grandfatherNameAmharic: '',
    idNo: '',
    mobileNumber: '',
    email: '',
    admissionType: 'Regular',
    degreeType: 'Degree',
    department: '',
    otherDepartment: false,
    otherDepartmentText: '',
    yearOfGraduationEC: '',
    yearOfGraduationGC: '',
    serviceType: '',
    costSharingLetter: null as File | null,
    otherDocuments: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted', formData);
    
    // Validation
    if (!formData.firstName || !formData.fatherName || !formData.email) {
      toast.error('Please fill in all required fields');
      console.log('Validation failed');
      return;
    }

    // Generate a tracking number
    const trackingNumber = `DEG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    console.log('Generated tracking number:', trackingNumber);
    
    // Store in localStorage for tracking
    const requests = JSON.parse(localStorage.getItem('degreeRequests') || '[]');
    const newRequest = {
      id: trackingNumber,
      trackingNumber: trackingNumber,
      ...formData,
      submittedDate: new Date().toISOString(),
      status: 'Pending',
      type: 'Original Degree',
    };
    requests.push(newRequest);
    localStorage.setItem('degreeRequests', JSON.stringify(requests));
    
    console.log('Request saved to localStorage:', newRequest);
    console.log('All requests:', requests);

    // Save last tracking and show dialog with copy option
    sessionStorage.setItem('lastTrackingNumber', trackingNumber);
    setLastTracking(trackingNumber);
    setShowTrackingDialog(true);

    toast.success(`Request submitted successfully! Your tracking number is: ${trackingNumber}`, {
      duration: 5000,
    });

    // keep dialog open until user chooses to track or close
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
      firstNameAmharic: '',
      fatherNameAmharic: '',
      grandfatherNameAmharic: '',
      idNo: '',
      mobileNumber: '',
      email: '',
      admissionType: 'Regular',
      degreeType: 'Degree',
      department: '',
      otherDepartment: false,
      otherDepartmentText: '',
      yearOfGraduationEC: '',
      yearOfGraduationGC: '',
      serviceType: '',
      costSharingLetter: null,
      otherDocuments: null,
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
              className="w-full text-left px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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
            {/* Requirements Banner */}
            <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-8">
              <p className="text-blue-900 mb-2">
                Make sure to bring the following required documents for taking an original Degree.
              </p>
              <ol className="text-sm text-blue-800 space-y-1 ml-4">
                <li>1. A valid ID card/ passport, if via a legal delegate, evidence from DARA (Document Authentication and Registration Authority) and a valid ID of the delegate</li>
                
                <li>3. If sponsored by a University, a letter from the AVP office indicating the completion of the required service (original)</li>
                <li>4. If sponsored by the Ministry of Health, Letter from the Ministry or relevant Health Center (original)</li>
              </ol>
            </div>

            <h1 className="text-3xl mb-8 text-center">Original Degree Request Form</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information - English */}
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

              {/* Personal Information - Amharic (Optional fields) */}
              <div className="grid grid-cols-3 gap-6">

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
                >

                  <div className="flex items-center space-x-2">
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

              {/* Year of Graduation and Service Type */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label>Year Of Graduation</Label>
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
                  <Label htmlFor="serviceType">Service Type</Label>
                  <Select
                    value={formData.serviceType}
                    onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="---Select Service Type---" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="original">Original Degree</SelectItem>
                      <SelectItem value="namechange">Name Change</SelectItem>
                      <SelectItem value="replacement">Degree Replacement</SelectItem>
                    </SelectContent>
                  </Select>
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
