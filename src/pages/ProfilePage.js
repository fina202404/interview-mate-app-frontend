import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

// --- Reusable Icons & Components ---
const SpinnerIcon = () => <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const AuthInput = (props) => <input className="w-full px-4 py-3 bg-[#222] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-pink" {...props} />;
const UserAvatar = ({ user }) => ( <img src={user?.avatar || '/profile.png'} alt="User Profile" className="w-24 h-24 rounded-full object-cover border-4 border-deep-purple mx-auto" /> );
const SaveIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1-4l-3 3m0 0l-3-3m3 3V3"></path></svg>;
const CloseIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>;
const InfinityIcon = () => <svg className="w-5 h-5 text-gray-300" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512"><path d="M256 256c0 52.022-50.623 94.137-110.198 94.137-58.31 0-105.802-42.115-105.802-94.137 0-52.022 47.492-94.137 105.802-94.137C205.377 161.863 256 203.978 256 256zM366.198 256c0-52.022 50.623-94.137 110.198-94.137 58.31 0 105.802 42.115 105.802 94.137 0 52.022-47.492 94.137-105.802 94.137-59.575 0-110.198-42.115-110.198-94.137z"></path></svg>;

// --- CORRECTED Usage Tracker Component ---
const UsageTracker = ({ featureName, count, max, tier }) => {
    const { t } = useTranslation();
    // UPDATE: The logic now checks for the 'enterprise' tier first.
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


const ProfilePage = () => {
  const { user, isLoading, loadUser, token, API_URL, logout } = useContext(AuthContext);
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.username);
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${API_URL}/users/profile`, { username: name }, config);
      toast.success(t('profile_update_success'));
      await loadUser();
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || t('profile_update_fail'));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API_URL}/users/profile`, config);
      toast.success(t('profile_delete_success'));
      logout();
    } catch (err) {
      toast.error(err.response?.data?.message || t('profile_delete_fail'));
    } finally {
        setIsDeleteModalOpen(false);
    }
  };

  if (isLoading || !user) {
    return <div className="flex justify-center items-center h-[50vh]"><SpinnerIcon /></div>;
  }

  return (
    <>
    <div className="bg-black text-gray-200 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-1">
                <div className="bg-gray-900/50 border border-white/10 rounded-xl p-8 text-center">
                    <UserAvatar user={user} />
                    <h2 className="text-2xl font-bold text-white mt-4 break-words">{user.username}</h2>
                    <p className="text-gray-400 break-words">{user.email}</p>
                    <span className="mt-4 inline-block px-3 py-1 text-sm font-bold rounded-full bg-neon-pink/20 text-neon-pink capitalize">{user.subscriptionTier || 'Free'} Plan</span>
                </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-8">
                {/* Account Info Card */}
                <div className="bg-gray-900/50 border border-white/10 rounded-xl">
                    <div className="p-6 flex justify-between items-center border-b border-white/10">
                        <h3 className="text-xl font-bold text-white">{t('profile_account_info_title')}</h3>
                        {!isEditing && <button onClick={() => setIsEditing(true)} className="text-sm font-semibold text-neon-pink hover:underline">{t('profile_edit_button')}</button>}
                    </div>
                    <div className="p-6">
                        {!isEditing ? (
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-400">{t('auth_username_label')}</dt>
                                    <dd className="mt-1 text-lg text-white break-words">{user.username}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-400">{t('auth_email_label')}</dt>
                                    <dd className="mt-1 text-lg text-white break-words">{user.email}</dd>
                                </div>
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-gray-400">{t('profile_joined_on')}</dt>
                                    <dd className="mt-1 text-lg text-white">{new Date(user.createdAt).toLocaleDateString()}</dd>
                                </div>
                            </dl>
                        ) : (
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">{t('auth_username_label')}</label>
                                    <AuthInput id="username" value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>
                                <p className="text-sm text-gray-500">{t('profile_password_note')}</p>
                                <div className="flex gap-4">
                                    <button type="submit" disabled={isUpdating} className="flex items-center justify-center bg-white text-black font-bold py-2 px-5 rounded-md transition-opacity hover:opacity-80 disabled:opacity-50">
                                        {isUpdating ? <SpinnerIcon/> : <SaveIcon/>} {t('profile_save_button')}
                                    </button>
                                    <button type="button" onClick={() => setIsEditing(false)} className="flex items-center justify-center bg-gray-700 text-white font-bold py-2 px-5 rounded-md hover:bg-gray-600">
                                        <CloseIcon/> {t('profile_cancel_button')}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* My Usage Limits Card */}
                <div className="bg-gray-900/50 border border-white/10 rounded-xl">
                    <div className="p-6 border-b border-white/10">
                        <h3 className="text-xl font-bold text-white">{t('profile_usage_title')}</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <UsageTracker
                            featureName={t('profile_usage_mock')}
                            count={user.voiceInterviewCount}
                            max={user.maxVoiceInterviews}
                            tier={user.subscriptionTier}
                        />
                         <UsageTracker
                            featureName={t('profile_usage_live')}
                            count={user.realInterviewCount}
                            max={user.maxRealInterviews}
                            tier={user.subscriptionTier}
                        />
                        <UsageTracker
                            featureName={t('profile_usage_resume')}
                            count={user.resumeAnalysisCount}
                            max={user.maxResumeAnalyses}
                            tier={user.subscriptionTier}
                        />
                    </div>
                </div>

                {/* Danger Zone Card */}
                <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-red-400">{t('profile_danger_zone_title')}</h3>
                    <p className="text-gray-400 mt-2 mb-4">{t('profile_danger_zone_desc')}</p>
                    <button onClick={() => setIsDeleteModalOpen(true)} className="bg-red-600 text-white font-bold py-2 px-5 rounded-md hover:bg-red-700 transition-colors">{t('profile_delete_button')}</button>
                </div>
            </div>
        </div>
      </div>
    </div>

    {/* Deletion Confirmation Modal */}
    {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#121212] border border-red-500/50 rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">{t('profile_delete_confirm_title')}</h2>
                <p className="text-gray-400 mb-8">{t('profile_delete_confirm_desc')}</p>
                <div className="flex justify-center gap-4">
                    <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-700 text-white font-bold py-2 px-8 rounded-md hover:bg-gray-600">
                        {t('profile_cancel_button')}
                    </button>
                    <button onClick={handleDeleteAccount} className="bg-red-600 text-white font-bold py-2 px-8 rounded-md hover:bg-red-700">
                        {t('profile_confirm_delete_button')}
                    </button>
                </div>
            </div>
        </div>
    )}
    </>
  );
};

export default ProfilePage;