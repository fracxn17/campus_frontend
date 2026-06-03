import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Building, Mail, Phone, Linkedin, Globe, Edit, Award, Briefcase, GraduationCap, Users, Heart, MessageCircle, Share2, ExternalLink, Star, TrendingUp, Save, X, User } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { alumniData } from './AlumniDirectory';
import jayPhoto from '../assets/jay_prakash.jpg';
import { API_BASE_URL } from '../config/api';


function ImageWithFallback({ src, alt, className }) {
  const [error, setError] = useState(false);
  if (error) return <div className={`${className} bg-blue-100 flex items-center justify-center`}><User className="w-12 h-12 text-blue-500" /></div>;
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
}

function Counter({ target }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true;
        let current = 0;
        const increment = target / 40;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            setCount(target);
            clearInterval(timer);
          } else {
            setCount(Math.floor(current));
          }
        }, 30);
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

const AlumniProfile = () => {
  const { user, login } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const isOwnProfile = !id || id === String(user?.id);

  const [activeTab, setActiveTab] = useState('about');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // State to hold the profile currently being displayed
  const [displayedProfile, setDisplayedProfile] = useState(null);

  // Local state for profile form fields
  const [profileData, setProfileData] = useState({
    fullName: '',
    department: '',
    batch: '',
    degree: '',
    location: '',
    phone: '',
    rollNumber: '',
  });

  // Load profile dynamically based on own vs others
  useEffect(() => {
    if (isOwnProfile) {
      setDisplayedProfile(user);
    } else {
      // 1. Check in static mock alumniData
      const mockAlumni = alumniData.find(a => String(a.id) === id);
      if (mockAlumni) {
        setDisplayedProfile({
          id: mockAlumni.id,
          fullName: mockAlumni.name,
          image: mockAlumni.image,
          degree: mockAlumni.designation,
          company: mockAlumni.company,
          batch: mockAlumni.batch,
          department: mockAlumni.department,
          location: mockAlumni.location,
          email: mockAlumni.name.toLowerCase().replace(/\s+/g, '') + '@company.com',
          phone: '',
          rollNumber: '',
        });
      } else {
        // 2. Fetch from the server
        const fetchAlumnus = async () => {
          setLoading(true);
          try {
            const response = await fetch(`${API_BASE_URL}/api/users/${id}`);
            const data = await response.json();
            if (data.success) {
              setDisplayedProfile(data.user);
            } else {
              setErrorMsg(data.message || 'Profile not found.');
            }
          } catch (err) {
            setErrorMsg('Failed to load profile details.');
          } finally {
            setLoading(false);
          }
        };
        fetchAlumnus();
      }
    }
  }, [id, isOwnProfile, user]);

  // Sync profile fields from Auth Context on mount/update (only for own profile)
  useEffect(() => {
    if (isOwnProfile && user) {
      setProfileData({
        fullName: user.fullName || '',
        department: user.department || '',
        batch: user.batch || '',
        degree: user.degree || '',
        location: user.location || '',
        phone: user.phone || '',
        rollNumber: user.rollNumber || '',
      });
    }
  }, [user, isOwnProfile]);

  const tabs = [
    { id: 'about', label: 'About', icon: Users },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'activity', label: 'Activity', icon: TrendingUp },
  ];

  const skills = [
    { name: 'JavaScript', level: 95 },
    { name: 'React', level: 90 },
    { name: 'Node.js', level: 85 },
    { name: 'Python', level: 80 },
    { name: 'Machine Learning', level: 70 },
    { name: 'System Design', level: 88 },
  ];

  const experiences = [
    {
      title: 'Senior Software Engineer',
      company: 'Google',
      location: 'Mountain View, CA',
      period: 'Jan 2021 - Present',
      description: 'Leading a team of 8 engineers building distributed systems for Google Cloud Platform. Improved system reliability by 40%.',
      current: true,
    },
    {
      title: 'Software Engineer',
      company: 'Microsoft',
      location: 'Redmond, WA',
      period: 'Jun 2018 - Dec 2020',
      description: 'Built scalable microservices for Azure DevOps. Contributed to open-source projects used by 10K+ developers.',
      current: false,
    },
  ];

  const achievements = [
    { title: 'Google Peer Bonus Award', year: '2023', desc: 'Recognized for exceptional contributions to Cloud Infrastructure' },
    { title: 'Best Paper - IEEE Conference', year: '2022', desc: 'Published research on distributed caching strategies' },
  ];

  const activities = [
    { type: 'post', text: 'Shared insights on building scalable microservices', time: '2 days ago', likes: 42 },
    { type: 'event', text: 'Registered for Annual Alumni Meet 2026', time: '1 week ago', likes: 15 },
  ];

  const handleInputChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/user/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user?.id,
          ...profileData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMsg('Profile updated and saved successfully!');
        login(data.user); // update the auth context global state
        setTimeout(() => {
          setIsEditing(false);
          setSuccessMsg('');
        }, 1500);
      } else {
        setErrorMsg(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      setErrorMsg('Server connection failed. Could not save changes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-0">
      {/* Profile Header with animated banner */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8 benefit-card">
        <div className="h-48 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700"></div>
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)',
            }}
          ></div>
          <div className="absolute top-4 left-10 w-3 h-3 bg-white/20 rounded-full float-animation"></div>
          <div className="absolute top-12 right-20 w-2 h-2 bg-white/30 rounded-full float-animation" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="px-6 md:px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-6 text-center md:text-left">
              <div className="relative group mx-auto md:mx-0">
                <ImageWithFallback
                  src={displayedProfile?.image || jayPhoto}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {displayedProfile?.fullName || displayedProfile?.name || 'Jay Prakash Sharma'}
                </h1>
                <p className="text-lg text-gray-600 mb-2">
                  {displayedProfile?.degree || 'Alumnus'}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-500 text-sm">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {displayedProfile?.location || 'West Bengal, India'}
                  </span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    Class of {displayedProfile?.batch || '2021'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    {displayedProfile?.company ? `${displayedProfile.company} (${displayedProfile?.department || 'Computer Science'})` : (displayedProfile?.department || 'Computer Science')}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex flex-wrap justify-center gap-3 self-center md:self-auto mt-4 md:mt-0">
              {isOwnProfile ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 flex items-center gap-2 text-sm font-medium transition-all duration-300"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/messages', { state: { recipient: displayedProfile } })}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 flex items-center gap-2 text-sm font-medium transition-all duration-300"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </button>
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`px-5 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                      isFollowing
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className={`w-4 h-4 transition-all duration-300 ${isFollowing ? 'fill-red-500 text-red-500' : ''}`} />
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stats with animated counters - Responsive Scale Fix */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
            <div className="text-center group cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-all duration-300">
              <div className="text-2xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                <Counter target={127} />
              </div>
              <div className="text-xs text-gray-500">Connections</div>
            </div>
            <div className="text-center group cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-all duration-300">
              <div className="text-2xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                <Counter target={856} />
              </div>
              <div className="text-xs text-gray-500">Profile Views</div>
            </div>
            <div className="text-center group cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-all duration-300">
              <div className="text-2xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                <Counter target={15} />
              </div>
              <div className="text-xs text-gray-500">Posts</div>
            </div>
            <div className="text-center group cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-all duration-300">
              <div className="text-2xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                <Counter target={42} />
              </div>
              <div className="text-xs text-gray-500">Endorsements</div>
            </div>
          </div>
        </div>
      </div>

      {/* Editing Modal / Overlay Section for Profile Overwrite */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl animate-dropdown border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Student Profile</h3>
              <button onClick={() => setIsEditing(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={profileData.department}
                    onChange={handleInputChange}
                    placeholder="e.g. Computer Science"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Batch Year</label>
                  <input
                    type="text"
                    name="batch"
                    value={profileData.batch}
                    onChange={handleInputChange}
                    placeholder="e.g. 2024"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Degree</label>
                  <input
                    type="text"
                    name="degree"
                    value={profileData.degree}
                    onChange={handleInputChange}
                    placeholder="e.g. B.Tech"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Roll Number</label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={profileData.rollNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. CS202401"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Bengaluru, India"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-bold transition-all duration-300 shadow-md flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {loading ? 'Saving Changes...' : 'Save Profile Details'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 p-1 flex gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 benefit-card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 font-display">Contact Information</h2>
            <div className="space-y-3">
              <a href={`mailto:${displayedProfile?.email || 'student@test.com'}`} className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors group">
                <Mail className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm truncate">{displayedProfile?.email || 'student@test.com'}</span>
              </a>
              {displayedProfile?.phone && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{displayedProfile.phone}</span>
                </div>
              )}
              {displayedProfile?.rollNumber && (
                <div className="flex items-center gap-3 text-gray-600">
                  <GraduationCap className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">Roll No: {displayedProfile.rollNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills with progress bars */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 benefit-card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 font-display">Skills & Expertise</h2>
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                    <span className="text-sm text-gray-500">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000 ease-out"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Tabs */}
        <div className="md:col-span-2 space-y-6">
          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="space-y-6 fade-in visible">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 benefit-card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 font-display">About</h2>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {isOwnProfile ? (
                    `Passionate student currently pursuing learning in ${displayedProfile?.department || 'Computer Science'}. Eager to connect with the campus community, grow skills in modern engineering, and network with esteemed alumni globally.`
                  ) : (
                    `Experienced professional working in ${displayedProfile?.department || 'Computer Science'}. Interested in mentoring students, sharing industry knowledge, and connecting with fellow alumni.`
                  )}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 benefit-card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 font-display">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  Education
                </h2>
                <div className="border-l-2 border-blue-600 pl-4">
                  <h3 className="text-base font-semibold text-gray-900">{displayedProfile?.degree || 'B.Tech'} in {displayedProfile?.department || 'Computer Science'}</h3>
                  <p className="text-gray-600 text-sm">Bengal Institute of Technology • Class of {displayedProfile?.batch || '2021'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <div className="space-y-4 fade-in visible">
              {experiences.map((exp, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 benefit-card">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${exp.current ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <Briefcase className={`w-6 h-6 ${exp.current ? 'text-blue-600' : 'text-gray-500'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-gray-900">{exp.title}</h3>
                        {exp.current && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">Current</span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">{exp.company} • {exp.location}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{exp.period}</p>
                      <p className="text-gray-600 text-sm mt-2">{exp.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-4 fade-in visible">
              {achievements.map((achievement, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 benefit-card group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-100 transition-colors">
                      <Star className="w-6 h-6 text-yellow-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{achievement.title}</h3>
                      <p className="text-gray-400 text-xs">{achievement.year}</p>
                      <p className="text-gray-600 text-sm mt-1">{achievement.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-4 fade-in visible">
              {activities.map((activity, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 benefit-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-800 text-sm font-medium">{activity.text}</p>
                      <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <Heart className="w-4 h-4" />
                      {activity.likes}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlumniProfile;
