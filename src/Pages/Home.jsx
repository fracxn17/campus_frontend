import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Briefcase, ArrowRight, Award, Network, MessageCircle } from 'lucide-react';
import EventCard from '../Components/EventCard';
import campusImage from '../assets/campus.png';

function ImageWithFallback({ src, alt, className }) {
  const [error, setError] = useState(false);

  if (error) {
    return <div className={`${className} bg-gray-200`}></div>;
  }

  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
}

// Hook for scroll-triggered animations
function useScrollAnimation() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}

// Animated counter component
function AnimatedCounter({ target, suffix = '+' }) {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useScrollAnimation();
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isVisible && !hasAnimated.current) {
      hasAnimated.current = true;
      const numTarget = parseInt(target.replace(/,/g, ''));
      const duration = 2000;
      const steps = 60;
      const increment = numTarget / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= numTarget) {
          setCount(numTarget);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isVisible, target]);

  const formatted = count.toLocaleString();
  return <span ref={ref}>{formatted}{suffix}</span>;
}

const Home = () => {
  const navigate = useNavigate();
  const [statsRef, statsVisible] = useScrollAnimation();
  const [benefitsRef, benefitsVisible] = useScrollAnimation();
  const [eventsRef, eventsVisible] = useScrollAnimation();
  const [storiesRef, storiesVisible] = useScrollAnimation();

  const upcomingEvents = [
    {
      id: 1,
      title: 'Annual Alumni Meet 2026',
      date: 'June 15, 2026',
      location: 'Main Campus Auditorium',
      image: 'https://images.unsplash.com/photo-1778876091264-1446d649156c?w=800',
      description: 'Join us for the biggest alumni gathering of the year with networking and celebrations.',
      category: 'Reunion',
    },
    {
      id: 2,
      title: 'Career Development Workshop',
      date: 'June 22, 2026',
      location: 'Virtual Event',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      description: 'Learn from industry leaders about career growth strategies and skill development.',
      category: 'Workshop',
    },
    {
      id: 3,
      title: 'Tech Innovation Summit',
      date: 'July 5, 2026',
      location: 'Tech Park Convention Center',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
      description: 'Explore the latest in technology and innovation with alumni tech entrepreneurs.',
      category: 'Summit',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative text-white min-h-[500px] flex items-center"
        style={{
          backgroundImage: `url(${campusImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 hero-overlay"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex justify-start">
          <div className="max-w-2xl text-left">
            <h1 className="text-5xl font-bold mb-6 hero-animate gradient-text">
              Connecting Alumni, Building Futures
            </h1>
            <p className="text-xl text-gray-200 mb-8 hero-animate-delay">
              Join thousands of alumni staying connected, networking, and creating opportunities together.
            </p>
            <div className="flex gap-4 hero-animate-delay-2">
              <button
                onClick={() => navigate('/register')}
                className="glow-button px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 flex items-center gap-2 font-semibold transition-all duration-300"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div ref={statsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className={`stat-card bg-white rounded-lg shadow-lg p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-500 border-2 border-transparent cursor-pointer fade-in delay-1 ${statsVisible ? 'visible' : ''}`}>
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-3 float-animation" />
            <div className="text-3xl font-bold text-gray-900 mb-1">
              <AnimatedCounter target="15,000" />
            </div>
            <div className="text-gray-600">Total Alumni</div>
          </div>
          <div className={`stat-card bg-white rounded-lg shadow-lg p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-500 border-2 border-transparent cursor-pointer fade-in delay-2 ${statsVisible ? 'visible' : ''}`}>
            <Network className="w-12 h-12 text-blue-600 mx-auto mb-3 float-animation" style={{ animationDelay: '0.5s' }} />
            <div className="text-3xl font-bold text-gray-900 mb-1">
              <AnimatedCounter target="8,500" />
            </div>
            <div className="text-gray-600">Active Members</div>
          </div>
          <div className={`stat-card bg-white rounded-lg shadow-lg p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-500 border-2 border-transparent cursor-pointer fade-in delay-3 ${statsVisible ? 'visible' : ''}`}>
            <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-3 float-animation" style={{ animationDelay: '1s' }} />
            <div className="text-3xl font-bold text-gray-900 mb-1">
              <AnimatedCounter target="250" />
            </div>
            <div className="text-gray-600">Events Conducted</div>
          </div>
          <div className={`stat-card bg-white rounded-lg shadow-lg p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-500 border-2 border-transparent cursor-pointer fade-in delay-4 ${statsVisible ? 'visible' : ''}`}>
            <Briefcase className="w-12 h-12 text-blue-600 mx-auto mb-3 float-animation" style={{ animationDelay: '1.5s' }} />
            <div className="text-3xl font-bold text-gray-900 mb-1">
              <AnimatedCounter target="1,200" />
            </div>
            <div className="text-gray-600">Job Opportunities</div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div ref={benefitsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className={`text-4xl font-bold text-center text-gray-900 mb-12 fade-in ${benefitsVisible ? 'visible' : ''}`}>
          Why Join CampusLegacy?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className={`benefit-card bg-white rounded-xl shadow-md p-8 border border-gray-100 fade-in delay-1 ${benefitsVisible ? 'visible' : ''}`}>
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Network className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Powerful Network</h3>
            <p className="text-gray-600">
              Connect with alumni across the globe, expand your professional network, and create meaningful relationships.
            </p>
          </div>
          <div className={`benefit-card bg-white rounded-xl shadow-md p-8 border border-gray-100 fade-in delay-2 ${benefitsVisible ? 'visible' : ''}`}>
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Briefcase className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Career Opportunities</h3>
            <p className="text-gray-600">
              Access exclusive job postings, internships, and mentorship programs from fellow alumni and partner companies.
            </p>
          </div>
          <div className={`benefit-card bg-white rounded-xl shadow-md p-8 border border-gray-100 fade-in delay-3 ${benefitsVisible ? 'visible' : ''}`}>
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Exclusive Events</h3>
            <p className="text-gray-600">
              Attend reunions, workshops, webinars, and networking events designed specifically for our alumni community.
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Events Preview */}
      <div className="bg-gray-50 py-20">
        <div ref={eventsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center mb-12 fade-in ${eventsVisible ? 'visible' : ''}`}>
            <h2 className="text-4xl font-bold text-gray-900">Upcoming Events</h2>
            <button
              onClick={() => navigate('/events')}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-2 font-semibold transition-all duration-300 hover:gap-3"
            >
              View All <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <div key={event.id} className={`tilt-card fade-in delay-${index + 1} ${eventsVisible ? 'visible' : ''}`}>
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div ref={storiesRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className={`text-4xl font-bold text-center text-gray-900 mb-12 fade-in ${storiesVisible ? 'visible' : ''}`}>
          Success Stories
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className={`quote-card bg-white rounded-xl shadow-md p-8 border border-gray-100 slide-left delay-1 ${storiesVisible ? 'visible' : ''}`}>
            <div className="flex items-start gap-4 mb-4">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300"
                alt="Sarah Johnson"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Sarah Johnson</h4>
                <p className="text-gray-600 text-sm">CEO, TechVentures Inc. | Class of 2015</p>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "CampusLegacy helped me connect with mentors who guided my entrepreneurial journey. The network I built here was instrumental in securing my first round of funding."
            </p>
          </div>
          <div className={`quote-card bg-white rounded-xl shadow-md p-8 border border-gray-100 slide-right delay-2 ${storiesVisible ? 'visible' : ''}`}>
            <div className="flex items-start gap-4 mb-4">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300"
                alt="Michael Chen"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Michael Chen</h4>
                <p className="text-gray-600 text-sm">Senior Data Scientist, Google | Class of 2018</p>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "Through CampusLegacy, I found my current role at Google. The job portal and alumni referrals made all the difference in my career transition."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
