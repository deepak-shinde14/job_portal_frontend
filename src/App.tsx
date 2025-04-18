import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useStore } from './store';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, RoleRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import JobManagement from './pages/JobManagement';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import EmployerDashboard from './pages/EmployerDashboard';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ApplicationForm from './components/ApplicationForm';
import ApplicationDetails from './components/ApplicationDetails';

function App() {
  const isDarkMode = useStore((state) => state.isDarkMode);

  return (
    <AuthProvider>
      <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <BrowserRouter>
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:_id" element={<JobDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs/:id/apply" element={<ApplicationForm />} />
              <Route path="/applications/:id" element={<ApplicationDetails />} />

              {/* Protected routes with role-based access */}
              <Route element={<RoleRoute allowedRoles={['employer']} />}>
                <Route path="/employer/dashboard" element={<EmployerDashboard />} />
                <Route path="/employer/jobs" element={<JobManagement />} />
              </Route>

              <Route element={<RoleRoute allowedRoles={['jobseeker']} />}>
                <Route path="/jobseeker/dashboard" element={<JobSeekerDashboard />} />
              </Route>
            </Routes>
          </main>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;