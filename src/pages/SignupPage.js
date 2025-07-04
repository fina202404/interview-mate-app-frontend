import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthContext from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import PoliciesModal from '../components/PoliciesModal';

// --- Reusable Components ---
const SpinnerIcon = () => <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const AuthInput = (props) => <input className="w-full px-4 py-3 bg-[#222] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-pink" {...props} />;
const AuthButton = ({ loading, children, ...props }) => (
    <button className="w-full flex justify-center items-center bg-white text-black font-bold py-3 px-6 rounded-md transition-opacity hover:opacity-80 disabled:opacity-50" {...props}>
        {loading ? <SpinnerIcon /> : children}
    </button>
);

const SignupPage = () => {
  const [loading, setLoading] = useState(false);
  const [isPoliciesModalOpen, setIsPoliciesModalOpen] = useState(false);
  const navigate = useNavigate();
  const { signup } = useContext(AuthContext);
  const { t } = useTranslation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    if (password !== confirmPassword) {
      toast.error(t('error_passwords_no_match'));
      return;
    }

    setLoading(true);
    const result = await signup(name, email, password);
    setLoading(false);
    if (result.success) {
      toast.success(result.message || t('alert_signup_success'));
      navigate('/login');
    } else {
      toast.error(result.message || t('error_signup_failed'));
    }
  };

  return (
    <>
        <AuthLayout titleKey="signup_title_short">
            <h1 className="text-3xl font-bold text-white mb-6">{t('signup_title')}</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <AuthInput id="username" name="username" type="text" placeholder={t('auth_username_placeholder')} required />
                <AuthInput id="email" name="email" type="email" placeholder={t('auth_email_placeholder')} required />
                <AuthInput id="password" name="password" type="password" placeholder={t('auth_password_placeholder_new')} minLength="6" required />
                <AuthInput id="confirmPassword" name="confirmPassword" type="password" placeholder={t('auth_confirm_password_placeholder')} required />
                
                <div className="flex items-center">
                    <input id="terms" name="terms" type="checkbox" className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-neon-pink focus:ring-neon-pink" required />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
                        {t('signup_terms_agree')}{' '}
                        <button type="button" onClick={() => setIsPoliciesModalOpen(true)} className="font-medium text-neon-pink hover:underline focus:outline-none">
                            {t('signup_terms_link')}
                        </button>
                    </label>
                </div>

                <AuthButton type="submit" loading={loading} disabled={loading}>
                    {t('signup_button_get_started')}
                </AuthButton>

                <div className="text-center text-sm text-gray-400">
                    {t('signup_has_account')}{' '}
                    <Link to="/login" className="font-semibold text-neon-pink hover:underline">{t('signup_login_link')}</Link>
                </div>
            </form>
        </AuthLayout>

        <PoliciesModal isOpen={isPoliciesModalOpen} onClose={() => setIsPoliciesModalOpen(false)} />
    </>
  );
};

export default SignupPage;