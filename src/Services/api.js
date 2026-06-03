// API Service file
// In a real application, these would make actual HTTP requests

const BASE_URL = 'https://api.campuslegacy.com';

// Alumni API
export const alumniAPI = {
  getAll: async () => {
    // Simulate API call
    return Promise.resolve([
      {
        id: 1,
        name: 'Jay Prakash Sharma',
        designation: 'MERN developer',
        company: 'TCS',
        batch: '2021',
        department: 'Computer Science',
        location: 'West Bengal, India',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
      },
      // Add more alumni data
    ]);
  },
  
  getById: async (id) => {
    return Promise.resolve({});
  },
  
  create: async (data) => {
    return Promise.resolve(data);
  },
  
  update: async (id, data) => {
    return Promise.resolve(data);
  },
  
  delete: async (id) => {
    return Promise.resolve({ success: true });
  },
};

// Events API
export const eventsAPI = {
  getAll: async () => {
    return Promise.resolve([]);
  },
  
  getById: async (id) => {
    return Promise.resolve({});
  },
  
  register: async (eventId, userId) => {
    return Promise.resolve({ success: true });
  },
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    // Simulate login
    return Promise.resolve({
      success: true,
      user: { email, role: email.includes('admin') ? 'admin' : 'alumni' },
    });
  },
  
  register: async (userData) => {
    return Promise.resolve({ success: true, user: userData });
  },
  
  logout: async () => {
    return Promise.resolve({ success: true });
  },
};

export default {
  alumniAPI,
  eventsAPI,
  authAPI,
};
