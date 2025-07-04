import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const InfinityIcon = () => <svg className="w-5 h-5 text-gray-300" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512"><path d="M256 256c0 52.022-50.623 94.137-110.198 94.137-58.31 0-105.802-42.115-105.802-94.137 0-52.022 47.492-94.137 105.802-94.137C205.377 161.863 256 203.978 256 256zM366.198 256c0-52.022 50.623-94.137 110.198-94.137 58.31 0 105.802 42.115 105.802 94.137 0 52.022-47.492 94.137-105.802 94.137-59.575 0-110.198-42.115-110.198-94.137z"></path></svg>;

const UsageTracker = ({ featureName, count, max, tier }) => {
    const { t } = useTranslation();
    const isUnlimited = tier === 'enterprise' || max === null || max < 0;
    const isFull = !isUnlimited && count >= max;
    const usagePercent = !isUnlimited && max > 0 ? (count / max) * 100 : 0;
  
    return (
      <div className={`p-4 rounded-lg ${isFull ? 'bg-red-900/30' : 'bg-gray-800/50'}`}>
        <div className="flex justify-between items-baseline mb-2">
          <p className="font-semibold text-gray-200">{featureName}</p>
          <div className="font-mono text-sm font-semibold">
            {isUnlimited ? (
              <span className="flex items-center gap-1 text-neon-pink"><InfinityIcon/> {t('usage_unlimited')}</span>
            ) : (
              <span className={isFull ? 'text-red-400' : 'text-white'}>{count} / {max}</span>
            )}
          </div>
        </div>
        {!isUnlimited && (
          <div className="w-full bg-black rounded-full h-2.5">
            <div className={`h-2.5 rounded-full ${isFull ? 'bg-red-500' : 'bg-gradient-to-r from-bright-blue to-neon-pink'}`} style={{ width: `${usagePercent}%` }}></div>
          </div>
        )}
        {isFull && tier !== 'enterprise' && (
             <p className="text-xs text-red-300 mt-2">{t('usage_limit_reached_pre')} <Link to="/packages" className="font-bold underline hover:text-white">{t('usage_limit_reached_link')}</Link> {t('usage_limit_reached_post')}</p>
        )}
      </div>
    );
};

export default UsageTracker;