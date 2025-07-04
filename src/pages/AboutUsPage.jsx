import React from 'react';
import { useTranslation } from 'react-i18next';

// --- Reusable Icons ---
const RobotIcon = () => <svg className="w-8 h-8 mb-4 text-neon-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M9 6h6v2H9V6z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 12h6"></path></svg>;
const SolutionIcon = () => <svg className="w-8 h-8 mb-4 text-neon-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>;
const AudioIcon = () => <svg className="w-8 h-8 mb-4 text-neon-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>;

// --- Feature Card Component ---
const FeatureCard = ({ icon, titleKey, descKey }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-xl p-8 text-center h-full transition-all duration-300 hover:border-neon-pink hover:-translate-y-2">
            {icon}
            <h3 className="text-xl font-bold text-white mb-3">{t(titleKey)}</h3>
            <p className="text-gray-400">{t(descKey)}</p>
        </div>
    );
};

// --- Main Page Component ---
const AboutUsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen bg-black">
      <video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover z-0 filter brightness-50">
        <source src="/background.mp4" type="video/mp4" />
      </video>
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-24">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto mb-20">
                <h1 className="text-5xl font-extrabold text-white mb-4">{t('about_title')}</h1>
                <p className="text-xl text-gray-300">{t('about_subtitle')}</p>
            </div>

            {/* Features Section */}
            <div>
                <h2 className="text-4xl font-bold text-center text-white mb-12">{t('about_features_title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard icon={<RobotIcon/>} titleKey="about_feature1_title" descKey="about_feature1_desc" />
                    <FeatureCard icon={<SolutionIcon/>} titleKey="about_feature2_title" descKey="about_feature2_desc" />
                    <FeatureCard icon={<AudioIcon/>} titleKey="about_feature3_title" descKey="about_feature3_desc" />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;