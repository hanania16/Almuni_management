import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { navigateTo } = useNavigation();
  const { isAuthenticated, isAdmin, isStudent, user, logout } = useAuth();

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className='h-24 w-30 relative flex items-center'>
              <img src="logo.png" alt="" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              Home
            </a>

            <a href="#events" className="text-gray-700 hover:text-green-600 transition-colors">
              Events
            </a>

            <a href="#news" className="text-gray-700 hover:text-green-600 transition-colors">
              News
            </a>

            <a href="#document-services" className="text-gray-700 hover:text-green-600 transition-colors">
              Document Services
            </a>

            <a 
              href="#contact" 
              onClick={(e) => { e.preventDefault(); navigateTo('contact'); }}
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              Contact
            </a>

            {isAuthenticated && isAdmin && (
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); navigateTo('admin'); }}
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                Admin
              </a>
            )}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated && isAdmin && (
              <Button 
                variant="outline"
                onClick={() => navigateTo('admin')}
              >
                Admin Dashboard
              </Button>
            )}
            {isAuthenticated && isAdmin && (
              <Button 
                variant="outline"
                onClick={() => {
                  logout();
                  navigateTo('home');
                }}
              >
                Logout
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <div className="flex flex-col gap-3">
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); navigateTo('home'); setMobileMenuOpen(false); }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded"
              >
                Home
              </a>
              <a href="#events" className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded">
                Events
              </a>
              <a href="#news" className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded">
                News
              </a>
              <a href="#document-services" className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded">
                Document Services
              </a>
              <a 
                href="#contact" 
                onClick={(e) => { e.preventDefault(); navigateTo('contact'); setMobileMenuOpen(false); }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded"
              >
                Contact
              </a>
              {isAuthenticated && isAdmin && (
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); navigateTo('admin'); setMobileMenuOpen(false); }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded"
                >
                  Admin
                </a>
              )}
              <div className="flex flex-col gap-2 px-4 pt-2">
                {!isAuthenticated && (
                  <Button
                    variant="outline"
                    onClick={() => { navigateTo('login'); setMobileMenuOpen(false); }}
                  >
                    Login
                  </Button>
                )}
                {isAuthenticated && isAdmin && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => { navigateTo('admin'); setMobileMenuOpen(false); }}
                    >
                      Admin Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        logout();
                        navigateTo('home');
                        setMobileMenuOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}