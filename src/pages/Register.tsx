import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useStore } from '../store';
import { useAuth } from '../context/AuthContext';

function Register() {
  const navigate = useNavigate();
  const isDarkMode = useStore((state) => state.isDarkMode);
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'jobseeker' as 'jobseeker' | 'employer',
    company: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Prepare data based on role
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        ...(formData.role === 'employer' && { company: formData.company })
      };

      await register(userData);

      // Redirect based on role
      navigate(formData.role === 'employer' ? '/employer/dashboard' : '/jobseeker/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8`}>
        <div className="flex items-center justify-center mb-8">
          <UserPlus className="w-12 h-12 text-blue-600" />
        </div>

        <h1 className="text-2xl font-bold text-center mb-8">Create Account</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Account Type</label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value as 'jobseeker' | 'employer' })
              }              
              className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border focus:ring-2 focus:ring-blue-500`}
            >
              <option value="jobseeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          {formData.role === 'employer' && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Company Name</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border focus:ring-2 focus:ring-blue-500`}
                required
              />
            </div>
          )}

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="mt-4 text-center">
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;