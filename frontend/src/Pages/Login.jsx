import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState(''); // 'not_found', 'wrong_password', 'general'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrorType('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        login(data.user);
        navigate('/');
      } else {
        // Determine error type based on status code
        if (response.status === 404) {
          setErrorType('not_found');
          setError(data.message);
        } else if (response.status === 401) {
          setErrorType('wrong_password');
          setError(data.message);
        } else {
          setErrorType('general');
          setError(data.message || 'Login failed. Please try again.');
        }
      }
    } catch (err) {
      setErrorType('general');
      setError('Unable to connect to server. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setErrorType('');
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center p-4 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, var(--color-bg), var(--color-card))' }}
    >
      {/* Dark Premium Blurred Ambient Gradient Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-peachAccent/10 to-peachHover/10 blur-[130px] animate-pulse duration-[10000ms] pointer-events-none"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-peachHover/5 to-pink-500/5 blur-[120px] animate-pulse duration-[8000ms] pointer-events-none" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[20%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-peachAccent/5 blur-[110px] pointer-events-none"></div>

      {/* Floating soft light glass rings/orbs */}
      <div className="absolute top-[10%] left-[5%] w-28 h-28 bg-white/5 border border-white/10 rounded-full backdrop-blur-md float-animation pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[8%] w-36 h-36 bg-white/5 border border-white/10 rounded-full backdrop-blur-lg float-animation pointer-events-none" style={{ animationDelay: '1.5s' }}></div>

      <div className="max-w-md w-full z-10 relative">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white dark:hover:text-orange-400 mb-6 transition-all duration-300 group text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Frosted Dark Glass Card Container */}
        <div className="backdrop-blur-[24px] bg-white/[0.05] border border-white/[0.1] dark:bg-[#0f1620]/80 dark:border-orange-500/20 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 md:p-10 transition-all duration-500 hover:border-white/[0.15] dark:hover:border-orange-500/30">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-peachAccent to-peachHover dark:from-warmSaffron dark:to-lightSaffron rounded-2xl flex items-center justify-center shadow-lg shadow-peachAccent/20 transition-transform duration-300 hover:rotate-12">
                <GraduationCap className="w-9 h-9 text-darkBg" />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-white dark:text-orange-400 tracking-tight mb-2 font-display">Welcome Back</h2>
            <p className="text-gray-400 dark:text-gray-300 text-sm">Sign in to your student portal</p>
          </div>

          {/* Error Alert - Account Not Found */}
          {error && errorType === 'not_found' && (
            <div className="mb-6 p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl animate-shake">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-amber-800 font-bold text-sm">Account Not Found!</p>
              </div>
              <p className="text-amber-700 text-sm mb-3 leading-relaxed">{error}</p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-amber-600/20 transition-all duration-300"
              >
                <UserPlus className="w-4 h-4" />
                Create New Account
              </Link>
            </div>
          )}

          {/* Error Alert - Wrong Password / General */}
          {error && errorType !== 'not_found' && (
            <div className="mb-6 p-4 bg-red-50/80 border border-red-200/80 rounded-2xl flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Address */}
            <div className="space-y-2">
              <label className="block text-gray-600 dark:text-orange-400 text-xs font-semibold uppercase tracking-wider">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@university.edu"
                  className="w-full pl-10 pr-4 py-3 bg-white/40 border border-gray-200 hover:border-gray-300 focus:border-blue-500 rounded-xl text-gray-800 placeholder-gray-400 dark:bg-[#121a24]/90 dark:border-[#2c3b4d] dark:text-white dark:placeholder-gray-500 dark:hover:border-orange-500 dark:focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 dark:focus:ring-orange-500/30 transition-all duration-300 text-sm shadow-sm"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-gray-600 dark:text-orange-400 text-xs font-semibold uppercase tracking-wider">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-orange-500 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 bg-white/40 border border-gray-200 hover:border-gray-300 focus:border-blue-500 rounded-xl text-gray-800 placeholder-gray-400 dark:bg-[#121a24]/90 dark:border-[#2c3b4d] dark:text-white dark:placeholder-gray-500 dark:hover:border-orange-500 dark:focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 dark:focus:ring-orange-500/30 transition-all duration-300 text-sm shadow-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-orange-400 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 dark:text-orange-500 focus:ring-blue-500/50 dark:focus:ring-orange-500/50 cursor-pointer"
                />
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-300 leading-none">Remember me</span>
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-4 py-3.5 rounded-xl text-white font-bold tracking-wide transition-all duration-300 relative overflow-hidden group/btn ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-600 dark:from-orange-500 dark:to-orange-600 hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] dark:hover:shadow-[0_0_20px_rgba(249,115,22,0.25)] active:scale-[0.98]'
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
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-500 dark:from-orange-600 dark:to-orange-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></span>
                  <span className="relative z-10">Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 dark:border-gray-800 pt-6">
            <p className="text-gray-500 dark:text-gray-300 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 dark:text-orange-400 dark:hover:text-orange-500 font-bold transition-colors">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
