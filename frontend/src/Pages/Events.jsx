import React, { useState } from 'react';
import { Search } from 'lucide-react';
import EventCard from '../Components/EventCard';
import alumniMeetBanner from '../assets/alumni_meet_banner.jpg';

const upcomingEvents = [
  {
    id: 1,
    title: 'Annual Alumni Meet 2026',
    date: 'Stay Tuned',
    time: '10:00 AM - 5:00 PM',
    location: 'College Campus',
    attendees: 'xxxx',
    image: alumniMeetBanner,
    description: 'Join us for the biggest alumni gathering of the year with networking sessions, panel discussions, and celebrations.',
    category: 'Reunion',
  },
];

const Events = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredEvents = upcomingEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl text-gray-900 mb-2">Events</h1>
        <p className="text-gray-600">Stay connected through alumni events and activities</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="Reunion">Reunion</option>
              <option value="Workshop">Workshop</option>
              <option value="Summit">Summit</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl text-gray-900 mb-6">Upcoming Events</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
