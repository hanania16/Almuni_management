import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigation } from '../context/NavigationContext';

export function Footer() {
  const { navigateTo } = useNavigation();

  return (
    <footer id="contact" className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg mb-4">About Us</h3>
            <p className="text-sm mb-4">
              The BITS College Alumni Association connects graduates worldwide, fostering lifelong relationships 
              and supporting the college community.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Membership Benefits</a></li>
              <li><a href="#events" className="hover:text-white transition-colors">Events Calendar</a></li>
              <li><a href="#news" className="hover:text-white transition-colors">News & Stories</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Career Services</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white text-lg mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#document-services" className="hover:text-white transition-colors">Document Services</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Alumni Directory</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Give Back</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Volunteer</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>123 College Road<br />BITS Campus, Suite 456<br />City, State 12345</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>alumni@bitscollege.edu</span>
              </li>
            </ul>
            <Button 
              onClick={() => navigateTo('contact')}
              className="mt-4 bg-green-600 hover:bg-green-700 w-full"
            >
              Contact Us
            </Button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              © 2024 BITS College Alumni Association. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Accessibility</a>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); navigateTo('admin-login'); }}
                className="hover:text-white transition-colors opacity-50 hover:opacity-100"
              >
                Admin
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}