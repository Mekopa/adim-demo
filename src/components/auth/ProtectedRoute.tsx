// src/components/auth/ProtectedRoute.tsx

import React from 'react';
import useAuth from '../../contexts/useAuth';
import { Navigate, useLocation } from 'react-router-dom';


interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Replace with a spinner or loading component as desired
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;