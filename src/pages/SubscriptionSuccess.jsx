import React, { useEffect, useContext, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

// --- Icons ---
const SpinnerIcon = () => <div className="animate-spin rounded-full h-12 w-12 border-y-2 border-white"></div>;
const CheckCircleIcon = () => <svg className="w-20 h-20 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const WarningIcon = () => <svg className="w-20 h-20 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>;

const SubscriptionSuccess = () => {
    const { loadUser, token, API_URL } = useContext(AuthContext);
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { t } = useTranslation();

    const verifySubscription = useCallback(async () => {
        toast(t('sub_success_toast_verifying'));
        
        const config = { headers: { Authorization: `Bearer ${token}` } };

        for (let i = 0; i < 5; i++) {
            try {
                const { data } = await axios.get(`${API_URL}/users/subscription-status`, config);
                if (data.success && data.subscriptionTier === 'pro') {
                    await loadUser();
                    toast.success(t('sub_success_toast_activated'));
                    setLoading(false);
                    return;
                }
            } catch(e) {
                console.error("Polling error:", e);
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        setError(t('sub_success_error_delayed'));
        setLoading(false);
    }, [loadUser, token, API_URL, t]);

    useEffect(() => {
        if (searchParams.get('payment_status') === 'success') {
            verifySubscription();
        } else {
            setLoading(false);
            setError(t('sub_success_error_not_complete'));
        }
    }, [verifySubscription, searchParams, t]);
    
    if (loading) {
      return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white p-6 text-center">
          <SpinnerIcon />
          <p className="mt-4 text-lg text-gray-300">{t('sub_success_loading_text')}</p>
        </div>
      );
    }

    if (error) {
         return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white p-6 text-center">
                <WarningIcon />
                <h1 className="text-3xl font-bold text-yellow-400 mt-6">{t('sub_success_pending_title')}</h1>
                <p className="text-lg text-gray-400 mt-2 max-w-md">{error}</p>
            </div>
         );
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white p-6 text-center">
            <CheckCircleIcon />
            <h1 className="text-4xl font-extrabold text-white mt-6">{t('sub_success_activated_title')}</h1>
            <p className="text-lg text-gray-400 mt-2 max-w-md">{t('sub_success_activated_subtitle')}</p>
            <Link to="/app/profile" className="mt-8 text-white font-bold text-lg py-3 px-10 rounded-full transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-neon-pink to-bright-blue hover:shadow-[0_0_25px_theme(colors.neon-pink)]">
                {t('sub_success_button')}
            </Link>
        </div>
    );
};

export default SubscriptionSuccess;