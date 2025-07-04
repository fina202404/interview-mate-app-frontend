import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// --- Reusable Icons ---
const CheckmarkIcon = () => <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>;
const StarIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
const SpinnerIcon = () => <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

// --- Plan Data ---
const plansData = [
    { tier: 'free', priceKey: 'plan_free_price', popular: false, features: ['plan_free_feature_1', 'plan_free_feature_2', 'plan_free_feature_3'] },
    { tier: 'pro', priceKey: 'plan_pro_price', popular: true, features: ['plan_pro_feature_1', 'plan_pro_feature_2', 'plan_pro_feature_3', 'plan_pro_feature_4'] },
    { tier: 'enterprise', priceKey: 'plan_enterprise_price', popular: false, features: ['plan_enterprise_feature_1', 'plan_enterprise_feature_2', 'plan_enterprise_feature_3', 'plan_enterprise_feature_4'] }
];

// --- Main Component ---
const PackagesPage = () => {
    const { t } = useTranslation();
    const [loadingPlan, setLoadingPlan] = useState(null);
    const { token, API_URL, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubscribe = async (plan) => {
        if (!token) {
            // Consider adding a toast message library for better UX
            alert('Please log in to choose a plan.');
            navigate('/login');
            return;
        }
        if (plan.tier === 'enterprise') {
            alert('Please contact our sales team for enterprise pricing.');
            return;
        }

        setLoadingPlan(plan.tier);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.post(`${API_URL}/checkout/create-checkout-session`, { plan: plan.tier }, config);
            if (res.data.url) {
                window.location.href = res.data.url; // Redirect user to Stripe
            }
        } catch (err) {
            alert("Failed to start subscription process. Please try again.");
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <div className="bg-black text-gray-200 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold text-white mb-4">{t('packages_title')}</h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">{t('packages_subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                    {plansData.map(plan => (
                        <div key={plan.tier} className={`relative bg-gray-900/50 border rounded-2xl p-8 flex flex-col transition-all duration-300 ${plan.popular ? 'border-neon-pink shadow-2xl shadow-neon-pink/20' : 'border-white/10'}`}>
                            {plan.popular && (
                                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                                    <div className="flex items-center gap-2 bg-neon-pink text-white text-sm font-bold px-4 py-1 rounded-full">
                                        <StarIcon />
                                        {t('plan_popular')}
                                    </div>
                                </div>
                            )}

                            <h3 className="text-2xl font-bold text-center text-white capitalize">{t(`plan_${plan.tier}_name`)}</h3>
                            
                            <div className="text-center my-8">
                                <span className="text-5xl font-extrabold text-white">{t(plan.priceKey)}</span>
                                {plan.tier !== 'enterprise' && <span className="text-gray-400">{t('plan_per_month')}</span>}
                            </div>

                            <ul className="space-y-4 text-left my-8 flex-grow">
                                {plan.features.map(featureKey => (
                                    <li key={featureKey} className="flex items-start">
                                        <CheckmarkIcon />
                                        <span className="ml-3 text-gray-300">{t(featureKey)}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSubscribe(plan)}
                                disabled={loadingPlan === plan.tier || user?.subscriptionTier === plan.tier}
                                className={`w-full text-white font-bold text-lg py-4 px-10 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${plan.popular ? 'bg-gradient-to-r from-neon-pink to-bright-blue hover:shadow-[0_0_25px_theme(colors.neon-pink)]' : 'bg-gray-700 hover:bg-gray-600'}`}
                            >
                                {loadingPlan === plan.tier ? <SpinnerIcon /> : 
                                 user?.subscriptionTier === plan.tier ? t('plan_button_current') :
                                 plan.tier === 'enterprise' ? t('plan_button_contact') : t('plan_button_choose')}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PackagesPage;