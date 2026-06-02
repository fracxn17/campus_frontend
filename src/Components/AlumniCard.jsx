import React, { useState } from 'react';
import { MapPin, Building, Mail, Linkedin, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function ImageWithFallback({ src, alt, className }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <GraduationCap className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}

const AlumniCard = ({ alumni }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <ImageWithFallback
            src={alumni.image}
            alt={alumni.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="text-xl text-gray-900 mb-1">{alumni.name}</h3>
            <p className="text-gray-600">{alumni.designation}</p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Building className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{alumni.company}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{alumni.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <GraduationCap className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{alumni.department} • Class of {alumni.batch}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate('/profile')}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            View Profile
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
            <Mail className="w-4 h-4" />
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
            <Linkedin className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlumniCard;
