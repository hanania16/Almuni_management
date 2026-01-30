import React from 'react';
import { FileText, Download, CheckCircle, Clock, GraduationCap, FileCheck, FileBadge, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useNavigation } from '../context/NavigationContext';

const services = [
  {
    icon: FileText,
    title: 'Official Transcript',
    description: 'Applicants who want to send their official transcript to higher learning institution can submit their request.',
    processingTime: '3-5 business days',
    action: 'official-request',
  },
  {
    icon: GraduationCap,
    title: 'Original Degree',
    description: 'Submit Original Degree, Name Change and Degree Replacement Request',
    processingTime: '5-7 business days',
    action: 'original-degree',
  },
  {
    icon: Download,
    title: 'Student Copy',
    description: 'Submit Student Copy Requests',
    processingTime: '2-3 business days',
    action: 'student-copy',
  },
  {
    icon: FileCheck,
    title: 'Temporary Degree',
    description: 'Submit Temporary Degree Certificate Requests',
    processingTime: '5-7 business days',
    action: 'temporary-degree',
  },
  {
    icon: FileText,
    title: 'Supporting Letter',
    description: 'Request supporting letters for employment, further studies, visa applications, or scholarships',
    processingTime: '3-5 business days',
    action: 'supporting-letter',
  },
  {
    icon: Search,
    title: 'Track Alumni Request',
    description: 'Use your tracking number to check the status of your alumni Request',
    processingTime: 'Real-time',
    action: 'official-status',
  },
];

export function DocumentServices() {
  const { navigateTo } = useNavigation();
  
  return (
    <section id="document-services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl mb-6">Document Services</h2>
            <p className="text-xl text-gray-600 mb-8">
              Access all your important academic documents and certifications in one place. 
              Our streamlined process makes it easy to request and receive official documents.
            </p>

            <div className="space-y-6 mb-8">
              {services.map((service, index) => (
                <Card 
                  key={index} 
                  className={`hover:shadow-lg transition-shadow ${service.action ? 'cursor-pointer hover:border-green-500' : ''}`}
                  onClick={() => service.action && navigateTo(service.action)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <service.icon className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg mb-1">{service.title}</h3>
                        <p className="text-gray-600 mb-2">{service.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{service.processingTime}</span>
                          </div>
                          {service.action && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigateTo(service.action);
                              }}
                            >
                              {service.title === 'Track Alumni Request' ? 'Track Now' : 'Apply Now'} →
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => navigateTo('official-request')}
            >
              Request Documents
            </Button>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="photo_2026-01-30_12-25-19.jpg"
                alt="Library and Education"
                className="w-full h-[600px] object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-green-600 rounded-2xl -z-10"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-green-200 rounded-2xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}