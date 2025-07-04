import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, Link } from 'react-router-dom';
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

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { resettoken } = useParams();
  const { resetPassword } = useContext(AuthContext);
  const { t } = useTranslation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    if (password !== confirmPassword) {
        setError(t('error_passwords_no_match'));
        return;
    }

    setLoading(true);
    setError('');
    const result = await resetPassword(resettoken, password);
    setLoading(false);
    if (result.success) {
      alert(result.message || t('alert_reset_password_success'));
      navigate('/login');
    } else {
      setError(result.message || t('error_reset_password_failed'));
    }
  };

  return (
    <AuthLayout titleKey="reset_password_title_short">
        <h1 className="text-3xl font-bold text-white mb-6">{t('reset_password_title')}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="p-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg text-center">{error}</div>}
            
            <AuthInput id="password" name="password" type="password" placeholder={t('auth_new_password_placeholder')} minLength="6" required />
            <AuthInput id="confirmPassword" name="confirmPassword" type="password" placeholder={t('auth_confirm_password_placeholder')} required />
            
            <AuthButton type="submit" loading={loading} disabled={loading}>
                {t('reset_password_button')}
            </AuthButton>

            <div className="text-center text-sm text-gray-400">
                <Link to="/login" className="font-semibold text-neon-pink hover:underline">{t('auth_back_to_login')}</Link>
            </div>
        </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;