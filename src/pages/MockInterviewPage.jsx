// src/pages/MockInterviewPage.jsx (Fully Implemented)

import React, { useState, useRef, useEffect, useContext } from 'react';
import { Input, Button, Card, Typography, Steps, message, Space, Divider, Spin } from 'antd';
import {
  AudioOutlined, AudioMutedOutlined, VideoCameraOutlined, StopOutlined,
  SendOutlined, RedoOutlined, ReadOutlined
} from '@ant-design/icons';
import axios from 'axios';
import Webcam from 'react-webcam';
import AuthContext from '../context/AuthContext';
import './MockInterviewPage.css';

const { Title, Paragraph, Text } = Typography;
const { Search, TextArea } = Input;

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

  const speakTextWithElevenLabs = async (text) => {
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
        message.error("Could not play AI voice.");
        setIsSpeaking(false);
        resolve();
      }
    });
  };

  const fetchQuestions = async (title) => {
    if (!title.trim()) return message.warning('Please enter a job title.');
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
          await speakTextWithElevenLabs(`Starting interview for ${title}. First question: ${res.data.questions[0]}`);
        }
      } else {
        message.error('Received invalid question data.');
      }
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to fetch questions.');
    } finally {
      setQuestionLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return message.warning('Please provide an answer.');
    setAnswerLoading(true);
    setFeedback(null);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const questionAsked = questions[currentIndex];
      const res = await axios.post(`${API_URL}/analyze`, { question: questionAsked, answer }, config);
      const currentFeedback = res.data;
      setFeedback(currentFeedback);
      
      // Save progress to the backend
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

      await speakTextWithElevenLabs("Answer submitted. You can review my feedback now.");
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to analyze answer.');
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
      message.success('You have completed all questions for this session!');
      speakTextWithElevenLabs("Congratulations! You've completed all questions.");
    }
  };
  
  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return message.error('Your browser does not support Speech Recognition.');

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
    recognitionRef.current.onerror = (event) => message.error(`Voice recognition error: ${event.error}`);
    recognitionRef.current.onend = () => setIsRecording(false);
    
    recognitionRef.current.start();
  };

  return (
    <div className="mock-interview-container">
      <div className="left-panel">
        <Title level={4} style={{ color: 'white', textAlign: 'center' }}>Your Camera</Title>
        <div className="webcam-container">
          {cameraOn ? <Webcam ref={webcamRef} audio={false} className="webcam-feed" mirrored /> : <div className="camera-off-placeholder">Camera is Off</div>}
        </div>
        <Button
          icon={cameraOn ? <StopOutlined /> : <VideoCameraOutlined />}
          onClick={() => setCameraOn(prev => !prev)}
          style={{ marginTop: '1rem', display: 'block', margin: '1rem auto 0' }}
        >
          {cameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
        </Button>
        <Divider style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
        {isSpeaking && (
            <div style={{textAlign: 'center', color: '#fff'}}>
                <Spin />
                <Text style={{color: '#fff', marginLeft: 8}}>AI is speaking...</Text>
            </div>
        )}
      </div>

      <div className="right-panel">
        {!jobTitle && !questionLoading ? (
          <Card className="get-started-card">
            <Title level={3}>Start Your Mock Interview</Title>
            <Paragraph type="secondary">Enter a job title to generate tailored interview questions.</Paragraph>
            <Search placeholder="e.g. Frontend Developer" enterButton="Generate Questions" size="large" onSearch={fetchQuestions} loading={questionLoading} />
          </Card>
        ) : questionLoading ? (
          <Spin size="large" tip="Generating questions..." />
        ) : (
          <div className="interview-flow">
            <Title level={4} style={{ textAlign: 'center' }}>Interview for: <Text strong style={{color: '#E923F4'}}>{jobTitle}</Text></Title>
            <Steps current={currentIndex} items={questions.map((q, i) => ({ title: `Q${i + 1}` }))} style={{ margin: '24px 0'}} />
            <Card title={`Question ${currentIndex + 1}`} className="question-card">
              <Paragraph style={{fontSize: '1.1rem'}}>{questions[currentIndex]}</Paragraph>
            </Card>
            <TextArea rows={6} placeholder="Type or speak your answer..." value={answer} onChange={e => setAnswer(e.target.value)} />
            <Space style={{marginTop: '1rem', display: 'flex', flexWrap: 'wrap'}}>
              <Button onClick={startVoiceInput} danger={isRecording} icon={isRecording ? <AudioMutedOutlined /> : <AudioOutlined />}>{isRecording ? 'Stop Listening' : 'Speak Answer'}</Button>
              <Button type="primary" onClick={submitAnswer} loading={answerLoading} disabled={!answer.trim()} icon={<SendOutlined />}>Submit for Feedback</Button>
              <Button onClick={() => speakTextWithElevenLabs(questions[currentIndex])} disabled={isSpeaking} icon={<ReadOutlined />}>Repeat Question</Button>
            </Space>
            {answerLoading && <Spin style={{display: 'block', margin: '1rem 0'}} />}
            {feedback && (
              <Card title="AI Feedback" className="feedback-card">
                <Paragraph><strong>Clarity:</strong> <Text mark>{feedback.clarity}/10</Text></Paragraph>
                <Paragraph><strong>Relevance:</strong> <Text mark>{feedback.relevance}/10</Text></Paragraph>
                <Paragraph strong>Suggestions:</Paragraph>
                <ul style={{paddingLeft: 20}}>{feedback.suggestions.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </Card>
            )}
            {currentIndex < questions.length - 1 && feedback && (
              <Button type="default" onClick={handleNext} style={{marginTop: '1rem'}} block icon={<RedoOutlined />}>Next Question</Button>
            )}
             {currentIndex === questions.length - 1 && feedback && (
              <Button type="primary" onClick={() => setJobTitle('')} block style={{marginTop: '1rem'}}>Finish & Start New Interview</Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterviewPage;