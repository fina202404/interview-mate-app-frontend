import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import axios from 'axios';
import Webcam from 'react-webcam';
import AuthContext from '../context/AuthContext';

// --- Icons ---
const MicIcon = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>;
const EndIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12H3m18 0l-4 4m4-4l-4-4"></path></svg>;
const VideoOnIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>;
const VideoOffIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path></svg>;
const CloseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>;
const SummaryIcon = () => <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>;
const SuggestionsIcon = () => <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>;
const TrophyIcon = () => <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.725 3.055a2.25 2.25 0 012.25 0gM10.725 3.055a2.25 2.25 0 00-2.25 0gM12 3v-2.25m0 16.5v2.25m0 0a2.25 2.25 0 01-2.25 0m2.25 0a2.25 2.25 0 002.25 0m-16.5-2.25a2.25 2.25 0 010-2.25m18.75 2.25a2.25 2.25 0 000-2.25M4.5 12a2.25 2.25 0 01-2.25 0m16.5 0a2.25 2.25 0 00-2.25 0m-12-3.75a2.25 2.25 0 010-2.25m12 2.25a2.25 2.25 0 000-2.25"></path></svg>;

// --- Sub-components for Cleanliness ---
const ChatMessage = ({ msg }) => (
    <div className={`flex items-start gap-3 my-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
        {msg.role === 'ai' && <img src="/logo.jpg" alt="AI Avatar" className="w-10 h-10 rounded-full" />}
        <div className={`max-w-xl p-4 rounded-2xl ${msg.role === 'user' ? 'bg-bright-blue text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'}`}>
            {msg.text}
        </div>
    </div>
);

const SummaryModal = ({ summaryData, show, onClose, onReset }) => {
    const { t } = useTranslation();
    if (!show || !summaryData?.feedback) return null;

    const ScoreBar = ({ score, feedback }) => (
        <div>
            <div className="w-full bg-black rounded-full h-2.5">
                <div className="bg-gradient-to-r from-bright-blue to-neon-pink h-2.5 rounded-full" style={{ width: `${score * 10}%` }}></div>
            </div>
            <p className="text-sm text-gray-400 mt-2 italic">"{feedback}"</p>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#121212] border border-white/10 rounded-2xl shadow-2xl flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h1 className="text-2xl font-bold text-white">{t('summary_title', { jobTitle: summaryData.jobTitle })}</h1>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"><CloseIcon /></button>
                </div>
                <div className="p-8 overflow-y-auto">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-white mb-3 flex items-center text-green-400"><SummaryIcon /> {t('summary_overall')}</h2>
                        <p className="text-gray-300">{summaryData.feedback.overallSummary}</p>
                    </div>
                    <hr className="border-white/10 my-8"/>
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center text-yellow-400"><SuggestionsIcon /> {t('summary_suggestions')}</h2>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                            {summaryData.feedback.suggestions.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </div>
                    <hr className="border-white/10 my-8"/>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center text-cyan-400"><TrophyIcon /> {t('summary_scores')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <h3 className="font-bold text-white mb-2">{t('mock_feedback_clarity')}: <span className="text-lg text-neon-pink">{summaryData.feedback.clarity.score}/10</span></h3>
                                <ScoreBar score={summaryData.feedback.clarity.score} feedback={summaryData.feedback.clarity.feedback} />
                            </div>
                             <div>
                                <h3 className="font-bold text-white mb-2">{t('mock_feedback_relevance')}: <span className="text-lg text-neon-pink">{summaryData.feedback.relevance.score}/10</span></h3>
                                <ScoreBar score={summaryData.feedback.relevance.score} feedback={summaryData.feedback.relevance.feedback} />
                            </div>
                             <div>
                                <h3 className="font-bold text-white mb-2">{t('summary_impact')}: <span className="text-lg text-neon-pink">{summaryData.feedback.impact.score}/10</span></h3>
                                <ScoreBar score={summaryData.feedback.impact.score} feedback={summaryData.feedback.impact.feedback} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-6 flex justify-end gap-4 border-t border-white/10">
                    <button onClick={onClose} className="bg-gray-700 text-white font-bold py-2 px-6 rounded-md hover:bg-gray-600">{t('summary_close_button')}</button>
                    <button onClick={onReset} className="bg-bright-blue text-white font-bold py-2 px-6 rounded-md hover:bg-royal-blue">{t('summary_new_interview_button')}</button>
                </div>
            </div>
        </div>
    );
};


const LiveInterviewPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [cameraOn, setCameraOn] = useState(true);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [jobTitleInput, setJobTitleInput] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);
  const greetingCalledRef = useRef(false);
  
  const { token, API_URL, loadUser } = useContext(AuthContext);
  const { t } = useTranslation();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const speakTextWithElevenLabs = useCallback(async (text) => {
    if (!text) return;
    setIsSpeaking(true);
    try {
      const res = await fetch(`${API_URL}/voice/speak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.detail?.message || 'Failed to fetch audio.');
      }
      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
      await new Promise(resolve => {
        audio.onended = () => { setIsSpeaking(false); resolve(); };
        audio.onerror = () => { setIsSpeaking(false); resolve(); };
      });
    } catch (err) {
      toast.error(`AI voice error: ${err.message}`);
      setIsSpeaking(false);
    }
  }, [API_URL, token]);
  
  useEffect(() => {
    if (jobTitle && !greetingCalledRef.current) {
      const introText = t('live_intro_text', { jobTitle });
      setConversation([{ role: 'ai', text: introText }]);
      speakTextWithElevenLabs(introText);
      greetingCalledRef.current = true;
    }
  }, [jobTitle, speakTextWithElevenLabs, t]);

  const handleStartInterview = () => {
    if (!jobTitleInput.trim()) {
      toast.error(t('live_toast_no_job_title'));
      return;
    }
    setJobTitle(jobTitleInput);
    setIsModalVisible(false);
  };
  
  const getAIResponse = async (currentConversation) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/interview/converse`, { history: currentConversation, jobTitle: jobTitle }, { headers: { Authorization: `Bearer ${token}` } });
      if (data.reply) return data.reply;
      throw new Error("Received an empty reply from the AI.");
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return toast.error('Speech recognition not supported.');
    if (isRecording || isLoading || isSpeaking) {
      recognitionRef.current?.stop();
      return;
    }
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = (event) => toast.error(`Speech recognition error: ${event.error}`);
    recognition.onresult = async (event) => {
      const userText = event.results[0][0].transcript;
      const updatedConversation = [...conversation, { role: 'user', text: userText }];
      setConversation(updatedConversation);
      try {
        const aiTextReply = await getAIResponse(updatedConversation);
        setConversation(prev => [...prev, { role: 'ai', text: aiTextReply }]);
        setAnsweredQuestions(prev => [...prev, { question: userText, answer: aiTextReply }]);
        await loadUser();
        await speakTextWithElevenLabs(aiTextReply);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to get AI response.");
      }
    };
    recognition.start();
  };
  
  const endInterviewManually = async () => {
    if (answeredQuestions.length === 0) return toast.error("Please answer at least one question to get a summary.");
    setIsLoading(true);
    const fullTranscript = answeredQuestions.map((item, i) => `Question ${i + 1} (User): ${item.question}\nAnswer ${i + 1} (AI): ${item.answer}`).join('\n\n');
    const feedbackPrompt = `
      You are an expert interview coach reviewing an interview transcript for the "${jobTitle}" role.
      Analyze the following transcript.
      ---
      TRANSCRIPT START
      ${fullTranscript}
      TRANSCRIPT END
      ---
      Your entire response MUST be ONLY the raw JSON object, starting with { and ending with }. Do not include any other text or markdown formatting.
      The JSON object must have these exact keys: "clarity", "relevance", "impact", "overallSummary", "suggestions".
      The value for "clarity", "relevance", and "impact" must be an object with "score" (a number out of 10) and "feedback" (a short string explanation) keys.
      "overallSummary" must be a string.
      "suggestions" must be an array of strings.
    `;
    
    try {
      const { data } = await axios.post(`${API_URL}/interview/converse`, { prompt: feedbackPrompt, jobTitle: jobTitle }, { headers: { Authorization: `Bearer ${token}` } });
      const cleanedReply = data.reply.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const feedbackJSON = JSON.parse(cleanedReply);
      setSummaryData({ 
        jobTitle, 
        feedback: feedbackJSON,
        totalQuestions: answeredQuestions.length, 
        timestamp: new Date().toLocaleString() 
      });
      setShowSummary(true);

    } catch (err) {
      console.error('Error generating or parsing feedback:', err);
      toast.error('Failed to generate or parse the interview summary. The AI may have returned an invalid format.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetInterview = () => {
    setIsModalVisible(true);
    setConversation([]);
    setAnsweredQuestions([]);
    setShowSummary(false);
    setSummaryData(null);
    setJobTitle('');
    setJobTitleInput('');
    greetingCalledRef.current = false;
  };

  return (
    <>
      {isModalVisible && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-[#121212] border border-white/10 rounded-2xl shadow-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-2">{t('live_modal_title')}</h2>
                <p className="text-gray-400 mb-6">{t('live_modal_subtitle')}</p>
                <input 
                    placeholder={t('mock_job_title_placeholder')} 
                    value={jobTitleInput} 
                    onChange={(e) => setJobTitleInput(e.target.value)} 
                    onKeyPress={(e) => e.key === 'Enter' && handleStartInterview()}
                    className="w-full px-4 py-3 bg-[#222] border border-gray-700 rounded-md text-white"
                />
                <button 
                    onClick={handleStartInterview} 
                    disabled={!jobTitleInput.trim()}
                    className="w-full mt-4 text-white font-bold text-lg py-3 rounded-lg bg-gradient-to-r from-neon-pink to-bright-blue disabled:opacity-50"
                >
                    {t('live_modal_start_button')}
                </button>
            </div>
        </div>
      )}

      <div className={`flex flex-col lg:flex-row h-screen bg-black text-white ${isModalVisible ? 'blur-md pointer-events-none' : ''}`}>
        <div className="lg:w-[450px] w-full bg-[#1A202C] p-6 flex flex-col gap-6 flex-shrink-0">
            <div className="flex-grow w-full rounded-xl overflow-hidden bg-black">
                <img src="/Agent.jpg" alt="AI Interviewer" className="w-full h-full object-cover" />
            </div>
            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
                {cameraOn ? <Webcam audio={false} className="w-full h-full object-cover" mirrored /> : <div className="w-full h-full flex items-center justify-center bg-gray-900"><p className="text-gray-500">{t('mock_camera_off')}</p></div>}
                <button onClick={() => setCameraOn(p => !p)} className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/80 transition">
                    {cameraOn ? <VideoOffIcon/> : <VideoOnIcon/>}
                </button>
            </div>
        </div>
        <div className="flex-1 flex flex-col h-full">
            <div className="flex-grow p-6 overflow-y-auto">
                {conversation.map((msg, index) => <ChatMessage key={index} msg={msg} />)}
                {isLoading && <div className="flex justify-start"><div className="w-16 h-8 bg-gray-700 rounded-full animate-pulse"></div></div>}
                <div ref={chatEndRef} />
            </div>
            <div className="p-6 border-t border-white/10 text-center">
                <div className="flex items-center justify-center gap-6">
                    <button onClick={endInterviewManually} disabled={isLoading || isSpeaking || conversation.length <= 1} className="p-4 bg-red-600 rounded-full text-white hover:bg-red-700 disabled:opacity-50 transition" title="End Interview & Get Report">
                        <EndIcon />
                    </button>
                    <button onClick={handleVoiceInput} disabled={isLoading || isSpeaking} className={`p-6 rounded-full text-white transition-all duration-300 ${isRecording ? 'bg-neon-pink animate-pulse' : 'bg-bright-blue hover:bg-royal-blue'}`} title="Click to Speak">
                        <MicIcon />
                    </button>
                </div>
                <p className="text-gray-400 mt-4 h-5">{isRecording ? t('live_status_listening') : isLoading ? t('live_status_thinking') : isSpeaking ? t('live_status_speaking') : t('live_status_idle')}</p>
            </div>
        </div>
      </div>
      
      <SummaryModal summaryData={summaryData} show={showSummary} onClose={() => setShowSummary(false)} onReset={handleResetInterview} />
    </>
  );
};

export default LiveInterviewPage;