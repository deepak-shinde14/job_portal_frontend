import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { getApplication, updateApplicationStatus } from '../services/applicationService';

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isDarkMode = useStore((state) => state.isDarkMode);
  const currentUser = useStore((state) => state.currentUser);
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadApplication = async () => {
      try {
        const data = await getApplication(id!);
        setApplication(data);
        setStatus(data.status);
      } catch (error) {
        console.error('Error fetching application:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    loadApplication();
  }, [id, navigate]);

  const handleStatusUpdate = async () => {
    try {
      await updateApplicationStatus(id!, status);
      setApplication({...application, status});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} p-8 rounded-lg shadow-md`}>
      <h1 className="text-3xl font-bold mb-6">Application Details</h1>
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Job Information</h2>
          <p className="mb-2"><span className="font-semibold">Title:</span> {application.job.title}</p>
          <p className="mb-2"><span className="font-semibold">Company:</span> {application.job.company}</p>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Applicant Information</h2>
          <p className="mb-2"><span className="font-semibold">Name:</span> {application.user.name}</p>
          <p className="mb-2"><span className="font-semibold">Email:</span> {application.user.email}</p>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Cover Letter</h2>
        <p className="whitespace-pre-line">{application.coverLetter}</p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Resume</h2>
        <a 
          href={application.resume} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800"
        >
          View Resume
        </a>
      </div>
      
      {currentUser?.role === 'employer' && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Update Status</h2>
          <div className="flex items-center gap-4">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border`}
            >
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              onClick={handleStatusUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update
            </button>
          </div>
          {error && (
            <div className={`mt-2 p-2 rounded-lg ${isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}>
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicationDetails;