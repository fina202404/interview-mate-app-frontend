import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import ResumeFeedbackDisplay from '../components/ResumeFeedbackDisplay';

// --- Icons ---
const UploadIcon = () => <svg className="w-12 h-12 mx-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-4 4H4a4 4 0 01-4-4v-6a4 4 0 014-4h2m10 0h2a4 4 0 014 4v6a4 4 0 01-4 4h-2m-4-12v12m0 0l-4-4m4 4l4-4"></path></svg>;
const SpinnerIcon = () => <div className="animate-spin rounded-full h-12 w-12 border-y-2 border-white"></div>;

const ResumeAnalysisPage = () => {
    const [file, setFile] = useState(null);
    const [jobTitle, setJobTitle] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    const { API_URL, token, loadUser } = useContext(AuthContext);
    const { t } = useTranslation();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type !== 'application/pdf') {
                toast.error(t('resume_toast_pdf_only'));
                return;
            }
            setFile(selectedFile);
            setFeedback(null); // Reset feedback when new file is chosen
        }
    };

    const handleAnalyze = async () => {
        if (!file || !jobTitle.trim()) {
            toast.error(t('resume_toast_no_file_or_title'));
            return;
        }
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobTitle', jobTitle);

        setLoading(true);
        setFeedback(null);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                }
            };
            const res = await axios.post(`${API_URL}/resume/job-analyze`, formData, config);
            
            if (res.data.success) {
                toast.success(t('resume_toast_analysis_complete'));
                setFeedback(res.data.feedback);
                await loadUser(); // Refresh user data to update usage counts
            } else {
                toast.error(res.data.message || t('error_generic'));
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || t('resume_toast_analysis_failed');
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFile(null);
        setFeedback(null);
        setJobTitle('');
    };

    return (
        <div className="bg-black text-white min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Show the form if there's no feedback yet */}
                {!feedback && (
                    <>
                        <div className="text-center mb-12">
                            <h1 className="text-5xl font-extrabold text-white mb-4">{t('resume_page_title')}</h1>
                            <p className="text-lg text-gray-400 max-w-2xl mx-auto">{t('resume_page_subtitle')}</p>
                        </div>
                        
                        <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-8 space-y-8">
                            <div>
                                <label htmlFor="jobTitle" className="block text-xl font-bold text-white mb-2">{t('resume_step1_title')}</label>
                                <p className="text-gray-400 mb-4">{t('resume_step1_subtitle')}</p>
                                <input
                                    id="jobTitle"
                                    placeholder={t('mock_job_title_placeholder')}
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#222] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-pink"
                                />
                            </div>

                            <div>
                                <label className="block text-xl font-bold text-white mb-2">{t('resume_step2_title')}</label>
                                <p className="text-gray-400 mb-4">{t('resume_step2_subtitle')}</p>
                                <label htmlFor="resume-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-900/50 hover:bg-gray-800/60">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadIcon />
                                        {file ? (
                                            <p className="font-semibold text-green-400 mt-2">{file.name}</p>
                                        ) : (
                                            <>
                                            <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">{t('resume_upload_click')}</span> {t('resume_upload_drag')}</p>
                                            <p className="text-xs text-gray-500">{t('resume_upload_hint')}</p>
                                            </>
                                        )}
                                    </div>
                                    <input id="resume-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf" />
                                </label>
                            </div>

                            <button
                                onClick={handleAnalyze}
                                disabled={!file || loading || !jobTitle.trim()}
                                className="w-full flex justify-center items-center text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-neon-pink to-bright-blue hover:shadow-[0_0_25px_theme(colors.neon-pink)] disabled:opacity-50"
                            >
                                {loading ? t('resume_button_analyzing') : t('resume_button_analyze')}
                            </button>
                        </div>
                    </>
                )}

                {/* Show loading spinner during analysis */}
                {loading && !feedback && (
                    <div className="text-center py-12">
                        <SpinnerIcon />
                        <p className="mt-4 text-lg text-gray-300">{t('resume_loading_text')}</p>
                    </div>
                )}
                
                {/* Show the feedback display when analysis is complete */}
                {feedback && (
                    <>
                        <ResumeFeedbackDisplay feedbackData={feedback} jobTitle={jobTitle} />
                        <div className="text-center mt-8">
                            <button onClick={handleReset} className="bg-gray-700 text-white font-semibold py-3 px-6 rounded-md hover:bg-gray-600">
                                {t('resume_button_analyze_another')}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResumeAnalysisPage;