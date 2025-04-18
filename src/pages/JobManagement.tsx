// src/pages/JobManagement.tsx
import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { Job } from '../types';
import JobForm from '../components/JobForm';
import Modal from '../components/Modal';
import {
  fetchJobs,
  createJob,
  updateJob,
  deleteJob,
} from '../services/jobService';
import { useAuth } from '../context/AuthContext';

const JobManagement = () => {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const currentUser = useStore((state) => state.currentUser);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const { user } = useAuth();

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await fetchJobs();
      const userJobs = data.filter(
        (job) => job.postedBy?.company === user?.company
      );
      setJobs(userJobs);
    } catch (err) {
      console.error('Error loading jobs:', err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadJobs();
  }, []);

  const handleCreate = async (jobData: Omit<Job, 'id' | 'postedDate'>) => {
    await createJob({ ...jobData, company: user?.company });
    setModalOpen(false);
    await loadJobs();
  };

  const handleUpdate = async (jobData: Omit<Job, 'id' | 'postedDate'>) => {
    if (editingJob) {
      await updateJob(editingJob.id, jobData);
      setEditingJob(null);
      setModalOpen(false);
      await loadJobs();
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      await deleteJob(id);
      await loadJobs();
    }
  };

  return (
    <div className={isDarkMode ? 'text-white' : 'text-gray-900'}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Jobs</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => {
            setEditingJob(null);
            setModalOpen(true);
          }}
        >
          + New Job
        </button>
      </div>

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{job.title}</h2>
                  <p className="text-sm text-gray-500">{job.location} • {job.type}</p>
                </div>
                <div className="space-x-2">
                  <button
                    className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    onClick={() => {
                      setEditingJob(job);
                      setModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(job.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div
          className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
            } p-6 rounded-lg max-h-[90vh] overflow-y-auto w-full`}
        >
          <h2 className="text-2xl font-bold mb-4">{editingJob ? 'Edit Job' : 'Post New Job'}</h2>
          <JobForm
            initialData={editingJob || {}}
            onSubmit={editingJob ? handleUpdate : handleCreate}
            onCancel={() => setModalOpen(false)}
            isLoading={false}
          />
        </div>
      </Modal>

    </div>
  );
};

export default JobManagement;
