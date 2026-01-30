import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

const defaultEvents = [
  {
    title: 'Annual Alumni Reunion',
    date: 'June 15, 2024',
    location: 'Main Campus',
    attendees: '500+ Expected',
    image: 'https://images.unsplash.com/photo-1653250198948-1405af521dbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFkdWF0aW9uJTIwc3R1ZGVudHMlMjBjZWxlYnJhdGluZ3xlbnwxfHx8fDE3NjU4NzgxNzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    title: 'Networking Night',
    date: 'May 20, 2024',
    location: 'Downtown Hotel',
    attendees: '150+ Expected',
    image: 'https://images.unsplash.com/photo-1764726354739-1222d1ea5b63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBuZXR3b3JraW5nJTIwZXZlbnR8ZW58MXx8fHwxNzY1NzkwNzk4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    title: 'Career Development Workshop',
    date: 'April 10, 2024',
    location: 'Virtual Event',
    attendees: '200+ Registered',
    image: 'https://images.unsplash.com/photo-1680226425348-cedaf70ec06d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzY1ODIwMTc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

export function EventsSection() {
  // Load events from localStorage, fallback to default items
  const getEvents = () => {
    const stored = localStorage.getItem('eventsItems');
    if (stored) {
      const items = JSON.parse(stored);
      return items.length > 0 ? items.slice(0, 3) : defaultEvents;
    }
    return defaultEvents;
  };

  const events = getEvents();

  return (
    <section id="events" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4">Upcoming Events</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join us at our upcoming alumni events and reconnect with your community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {events.map((event, index) => (
            <Card key={index} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-48">
                <ImageWithFallback
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl mb-4">{event.title}</h3>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{event.attendees}</span>
                  </div>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Register Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg">
            View All Events
          </Button>
        </div>
      </div>
    </section>
  );
}