import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Grid, List, MapPin, Building, GraduationCap, Users, X, SlidersHorizontal } from 'lucide-react';
import AlumniCard from '../Components/AlumniCard';

const alumniData = [
  {
    id: 1,
    name: 'Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
    designation: 'CEO',
    company: 'TechVentures Inc.',
    batch: '2015',
    department: 'Computer Science',
    location: 'San Francisco, CA',
  },
];

const AlumniDirectory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filteredAlumni = alumniData.filter(alumni => {
    const matchesSearch = alumni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          alumni.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          alumni.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          alumni.designation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBatch = !selectedBatch || alumni.batch === selectedBatch;
    const matchesDepartment = !selectedDepartment || alumni.department === selectedDepartment;
    return matchesSearch && matchesBatch && matchesDepartment;
  });

  const activeFilters = [selectedBatch, selectedDepartment].filter(Boolean).length;

  const clearAllFilters = () => {
    setSelectedBatch('');
    setSelectedDepartment('');
    setSearchQuery('');
  };

  // Get unique departments and batches
  const departments = [...new Set(alumniData.map(a => a.department))];
  const batches = [...new Set(alumniData.map(a => a.batch))].sort();

  // Stats
  const stats = [
    { icon: Users, label: 'Total Alumni', value: alumniData.length },
    { icon: Building, label: 'Companies', value: new Set(alumniData.map(a => a.company)).size },
    { icon: MapPin, label: 'Locations', value: new Set(alumniData.map(a => a.location)).size },
    { icon: GraduationCap, label: 'Batches', value: batches.length },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with gradient */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 hero-animate">Alumni Directory</h1>
        <p className="text-gray-600 hero-animate-delay">
          Connect with {alumniData.length}+ alumni from around the world
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center gap-3 benefit-card cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Icon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100 transition-all duration-300">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className={`relative transition-all duration-300 ${isSearchFocused ? 'scale-[1.02]' : ''}`}>
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${isSearchFocused ? 'text-blue-500' : 'text-gray-400'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search by name, company, role, or location..."
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none transition-all duration-300 ${
                  isSearchFocused
                    ? 'border-blue-500 ring-2 ring-blue-100 shadow-lg shadow-blue-50'
                    : 'border-gray-300'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Toggle & View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                showFilters || activeFilters > 0
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilters > 0 && (
                <span className="w-5 h-5 bg-white text-blue-600 rounded-full text-xs flex items-center justify-center font-bold">
                  {activeFilters}
                </span>
              )}
            </button>

            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-300 ${
                  viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-300 ${
                  viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Filters */}
        <div className={`overflow-hidden transition-all duration-500 ${showFilters ? 'max-h-40 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Batch Year</label>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all duration-300"
              >
                <option value="">All Batches</option>
                {batches.map(batch => (
                  <option key={batch} value={batch}>{batch}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all duration-300"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={clearAllFilters}
                className="w-full px-4 py-2.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-all duration-300 font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filter Tags */}
      {activeFilters > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedBatch && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
              Batch: {selectedBatch}
              <button onClick={() => setSelectedBatch('')} className="hover:text-blue-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedDepartment && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
              {selectedDepartment}
              <button onClick={() => setSelectedDepartment('')} className="hover:text-blue-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-gray-600 text-sm">
          Showing <span className="font-semibold text-gray-900">{filteredAlumni.length}</span>{' '}
          {filteredAlumni.length === 1 ? 'alumnus' : 'alumni'}
        </p>
      </div>

      {/* Alumni Grid/List */}
      {filteredAlumni.length > 0 ? (
        <div className={
          viewMode === 'grid'
            ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredAlumni.map((alumni, index) => (
            <div
              key={alumni.id}
              className="fade-in visible benefit-card"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <AlumniCard alumni={alumni} viewMode={viewMode} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No alumni found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 text-sm font-medium"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default AlumniDirectory;
