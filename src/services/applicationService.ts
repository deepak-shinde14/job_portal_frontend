// src/services/applicationService.ts
import api from '../utils/api';
import { Application } from '../types';

export const getApplications = async (): Promise<Application[]> => {
  const response = await api.get('/applications');
  return response.data;
};

export const getApplication = async (id: string): Promise<Application> => {
  const response = await api.get(`/applications/${id}`);
  return response.data;
};

export const createApplication = async (data: {
  jobId: string;
  coverLetter: string;
  resume: string;
}): Promise<Application> => {
  try {
    const response = await api.post('/applications', data);
    return response.data;
  } catch (error: any) {
    const apiMessage = error.response?.data?.message || error.message || 'Application failed';
    console.error('API error:', apiMessage);
    throw new Error(apiMessage);
  }
};

export const updateApplicationStatus = async (id: string, status: string): Promise<Application> => {
  const response = await api.put(`/applications/${id}/status`, { status });
  return response.data;
};

