import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protected route that requires authentication
export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

// Role-specific protected route
interface RoleRouteProps {
  allowedRoles: string[];
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Redirect to home if not authorized for this role
  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  // Render child routes if authenticated and authorized
  return <Outlet />;
};