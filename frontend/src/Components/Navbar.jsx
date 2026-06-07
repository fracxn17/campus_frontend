import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  GraduationCap, LogOut, ChevronDown, Menu, X, Sun, Moon,
  User, Edit3, LayoutDashboard, Mail, Phone, MapPin,
  BookOpen, BadgeCheck, Building, Calendar, Save, AlertCircle, CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { API_BASE_URL } from '../config/api';
import defaultMale   from '../assets/default_male.png';
import defaultFemale from '../assets/default_female.png';

function getDefaultAvatar(gender) {
  if (gender === 'female') return defaultFemale;
  return defaultMale;
}

/* ─── Profile Strength Ring ──────────────────────────────────────────── */
function ProfileStrengthRing({ percentage }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const filled = (percentage / 100) * circ;
  const color = percentage >= 80 ? '#22c55e' : percentage >= 50 ? '#3b82f6' : '#f59e0b';

  return (
    <svg width="46" height="46" viewBox="0 0 46 46" className="absolute -top-[3px] -left-[3px]">
      <circle cx="23" cy="23" r={r} fill="none" stroke="#e5e7eb" strokeWidth="3" />
      <circle
        cx="23" cy="23" r={r} fill="none"
        stroke={color} strokeWidth="3"
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 23 23)"
        style={{ transition: 'stroke-dasharray 0.8s ease' }}
      />
    </svg>
  );
}

/* ─── Helpers ────────────────────────────────────────────────────────── */
function getInitials(name) {
  if (!name) return 'U';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function calcStrength(user) {
  if (!user) return 0;
  const fields = user.role === 'alumni'
    ? ['fullName', 'email', 'phone', 'location', 'department', 'batch', 'company', 'designation', 'gender']
    : ['fullName', 'email', 'phone', 'location', 'department', 'batch', 'degree', 'rollNumber', 'gender'];
  const filled = fields.filter(f => user[f] && String(user[f]).trim() !== '').length;
  return Math.round((filled / fields.length) * 100);
}

function strengthLabel(pct) {
  if (pct >= 80) return { text: 'All-Star', color: 'text-green-600' };
  if (pct >= 50) return { text: 'Intermediate', color: 'text-blue-600' };
  return { text: 'Beginner', color: 'text-amber-600' };
}

/* ─── Edit Profile Slide-over ────────────────────────────────────────── */
function EditProfilePanel({ user, onClose, onSaved }) {
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
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState('');
  const [success, setSuccess]   = useState('');

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const save = async e => {
    e.preventDefault();
    if (!form.fullName.trim()) { setError('Full name is required.'); return; }
    setLoading(true); setError(''); setSuccess('');
    try {
      const res  = await fetch(`${API_BASE_URL}/api/user/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user?.id, ...form }),
      });
      const data = await res.json();
      if (data.success) {
        login(data.user);
        setSuccess('Profile saved successfully!');
        setTimeout(() => { onSaved(); onClose(); }, 1200);
      } else {
        setError(data.message || data.detail || 'Save failed — please try again.');
      }
    } catch {
      setError('Cannot reach server. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const field = (label, name, type = 'text', icon) => (
    <div className="space-y-1">
      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
        {icon} {label}
      </label>
      <input
        type={type} name={name} value={form[name]} onChange={handle}
        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800
                   focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                   hover:border-gray-300 transition-all duration-200 placeholder-gray-400"
      />
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl
                      flex flex-col overflow-hidden animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100
                        bg-gradient-to-r from-blue-600 to-indigo-600">
          <div>
            <h2 className="text-lg font-bold text-white">Edit Profile</h2>
            <p className="text-blue-200 text-xs mt-0.5">Your changes save instantly</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Avatar strip */}
        <div className="px-6 py-4 bg-gradient-to-b from-blue-50 to-white flex items-center gap-4 border-b border-gray-100">
          <img
            src={user?.image || getDefaultAvatar(form.gender || user?.gender)}
            alt="avatar"
            className="w-14 h-14 rounded-full object-cover shadow-lg border-2 border-blue-100"
            onError={e => { e.target.src = getDefaultAvatar(form.gender || user?.gender); }}
          />
          <div>
            <p className="font-semibold text-gray-900">{form.fullName || user?.fullName}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
            <span className="inline-block mt-1 text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full capitalize">
              {user?.role || 'student'}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={save} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pt-1">
            Personal Information
          </div>

          {/* Gender picker */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Gender</label>
            <div className="flex gap-2">
              {[{v:'male',l:'\u2642 Male'},{v:'female',l:'\u2640 Female'},{v:'other',l:'\u25ce Other'}].map(g => (
                <button
                  key={g.v} type="button"
                  onClick={() => setForm(f => ({...f, gender: g.v}))}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all duration-200 ${
                    form.gender === g.v
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'border-gray-200 text-gray-500 hover:border-blue-400 hover:text-blue-600'
                  }`}
                >{g.l}</button>
              ))}
            </div>
          </div>

          {field('Full Name', 'fullName', 'text', <User className="w-3 h-3" />)}
          {field('Phone Number', 'phone', 'tel', <Phone className="w-3 h-3" />)}
          {field('Location', 'location', 'text', <MapPin className="w-3 h-3" />)}

          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pt-2">
            Academic Details
          </div>

          {field('Department', 'department', 'text', <Building className="w-3 h-3" />)}
          {field('Batch Year', 'batch', 'text', <Calendar className="w-3 h-3" />)}

          {user?.role !== 'alumni' && (
            <>
              {field('Degree', 'degree', 'text', <BookOpen className="w-3 h-3" />)}
              {field('Roll Number', 'rollNumber', 'text', <BadgeCheck className="w-3 h-3" />)}
            </>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex gap-3">
          <button
            type="button" onClick={onClose}
            className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700
                       hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={loading}
            className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg
                       text-sm font-bold flex items-center justify-center gap-2
                       hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed
                       shadow-md shadow-blue-200 transition-all duration-200"
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : <Save className="w-4 h-4" />}
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── Main Navbar ────────────────────────────────────────────────────── */
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme }            = useTheme();

  const [showDropdown,  setShowDropdown]  = useState(false);
  const [showMobile,    setShowMobile]    = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const close = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleLogout = () => { logout(); setShowDropdown(false); navigate('/'); };

  const navLinks = isAuthenticated()
    ? [
        { to: '/',          label: 'Home' },
        { to: '/directory', label: 'Alumni Directory' },
        { to: '/events',    label: 'Events' },
        { to: '/contact',   label: 'About' },
      ]
    : [
        { to: '/',          label: 'Home' },
        { to: '/directory', label: 'Alumni Directory' },
        { to: '/contact',   label: 'About' },
      ];

  const isActive = path => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const strength  = calcStrength(user);
  const sLabel    = strengthLabel(strength);

  const quickLinks = [
    { label: 'Dashboard',    icon: LayoutDashboard, to: '/dashboard' },
    { label: 'My Profile',   icon: User,            to: '/profile'   },
  ];

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <GraduationCap className="w-8 h-8 text-blue-600 transition-transform duration-300 group-hover:rotate-12" />
              <span className="text-xl font-bold text-gray-900">CampusLegacy</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to} to={link.to}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                    ${isActive(link.to)
                      ? 'text-blue-600 bg-blue-50 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}
                >
                  {link.label}
                  {isActive(link.to) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-blue-600 rounded-full animate-pulse" />
                  )}
                </Link>
              ))}

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 ml-1 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-300"
                aria-label="Toggle theme"
              >
                {theme === 'dark'
                  ? <Sun  className="w-5 h-5 text-yellow-500" />
                  : <Moon className="w-5 h-5" />}
              </button>

              {/* Authenticated profile button */}
              {isAuthenticated() ? (
                <div className="relative ml-2" ref={dropdownRef}>
                  <button
                    id="user-avatar-btn"
                    onClick={() => setShowDropdown(v => !v)}
                    className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-gray-100 transition-all duration-300 group"
                  >
                    {/* Avatar with strength ring */}
                    <div className="relative w-10 h-10">
                      <img
                        src={user?.image || getDefaultAvatar(user?.gender)}
                        alt={user?.fullName || 'avatar'}
                        className="w-10 h-10 rounded-full object-cover shadow-md shadow-blue-200 group-hover:shadow-blue-300 transition-shadow"
                        onError={e => { e.target.src = getDefaultAvatar(user?.gender); }}
                      />
                      <ProfileStrengthRing percentage={strength} />
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* ── Rich Dropdown ─────────────────────────────────── */}
                  {showDropdown && (
                    <div className="absolute right-0 top-full mt-2.5 w-72 bg-white rounded-2xl
                                    shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-gray-100
                                    overflow-hidden z-50 animate-dropdown">

                      {/* Profile header */}
                      <div className="px-5 pt-5 pb-4 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
                        {/* subtle bokeh */}
                        <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
                        <div className="absolute bottom-0 left-8 w-12 h-12 bg-white/5 rounded-full" />

                        <div className="relative flex items-center gap-3">
                          <div className="relative w-12 h-12 flex-shrink-0">
                            <img
                              src={user?.image || getDefaultAvatar(user?.gender)}
                              alt={user?.fullName || 'avatar'}
                              className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                              onError={e => { e.target.src = getDefaultAvatar(user?.gender); }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-white truncate">{user?.fullName}</p>
                            <p className="text-blue-200 text-xs truncate">{user?.email}</p>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full capitalize font-semibold">
                                {user?.role || 'student'}
                              </span>
                              {user?.department && (
                                <span className="text-[10px] bg-white/15 text-blue-100 px-2 py-0.5 rounded-full truncate max-w-[100px]">
                                  {user.department}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Profile strength bar */}
                        <div className="relative mt-4">
                          <div className="flex justify-between text-[11px] text-blue-200 font-medium mb-1.5">
                            <span>Profile Strength</span>
                            <span className="font-bold text-white">{strength}% · <span className="text-yellow-300">{sLabel.text}</span></span>
                          </div>
                          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-yellow-400 to-green-400 rounded-full transition-all duration-700"
                              style={{ width: `${strength}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Quick info pills */}
                      {(user?.phone || user?.location || user?.batch) && (
                        <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap gap-2">
                          {user?.phone && (
                            <span className="flex items-center gap-1 text-[11px] text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                              <Phone className="w-3 h-3 text-gray-400" />{user.phone}
                            </span>
                          )}
                          {user?.location && (
                            <span className="flex items-center gap-1 text-[11px] text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                              <MapPin className="w-3 h-3 text-gray-400" />{user.location}
                            </span>
                          )}
                          {user?.batch && (
                            <span className="flex items-center gap-1 text-[11px] text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                              <Calendar className="w-3 h-3 text-gray-400" />Class of {user.batch}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Quick links */}
                      <div className="px-2 py-2 border-b border-gray-100">
                        {quickLinks.map(({ label, icon: Icon, to }) => (
                          <Link
                            key={to} to={to}
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700
                                       hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150 group"
                          >
                            <div className="w-7 h-7 bg-gray-100 group-hover:bg-blue-100 rounded-lg
                                            flex items-center justify-center transition-colors">
                              <Icon className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                            </div>
                            <span className="font-medium">{label}</span>
                          </Link>
                        ))}

                        {/* Edit profile */}
                        <button
                          onClick={() => { setShowDropdown(false); setShowEditPanel(true); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700
                                     hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-150 group"
                        >
                          <div className="w-7 h-7 bg-gray-100 group-hover:bg-indigo-100 rounded-lg
                                          flex items-center justify-center transition-colors">
                            <Edit3 className="w-4 h-4 text-gray-500 group-hover:text-indigo-600" />
                          </div>
                          <span className="font-medium">Edit Profile</span>
                          {strength < 80 && (
                            <span className="ml-auto text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">
                              Incomplete
                            </span>
                          )}
                        </button>
                      </div>

                      {/* Email row */}
                      <div className="px-4 py-2.5 border-b border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{user?.email}</span>
                        </div>
                      </div>

                      {/* Sign out */}
                      <div className="px-2 py-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                                     text-red-600 hover:bg-red-50 transition-colors duration-150 group"
                        >
                          <div className="w-7 h-7 bg-red-50 group-hover:bg-red-100 rounded-lg
                                          flex items-center justify-center transition-colors">
                            <LogOut className="w-4 h-4 text-red-500" />
                          </div>
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="ml-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg
                             hover:from-blue-700 hover:to-indigo-700 text-sm font-medium transition-all duration-300
                             hover:shadow-lg hover:shadow-blue-200"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              onClick={() => setShowMobile(v => !v)}
            >
              {showMobile ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* ── Mobile Menu ──────────────────────────────────────────── */}
          {showMobile && (
            <div className="md:hidden py-4 border-t border-gray-100 animate-dropdown space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.to} to={link.to}
                  onClick={() => setShowMobile(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive(link.to) ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}
                >
                  {link.label}
                </Link>
              ))}

              <button
                onClick={() => { toggleTheme(); setShowMobile(false); }}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium
                           text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all"
              >
                <span>Toggle Theme</span>
                {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
              </button>

              {isAuthenticated() ? (
                <div className="pt-3 mt-2 border-t border-gray-100 space-y-1">
                  {/* Mobile profile info */}
                  <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full
                                      flex items-center justify-center text-white text-sm font-bold">
                        {getInitials(user?.fullName)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{user?.fullName}</p>
                        <p className="text-xs text-gray-500">{strength}% complete</p>
                      </div>
                    </div>
                  </div>

                  <Link to="/dashboard" onClick={() => setShowMobile(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium">
                    <LayoutDashboard className="w-4 h-4 text-gray-400" /> Dashboard
                  </Link>
                  <Link to="/profile" onClick={() => setShowMobile(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium">
                    <User className="w-4 h-4 text-gray-400" /> My Profile
                  </Link>
                  <button
                    onClick={() => { setShowMobile(false); setShowEditPanel(true); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium"
                  >
                    <Edit3 className="w-4 h-4 text-gray-400" /> Edit Profile
                  </button>
                  <button
                    onClick={() => { handleLogout(); setShowMobile(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login" onClick={() => setShowMobile(false)}
                  className="block mx-1 mt-2 px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium text-center"
                >
                  Login
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* ── Edit Profile Slide-over Panel ────────────────────────────── */}
      {showEditPanel && (
        <EditProfilePanel
          user={user}
          onClose={() => setShowEditPanel(false)}
          onSaved={() => setShowEditPanel(false)}
        />
      )}
    </>
  );
};

export default Navbar;
