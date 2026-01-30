import React from 'react';
import { Users, Calendar, Award, BookOpen, Briefcase, Globe } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const features = [
  {
    icon: Users,
    title: 'Networking Opportunities',
    description: 'Connect with fellow alumni across industries and generations.',
  },
  {
    icon: Calendar,
    title: 'Exclusive Events',
    description: 'Access to reunions, lectures, and networking events worldwide.',
  },
  {
    icon: Award,
    title: 'Career Development',
    description: 'Professional development resources and mentorship programs.',
  },
  {
    icon: BookOpen,
    title: 'Lifelong Learning',
    description: 'Continuing education courses and access to university resources.',
  },
  {
    icon: Briefcase,
    title: 'Job Board',
    description: 'Exclusive job postings and career opportunities from alumni employers.',
  },
  {
    icon: Globe,
    title: 'Global Community',
    description: 'Join alumni chapters in cities around the world.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4">Why Join Our Alumni Community</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the benefits and opportunities available exclusively to our alumni members.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}