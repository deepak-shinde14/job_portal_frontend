// src/utils/api.ts
import axios from 'axios';
import { getAuthCookie } from './cookies';

// Create base axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token in headers
api.interceptors.request.use(
  (config) => {
    const token = getAuthCookie();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific status codes
      if (error.response.status === 401) {
        // Handle unauthorized access
        window.location.href = '/login';
      }
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;

// Get all jobs with optional filters
export const getJobs = async (filters: Record<string, any> = {}) => {
    const response = await api.get('/jobs', { params: filters });
    return response.data;
  };
  
  // Get a single job by ID
  export const getJob = async (id: string) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  };
  
  // Create a new job
  export const createJob = async (jobData: Record<string, any>) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  };
  
  // Update a job
  export const updateJob = async (id: string, jobData: Record<string, any>) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  };
  
  // Delete a job
  export const deleteJob = async (id: string) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  };