import React, { useState } from 'react';
import { Search } from 'lucide-react';
import JobCard from '../Components/JobCard';

const jobListings = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'Google',
    location: 'Mountain View, CA',
    type: 'Full-time',
    workMode: 'Remote',
    salary: '$150,000 - $200,000',
    postedBy: 'Michael Chen',
    postedDate: '2 days ago',
    description: 'Join our team to build cutting-edge distributed systems serving millions of users.',
    requirements: ['5+ years experience', 'Strong Python/Java skills', 'Distributed systems experience'],
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'Microsoft',
    location: 'Seattle, WA',
    type: 'Full-time',
    workMode: 'Hybrid',
    salary: '$130,000 - $170,000',
    postedBy: 'Priya Patel',
    postedDate: '5 days ago',
    description: 'Lead product strategy and development for our cloud services platform.',
    requirements: ['3+ years PM experience', 'Technical background', 'Strong communication skills'],
  },
  {
    id: 3,
    title: 'UX Designer',
    company: 'Apple',
    location: 'Cupertino, CA',
    type: 'Full-time',
    workMode: 'On-site',
    salary: '$110,000 - $150,000',
    postedBy: 'Maria Garcia',
    postedDate: '1 week ago',
    description: 'Design beautiful and intuitive user experiences for next-generation products.',
    requirements: ['4+ years UX experience', 'Portfolio required', 'Figma expertise'],
  },
];

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || job.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl text-gray-900 mb-2">Job & Internship Portal</h1>
        <p className="text-gray-600">Explore career opportunities posted by alumni and partner companies</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs, companies..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'}
        </p>
      </div>

      <div className="space-y-4">
        {filteredJobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default Jobs;
