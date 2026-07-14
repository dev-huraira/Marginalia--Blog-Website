import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col justify-center items-center font-serif text-ink italic">
        <div className="w-12 h-0.5 bg-forest mb-4 animate-pulse"></div>
        <p className="animate-pulse">Loading publication settings...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
