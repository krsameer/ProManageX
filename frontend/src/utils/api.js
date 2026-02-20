import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://promanagex.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  getAllUsers: () => api.get('/auth/users')
};

// Project APIs
export const projectAPI = {
  getProjects: () => api.get('/projects'),
  getProject: (id) => api.get(`/projects/${id}`),
  createProject: (data) => api.post('/projects', data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  addMember: (id, data) => api.post(`/projects/${id}/members`, data),
  removeMember: (id, userId) => api.delete(`/projects/${id}/members/${userId}`)
};

// Issue APIs
export const issueAPI = {
  getIssuesByProject: (projectId) => api.get(`/issues/project/${projectId}`),
  getIssue: (id) => api.get(`/issues/${id}`),
  createIssue: (data) => api.post('/issues', data),
  updateIssue: (id, data) => api.put(`/issues/${id}`, data),
  updateIssueStatus: (id, data) => api.patch(`/issues/${id}/status`, data),
  deleteIssue: (id) => api.delete(`/issues/${id}`),
  getIssueActivities: (id) => api.get(`/issues/${id}/activities`)
};

// Comment APIs
export const commentAPI = {
  getCommentsByIssue: (issueId) => api.get(`/comments/issue/${issueId}`),
  createComment: (data) => api.post('/comments', data),
  updateComment: (id, data) => api.put(`/comments/${id}`, data),
  deleteComment: (id) => api.delete(`/comments/${id}`)
};

// Analytics APIs
export const analyticsAPI = {
  getProjectAnalytics: (projectId) => api.get(`/analytics/${projectId}`),
  getUserAnalytics: () => api.get('/analytics/user/me')
};

export default api;
