import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const AuthLayout = ({ titleKey, children }) => {
    const { t } = useTranslation();

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center">
        <div className="w-full max-w-6xl h-screen lg:h-auto lg:max-h-[900px] flex flex-col lg:flex-row">
            
            {/* Left Column: Brand & Info */}
            <div className="hidden lg:flex flex-col justify-center items-start w-full lg:w-1/2 bg-[#2B0245] p-12 text-white">
                <Link to="/" className="mb-8">
                    <span className="text-white font-bold text-3xl">
                        Interview<span className="text-neon-pink">Mate</span>
                    </span>
                </Link>
                <h1 className="text-5xl font-bold leading-tight mb-4">{t('auth_promo_title')}</h1>
                <p className="text-lg text-gray-300">{t('auth_promo_subtitle')}</p>
            </div>

            {/* Right Column: Form */}
            <div className="w-full lg:w-1/2 bg-[#121212] p-8 sm:p-12 flex flex-col justify-center">
                <div className="w-full max-w-md mx-auto">
                    <h2 className="text-sm font-bold uppercase text-gray-400 mb-2">{t(titleKey)}</h2>
                    {children}
                </div>
            </div>
        </div>
    </div>
  );
};

export default AuthLayout;