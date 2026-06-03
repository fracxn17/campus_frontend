import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, User, Mail, Lock, ArrowLeft, Eye, EyeOff, AlertCircle, CheckCircle, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'alumni',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Account created successfully! Welcome to CampusLegacy!');
        login(data.user);
        setTimeout(() => navigate('/'), 1500);
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Unable to connect to server. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center p-4 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, var(--color-bg), var(--color-card))' }}
    >
      {/* Dynamic Animated Ambient Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-peachAccent/10 to-peachHover/10 blur-[120px] animate-pulse duration-[8000ms] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-peachHover/5 to-pink-500/5 blur-[120px] animate-pulse duration-[6000ms] pointer-events-none" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[30%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-peachAccent/5 blur-[100px] pointer-events-none"></div>

      {/* Floating abstract decorative glass circles */}
      <div className="absolute top-[15%] right-[10%] w-24 h-24 bg-white/5 border border-white/10 rounded-full backdrop-blur-md float-animation pointer-events-none"></div>
      <div className="absolute bottom-[15%] left-[8%] w-32 h-32 bg-white/5 border border-white/10 rounded-full backdrop-blur-lg float-animation pointer-events-none" style={{ animationDelay: '1.5s' }}></div>

      <div className="max-w-lg w-full z-10 relative">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white dark:hover:text-orange-400 mb-6 transition-all duration-300 group text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Premium Glassmorphic Card Container */}
        <div className="backdrop-blur-[24px] bg-white/[0.05] border border-white/[0.1] dark:bg-[#0f1620]/80 dark:border-orange-500/20 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 md:p-10 transition-all duration-500 hover:border-white/[0.15] dark:hover:border-orange-500/30">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-peachAccent to-peachHover dark:from-warmSaffron dark:to-lightSaffron rounded-2xl flex items-center justify-center shadow-lg shadow-peachAccent/20 transition-transform duration-300 hover:rotate-12">
                <GraduationCap className="w-9 h-9 text-darkBg" />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-white dark:text-orange-400 tracking-tight mb-2">Create Account</h2>
            <p className="text-gray-400 dark:text-gray-300 text-sm">Join CampusLegacy and connect with your campus today</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm leading-relaxed">{error}</p>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-green-200 text-sm leading-relaxed">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Register As - Role Selector */}
            <div className="space-y-2">
              <label className="block text-gray-300 dark:text-orange-400 text-xs font-semibold uppercase tracking-wider">Register As</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'alumni' })}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300 border ${
                    formData.role === 'alumni'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-orange-500 dark:to-orange-600 text-white border-transparent shadow-lg shadow-blue-200/20 dark:shadow-orange-500/20'
                      : 'bg-white/[0.04] dark:bg-[#121a24]/90 border-white/[0.08] dark:border-[#2c3b4d] text-gray-400 dark:text-gray-400 hover:border-white/[0.15] dark:hover:border-orange-500/50'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  Alumni
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'student' })}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300 border ${
                    formData.role === 'student'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-orange-500 dark:to-orange-600 text-white border-transparent shadow-lg shadow-blue-200/20 dark:shadow-orange-500/20'
                      : 'bg-white/[0.04] dark:bg-[#121a24]/90 border-white/[0.08] dark:border-[#2c3b4d] text-gray-400 dark:text-gray-400 hover:border-white/[0.15] dark:hover:border-orange-500/50'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Student
                </button>
              </div>
            </div>
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-gray-300 dark:text-orange-400 text-xs font-semibold uppercase tracking-wider">Full Name</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-500 group-focus-within:text-blue-400 dark:group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-blue-500 rounded-xl text-white placeholder-gray-500 dark:bg-[#121a24]/90 dark:border-[#2c3b4d] dark:hover:border-orange-500 dark:focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:focus:ring-orange-500/30 transition-all duration-300 text-sm"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="block text-gray-300 dark:text-orange-400 text-xs font-semibold uppercase tracking-wider">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-500 group-focus-within:text-blue-400 dark:group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. john.doe@university.edu"
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-blue-500 rounded-xl text-white placeholder-gray-500 dark:bg-[#121a24]/90 dark:border-[#2c3b4d] dark:hover:border-orange-500 dark:focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:focus:ring-orange-500/30 transition-all duration-300 text-sm"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-gray-300 dark:text-orange-400 text-xs font-semibold uppercase tracking-wider">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-500 group-focus-within:text-blue-400 dark:group-focus-within:text-orange-500 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-12 py-3 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-blue-500 rounded-xl text-white placeholder-gray-500 dark:bg-[#121a24]/90 dark:border-[#2c3b4d] dark:hover:border-orange-500 dark:focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:focus:ring-orange-500/30 transition-all duration-300 text-sm"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 dark:text-gray-500 dark:hover:text-orange-400 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-gray-300 dark:text-orange-400 text-xs font-semibold uppercase tracking-wider">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-500 group-focus-within:text-blue-400 dark:group-focus-within:text-orange-500 transition-colors" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-12 py-3 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-blue-500 rounded-xl text-white placeholder-gray-500 dark:bg-[#121a24]/90 dark:border-[#2c3b4d] dark:hover:border-orange-500 dark:focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:focus:ring-orange-500/30 transition-all duration-300 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 dark:text-gray-500 dark:hover:text-orange-400 focus:outline-none transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start pt-1">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 rounded border-white/10 bg-white/5 text-blue-600 dark:text-orange-500 focus:ring-blue-500/50 focus:ring-offset-0 cursor-pointer"
                required
              />
              <label htmlFor="terms" className="ml-2 text-xs text-gray-400 dark:text-gray-300 leading-relaxed cursor-pointer select-none">
                I agree to the <span className="text-blue-400 dark:text-orange-400 dark:hover:text-orange-500 hover:underline">Terms & Conditions</span> and <span className="text-blue-400 dark:text-orange-400 dark:hover:text-orange-500 hover:underline">Privacy Policy</span>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-4 py-3.5 rounded-xl text-white font-bold tracking-wide transition-all duration-300 relative overflow-hidden group/btn ${
                loading
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 dark:from-orange-500 dark:to-orange-600 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] dark:hover:shadow-[0_0_20px_rgba(249,115,22,0.25)] active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 dark:from-orange-600 dark:to-orange-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></span>
                  <span className="relative z-10">Register Account</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/[0.08] pt-6">
            <p className="text-gray-400 dark:text-gray-300 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 dark:text-orange-400 dark:hover:text-orange-500 font-bold transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
