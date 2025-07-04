import React from 'react';
import { useTranslation } from 'react-i18next';

// Data for the learning resource cards
const learningSites = [
  {
    titleKey: 'learn_bbc_title',
    descriptionKey: 'learn_bbc_desc',
    imageUrl: '/learning_sites/BBC.png',
    link: 'https://www.bbc.co.uk/learningenglish/',
    tags: ['English', 'Grammar', 'News'],
  },
  {
    titleKey: 'learn_nhk_title',
    descriptionKey: 'learn_nhk_desc',
    imageUrl: '/learning_sites/NHK.png',
    link: 'https://www3.nhk.or.jp/nhkworld/en/learnjapanese/',
    tags: ['Japanese', 'Conversation', 'Culture'],
  },
  {
    titleKey: 'learn_ted_title',
    descriptionKey: 'learn_ted_desc',
    imageUrl: '/learning_sites/ted.com.png',
    link: 'https://www.ted.com/',
    tags: ['English', 'Listening', 'Ideas'],
  },
  {
    titleKey: 'learn_exam_title',
    descriptionKey: 'learn_exam_desc',
    imageUrl: '/learning_sites/exam_english.png',
    link: 'https://www.examenglish.com/',
    tags: ['English', 'IELTS', 'TOEFL'],
  },
];

// Card component
const ResourceCard = ({ site }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-gray-900/50 border border-white/10 rounded-xl overflow-hidden flex flex-col group transition-all duration-300 hover:border-neon-pink hover:shadow-2xl hover:shadow-neon-pink/10">
      <div className="overflow-hidden">
        <img src={site.imageUrl} alt={t(site.titleKey)} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-2">{t(site.titleKey)}</h3>
        <p className="text-gray-400 mb-4 flex-grow">{t(site.descriptionKey)}</p>
        <div className="flex flex-wrap gap-2 mb-6">
            {site.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-deep-purple text-xs text-gray-200 rounded-full">{tag}</span>
            ))}
        </div>
        <a 
          href={site.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-auto block text-center w-full bg-bright-blue text-white font-semibold py-3 px-6 rounded-lg hover:bg-royal-blue transition-colors"
        >
          {t('visit_site_button')}
        </a>
      </div>
    </div>
  );
};


const LearnLanguagePage = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-black text-gray-200 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
            <h1 className="text-5xl font-extrabold text-white mb-4">
              <span className="bg-gradient-to-r from-neon-pink to-bright-blue text-transparent bg-clip-text">
                {t('learn_page_title')}
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">{t('learn_page_subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {learningSites.map((site) => (
            <ResourceCard key={site.titleKey} site={site} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearnLanguagePage;