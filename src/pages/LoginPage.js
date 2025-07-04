import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthContext from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

// --- Reusable Components ---
const SpinnerIcon = () => <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const AuthInput = (props) => <input className="w-full px-4 py-3 bg-[#222] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-pink" {...props} />;
const AuthButton = ({ loading, children, ...props }) => (
    <button className="w-full flex justify-center items-center bg-white text-black font-bold py-3 px-6 rounded-md transition-opacity hover:opacity-80 disabled:opacity-50" {...props}>
        {loading ? <SpinnerIcon /> : children}
    </button>
);

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const { t } = useTranslation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      toast.success(t('alert_login_success'));
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } else {
      toast.error(result.message || t('error_login_failed'));
    }
  };

  return (
    <AuthLayout titleKey="login_title_short">
        <h1 className="text-3xl font-bold text-white mb-6">{t('login_title')}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
            <AuthInput id="email" name="email" type="email" placeholder={t('auth_email_placeholder')} required />
            <AuthInput id="password" name="password" type="password" placeholder={t('auth_password_placeholder')} required />
            
            <div className="text-right text-sm">
            <Link to="/forgot-password" className="text-gray-400 hover:text-neon-pink transition-colors">{t('login_forgot_password')}</Link>
            </div>
            
            <AuthButton type="submit" loading={loading} disabled={loading}>
                {t('login_button')}
            </AuthButton>
            
            <div className="text-center text-sm text-gray-400">
            {t('login_no_account')}{' '}
            <Link to="/signup" className="font-semibold text-neon-pink hover:underline">{t('login_signup_link')}</Link>
            </div>
        </form>
    </AuthLayout>
  );
};

export default LoginPage;