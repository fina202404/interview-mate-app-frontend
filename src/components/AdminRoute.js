import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Spinner = () => <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>;
const LockIcon = () => <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>;

const AdminRoute = () => {
  const { isAuthenticated, user, isLoading } = useContext(AuthContext);
  const location = useLocation();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white p-6 text-center">
        <LockIcon />
        <h1 className="text-4xl font-extrabold text-red-500 mt-6">{t('admin_route_denied_title')}</h1>
        <p className="text-lg text-gray-400 mt-2 max-w-md">{t('admin_route_denied_subtitle')}</p>
        <Link to="/" className="mt-8 bg-bright-blue text-white font-semibold py-3 px-6 rounded-md hover:bg-royal-blue transition-colors">
            {t('admin_route_back_home')}
        </Link>
      </div>
    );
  }

  return <Outlet />;
};

export default AdminRoute;