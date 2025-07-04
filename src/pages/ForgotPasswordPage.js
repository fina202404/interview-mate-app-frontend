import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
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

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { API_URL } = useContext(AuthContext);
  const { t } = useTranslation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;

    setLoading(true);
    setError('');
    setMessage('');
    try {
        const response = await fetch(`${API_URL}/auth/forgotpassword`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'An error occurred.');
        
        setMessage(data.message || t('alert_forgot_password_success'));
    } catch (err) {
        setError(err.message || t('error_generic'));
    } finally {
        setLoading(false);
    }
  };

  return (
    <AuthLayout titleKey="forgot_password_title_short">
        <h1 className="text-3xl font-bold text-white mb-2">{t('forgot_password_title')}</h1>
        <p className="text-center text-gray-400 mb-6">{t('forgot_password_subtitle')}</p>
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="p-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg text-center">{error}</div>}
            {message && <div className="p-3 bg-green-500/20 text-green-300 border border-green-500/30 rounded-lg text-center">{message}</div>}
            
            {!message && (
                <>
                    <AuthInput id="email" name="email" type="email" placeholder={t('auth_email_placeholder')} required />
                    <AuthButton type="submit" loading={loading} disabled={loading}>
                        {t('forgot_password_button')}
                    </AuthButton>
                </>
            )}

            <div className="text-center text-sm text-gray-400">
                <Link to="/login" className="font-semibold text-neon-pink hover:underline">{t('auth_back_to_login')}</Link>
            </div>
        </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;