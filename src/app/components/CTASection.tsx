import React from 'react';
import { Button } from './ui/button';

export function CTASection() {
  return (
    <section className="py-20 bg-green-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl text-white mb-6">
          Ready to Reconnect?
        </h2>
        <p className="text-xl text-green-100 mb-10">
          Join thousands of alumni who have already discovered the benefits of staying connected. 
          Your journey doesn't end at graduation—it evolves with us.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8">
            Become a Member Today
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white/10 text-lg px-8"
          >
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
}