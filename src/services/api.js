// Alumni Management System - API Service Layer
// This service handles all HTTP communication with the backend

// Match backend default port (3001) used by `backend/src/index.js`.
const API_BASE_URL = 'http://localhost:3001/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Helper function to handle responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

// ==================== AUTH API ====================

export const authAPI = {
  // Register new student
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Login
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  // Logout
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return handleResponse(response);
  },

  // Get current user
  getMe: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await fetch(`${API_BASE_URL}/auth/password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(passwordData),
    });
    return handleResponse(response);
  },
};

// ==================== REQUESTS API ====================

export const requestsAPI = {
  // Track request by tracking number (public)
  track: async (trackingNumber) => {
    const response = await fetch(`${API_BASE_URL}/requests/track/${trackingNumber}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },

  // Create new document request (with file uploads)
  create: async (requestData, files = []) => {
    // If files are provided, use FormData
    if (files.length > 0) {
      const formData = new FormData();
      
      // Add all request fields
      Object.keys(requestData).forEach(key => {
        if (requestData[key] !== undefined && requestData[key] !== null) {
          formData.append(key, requestData[key]);
        }
      });
      
      // Add files
      files.forEach(file => {
        formData.append(file.fieldName || 'documents', file);
      });

      const response = await fetch(`${API_BASE_URL}/requests`, {
        method: 'POST',
        headers: {
          ...(localStorage.getItem('token') && { 'Authorization': `Bearer ${localStorage.getItem('token')}` }),
        },
        body: formData,
      });
      return handleResponse(response);
    }

    // Otherwise use regular JSON
    const response = await fetch(`${API_BASE_URL}/requests`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestData),
    });
    return handleResponse(response);
  },

  // Get my requests (student)
  getMyRequests: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/requests/my?${queryString}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get all requests (admin)
  getAllRequests: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/requests?${queryString}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get request by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/requests/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Update request status (admin)
  updateStatus: async (id, status, notes = '') => {
    const response = await fetch(`${API_BASE_URL}/requests/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes }),
    });
    return handleResponse(response);
  },

  // Get dashboard statistics (admin)
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/requests/stats`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// ==================== ADMIN API ====================

export const adminAPI = {
  // Get dashboard statistics
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get all users
  getUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/admin/users?${queryString}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Deactivate user
  deleteUser: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get all admin requests
  getAllRequests: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/admin/requests?${queryString}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Update admin request
  updateRequest: async (id, requestData) => {
    const response = await fetch(`${API_BASE_URL}/admin/requests/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestData),
    });
    return handleResponse(response);
  },

  // Delete admin request
  deleteRequest: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/requests/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// ==================== UPLOAD API ====================

export const uploadAPI = {
  // Upload single file
  upload: async (file, fieldName = 'documents') => {
    const formData = new FormData();
    formData.append(fieldName, file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });
    return handleResponse(response);
  },

  // Get file URL
  getFileUrl: (filename) => {
    return `${API_BASE_URL}/upload/${filename}`;
  },

  // Delete file
  delete: async (filename) => {
    const response = await fetch(`${API_BASE_URL}/upload/${filename}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// ==================== UTILITY FUNCTIONS ====================

// Check if backend is reachable
export const checkBackendConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.ok;
  } catch {
    return false;
  }
};

// Get API documentation
export const getAPIDocs = async () => {
  const response = await fetch(`${API_BASE_URL}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse(response);
};

export default {
  auth: authAPI,
  requests: requestsAPI,
  admin: adminAPI,
  upload: uploadAPI,
  checkConnection: checkBackendConnection,
  getDocs: getAPIDocs,
};

