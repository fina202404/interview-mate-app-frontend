// src/App.js

import React, { useState, useEffect, useMemo, useContext } from 'react';
import { ConfigProvider, Layout, App as AntApp, Spin } from 'antd';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// Layouts & Pages
import AppHeader from './components/AppHeader'; // New Header
import AppFooter from './components/AppFooter'; // New Footer
import HomePage from './HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import AdminLayout from './components/AdminLayout';
import UserManagementPage from './pages/UserManagementPage';
import ResumeAnalysisPage from './pages/ResumeAnalysisPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProgressPage from './pages/AdminProgressPage';
import MockInterviewPage from './pages/MockInterviewPage';
import LiveInterviewPage from './pages/LiveInterviewPage';
import ProgressPage from './pages/ProgressPage';
import HistoryPage from './pages/HistoryPage';
import PackagesPage from './pages/PackagesPage';
import SubscriptionSuccess from './pages/SubscriptionSuccess';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import NotFoundPage from './pages/NotFoundPage';
 

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

const { Content } = Layout;


const colors = {
  primary: '#E923F4', // Vibrant Pink
  secondary: '#72076E', // Deep Magenta
  background: '#1A022B', // A slightly lighter purple than #2B0245 for better contrast
  surface: '#2B0245', // For cards and surfaces
  accent: '#5600F4', // Bright Blue/Purple accent
  text: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.65)',
};

const MainLayout = ({ currentTheme, toggleTheme }) => {
  return (
    <Layout>
      <AppHeader currentTheme={currentTheme} toggleTheme={toggleTheme} />
      <Content>
        <Outlet />
      </Content>
      <AppFooter />
    </Layout>
  );
};

function App() {
  // Default to dark theme as requested
  const [currentTheme, setCurrentTheme] = useState(() => {
    const storedTheme = localStorage.getItem('appTheme') || 'dark';
    return storedTheme;
  });

  useEffect(() => {
    localStorage.setItem('appTheme', currentTheme);
    document.body.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const toggleTheme = () => setCurrentTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const themeConfig = useMemo(() => {
   const isDark = currentTheme === 'dark';
    
    // New Dark Theme Palette
    const darkThemeColors = {
      primary: '#E923F4',         // Vibrant Pink from color-code-1.jpg
      background: '#0D0614',     // A very dark, near-black purple
      surface: '#190729',        // A slightly lighter purple for cards
      accent: '#72076E',         // Deep Magenta for highlights
      text: '#EAE6F0',           // A soft white for text
      textSecondary: 'rgba(234, 230, 240, 0.65)',
    };
    
    // A sample Light Theme Palette (we can refine this later)
    const lightThemeColors = {
        primary: '#6F42C1',
        background: '#FFFFFF',
        surface: '#F8F9FA',
        text: '#212529',
        textSecondary: '#6C757D',
    };

    return {
      token: {
        colorPrimary: isDark ? darkThemeColors.primary : lightThemeColors.primary,
        colorBgBase: isDark ? darkThemeColors.background : lightThemeColors.background,
        colorBgContainer: isDark ? darkThemeColors.surface : lightThemeColors.surface,
        colorBgLayout: isDark ? darkThemeColors.background : '#f0f2f5',
        colorTextBase: isDark ? darkThemeColors.text : lightThemeColors.text,
        colorText: isDark ? darkThemeColors.text : 'rgba(0, 0, 0, 0.88)',
        colorTextSecondary: isDark ? darkThemeColors.textSecondary : 'rgba(0, 0, 0, 0.65)',
        colorBorder: isDark ? '#3a2d4a' : '#d9d9d9',
        colorBorderSecondary: isDark ? '#2b1d3b' : '#f0f0f0',
        borderRadius: 10, // Slightly more rounded corners for a smoother look
      },
      algorithm: isDark ? AntApp.darkAlgorithm : AntApp.defaultAlgorithm,
    };
  }, [currentTheme]);

  return (
    <ConfigProvider theme={themeConfig}>
      <AntApp>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<MainLayout currentTheme={currentTheme} toggleTheme={toggleTheme} />}>
                <Route index element={<HomePage />} />

                    <Route path="about-us" element={<AboutUsPage />} />  
                    <Route path="contact-us" element={<ContactUsPage />} />
  
                  <Route path="app" element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
                    <Route path="profile" element={<ProfilePage />} />
                      <Route path="progress" element={<ProgressPage />} />
                      <Route path="history" element={<HistoryPage />} />
                    <Route path="mock-interview" element={<MockInterviewPage />} />
                    <Route path="live-interview" element={<LiveInterviewPage />} />
                    <Route path="resume-analysis" element={<ResumeAnalysisPage />} />
                </Route>
              </Route>

              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/resetpassword/:resettoken" element={<ResetPasswordPage />} />
              <Route path="/packages" element={<PackagesPage />} />
              <Route path="/app/subscription-success" element={<SubscriptionSuccess />} />

             
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="users" element={<UserManagementPage />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AuthProvider>
        </Router>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;