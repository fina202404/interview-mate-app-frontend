import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './i18n';

// Layouts & Pages
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import HomePage from './HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import AdminLayout from './components/AdminLayout';
import UserManagementPage from './pages/UserManagementPage';
import AdminProgressPage from './pages/AdminProgressPage';
import ResumeAnalysisPage from './pages/ResumeAnalysisPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import MockInterviewPage from './pages/MockInterviewPage';
import LiveInterviewPage from './pages/LiveInterviewPage';
import ProgressPage from './pages/ProgressPage';
import HistoryPage from './pages/HistoryPage';
import PackagesPage from './pages/PackagesPage';
import SubscriptionSuccess from './pages/SubscriptionSuccess';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import UserGuidePage from './pages/UserGuidePage';
import VideosPage from './pages/VideosPage';
import LearnLanguagePage from './pages/LearnLanguagePage';
import NotFoundPage from './pages/NotFoundPage';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <AppHeader />
      {/* UPDATE: Added padding-top to the main content area. This pushes all page content down so it's not hidden by the fixed header. The height 'h-20' should match your header's height. */}
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
};

// A simple loading component for Suspense fallback
const LoadingSpinner = () => (
    <div className="w-full h-screen bg-black flex items-center justify-center text-white text-xl">
        <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading...
    </div>
);


function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1A202C', // A dark navy blue
            color: '#FFFFFF',
            border: '1px solid #4A5568',
          },
          success: {
            iconTheme: {
              primary: '#34D399', // A nice green
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#F87171', // A nice red
              secondary: 'white',
            },
          },
        }}
      />
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="about-us" element={<AboutUsPage />} />
              <Route path="contact-us" element={<ContactUsPage />} />
              <Route path="packages" element={<PackagesPage />} />
              <Route path="guide" element={<UserGuidePage />} />

              <Route path="app" element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
                <Route path="profile" element={<ProfilePage />} />
                <Route path="progress" element={<ProgressPage />} />
                <Route path="history" element={<HistoryPage />} />
                <Route path="mock-interview" element={<MockInterviewPage />} />
                <Route path="live-interview" element={<LiveInterviewPage />} />
                <Route path="resume-analysis" element={<ResumeAnalysisPage />} />
                <Route path="learn/videos" element={<VideosPage />} />
                <Route path="learn/language" element={<LearnLanguagePage />} />
                <Route path="subscription-success" element={<SubscriptionSuccess />} />
              </Route>
            </Route>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/resetpassword/:resettoken" element={<ResetPasswordPage />} />

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="users" element={<UserManagementPage />} />
                <Route path="progress" element={<AdminProgressPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </Router>
    </Suspense>
  );
}

export default App;