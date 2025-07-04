import React from 'react';
import { useTranslation } from 'react-i18next';

const XIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const LinkedinIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
    </svg>
);


const AppFooter = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10 text-gray-500">
      <div className="container mx-auto px-6 py-8">
        {/* UPDATE: Switched from Flexbox to a more stable Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {/* Copyright */}
            <div className="md:text-left">
                <p className="text-sm">
                    {t('footer_copyright', { year: currentYear })}
                </p>
            </div>

            {/* Logo */}
            <div className="flex justify-center items-center">
                <span className="text-white font-bold text-xl bg-gradient-to-r from-neon-pink to-bright-blue text-transparent bg-clip-text">
                  InterviewMate
                </span>
            </div>

            {/* Social Links */}
            <div className="flex justify-center md:justify-end gap-6">
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    <XIcon />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    <LinkedinIcon />
                </a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;