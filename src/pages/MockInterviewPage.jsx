import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import axios from 'axios';
import Webcam from 'react-webcam';
import AuthContext from '../context/AuthContext';

// --- Reusable Icons ---
const SpinnerIcon = () => <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>;
const SmallSpinnerIcon = () => <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const MicOnIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>;
const MicOffIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>;
const VideoOnIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>;
const VideoOffIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>;
const SendIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>;
const RepeatIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3"></path></svg>;
const NextIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>;

const MockInterviewPage = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [answerLoading, setAnswerLoading] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef(null);
  const webcamRef = useRef(null);
  
  const { token, API_URL, loadUser } = useContext(AuthContext);
  const { t } = useTranslation();

  const speakTextWithElevenLabs = useCallback(async (text) => {
    if (!text) return;
    return new Promise(async (resolve) => {
      setIsSpeaking(true);
      try {
        const res = await fetch(`${API_URL}/voice/speak`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text })
        });
        if (!res.ok) throw new Error('Failed to fetch audio from server.');
        const audioBlob = await res.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.onended = () => {
          setIsSpeaking(false);
          resolve();
        };
        audio.onerror = (err) => {
          console.error("Audio playback error:", err);
          setIsSpeaking(false);
          resolve();
        };
        audio.play();
      } catch (err) {
        console.error("Voice playback error:", err);
        toast.error("Could not play AI voice.");
        setIsSpeaking(false);
        resolve();
      }
    });
  }, [API_URL]);

  const fetchQuestions = async (title) => {
    if (!title.trim()) return toast.error(t('mock_toast_no_job_title'));
    setQuestionLoading(true);
    setJobTitle(title);
    setQuestions([]);
    setFeedback(null);
    setCurrentIndex(0);
    setAnswer('');
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.post(`${API_URL}/interview/get-questions`, { jobTitle: title }, config);
      if (res.data && Array.isArray(res.data.questions)) {
        await loadUser(); 
        setQuestions(res.data.questions);
        if (res.data.questions.length > 0) {
          await speakTextWithElevenLabs(`${t('mock_toast_starting_interview')} ${title}. ${t('mock_toast_first_question')}: ${res.data.questions[0]}`);
        }
      } else {
        toast.error('Received invalid question data.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch questions.');
    } finally {
      setQuestionLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return toast.error(t('mock_toast_no_answer'));
    setAnswerLoading(true);
    setFeedback(null);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const questionAsked = questions[currentIndex];
      const res = await axios.post(`${API_URL}/analyze`, { question: questionAsked, answer }, config);
      const currentFeedback = res.data;
      setFeedback(currentFeedback);
      
      const newSessionEntry = {
        job: jobTitle,
        question: questionAsked,
        answer,
        clarity: currentFeedback.clarity || 0,
        relevance: currentFeedback.relevance || 0,
      };
      await axios.post(`${API_URL}/progress`, newSessionEntry, config);
      
      const completed = Number(localStorage.getItem('interviewsCompleted') || 0);
      localStorage.setItem('interviewsCompleted', completed + 1);

      await speakTextWithElevenLabs(t('mock_toast_answer_submitted'));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to analyze answer.');
    } finally {
      setAnswerLoading(false);
    }
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
      setAnswer('');
      setFeedback(null);
      speakTextWithElevenLabs(questions[nextIndex]);
    } else {
      toast.success(t('mock_toast_all_questions_complete'));
      speakTextWithElevenLabs(t('mock_toast_congratulations'));
    }
  };
  
  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return toast.error('Your browser does not support Speech Recognition.');

    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.interimResults = true;
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onstart = () => setIsRecording(true);
    recognitionRef.current.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) setAnswer(prev => prev + finalTranscript + '. ');
    };
    recognitionRef.current.onerror = (event) => toast.error(`Voice recognition error: ${event.error}`);
    recognitionRef.current.onend = () => setIsRecording(false);
    
    recognitionRef.current.start();
  };

  useEffect(() => {
    // Clean up speech recognition on component unmount
    return () => {
      if (recognitionRef.current && typeof recognitionRef.current.stop === 'function') {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.warn("Error stopping recognition on unmount:", e);
        }
      }
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-black text-white">
      {/* Left Panel */}
      <div className="lg:w-[400px] w-full bg-[#1A202C] p-6 flex flex-col flex-shrink-0">
        <h2 className="text-xl font-bold text-center mb-4">{t('mock_camera_title')}</h2>
        <div className="w-full aspect-w-4 aspect-h-3 bg-black rounded-xl overflow-hidden shadow-lg">
          {cameraOn ? <Webcam ref={webcamRef} audio={false} className="w-full h-full object-cover" mirrored /> : <div className="w-full h-full flex items-center justify-center bg-gray-900"><p className="text-gray-500">{t('mock_camera_off')}</p></div>}
        </div>
        <button onClick={() => setCameraOn(prev => !prev)} className="flex items-center justify-center w-full mt-4 bg-gray-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-600 transition-colors">
            {cameraOn ? <VideoOffIcon/> : <VideoOnIcon/>}
            {cameraOn ? t('mock_camera_off_button') : t('mock_camera_on_button')}
        </button>
        <hr className="border-white/10 my-6" />
        {isSpeaking && (
            <div className="flex items-center justify-center gap-3 text-white">
                <SmallSpinnerIcon />
                <span>{t('mock_ai_speaking')}</span>
            </div>
        )}
      </div>

      {/* Right Panel */}
      <div className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-3xl mx-auto">
            {questionLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <SpinnerIcon />
                    <p className="mt-4 text-lg">{t('mock_generating_questions')}</p>
                </div>
            ) : !jobTitle ? (
                <div className="bg-gray-900/50 border border-white/10 rounded-xl p-8 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">{t('mock_start_title')}</h1>
                    <p className="text-gray-400 mb-6">{t('mock_start_subtitle')}</p>
                    <form onSubmit={(e) => { e.preventDefault(); fetchQuestions(e.target.jobTitle.value); }}>
                        <div className="flex gap-2">
                            <input name="jobTitle" className="w-full px-4 py-3 bg-[#222] border border-gray-700 rounded-md text-white" placeholder={t('mock_job_title_placeholder')} />
                            <button type="submit" className="bg-bright-blue text-white font-semibold py-3 px-6 rounded-md hover:bg-royal-blue">
                                {t('mock_generate_button')}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div>
                    <h2 className="text-center text-xl text-gray-300 mb-2">{t('mock_interview_for')}</h2>
                    <h1 className="text-center text-3xl font-bold text-neon-pink mb-6">{jobTitle}</h1>
                    {/* Progress Steps */}
                    <div className="flex gap-2 mb-8">
                        {questions.map((_, i) => (
                            <div key={i} className={`h-2 flex-1 rounded-full ${i < currentIndex ? 'bg-neon-pink' : i === currentIndex ? 'bg-bright-blue' : 'bg-gray-700'}`}></div>
                        ))}
                    </div>

                    {/* Question Card */}
                    <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6 mb-6">
                        <h3 className="font-bold text-white text-lg mb-2">{t('mock_question_title', { number: currentIndex + 1 })}</h3>
                        <p className="text-gray-200 text-xl">{questions[currentIndex]}</p>
                    </div>

                    <textarea
                        rows={6}
                        placeholder={t('mock_answer_placeholder')}
                        value={answer}
                        onChange={e => setAnswer(e.target.value)}
                        className="w-full p-4 bg-[#222] border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-neon-pink focus:outline-none"
                    />

                    <div className="flex flex-wrap gap-3 mt-4">
                        <button onClick={startVoiceInput} disabled={isSpeaking} className={`flex items-center font-semibold py-2 px-4 rounded-md transition-colors ${isRecording ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}>
                            {isRecording ? <MicOffIcon/> : <MicOnIcon/>}
                            {isRecording ? t('mock_stop_listening_button') : t('mock_speak_button')}
                        </button>
                        <button onClick={submitAnswer} disabled={!answer.trim() || answerLoading || isSpeaking} className="flex items-center font-semibold py-2 px-4 rounded-md transition-colors bg-bright-blue hover:bg-royal-blue text-white disabled:opacity-50">
                            {answerLoading ? <SmallSpinnerIcon/> : <SendIcon/>}
                            {t('mock_submit_button')}
                        </button>
                        <button onClick={() => speakTextWithElevenLabs(questions[currentIndex])} disabled={isSpeaking} className="flex items-center font-semibold py-2 px-4 rounded-md transition-colors bg-gray-700 hover:bg-gray-600 text-white">
                            <RepeatIcon/> {t('mock_repeat_button')}
                        </button>
                    </div>

                    {answerLoading && <div className="flex justify-center my-6"><SpinnerIcon/></div>}

                    {feedback && (
                        <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6 my-6">
                            <h3 className="text-xl font-bold text-white mb-4">{t('mock_feedback_title')}</h3>
                            <p><strong>{t('mock_feedback_clarity')}:</strong> <span className="font-bold text-lg text-neon-pink">{feedback.clarity}/10</span></p>
                            <p><strong>{t('mock_feedback_relevance')}:</strong> <span className="font-bold text-lg text-neon-pink">{feedback.relevance}/10</span></p>
                            <p className="font-bold mt-4">{t('mock_feedback_suggestions')}:</p>
                            <ul className="list-disc list-inside text-gray-300 space-y-1 mt-2">
                                {feedback.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                    )}
                    
                    {feedback && (currentIndex < questions.length - 1 ? (
                        <button onClick={handleNext} className="w-full flex items-center justify-center font-semibold py-3 px-4 rounded-md transition-colors bg-white text-black hover:bg-gray-200">
                            <NextIcon/> {t('mock_next_button')}
                        </button>
                    ) : (
                        <button onClick={() => window.location.reload()} className="w-full flex items-center justify-center font-semibold py-3 px-4 rounded-md transition-colors bg-green-500 hover:bg-green-600 text-white">
                            {t('mock_finish_button')}
                        </button>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MockInterviewPage;