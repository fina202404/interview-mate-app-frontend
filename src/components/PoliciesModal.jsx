import React from 'react';
import { useTranslation } from 'react-i18next';

// Close Icon SVG
const IconClose = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>;

// Reusable component for each policy section
const PolicySection = ({ titleKey, children }) => {
    const { t } = useTranslation();
    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-3">{t(titleKey)}</h2>
            <div className="space-y-4 text-gray-400 text-base leading-relaxed">
                {children}
            </div>
        </div>
    );
};

const PoliciesModal = ({ isOpen, onClose }) => {
    const { t } = useTranslation();

    if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#121212] border border-white/10 rounded-2xl shadow-2xl flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
                <h1 className="text-2xl font-bold text-white">{t('policies_main_title')}</h1>
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10">
                    <IconClose />
                </button>
            </div>

            <div className="p-8 overflow-y-auto">
                <PolicySection titleKey="policies_terms_title">
                    <p>{t('policies_terms_p1')}</p>
                    <p>{t('policies_terms_p2')}</p>
                    <p>{t('policies_terms_p3')}</p>
                </PolicySection>

                <PolicySection titleKey="policies_privacy_title">
                    <p>{t('policies_privacy_p1')}</p>
                    <p>{t('policies_privacy_p2')}</p>
                </PolicySection>
                
                <PolicySection titleKey="policies_ai_title">
                    <p>{t('policies_ai_p1')}</p>
                    <p>{t('policies_ai_p2')}</p>
                </PolicySection>
            </div>

            <div className="p-6 border-t border-white/10 text-right">
                <button 
                    onClick={onClose}
                    className="bg-white text-black font-bold py-2 px-6 rounded-md transition-opacity hover:opacity-80"
                >
                    {t('policies_close_button')}
                </button>
            </div>
        </div>
    </div>
  );
};

export default PoliciesModal;