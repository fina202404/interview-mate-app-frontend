import React, { useState, useContext, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthContext from '../context/AuthContext';


const IconDown = () => <svg className="w-4 h-4 ml-1 text-gray-400 group-hover:text-white transition-transform duration-300 transform group-hover:rotate-180" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
const IconUser = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const IconChart = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const IconHistory = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconLogout = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const IconDashboard = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
const IconMenu = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>;
const IconClose = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>;
const UserAvatar = ({ user }) => ( <img src={user?.avatar || '/profile.png'} alt="User Profile" className="w-9 h-9 rounded-full object-cover transition-all duration-300 group-hover:ring-2 group-hover:ring-neon-pink" /> );


const HeaderDropdown = ({ title, children }) => (
  <div className="relative group">
    <button className="px-3 py-2 rounded-md text-base font-medium text-gray-300 group-hover:text-white group-hover:bg-white/5 transition-all duration-200 flex items-center">
      <span>{title}</span>
      <IconDown />
    </button>
    <div className="absolute top-full mt-3 w-60 bg-black/70 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 p-2">
      {children}
    </div>
  </div>
);

const DropdownLink = ({ to, children, onClick }) => (
    <Link to={to} onClick={onClick} className="flex items-center w-full px-4 py-3 text-sm text-gray-200 rounded-md hover:bg-gradient-to-r hover:from-neon-pink hover:to-bright-blue hover:text-white transition-colors duration-200">
        {children}
    </Link>
);

const AppHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const DesktopMenu = () => (
    <div className="hidden lg:flex items-center space-x-1">
      <HeaderDropdown title={t('header_interview')}>
        <DropdownLink to="/app/mock-interview">{t('dd_mock_interview')}</DropdownLink>
        <DropdownLink to="/app/live-interview">{t('dd_live_interview')}</DropdownLink>
      </HeaderDropdown>
      <HeaderDropdown title={t('header_resume')}>
        <DropdownLink to="/app/resume-analysis">{t('dd_resume_analysis')}</DropdownLink>
      </HeaderDropdown>
      <HeaderDropdown title={t('header_learn')}>
        <DropdownLink to="/app/learn/videos">{t('dd_videos')}</DropdownLink>
        <DropdownLink to="/app/learn/language">{t('dd_learn_language')}</DropdownLink>
      </HeaderDropdown>
      <HeaderDropdown title={t('header_packages')}>
        <DropdownLink to="/packages">{t('dd_view_plans')}</DropdownLink>
      </HeaderDropdown>
      <HeaderDropdown title={t('header_about')}>
        <DropdownLink to="/about-us">{t('dd_about_us')}</DropdownLink>
        <DropdownLink to="/contact-us">{t('dd_contact_us')}</DropdownLink>
      </HeaderDropdown>
    </div>
  );

  const AuthControls = () => (
    <div className="flex items-center gap-4">
        <div className="hidden lg:flex font-semibold text-gray-400 text-sm gap-1">
            <button onClick={() => changeLanguage('en')} className={`px-2 transition-colors ${i18n.language.startsWith('en') ? 'text-neon-pink' : 'hover:text-white'}`}>EN</button>
            <span className="text-gray-600">|</span>
            <button onClick={() => changeLanguage('ja')} className={`px-2 transition-colors ${i18n.language === 'ja' ? 'text-neon-pink' : 'hover:text-white'}`}>JP</button>
        </div>

      {isAuthenticated ? (
        <div className="relative">
          <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="block group">
            <UserAvatar user={user} />
          </button>
          {isProfileOpen && (
            <div className="absolute top-full right-0 mt-3 w-60 bg-black/70 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl z-50 p-2">
                {user?.role === 'admin' && <DropdownLink to="/admin/dashboard" onClick={closeAllMenus}><IconDashboard /> {t('profile_admin_dashboard')}</DropdownLink>}
                <DropdownLink to="/app/profile" onClick={closeAllMenus}><IconUser /> {t('profile_my_profile')}</DropdownLink>
                <DropdownLink to="/app/progress" onClick={closeAllMenus}><IconChart /> {t('profile_progress')}</DropdownLink>
                <DropdownLink to="/app/history" onClick={closeAllMenus}><IconHistory /> {t('profile_history')}</DropdownLink>
                <div className="h-px bg-deep-purple my-2"></div>
                <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-sm text-red-400 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-200">
                    <IconLogout /> {t('profile_logout')}
                </button>
            </div>
          )}
        </div>
      ) : (
        <div className="hidden lg:flex items-center gap-2">
          <button onClick={() => navigate('/login')} className="px-4 py-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors">{t('header_login')}</button>
          <button onClick={() => navigate('/signup')} className="px-4 py-2 rounded-lg font-semibold text-white bg-bright-blue hover:bg-royal-blue transition-colors">{t('header_signup')}</button>
        </div>
      )}
      
      <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-gray-300 hover:text-white">
        <IconMenu />
      </button>
    </div>
  );
  
  const MobileMenu = () => (
    <div className={`fixed top-0 right-0 h-full w-full max-w-xs bg-black z-[100] shadow-2xl transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-deep-purple">
            <h2 className="text-lg font-semibold text-white">{t('menu_title')}</h2>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-white">
                <IconClose />
            </button>
        </div>
        <div className="p-4 flex flex-col gap-4">
            <Link to="/app/mock-interview" onClick={closeAllMenus} className="w-full text-left text-gray-200 p-3 rounded-md hover:bg-white/10">{t('header_interview')}</Link>
            <Link to="/app/resume-analysis" onClick={closeAllMenus} className="w-full text-left text-gray-200 p-3 rounded-md hover:bg-white/10">{t('header_resume')}</Link>
            <Link to="/packages" onClick={closeAllMenus} className="w-full text-left text-gray-200 p-3 rounded-md hover:bg-white/10">{t('header_packages')}</Link>
            <Link to="/about-us" onClick={closeAllMenus} className="w-full text-left text-gray-200 p-3 rounded-md hover:bg-white/10">{t('header_about')}</Link>
            <div className="h-px bg-deep-purple my-4"></div>
            {!isAuthenticated && (
                <div className="flex flex-col gap-4">
                    <button onClick={() => {navigate('/login'); closeAllMenus();}} className="w-full py-3 rounded-md text-gray-200 bg-white/10 hover:bg-white/20">{t('header_login')}</button>
                    <button onClick={() => {navigate('/signup'); closeAllMenus();}} className="w-full py-3 rounded-md font-semibold text-white bg-bright-blue hover:bg-royal-blue">{t('header_signup')}</button>
                </div>
            )}
        </div>
    </div>
  );

  return (
    <Fragment>
      <header className="fixed top-0 z-40 w-full bg-black/80 backdrop-blur-lg">
        <nav className="container mx-auto flex items-center justify-between p-4 h-20">
            <Link to="/" className="flex items-center gap-3">
                <img src="/logo.jpg" alt="InterviewMate Logo" className="h-9 w-9 rounded-full transition-transform duration-300 hover:scale-110 hover:rotate-12" />
                <span className="hidden sm:block text-white font-bold text-xl bg-gradient-to-r from-neon-pink to-bright-blue text-transparent bg-clip-text">
                  InterviewMate
                </span>
            </Link>
            <DesktopMenu />
            <AuthControls />
        </nav>
      </header>
      {isMobileMenuOpen && <div onClick={closeAllMenus} className="fixed inset-0 bg-black/60 z-50"></div>}
      <MobileMenu />
    </Fragment>
  );
};
 
export default AppHeader;