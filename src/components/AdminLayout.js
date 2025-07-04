import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

// Icons
const IconDashboard = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>;
const IconUsers = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a3.004 3.004 0 015.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>;
const IconHome = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>;
const IconMenu = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>;
const IconChart = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();

  const NavLink = ({ to, icon, children }) => {
    const isActive = location.pathname.startsWith(to);
    return (
      <Link to={to} className={`flex items-center p-3 my-1 rounded-lg transition-colors ${isActive ? 'bg-neon-pink text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}>
        {icon}
        {!collapsed && <span className="ml-4">{children}</span>}
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sider */}
      <div className={`bg-[#1A202C] p-4 flex flex-col transition-all duration-300 ${collapsed ? 'w-24' : 'w-64'}`}>
        <div className="flex items-center gap-3 mb-8 h-8 px-2">
            <img src="/logo.jpg" alt="Logo" className="h-8 w-8 rounded-full flex-shrink-0" />
            {!collapsed && <span className="font-bold text-lg text-white">InterviewMate</span>}
        </div>
        {/* UPDATE: Moved "Back to Main Site" up and removed the bottom divider */}
        <nav className="flex-grow">
            <NavLink to="/admin/dashboard" icon={<IconDashboard/>}>{t('admin_nav_dashboard')}</NavLink>
            <NavLink to="/admin/users" icon={<IconUsers/>}>{t('admin_nav_users')}</NavLink>
            <NavLink to="/admin/progress" icon={<IconChart />}>{t('admin_nav_progress')}</NavLink>
            <div className="border-t border-white/10 my-4"></div>
            <NavLink to="/" icon={<IconHome/>}>{t('admin_nav_back_to_site')}</NavLink>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-black/80 backdrop-blur-sm h-20 flex items-center justify-between px-6 border-b border-white/10">
            <button onClick={() => setCollapsed(!collapsed)} className="text-gray-300 hover:text-white">
                <IconMenu/>
            </button>
            <div className="text-gray-300">
                {t('admin_header_welcome')}, <span className="font-bold text-white">{user?.username || 'Admin'}</span>
            </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#0D0614]">
            <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;