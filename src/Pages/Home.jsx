import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, ArrowRight, Award, Network, MessageCircle } from 'lucide-react';
import EventCard from '../Components/EventCard';
import campusImage from '../assets/campus.png';
import priyotaPhoto from '../assets/priyota_kundu.jpg';
import titasPhoto from '../assets/titas_karmakar.png';
import alumniMeetBanner from '../assets/alumni_meet_banner.jpg';

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
      date: 'Stay Tuned',
      location: 'College Campus',
      image: alumniMeetBanner,
      description: 'Join us for the biggest alumni gathering of the year with networking and celebrations.',
      category: 'Reunion',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative text-white min-h-[500px] flex flex-col justify-between"
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

        {/* Top left content */}
        <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-12 text-left z-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 hero-animate whitespace-nowrap overflow-x-auto scrollbar-none"
            style={{
              color: '#A35139',
              textShadow: '0 0 12px #ffffff, 0 0 6px #ffffff'
            }}>
            Connecting Alumni, Building Futures
          </h1>
        </div>

        {/* Middle Button */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="pointer-events-auto hero-animate-delay-2">
            <button
              onClick={() => navigate('/register')}
              className="glow-button px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 flex items-center gap-2 font-bold text-lg shadow-2xl transition-all duration-300"
            >
              Get Started <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Bottom space balance */}
        <div className="h-16 z-10"></div>
      </div>

      {/* Statistics Section */}
      <div ref={statsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className={`stat-card bg-white rounded-lg shadow-lg p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-[#A35139] hover:shadow-[0_0_20px_rgba(163,81,57,0.5)] border-2 border-transparent cursor-pointer fade-in delay-1 ${statsVisible ? 'visible' : ''}`}>
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-3 float-animation" />
            <div className="text-3xl font-bold text-gray-900 mb-1">
              <AnimatedCounter target="01" />
            </div>
            <div className="text-gray-600">Total Alumni</div>
          </div>
          <div className={`stat-card bg-white rounded-lg shadow-lg p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-[#A35139] hover:shadow-[0_0_20px_rgba(163,81,57,0.5)] border-2 border-transparent cursor-pointer fade-in delay-2 ${statsVisible ? 'visible' : ''}`}>
            <Network className="w-12 h-12 text-blue-600 mx-auto mb-3 float-animation" style={{ animationDelay: '0.5s' }} />
            <div className="text-3xl font-bold text-gray-900 mb-1">
              <AnimatedCounter target="01" />
            </div>
            <div className="text-gray-600">Active Members</div>
          </div>
          <div className={`stat-card bg-white rounded-lg shadow-lg p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-[#A35139] hover:shadow-[0_0_20px_rgba(163,81,57,0.5)] border-2 border-transparent cursor-pointer fade-in delay-3 ${statsVisible ? 'visible' : ''}`}>
            <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-3 float-animation" style={{ animationDelay: '1s' }} />
            <div className="text-3xl font-bold text-gray-900 mb-1">
              <AnimatedCounter target="01" />
            </div>
            <div className="text-gray-600">Events Conducted</div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div ref={benefitsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className={`text-4xl font-bold text-center text-gray-900 mb-12 fade-in ${benefitsVisible ? 'visible' : ''}`}>
          Why Join CampusLegacy?
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className={`benefit-card bg-white rounded-xl shadow-md p-8 border border-gray-100 fade-in delay-1 ${benefitsVisible ? 'visible' : ''}`}>
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Network className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Powerful Network</h3>
            <p className="text-gray-600">
              Connect with alumni across the globe, expand your professional network, and create meaningful relationships.
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
                src={priyotaPhoto}
                alt="Priyota Kundu"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Priyota Kundu</h4>
                <p className="text-gray-600 text-sm">Ex-Intern @Acceleratron | Class of 2022</p>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "CampusLegacy helped me connect with mentors who guided my entrepreneurial journey. The network I built here was instrumental in securing my first round of interview"
            </p>
          </div>
          <div className={`quote-card bg-white rounded-xl shadow-md p-8 border border-gray-100 slide-right delay-2 ${storiesVisible ? 'visible' : ''}`}>
            <div className="flex items-start gap-4 mb-4">
              <ImageWithFallback
                src={titasPhoto}
                alt="Titas Karmakar"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Titas Karmakar</h4>
                <p className="text-gray-600 text-sm">Ex-Intern @keysight Technology | Class of 2022</p>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "Through CampusLegacy, I connected with alumni who helped guide my career path. The networking opportunities and referrals made all the difference in my transition."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
