import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { createApplication } from '../services/applicationService';

const ApplicationForm = () => {
    const { id: jobId } = useParams();
    const navigate = useNavigate();
    const isDarkMode = useStore((state) => state.isDarkMode);
    const [formData, setFormData] = useState({
        coverLetter: '',
        resume: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!jobId) {
            setError('Job ID is missing');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            await createApplication({
                jobId,
                coverLetter: formData.coverLetter,
                resume: formData.resume
            });
            navigate(`/jobs/${jobId}`, { state: { applied: true } });
        }catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to apply';
            if (errorMessage.includes('already applied')) {
                setError('You have already applied for this job.');
            } else {
                setError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`max-w-2xl mx-auto p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md`}>
            <h2 className="text-2xl font-bold mb-6">Apply for Job</h2>

            {error && (
                <div className={`p-4 mb-4 rounded-lg ${isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Cover Letter</label>
                    <textarea
                        value={formData.coverLetter}
                        onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                        rows={8}
                        className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border focus:ring-2 focus:ring-blue-500`}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Resume URL</label>
                    <input
                        type="url"
                        value={formData.resume}
                        onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                        className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border focus:ring-2 focus:ring-blue-500`}
                        required
                    />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className={`px-6 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={`px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Submitting...' : 'Submit Application'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ApplicationForm;