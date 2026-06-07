import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin, Building, Mail, Phone, Edit, Award, Briefcase,
  GraduationCap, Users, Heart, MessageCircle, Star, TrendingUp,
  Save, X, User, BookOpen, BadgeCheck, Calendar
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { alumniData } from './AlumniDirectory';
import jayPhoto from '../assets/jay_prakash.jpg';
import defaultMale   from '../assets/default_male.png';
import defaultFemale from '../assets/default_female.png';
import { API_BASE_URL } from '../config/api';

/* ─── Pick the right default avatar ──────────────────────────────────── */
function getDefaultAvatar(gender) {
  if (gender === 'female') return defaultFemale;
  if (gender === 'male')   return defaultMale;
  return defaultMale; // fallback for 'other' or unknown
}

/* ─── Shared helpers ─────────────────────────────────────────────────── */
function ImageWithFallback({ src, fallbackSrc, alt, className }) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  // If src prop changes (e.g. on profile reload) reset it
  useEffect(() => { setImgSrc(src || fallbackSrc); }, [src, fallbackSrc]);
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
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
          if (current >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(current));
        }, 30);
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString()}</span>;
}

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 text-gray-600">
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-sm text-gray-700 font-medium">{value}</p>
      </div>
    </div>
  );
}

/* ─── ALUMNI PROFILE DISPLAY ─────────────────────────────────────────── */
function AlumniDisplay({ profile, isOwnProfile, onEdit }) {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('about');

  const tabs = [
    { id: 'about',        label: 'About',        icon: Users },
    { id: 'experience',   label: 'Experience',    icon: Briefcase },
    { id: 'achievements', label: 'Achievements',  icon: Award },
    { id: 'activity',     label: 'Activity',      icon: TrendingUp },
  ];

  const mockExperiences = [
    {
      title: profile.designation || 'Software Engineer',
      company: profile.company || 'Company',
      location: profile.location || '',
      period: `Class of ${profile.batch || 'N/A'} · Present`,
      description: `Working as ${profile.designation || 'a professional'} at ${profile.company || 'a leading company'}.`,
      current: true,
    },
  ];

  const mockAchievements = [
    { title: 'Campus Legacy Alumni', year: profile.batch || 'N/A', desc: `${profile.degree || 'Graduate'} in ${profile.department || 'Engineering'} from Bengal Institute of Technology.` },
  ];

  const mockActivities = [
    { type: 'event', text: 'Connected with the Alumni Network', time: 'Recently', likes: 12 },
  ];

  return (
    <>
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 benefit-card">
        {/* Banner */}
        <div className="h-44 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700" />
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)' }} />
          <div className="absolute top-4 left-10 w-3 h-3 bg-white/20 rounded-full float-animation" />
          <div className="absolute top-12 right-20 w-2 h-2 bg-white/30 rounded-full float-animation" style={{ animationDelay: '1s' }} />
          {/* Role badge */}
          <div className="absolute top-4 right-4">
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/30 uppercase tracking-wide">
              Alumni
            </span>
          </div>
        </div>

        <div className="px-6 md:px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-5">
              {/* Avatar */}
              <div className="relative group mx-auto md:mx-0">
                <ImageWithFallback
                  src={profile.image}
                  fallbackSrc={getDefaultAvatar(profile.gender)}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
              </div>

              <div className="mb-4 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{profile.fullName || 'Alumni Member'}</h1>
                <p className="text-base text-gray-600 mb-1">{profile.designation || 'Professional'}{profile.company ? ` @ ${profile.company}` : ''}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 text-gray-500 text-sm">
                  {profile.location && (
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{profile.location}</span>
                  )}
                  {profile.batch && (
                    <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" />Class of {profile.batch}</span>
                  )}
                  {profile.department && (
                    <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" />{profile.department}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap justify-center gap-3 mt-4 md:mt-0">
              {isOwnProfile ? (
                <button
                  onClick={onEdit}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 flex items-center gap-2 text-sm font-medium transition-all duration-300"
                >
                  <Edit className="w-4 h-4" /> Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/messages', { state: { recipient: profile } })}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium transition-all duration-300"
                  >
                    <MessageCircle className="w-4 h-4" /> Message
                  </button>
                  <button
                    onClick={() => setIsFollowing(v => !v)}
                    className={`px-5 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-300 ${isFollowing ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                  >
                    <Heart className={`w-4 h-4 ${isFollowing ? 'fill-red-500 text-red-500' : ''}`} />
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
            {[
              { label: 'Connections', target: 127 }, { label: 'Profile Views', target: 856 },
              { label: 'Posts', target: 15 }, { label: 'Endorsements', target: 42 },
            ].map(s => (
              <div key={s.label} className="text-center group cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-all duration-300">
                <div className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors"><Counter target={s.target} /></div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-1 flex gap-1 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}
            >
              <Icon className="w-4 h-4" />{tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Contact */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 benefit-card space-y-3">
            <h2 className="text-base font-bold text-gray-900 mb-4">Contact</h2>
            <InfoRow icon={Mail}  label="Email"    value={profile.email} />
            <InfoRow icon={Phone} label="Phone"    value={profile.phone} />
            <InfoRow icon={MapPin} label="Location" value={profile.location} />
          </div>

          {/* Professional details */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 benefit-card space-y-3">
            <h2 className="text-base font-bold text-gray-900 mb-4">Professional</h2>
            <InfoRow icon={Building}    label="Company"     value={profile.company} />
            <InfoRow icon={Briefcase}   label="Designation" value={profile.designation} />
            <InfoRow icon={BookOpen}    label="Degree"      value={profile.degree} />
            <InfoRow icon={GraduationCap} label="Department" value={profile.department} />
            <InfoRow icon={Calendar}    label="Batch"       value={profile.batch ? `Class of ${profile.batch}` : ''} />
          </div>
        </div>

        {/* Right column */}
        <div className="md:col-span-2 space-y-6">
          {activeTab === 'about' && (
            <div className="space-y-6 fade-in visible">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 benefit-card">
                <h2 className="text-base font-bold text-gray-900 mb-3">About</h2>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Experienced professional working in {profile.department || 'their field'}. Passionate about mentoring students, sharing industry knowledge, and connecting with fellow alumni from Bengal Institute of Technology.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 benefit-card">
                <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" /> Education
                </h2>
                <div className="border-l-2 border-blue-600 pl-4">
                  <h3 className="text-sm font-semibold text-gray-900">{profile.degree || 'B.Tech'} in {profile.department || 'Engineering'}</h3>
                  <p className="text-gray-500 text-sm">Bengal Institute of Technology · Class of {profile.batch || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-4 fade-in visible">
              {mockExperiences.map((exp, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 benefit-card">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${exp.current ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <Briefcase className={`w-6 h-6 ${exp.current ? 'text-blue-600' : 'text-gray-500'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-900">{exp.title}</h3>
                        {exp.current && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">Current</span>}
                      </div>
                      <p className="text-gray-600 text-sm">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{exp.period}</p>
                      <p className="text-gray-600 text-sm mt-2">{exp.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-4 fade-in visible">
              {mockAchievements.map((ach, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 benefit-card group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-100 transition-colors">
                      <Star className="w-6 h-6 text-yellow-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{ach.title}</h3>
                      <p className="text-gray-400 text-xs">{ach.year}</p>
                      <p className="text-gray-600 text-sm mt-1">{ach.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4 fade-in visible">
              {mockActivities.map((act, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 benefit-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-800 text-sm font-medium">{act.text}</p>
                      <p className="text-gray-400 text-xs mt-1">{act.time}</p>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <Heart className="w-4 h-4" />{act.likes}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ─── STUDENT PROFILE DISPLAY ────────────────────────────────────────── */
function StudentDisplay({ profile, isOwnProfile, onEdit }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview',  label: 'Overview',  icon: Users },
    { id: 'academic',  label: 'Academic',   icon: GraduationCap },
    { id: 'activity',  label: 'Activity',   icon: TrendingUp },
  ];

  return (
    <>
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 benefit-card">
        {/* Banner — teal/green for students */}
        <div className="h-44 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-600" />
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)' }} />
          <div className="absolute top-4 left-10 w-3 h-3 bg-white/20 rounded-full float-animation" />
          <div className="absolute top-12 right-20 w-2 h-2 bg-white/30 rounded-full float-animation" style={{ animationDelay: '0.7s' }} />
          {/* Role badge */}
          <div className="absolute top-4 right-4">
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/30 uppercase tracking-wide">
              Student
            </span>
          </div>
        </div>

        <div className="px-6 md:px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-5">
              {/* Avatar */}
              <div className="relative group mx-auto md:mx-0">
                <ImageWithFallback
                  src={profile.image}
                  fallbackSrc={getDefaultAvatar(profile.gender)}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
              </div>

              <div className="mb-4 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{profile.fullName || 'Student'}</h1>
                <p className="text-base text-gray-600 mb-1">
                  {profile.degree || 'Undergraduate'} Student
                  {profile.department ? ` · ${profile.department}` : ''}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 text-gray-500 text-sm">
                  {profile.rollNumber && (
                    <span className="flex items-center gap-1"><BadgeCheck className="w-4 h-4" />Roll No: {profile.rollNumber}</span>
                  )}
                  {profile.batch && (
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Batch {profile.batch}</span>
                  )}
                  {profile.location && (
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{profile.location}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap justify-center gap-3 mt-4 md:mt-0">
              {isOwnProfile ? (
                <button
                  onClick={onEdit}
                  className="px-5 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-200 flex items-center gap-2 text-sm font-medium transition-all duration-300"
                >
                  <Edit className="w-4 h-4" /> Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => navigate('/messages', { state: { recipient: profile } })}
                  className="px-5 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2 text-sm font-medium transition-all duration-300"
                >
                  <MessageCircle className="w-4 h-4" /> Message
                </button>
              )}
            </div>
          </div>

          {/* Stats — student-appropriate */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
            {[
              { label: 'Connections', target: 24 }, { label: 'Profile Views', target: 143 },
              { label: 'Events Joined', target: 5 }, { label: 'Posts', target: 3 },
            ].map(s => (
              <div key={s.label} className="text-center group cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-all duration-300">
                <div className="text-2xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors"><Counter target={s.target} /></div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-1 flex gap-1 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === tab.id ? 'bg-teal-600 text-white shadow-lg shadow-teal-200' : 'text-gray-600 hover:bg-gray-50 hover:text-teal-600'}`}
            >
              <Icon className="w-4 h-4" />{tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Contact info */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 benefit-card space-y-3">
            <h2 className="text-base font-bold text-gray-900 mb-4">Contact</h2>
            <InfoRow icon={Mail}  label="Email"    value={profile.email} />
            <InfoRow icon={Phone} label="Phone"    value={profile.phone} />
            <InfoRow icon={MapPin} label="Location" value={profile.location} />
          </div>

          {/* Academic details */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 benefit-card space-y-3">
            <h2 className="text-base font-bold text-gray-900 mb-4">Academic Details</h2>
            <InfoRow icon={BookOpen}     label="Degree"      value={profile.degree} />
            <InfoRow icon={Building}     label="Department"  value={profile.department} />
            <InfoRow icon={BadgeCheck}   label="Roll Number" value={profile.rollNumber} />
            <InfoRow icon={Calendar}     label="Batch"       value={profile.batch} />
          </div>
        </div>

        {/* Right column */}
        <div className="md:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6 fade-in visible">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 benefit-card">
                <h2 className="text-base font-bold text-gray-900 mb-3">About Me</h2>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Passionate student currently pursuing {profile.degree || 'a degree'} in {profile.department || 'Engineering'} at Bengal Institute of Technology. Eager to connect with the campus community, grow technical skills, and network with esteemed alumni worldwide.
                </p>
              </div>

              {/* Profile completion nudge — only for own profile */}
              {isOwnProfile && !profile.rollNumber && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <BadgeCheck className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-800 text-sm">Complete your profile</h3>
                    <p className="text-amber-700 text-xs mt-1">Add your Roll Number, Department, and Batch to unlock all features and be discoverable by alumni.</p>
                    <button onClick={onEdit} className="mt-3 px-4 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors">
                      Update Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'academic' && (
            <div className="space-y-6 fade-in visible">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 benefit-card">
                <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-teal-600" /> Education
                </h2>
                <div className="border-l-2 border-teal-500 pl-4">
                  <h3 className="text-sm font-semibold text-gray-900">{profile.degree || 'B.Tech'} · {profile.department || 'Engineering'}</h3>
                  <p className="text-gray-500 text-sm">Bengal Institute of Technology</p>
                  {profile.batch && <p className="text-gray-400 text-xs mt-1">Batch {profile.batch}</p>}
                  {profile.rollNumber && <p className="text-gray-400 text-xs">Roll No: {profile.rollNumber}</p>}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 benefit-card">
                <h2 className="text-base font-bold text-gray-900 mb-4">Enrolled Courses</h2>
                <p className="text-sm text-gray-500 italic">Course details not added yet.</p>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4 fade-in visible">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 benefit-card text-center">
                <TrendingUp className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No recent activity yet.<br />Start by connecting with alumni and attending events!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ─── EDIT MODAL (role-aware) ────────────────────────────────────────── */
function EditModal({ user, isAlumni, onClose, onSaved }) {
  const { login } = useAuth();
  const [form, setForm] = useState({
    fullName:    user?.fullName    || '',
    phone:       user?.phone       || '',
    location:    user?.location    || '',
    department:  user?.department  || '',
    batch:       user?.batch       || '',
    degree:      user?.degree      || '',
    rollNumber:  user?.rollNumber  || '',
    gender:      user?.gender      || '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg]   = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const labelledInput = (label, name, placeholder = '') => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
      <input
        type="text" name={name} value={form[name]} onChange={handle}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );

  const save = async e => {
    e.preventDefault();
    if (!form.fullName.trim()) { setErrorMsg('Full name is required.'); return; }
    setLoading(true); setErrorMsg(''); setSuccessMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user?.id, ...form }),
      });
      const data = await res.json();
      if (data.success) {
        login(data.user);
        setSuccessMsg('Profile saved!');
        setTimeout(() => { onSaved(); onClose(); }, 1200);
      } else {
        setErrorMsg(data.message || data.detail || 'Failed to save.');
      }
    } catch {
      setErrorMsg('Cannot reach server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl animate-dropdown border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            Edit {isAlumni ? 'Alumni' : 'Student'} Profile
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {errorMsg   && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{errorMsg}</div>}
        {successMsg && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">{successMsg}</div>}

        <form onSubmit={save} className="space-y-4">
          {/* Gender picker */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Gender</label>
            <div className="flex gap-2">
              {[{v:'male',l:'♂ Male'},{v:'female',l:'♀ Female'},{v:'other',l:'◎ Other'}].map(g => (
                <button
                  key={g.v} type="button"
                  onClick={() => setForm(f => ({...f, gender: g.v}))}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                    form.gender === g.v
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                      : 'border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                  }`}
                >{g.l}</button>
              ))}
            </div>
          </div>

          {/* Common fields */}
          {labelledInput('Full Name',    'fullName',   'Your full name')}
          {labelledInput('Phone Number', 'phone',      '+91 9876543210')}
          {labelledInput('Location',     'location',   'City, Country')}

          <div className="grid grid-cols-2 gap-4">
            {labelledInput('Department', 'department', 'e.g. Computer Science')}
            {labelledInput('Batch Year', 'batch',      'e.g. 2024')}
          </div>

          {/* Student-only fields */}
          {!isAlumni && (
            <div className="grid grid-cols-2 gap-4">
              {labelledInput('Degree',      'degree',      'e.g. B.Tech')}
              {labelledInput('Roll Number', 'rollNumber',  'e.g. CS202401')}
            </div>
          )}

          {/* Alumni-only field */}
          {isAlumni && (
            labelledInput('Degree / Qualification', 'degree', 'e.g. B.Tech, M.Tech')
          )}

          <button
            type="submit" disabled={loading}
            className="w-full mt-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-bold transition-all duration-300 shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Saving…' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT (router) ─────────────────────────────────────────── */
const AlumniProfile = () => {
  const { user } = useAuth();
  const { id }   = useParams();
  const navigate = useNavigate();

  // Determine whose profile to show
  const isOwnProfile = !id || id === String(user?.id);

  const [displayedProfile,  setDisplayedProfile]  = useState(null);
  const [loading,           setLoading]            = useState(true);
  const [errorMsg,          setErrorMsg]           = useState('');
  const [isEditing,         setIsEditing]          = useState(false);

  /* Load profile data */
  useEffect(() => {
    if (isOwnProfile) {
      setDisplayedProfile(user);
      setLoading(false);
    } else {
      // Check static mock data first
      const mock = alumniData.find(a => String(a.id) === id);
      if (mock) {
        setDisplayedProfile({
          id:          mock.id,
          fullName:    mock.name,
          image:       mock.image,
          degree:      mock.designation,
          company:     mock.company,
          designation: mock.designation,
          batch:       mock.batch,
          department:  mock.department,
          location:    mock.location,
          email:       mock.name.toLowerCase().replace(/\s+/g, '') + '@company.com',
          phone:       '',
          rollNumber:  '',
          role:        'alumni',   // mock data is always alumni
        });
        setLoading(false);
      } else {
        // Fetch from server
        (async () => {
          try {
            const res  = await fetch(`${API_BASE_URL}/api/users/${id}`);
            const data = await res.json();
            if (data.success) setDisplayedProfile(data.user);
            else setErrorMsg('Profile not found.');
          } catch {
            setErrorMsg('Failed to load profile.');
          } finally {
            setLoading(false);
          }
        })();
      }
    }
  }, [id, isOwnProfile, user]);

  /* When own-profile and user context updates (after edit), sync */
  useEffect(() => {
    if (isOwnProfile) setDisplayedProfile(user);
  }, [user, isOwnProfile]);

  /* Decide which view to render */
  const role = displayedProfile?.role || 'student';
  const isAlumni = role === 'alumni';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading profile…</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="text-center py-32">
        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">Profile not found</h2>
        <p className="text-gray-500 text-sm mb-6">{errorMsg}</p>
        <button onClick={() => navigate(-1)} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Go Back</button>
      </div>
    );
  }

  if (!displayedProfile) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-0">
      {/* Display the right profile type */}
      {isAlumni ? (
        <AlumniDisplay
          profile={displayedProfile}
          isOwnProfile={isOwnProfile}
          onEdit={() => setIsEditing(true)}
        />
      ) : (
        <StudentDisplay
          profile={displayedProfile}
          isOwnProfile={isOwnProfile}
          onEdit={() => setIsEditing(true)}
        />
      )}

      {/* Edit modal — shown only for own profile */}
      {isEditing && isOwnProfile && (
        <EditModal
          user={displayedProfile}
          isAlumni={isAlumni}
          onClose={() => setIsEditing(false)}
          onSaved={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default AlumniProfile;
