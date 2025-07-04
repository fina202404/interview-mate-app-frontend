import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const IconAlert = () => <svg className="w-16 h-16 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>;

const NotFoundPage = () => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white p-6 text-center">
            <IconAlert />
            <h1 className="mt-6 text-8xl font-extrabold text-white">404</h1>
            <h2 className="text-3xl font-bold text-gray-300 mt-2">{t('not_found_title')}</h2>
            <p className="text-lg text-gray-500 mt-2 max-w-md">{t('not_found_subtitle')}</p>
            <Link to="/" className="mt-8 text-white font-bold text-lg py-3 px-10 rounded-full transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-neon-pink to-bright-blue hover:shadow-[0_0_25px_theme(colors.neon-pink)]">
                {t('not_found_button')}
            </Link>
        </div>
    );
};

export default NotFoundPage;