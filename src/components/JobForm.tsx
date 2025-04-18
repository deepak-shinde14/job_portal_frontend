import React, { useState } from 'react';
import { useStore } from '../store';
import { Job } from '../types';
import { X } from 'lucide-react';

interface JobFormProps {
  initialData?: Partial<Job>;
  onSubmit: (jobData: Omit<Job, 'id' | 'postedDate'>) => Promise<void>;
  onCancel?: () => void;
  isLoading: boolean;
}

const JobForm: React.FC<JobFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading 
}) => {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const [formData, setFormData] = useState<Omit<Job, 'id' | 'postedDate'>>({
    title: initialData?.title || '',
    company: initialData?.company || '',
    location: initialData?.location || '',
    type: initialData?.type || 'Full-time',
    salary: initialData?.salary || '',
    description: initialData?.description || '',
    requirements: initialData?.requirements || [''],
    category: initialData?.category || 'Development',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData(prev => ({ ...prev, requirements: newRequirements }));
  };

  const addRequirement = () => {
    setFormData(prev => ({ ...prev, requirements: [...prev.requirements, ''] }));
  };

  const removeRequirement = (index: number) => {
    if (formData.requirements.length <= 1) return;
    const newRequirements = [...formData.requirements];
    newRequirements.splice(index, 1);
    setFormData(prev => ({ ...prev, requirements: newRequirements }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}>
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Job Title*</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border focus:ring-2 focus:ring-blue-500`}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Company*</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border focus:ring-2 focus:ring-blue-500`}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Location*</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border focus:ring-2 focus:ring-blue-500`}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Job Type*</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border focus:ring-2 focus:ring-blue-500`}
            required
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Freelance">Freelance</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Salary*</label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border focus:ring-2 focus:ring-blue-500`}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category*</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border focus:ring-2 focus:ring-blue-500`}
            required
          >
            <option value="Development">Development</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="Business">Business</option>
            <option value="Customer Support">Customer Support</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Job Description*</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={5}
          className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border focus:ring-2 focus:ring-blue-500`}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Requirements*</label>
        <div className="space-y-2">
          {formData.requirements.map((req, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={req}
                onChange={(e) => handleRequirementChange(index, e.target.value)}
                className={`flex-1 p-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border`}
                required
              />
              <button
                type="button"
                onClick={() => removeRequirement(index)}
                disabled={formData.requirements.length <= 1}
                className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} ${formData.requirements.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <X size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addRequirement}
            className={`mt-2 px-3 py-1 text-sm rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            Add Requirement
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={`px-6 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className={`px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Save Job'}
        </button>
      </div>
    </form>
  );
};

export default JobForm;