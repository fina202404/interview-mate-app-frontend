import React from 'react';
import { useTranslation } from 'react-i18next';

const GuideStep = ({ number, title, children }) => (
    <div className="relative pl-12 pb-8 border-l-2 border-deep-purple">
        <div className="absolute -left-5 top-0 w-10 h-10 bg-bright-blue rounded-full flex items-center justify-center text-white font-bold text-lg ring-4 ring-black">
            {number}
        </div>
        <h3 className="text-2xl font-bold text-neon-pink mb-2">{title}</h3>
        <p className="text-gray-300">{children}</p>
    </div>
);

const UserGuidePage = () => {
    const { t } = useTranslation();
  return (
    <div className="bg-black text-white min-h-screen py-24">
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-extrabold mb-4">
                    <span className="bg-gradient-to-r from-neon-pink to-bright-blue text-transparent bg-clip-text">
                        {t('guide_main_title')}
                    </span>
                </h1>
                <p className="text-xl text-gray-400">{t('guide_main_subtitle')}</p>
            </div>

            <div className="max-w-3xl mx-auto">
                <GuideStep number="1" title={t('guide_step_1_title')}>{t('guide_step_1_desc')}</GuideStep>
                <GuideStep number="2" title={t('guide_step_2_title')}>{t('guide_step_2_desc')}</GuideStep>
                <GuideStep number="3" title={t('guide_step_3_title')}>{t('guide_step_3_desc')}</GuideStep>
                <GuideStep number="4" title={t('guide_step_4_title')}>{t('guide_step_4_desc')}</GuideStep>
                <GuideStep number="5" title={t('guide_step_5_title')}>{t('guide_step_5_desc')}</GuideStep>
                <GuideStep number="6" title={t('guide_step_6_title')}>{t('guide_step_6_desc')}</GuideStep>
            </div>
        </div>
    </div>
  );
};

export default UserGuidePage;