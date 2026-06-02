// Format date helper
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Format time helper
export const formatTime = (timeString) => {
  return timeString;
};

// Truncate text helper
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Get initials from name
export const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Format number with commas
export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Check if user is authenticated (uses new AuthContext data in localStorage)
export const isAuthenticated = () => {
  return localStorage.getItem('campuslegacy_user') !== null;
};

// Get current user data
export const getCurrentUser = () => {
  const userData = localStorage.getItem('campuslegacy_user');
  return userData ? JSON.parse(userData) : null;
};

// Get user role
export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role || 'student';
};

// Login user (kept for backward compatibility but AuthContext is preferred)
export const loginUser = (role = 'student') => {
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userRole', role);
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('campuslegacy_user');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userRole');
};
