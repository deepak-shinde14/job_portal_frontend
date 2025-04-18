// src/services/jobService.ts
import { Job } from '../types';
import api from '../utils/api';

export const fetchJobs = async (filters: Record<string, any> = {}): Promise<Job[]> => {
  const response = await api.get('/jobs', { params: filters });
  return response.data;
};

export const fetchJob = async (id: string): Promise<Job> => {
  const response = await api.get(`/jobs/${id}`);
  console.log(response)
  return response.data;
};

export const createJob = async (jobData: Partial<Job>): Promise<Job> => {
  const response = await api.post('/jobs', jobData);
  return response.data;
};

export const updateJob = async (id: string, jobData: Partial<Job>): Promise<Job> => {
  const response = await api.put(`/jobs/${id}`, jobData);
  return response.data;
};

export const deleteJob = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/jobs/${id}`);
  return response.data;
};

export const searchJobs = async (filters: {
  search?: string;
  category?: string;
  type?: string;
  location?: string;
}) => {
  const response = await api.get('/jobs/search', { params: filters });
  return response.data;
};
