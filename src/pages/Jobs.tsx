// src/pages/Jobs.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Job } from '../types';
import { useStore } from '../store';
import { fetchJobs } from '../services/jobService';

const Jobs = () => {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        const data = await fetchJobs();
        console.log(data)
        setJobs(data);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  return (
    <div className={isDarkMode ? 'text-white' : 'text-gray-900'}>
      <h1 className="text-3xl font-bold mb-6">Job Listings</h1>
      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <Link
              key={job.id}
              to={`/jobs/${job._id}`}
              className={`block p-6 rounded-lg shadow-md transition hover:shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
              <p className="text-sm text-gray-500 mb-1">{job.company} • {job.location}</p>
              <p className="text-sm text-gray-500 mb-1">{job.type} • {job.category}</p>
              <p className="text-sm text-gray-600 truncate">{job.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
