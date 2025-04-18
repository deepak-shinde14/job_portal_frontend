// src/pages/EmployerDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { Application, Job } from '../types';
import { fetchJobs } from '../services/jobService';
import { getApplications } from '../services/applicationService';
import { Link } from 'react-router-dom';

const EmployerDashboard = () => {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const currentUser = useStore((state) => state.currentUser);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const allJobs = await fetchJobs();
        const employerJobs = allJobs.filter((job) => job.company === currentUser?.company);
        setJobs(employerJobs);

        const allApps = await getApplications();
        const employerApps = allApps.filter(app => employerJobs.some(job => job.id === app.jobId));
        setApplications(employerApps);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUser]);

  const statBox = (title: string, value: number, color: string) => (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );

  return (
    <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-1">Employer Dashboard</h1>
            <p className="text-gray-500">Welcome back, {currentUser?.name}</p>
          </div>
          <Link
            to="/employer/jobs"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Manage Jobs
          </Link>
        </div>
      </div>

      {loading ? (
        <p>Loading stats...</p>
      ) : (
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {statBox('Active Jobs', jobs.length, 'text-blue-600')}
          {statBox('Total Applications', applications.length, 'text-green-600')}
          {statBox('Pending Review', applications.filter(app => app.status === 'pending').length, 'text-yellow-600')}
          {statBox('Hired', applications.filter(app => app.status === 'accepted').length, 'text-purple-600')}
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;