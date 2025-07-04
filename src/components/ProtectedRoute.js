import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

// --- Reusable Spinner Component ---
const Spinner = () => (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-y-2 border-white"></div>
        <p className="mt-4 text-lg text-gray-300">Loading user data...</p>
    </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const location = useLocation();

  if (isLoading) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />; 
};

export default ProtectedRoute;