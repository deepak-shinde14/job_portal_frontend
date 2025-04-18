import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { MapPin, Building2, Clock, Send, Check } from 'lucide-react';
import { useStore } from '../store';
import { dummyApplications } from '../data';
import { useAuth } from '../context/AuthContext';
import { fetchJob } from '../services/jobService';
import { Job } from '../types';

function JobDetails() {
  const { _id } = useParams();
  const isDarkMode = useStore((state) => state.isDarkMode);
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (location.state?.applied) {
      setShowSuccess(true);
      // Clear the state after showing the message
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  useEffect(() => {
    const loadJob = async () => {
      setLoading(true);
      try {
        if (_id) {
          const data = await fetchJob(_id);
          console.log(data);
          setJob(data);
        }
      } catch (error) {
        console.error('Failed to fetch job:', error);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [_id]);

  const hasApplied =
    user?.role === 'jobseeker' &&
    dummyApplications.some(app => app.jobId === _id && app.userId === user?.id);

  if (!job) {
    return <div>Job not found</div>;
  }

  return (
    <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      {showSuccess && (
        <div className={`mb-4 p-4 rounded-lg ${isDarkMode ? 'bg-green-900' : 'bg-green-100'} text-green-800`}>
          Application submitted successfully!
        </div>
      )}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8 mb-8`}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
            <div className="flex items-center text-gray-500 mb-4">
              <Building2 className="w-5 h-5 mr-2" />
              <span className="mr-4">{job.company}</span>
              <MapPin className="w-5 h-5 mr-2" />
              <span>{job.location}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`px-4 py-2 rounded-full text-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                {job.type}
              </span>
              <span className={`px-4 py-2 rounded-full text-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                {job.category}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 mb-2">₹{job.salary}</div>
            <div className="flex items-center text-gray-500">
              <Clock className="w-5 h-5 mr-2" />
              <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {user?.role === 'jobseeker' && (
          hasApplied ? (
            <button className="w-full md:w-auto bg-gray-400 text-white px-8 py-3 rounded-lg cursor-not-allowed flex items-center justify-center">
              <Check className="w-5 h-5 mr-2" />
              Already Applied
            </button>
          ) : (
            <Link
              to={`/jobs/${job._id}/apply`}
              className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
            >
              <Send className="w-5 h-5 mr-2" />
              Apply Now
            </Link>
          )
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8 mb-8`}>
            <h2 className="text-2xl font-bold mb-4">Job Description</h2>
            <p className="mb-6 whitespace-pre-line">{job.description}</p>

            <h3 className="text-xl font-bold mb-4">Requirements</h3>
            <ul className="list-disc pl-6 space-y-2">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8`}>
            <h2 className="text-xl font-bold mb-4">Company Overview</h2>
            <div className="flex items-center mb-4">
              <Building2 className="w-12 h-12 text-blue-600 mr-4" />
              <div>
                <h3 className="font-semibold">{job.company}</h3>
                <p className="text-gray-500">{job.location}</p>
              </div>
            </div>
            <p className="text-gray-500">
              Leading technology company specializing in innovative solutions...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
