import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

function ImageWithFallback({ src, alt, className }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <Calendar className="w-12 h-12 text-gray-400" />
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

const EventCard = ({ event }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
      <ImageWithFallback
        src={event.image}
        alt={event.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        {event.category && (
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
              {event.category}
            </span>
          </div>
        )}
        
        <h3 className="text-xl text-gray-900 mb-2">{event.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{event.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            {event.date}
          </div>
          {event.time && (
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Clock className="w-4 h-4 flex-shrink-0" />
              {event.time}
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            {event.location}
          </div>
          {event.attendees && (
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Users className="w-4 h-4 flex-shrink-0" />
              {event.attendees} Registered
            </div>
          )}
        </div>

        <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Register Now
        </button>
      </div>
    </div>
  );
};

export default EventCard;
