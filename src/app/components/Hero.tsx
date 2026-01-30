import React from 'react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Hero() {
  return (
    <section className="relative h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="/photo_2026-01-30_12-25-41.jpg"
          alt="University Campus"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        {/* <div className="mb-6">
          <ImageWithFallback
            src="logo.png"
            alt="BITS Alumni Logo"
            className="w-32 h-32 mx-auto rounded-full border-4 border-white shadow-lg"
          />
        </div> */}
        <h1 className="text-5xl md:text-6xl mb-6">
          Welcome to BITS Alumni
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-200">
          Stay connected. Make an impact. Build lifelong relationships.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8">
            Become a Member
          </Button>
          <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20 text-lg px-8">
            Explore Benefits
          </Button>
        </div>
      </div>
    </section>
  );
}