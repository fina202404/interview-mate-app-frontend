import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

// This data could eventually come from a backend, but for now, we'll define it here.
const videosData = [
  {
    id: 1,
    embedUrl: 'https://www.youtube.com/embed/2LHFTr2xKa4',
    titleKey: 'video1_title',
    ownerKey: 'video1_owner',
  },
  {
    id: 2,
    embedUrl: 'https://www.youtube.com/embed/bwsnzk-kPD4',
    titleKey: 'video2_title',
    ownerKey: 'video2_owner',
  },
  {
    id: 3,
    embedUrl: 'https://www.youtube.com/embed/6bJTEZnTT5A',
    titleKey: 'video3_title',
    ownerKey: 'video3_owner',
  },
  {
    id: 4,
    embedUrl: 'https://www.youtube.com/embed/mmQcX6HpCGs',
    titleKey: 'video4_title',
    ownerKey: 'video4_owner',
  },
  {
    id: 5,
    embedUrl: 'https://www.youtube.com/embed/mXYFnK0UPa4',
    titleKey: 'video5_title',
    ownerKey: 'video5_owner',
  },
];

const VideosPage = () => {
  const { t } = useTranslation();
  // Set the first video as the default active video
  const [activeVideo, setActiveVideo] = useState(videosData[0]);

  return (
    <div className="bg-black text-gray-200 min-h-screen">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 p-4 sm:p-6 lg:p-8">
        
        {/* Left Sidebar: Video Playlist */}
        <div className="lg:col-span-1 w-full lg:h-[calc(100vh-8rem)] lg:sticky lg:top-28">
            <h2 className="text-2xl font-bold text-white mb-4">{t('videos_page_title')}</h2>
            <div className="bg-gray-900/50 border border-white/10 rounded-xl p-2 space-y-2 h-full max-h-[40vh] lg:max-h-full overflow-y-auto">
              {videosData.map((video) => (
                <button
                  key={video.id}
                  onClick={() => setActiveVideo(video)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-4 ${activeVideo.id === video.id ? 'bg-gradient-to-r from-neon-pink to-bright-blue' : 'hover:bg-white/10'}`}
                >
                  <div className={`w-10 h-10 flex-shrink-0 rounded-md flex items-center justify-center font-bold text-lg ${activeVideo.id === video.id ? 'bg-white text-black' : 'bg-deep-purple text-white'}`}>
                    {video.id}
                  </div>
                  <div>
                    <h3 className={`font-semibold leading-tight ${activeVideo.id === video.id ? 'text-white' : 'text-gray-200'}`}>{t(video.titleKey)}</h3>
                  </div>
                </button>
              ))}
            </div>
        </div>

        {/* Right Content: Main Video Player */}
        <div className="lg:col-span-3 w-full">
            <div className="w-full">
                {/* UPDATE: This is the new, robust video container.
                  It uses a classic CSS trick (`padding-top: 56.25%`) to maintain a 16:9 aspect ratio.
                */}
                <div className="relative w-full bg-black rounded-xl overflow-hidden shadow-2xl shadow-neon-pink/10" style={{ paddingTop: '56.25%' }}>
                  <iframe
                      src={activeVideo.embedUrl}
                      title={t(activeVideo.titleKey)}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      className="absolute top-0 left-0 w-full h-full"
                  ></iframe>
                </div>
                <div className="mt-6 px-2">
                  <h2 className="text-3xl font-bold text-white">{t(activeVideo.titleKey)}</h2>
                  <p className="text-md text-gray-500 mt-1">{t('video_credit')} <span className="text-neon-pink">{t(activeVideo.ownerKey)}</span></p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default VideosPage;