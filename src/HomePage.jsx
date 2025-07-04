import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // UPDATE: 'useNavigate' has been removed from this line
import { useTranslation } from 'react-i18next';

// --- SVG Icons ---
const MuteIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M7 9a.75.75 0 011.5 0v1.373l-1.5-1.5V9zm-1.25-1.25a.75.75 0 011.5 0v2.5l-1.5-1.5V7.75zM4 9a.75.75 0 011.5 0v1.373l-1.5-1.5V9zM2.75 7.75a.75.75 0 011.5 0v2.5L2.75 8.873V7.75zM10 2.5a.75.75 0 00-1.5 0v5.873L6.51 6.383A2.25 2.25 0 004 7.953V12.5A2.25 2.25 0 006.25 14.75h.34l7.66 7.66a.75.75 0 001.06-1.06L3.56 3.56a.75.75 0 00-1.06 1.06L5 7.05v5.45A3.75 3.75 0 011.25 9 3.75 3.75 0 015 5.25v-.104l4.25-2.656V10a.75.75 0 001.5 0V2.5zm5.03 4.22a.75.75 0 010 1.06l-1.72 1.72 1.06 1.06 1.72-1.72a.75.75 0 111.06 1.06l-1.72 1.72 1.06 1.06 1.72-1.72a.75.75 0 10-1.06-1.06l-1.72 1.72-1.06-1.06-1.72 1.72a.75.75 0 11-1.06-1.06l1.72-1.72-1.06-1.06-1.72 1.72a.75.75 0 01-1.06-1.06l1.72-1.72 1.06 1.06 1.72-1.72a.75.75 0 011.06 0z" /></svg>;
const UnmuteIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M7.75 2.75a.75.75 0 00-1.5 0v14.5a.75.75 0 001.5 0V2.75zM4 6.25a.75.75 0 00-1.5 0v7.5a.75.75 0 001.5 0v-7.5zM10.25 4a.75.75 0 00-1.5 0v12a.75.75 0 001.5 0v-12zM13.5 6.25a.75.75 0 00-1.5 0v7.5a.75.75 0 001.5 0v-7.5zM16.75 8a.75.75 0 00-1.5 0v4a.75.75 0 001.5 0v-4z" /></svg>;
const CheckmarkIcon = () => <svg className="w-6 h-6 text-neon-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>;


const HomePage = () => {
  const { t } = useTranslation();
  // UPDATE: The unused 'navigate' variable has been removed from this line
  const [isMuted, setIsMuted] = useState(true);

  // --- SECTION 1: Main Hero ---
  const HeroSection = () => (
    <section className="relative h-screen flex flex-col items-center justify-center p-4 border-0">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/bg1.mp4"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black/70 z-10"></div>
      
      <div className="relative z-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-gray-200 via-white to-gray-400 text-transparent bg-clip-text">
            {t('hero_title_1')}
          </span>
        </h1>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          <span className="bg-gradient-to-r from-gray-200 via-white to-gray-400 text-transparent bg-clip-text">
            {t('hero_title_2')}
          </span>
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-gray-400 mb-10">
          {t('hero_subtitle')}
        </p>

        <Link to="/guide">
          <button className="text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-neon-pink via-deep-purple to-bright-blue hover:shadow-[0_0_25px_theme(colors.neon-pink)]">
              {t('user_guide_button')}
          </button>
        </Link>
      </div>
    </section>
  );

  // --- SECTION 2: Restored Emmy Video Section ---
  const EmmySection = () => (
    <section className="bg-black text-white py-16 lg:py-24">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-6">
        <div className="lg:pr-10">
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-6" dangerouslySetInnerHTML={{ __html: t('emmy_section_title').replace('Dynamic AI,', '<span class="text-neon-pink">Dynamic AI,</span>') }} />
          <p className="text-lg text-gray-400 max-w-xl mb-8">
            {t('emmy_section_subtitle')}
          </p>
          <div className="space-y-3">
            <div className="p-4 border-l-4 border-deep-purple cursor-pointer transition-all duration-300 hover:border-neon-pink hover:bg-neon-pink/10 hover:translate-x-3">{t('feature_1')}</div>
            <div className="p-4 border-l-4 border-deep-purple cursor-pointer transition-all duration-300 hover:border-neon-pink hover:bg-neon-pink/10 hover:translate-x-3">{t('feature_2')}</div>
            <div className="p-4 border-l-4 border-deep-purple cursor-pointer transition-all duration-300 hover:border-neon-pink hover:bg-neon-pink/10 hover:translate-x-3">{t('feature_3')}</div>
          </div>
        </div>

        <div className="relative w-full h-[70vh] rounded-lg overflow-hidden">
           <video
            autoPlay
            loop
            muted={isMuted}
            className="absolute top-0 left-0 w-full h-full object-cover"
            src="/Emmy.mp4"
          />
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute top-4 right-4 z-20 w-12 h-12 bg-black/50 text-white/70 rounded-full flex items-center justify-center border border-white/30 backdrop-blur-sm hover:bg-white/20 hover:text-white transition-all"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? <MuteIcon /> : <UnmuteIcon />}
          </button>
        </div>
      </div>
    </section>
  );

  // --- SECTION 3: "Why Choose Us" Section ---
  const FeaturesGrid = () => (
    <div className="bg-black text-white py-16 lg:py-24">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-2" dangerouslySetInnerHTML={{ __html: t('why_choose_title').replace('InterviewMate', '<span class="text-bright-blue">InterviewMate</span>') }} />
        <p className="text-lg text-gray-500 mb-12">{t('why_choose_subtitle')}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-900/50 border border-white/10 rounded-xl p-8">
            <h3 className="text-xl font-bold text-neon-pink mb-4">{t('feature_grid_1_title')}</h3>
            <p className="text-gray-400">{t('feature_grid_1_desc')}</p>
          </div>
          <div className="bg-gray-900/50 border border-white/10 rounded-xl p-8">
            <h3 className="text-xl font-bold text-neon-pink mb-4">{t('feature_grid_2_title')}</h3>
            <p className="text-gray-400">{t('feature_grid_2_desc')}</p>
          </div>
          <div className="bg-gray-900/50 border border-white/10 rounded-xl p-8">
            <h3 className="text-xl font-bold text-neon-pink mb-4">{t('feature_grid_3_title')}</h3>
            <p className="text-gray-400">{t('feature_grid_3_desc')}</p>
          </div>
        </div>
      </div>
    </div>
  );

  // --- SECTION 4: Testimonials Section ---
  const Testimonials = () => (
    <div className="bg-black text-white py-16 lg:py-24">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-12">{t('testimonials_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900/50 border border-white/10 rounded-xl p-8 text-left">
                <p className="text-gray-300 mb-6">{t('testimonial_1_quote')}</p>
                <div className="flex items-center">
                    <img src="/Anuka_Senarathna.png" alt={t('testimonial_1_author')} className="w-12 h-12 rounded-full mr-4 object-cover"/>
                    <div>
                        <p className="font-bold text-white">{t('testimonial_1_author')}</p>
                        <p className="text-sm text-gray-500">{t('testimonial_1_role')}</p>
                    </div>
                </div>
            </div>
            <div className="bg-gray-900/50 border border-white/10 rounded-xl p-8 text-left">
                <p className="text-gray-300 mb-6">{t('testimonial_2_quote')}</p>
                <div className="flex items-center">
                    <img src="/Rajitha_Perera.png" alt={t('testimonial_2_author')} className="w-12 h-12 rounded-full mr-4 object-cover"/>
                    <div>
                        <p className="font-bold text-white">{t('testimonial_2_author')}</p>
                        <p className="text-sm text-gray-500">{t('testimonial_2_role')}</p>
                    </div>
                </div>
            </div>
            <div className="bg-gray-900/50 border border-white/10 rounded-xl p-8 text-left">
                <p className="text-gray-300 mb-6">{t('testimonial_3_quote')}</p>
                <div className="flex items-center">
                    <img src="/Lakshika_Jayawardhana.png" alt={t('testimonial_3_author')} className="w-12 h-12 rounded-full mr-4 object-cover"/>
                    <div>
                        <p className="font-bold text-white">{t('testimonial_3_author')}</p>
                        <p className="text-sm text-gray-500">{t('testimonial_3_role')}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );

  // --- SECTION 5: Pricing Preview Section ---
  const PricingPreview = () => (
      <div className="bg-gradient-to-t from-deep-purple/20 to-black text-white py-16 lg:py-24">
          <div className="container mx-auto px-6 text-center">
              <h2 className="text-4xl font-bold mb-4">{t('pricing_title')}</h2>
              <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">{t('pricing_subtitle')}</p>
              <div className="max-w-md mx-auto bg-black/50 border border-white/10 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-neon-pink">{t('pricing_plan_name')}</h3>
                  <p className="text-5xl font-bold my-4">¥1000<span className="text-lg text-gray-400">{t('pricing_per_month')}</span></p>
                  <ul className="space-y-4 text-left my-8">
                      <li className="flex items-center"><CheckmarkIcon/> <span className="ml-3">{t('pricing_feature_1')}</span></li>
                      <li className="flex items-center"><CheckmarkIcon/> <span className="ml-3">{t('pricing_feature_2')}</span></li>
                      <li className="flex items-center"><CheckmarkIcon/> <span className="ml-3">{t('pricing_feature_3')}</span></li>
                  </ul>
                  <Link to="/packages">
                    <button className="w-full text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-neon-pink to-bright-blue hover:shadow-[0_0_25px_theme(colors.neon-pink)]">
                        {t('pricing_button')}
                    </button>
                  </Link>
              </div>
          </div>
      </div>
  );

  return (
    <div className="bg-black">
      <HeroSection />
      <EmmySection />
      <FeaturesGrid />
      <Testimonials />
      <PricingPreview />
    </div>
  );
};

export default HomePage;