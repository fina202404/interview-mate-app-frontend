import React, { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import moment from 'moment';

// --- Reusable Icons ---
const SpinnerIcon = () => <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const TrophyIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.725 3.055a2.25 2.25 0 012.25 0gM10.725 3.055a2.25 2.25 0 00-2.25 0gM12 3v-2.25m0 16.5v2.25m0 0a2.25 2.25 0 01-2.25 0m2.25 0a2.25 2.25 0 002.25 0m-16.5-2.25a2.25 2.25 0 010-2.25m18.75 2.25a2.25 2.25 0 000-2.25M4.5 12a2.25 2.25 0 01-2.25 0m16.5 0a2.25 2.25 0 00-2.25 0m-12-3.75a2.25 2.25 0 010-2.25m12 2.25a2.25 2.25 0 000-2.25"></path></svg>;

// --- Chart Tooltip Component ---
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-black/70 backdrop-blur-md border border-white/20 rounded-lg p-4 text-sm">
        <p className="font-bold text-white mb-2 pb-2 border-b border-white/20">{`Job: ${data.job}`}</p>
        <p className="text-neon-pink font-bold">{`Total Score : ${data.score}`}</p>
        <p className="text-gray-400 mt-1">{`Date: ${data.formattedDate}`}</p>
      </div>
    );
  }
  return null;
};

// --- Main Page Component ---
const ProgressPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, API_URL } = useContext(AuthContext);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchSessions = async () => {
      if (!token) { setLoading(false); return; }
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/progress`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const validSessions = res.data.map((s) => ({
          ...s,
          score: (s.clarity || 0) + (s.relevance || 0),
          name: moment(s.createdAt).format('MMM D'),
          formattedDate: moment(s.createdAt).format('L LT'),
          job: s.job || 'General'
        })).filter(s => s.score > 0);
        
        validSessions.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setSessions(validSessions);
      } catch (err) {
        console.error('Failed to load progress data.', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [token, API_URL]);

  const totalXP = sessions.reduce((acc, s) => acc + s.score, 0);
  const level = Math.floor(totalXP / 100);
  const nextLevelXP = (level + 1) * 100;
  const progressPercent = nextLevelXP > 0 ? parseFloat(((totalXP % 100)).toFixed(2)) : 0;

  const getRank = (lvl) => {
      if (lvl >= 10) return { key: 'rank_elite', color: 'bg-yellow-500/20 text-yellow-300' };
      if (lvl >= 5) return { key: 'rank_star', color: 'bg-sky-500/20 text-sky-300' };
      if (lvl >= 1) return { key: 'rank_beginner', color: 'bg-green-500/20 text-green-300' };
      return { key: 'rank_newbie', color: 'bg-gray-500/20 text-gray-300' };
  };
  const rank = getRank(level);

  if(loading) return <div className="flex justify-center items-center h-[50vh]"><SpinnerIcon /></div>;

  return (
    <div className="bg-black text-gray-200 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-2">{t('progress_title')}</h1>
            <p className="text-lg text-gray-400">{t('progress_subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 gap-8">
            {/* Rank & Level Card */}
            <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6">
                <h3 className="flex items-center gap-3 text-xl font-bold text-white mb-6"><TrophyIcon /> {t('progress_rank_card_title')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <p className="text-sm text-gray-400 uppercase tracking-wider">{t('progress_level')}</p>
                        <p className="text-4xl font-extrabold text-white">{level}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-400 uppercase tracking-wider">{t('progress_rank')}</p>
                        <span className={`px-4 py-1 mt-2 inline-block text-lg font-bold rounded-full ${rank.color}`}>{t(rank.key)}</span>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-400 uppercase tracking-wider">{t('progress_xp')}</p>
                        <p className="text-2xl font-bold text-white mt-2">{totalXP % 100} / 100</p>
                        <div className="w-full bg-black rounded-full h-2.5 mt-2">
                            <div className="bg-gradient-to-r from-bright-blue to-neon-pink h-2.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Trend Card */}
            <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">{t('progress_chart_title')}</h3>
                <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sessions} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#E923F4" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#E923F4" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                            <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.5)" />
                            <YAxis domain={[0, 20]} stroke="rgba(255, 255, 255, 0.5)" />
                            <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(233, 35, 244, 0.1)' }}/>
                            <Area type="monotone" dataKey="score" name="Score" stroke="#E923F4" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;