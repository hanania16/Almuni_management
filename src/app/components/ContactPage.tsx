import React, { useState } from 'react';
import { Button } from './ui/button';
import { useNavigation } from '../context/NavigationContext';

export function ContactPage() {
  const { navigateTo } = useNavigation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div 
        className="relative h-64 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1687866394811-9fe40749c860?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc2NTk1MTg3MXww&ixlib=rb-4.1.0&q=80&w=1080')`
        }}
      >
        <div className="text-center text-white">
          <h1 className="text-5xl mb-3">Contact Us</h1>
          <p className="text-lg">
            <a href="#" className="hover:text-green-400 transition-colors" onClick={() => navigateTo('home')}>Home</a>
            <span className="mx-2">/</span>
            <span className="text-green-400">Contact Us</span>
          </p>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm mb-2">
              Email Address
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className="block text-sm mb-2">
              Email Address
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Message"
              required
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}