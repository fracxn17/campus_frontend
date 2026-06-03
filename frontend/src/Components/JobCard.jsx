import React from 'react';
import { Building, MapPin, DollarSign, Briefcase } from 'lucide-react';

const JobCard = ({ job }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-2xl text-gray-900 mb-2">{job.title}</h3>
          <div className="flex flex-wrap gap-4 text-gray-600 mb-3">
            <span className="flex items-center gap-1">
              <Building className="w-4 h-4" />
              {job.company}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </span>
            {job.salary && (
              <span className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {job.salary}
              </span>
            )}
          </div>
          <div className="flex gap-2 mb-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
              {job.type}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-600 text-xs rounded-full">
              {job.workMode}
            </span>
          </div>
        </div>
        <div className="text-right">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-2">
            Apply Now
          </button>
          {job.postedDate && (
            <p className="text-sm text-gray-500">Posted {job.postedDate}</p>
          )}
        </div>
      </div>

      <p className="text-gray-600 mb-4">{job.description}</p>

      {job.requirements && (
        <div className="mb-4">
          <h4 className="text-gray-900 mb-2">Requirements:</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            {job.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
      )}

      {job.postedBy && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Posted by <span className="text-blue-600">{job.postedBy}</span>
          </div>
          <button className="text-blue-600 hover:text-blue-700 text-sm">
            View Full Details →
          </button>
        </div>
      )}
    </div>
  );
};

export default JobCard;
