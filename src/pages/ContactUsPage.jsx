import React from 'react';
import { useTranslation } from 'react-i18next';

// --- Reusable Icons ---
const MailIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>;
const QuestionIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;

const ContactUsPage = () => {
    const { t } = useTranslation();
  return (
    <div className="bg-gradient-to-br from-[#1A202C] via-black to-deep-purple/20 text-white min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl">
        <h1 className="text-5xl font-extrabold mb-4">{t('contact_title')}</h1>
        <p className="text-xl text-gray-400 mb-12">{t('contact_subtitle')}</p>
      </div>

      <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl w-full max-w-lg p-8 transition-all duration-300 hover:border-neon-pink hover:shadow-2xl hover:shadow-neon-pink/10">
        <h2 className="flex items-center justify-center gap-3 text-2xl font-bold text-white mb-4">
            <QuestionIcon />
            {t('contact_card_title')}
        </h2>
        <p className="text-gray-300 mb-8">{t('contact_card_desc')}</p>
        <a 
          href="mailto:support@interviewmate.com"
          className="inline-flex items-center justify-center text-white font-bold text-lg py-3 px-10 rounded-full transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-neon-pink to-bright-blue hover:shadow-[0_0_25px_theme(colors.neon-pink)]"
        >
          <MailIcon />
          {t('contact_card_button')}
        </a>
      </div>
    </div>
  );
};

export default ContactUsPage;