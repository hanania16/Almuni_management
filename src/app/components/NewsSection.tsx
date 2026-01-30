import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

const defaultNewsItems = [
  {
    category: 'Achievement',
    title: 'Alumni Win Prestigious Award',
    excerpt: 'Three of our distinguished alumni have been recognized with the National Excellence Award for their contributions to science and technology.',
    date: 'December 10, 2024',
  },
  {
    category: 'Community',
    title: 'New Alumni Chapter Opens in Silicon Valley',
    excerpt: 'We are excited to announce the opening of our newest alumni chapter, connecting tech professionals in the heart of innovation.',
    date: 'December 5, 2024',
  },
  {
    category: 'Education',
    title: 'Scholarship Fund Reaches $10M Milestone',
    excerpt: 'Thanks to generous alumni donations, our scholarship fund has reached an unprecedented milestone, supporting the next generation.',
    date: 'November 28, 2024',
  },
];

export function NewsSection() {
  // Load news from localStorage, fallback to default items
  const getNewsItems = () => {
    const stored = localStorage.getItem('newsItems');
    if (stored) {
      const items = JSON.parse(stored);
      return items.length > 0 ? items.slice(0, 3) : defaultNewsItems;
    }
    return defaultNewsItems;
  };

  const newsItems = getNewsItems();

  return (
    <section id="news" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl mb-4">Latest News</h2>
            <p className="text-xl text-gray-600">
              Stay updated with the latest from our alumni community.
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex items-center gap-2">
            View All News
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="inline-block px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm mb-4">
                  {item.category}
                </div>
                <h3 className="text-xl mb-3">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.excerpt}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{item.date}</span>
                  <Button variant="link" className="text-green-600 p-0 h-auto">
                    Read More →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Button variant="outline" className="flex items-center gap-2 mx-auto">
            View All News
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}