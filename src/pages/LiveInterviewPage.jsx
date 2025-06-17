// src/pages/LiveInterviewPage.jsx (Corrected and Final)

import React, { useState, useRef, useEffect, useContext } from 'react';
import { Button, Typography, Spin, Avatar, Tooltip, Modal, Row, Col, Progress, List, Divider, Space, App as AntdApp, Input } from 'antd';
import { AudioOutlined, SendOutlined, VideoCameraOutlined, StopOutlined, TrophyOutlined, CheckCircleOutlined, BulbOutlined } from '@ant-design/icons';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import './LiveInterviewPage.css';

const { Title, Paragraph, Text } = Typography;

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
  const { message } = AntdApp.useApp();
  const navigate = useNavigate();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const speakTextWithElevenLabs = React.useCallback(async (text) => {
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
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => setIsSpeaking(false);
        resolve();
      });
    } catch (err) {
      message.error(`AI voice error: ${err.message}`);
      setIsSpeaking(false);
    }
  }, [API_URL, token, message]);
  
  useEffect(() => {
    if (jobTitle && !greetingCalledRef.current) {
      const introText = `Hello! Welcome to your interview for the ${jobTitle} role. Let's begin. Please click the microphone and introduce yourself.`;
      setConversation([{ role: 'ai', text: introText }]);
      speakTextWithElevenLabs(introText);
      greetingCalledRef.current = true;
    }
  }, [jobTitle, speakTextWithElevenLabs]);

  const handleStartInterview = () => {
    if (!jobTitleInput.trim()) {
      message.error("Please enter a job role to begin.");
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
    if (!SpeechRecognition) return message.error('Speech recognition not supported.');
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
    recognition.onerror = (event) => message.error(`Speech recognition error: ${event.error}`);
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
        message.error(err.response?.data?.message || "Failed to get AI response.");
      }
    };
    recognition.start();
  };
  
  const endInterviewManually = async () => {
    if (answeredQuestions.length === 0) return message.warning("Please answer at least one question to get a summary.");
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
      The value for "clarity", "relevance", and "impact" must be an object with "score" (number) and "feedback" (string) keys.
      "overallSummary" must be a string.
      "suggestions" must be an array of strings.
    `;
    
    try {
      const { data } = await axios.post(`${API_URL}/interview/converse`, { prompt: feedbackPrompt, jobTitle: jobTitle }, { headers: { Authorization: `Bearer ${token}` } });
      const cleanedReply = data.reply.replace(/```json/g, '').replace(/```/g, '').trim();
      
      // ✅ FIX: Use the parsed 'feedbackJSON' object when setting the state.
      const feedbackJSON = JSON.parse(cleanedReply);
      setSummaryData({ 
        jobTitle, 
        feedback: feedbackJSON, // Use the parsed object, not the raw text
        totalQuestions: answeredQuestions.length, 
        timestamp: new Date().toLocaleString() 
      });
      setShowSummary(true);

    } catch (err) {
      console.error('Error generating or parsing feedback:', err);
      message.error('Failed to generate or parse the interview summary. The AI may have returned an invalid format.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        title={<Title level={4}>Start Your Live Interview</Title>}
        open={isModalVisible}
        closable={false}
        keyboard={false}
        footer={[<Button key="start" type="primary" onClick={handleStartInterview} disabled={!jobTitleInput.trim()}>Start Interview</Button>]}
      >
        <Paragraph>Please enter the job role you would like to practice for.</Paragraph>
        <Input placeholder="e.g., Senior Full Stack Developer" value={jobTitleInput} onChange={(e) => setJobTitleInput(e.target.value)} onPressEnter={handleStartInterview} />
      </Modal>

      <div className="live-interview-container" style={{ filter: isModalVisible ? 'blur(5px)' : 'none', pointerEvents: isModalVisible ? 'none' : 'auto' }}>
        <div className="live-left-panel">
          <div className="ai-image-container"><img src="/Agent.jpg" alt="AI Interviewer" className="ai-avatar-image" /></div>
          <div className="user-camera-container">
            {cameraOn ? <Webcam audio={false} className="live-webcam-feed" mirrored /> : <div className="live-camera-off">Camera Off</div>}
            <Button icon={cameraOn ? <StopOutlined /> : <VideoCameraOutlined />} onClick={() => setCameraOn(p => !p)} className="camera-toggle-btn" size="small" />
          </div>
        </div>
        <div className="live-right-panel">
          <div className="chat-area">
            {conversation.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.role}`}>
                <Avatar className="chat-avatar" style={{ backgroundColor: msg.role === 'ai' ? '#722ed1' : '#1890ff' }}>{msg.role === 'ai' ? 'AI' : 'You'}</Avatar>
                <div className="chat-bubble">{msg.text}</div>
              </div>
            ))}
            {isLoading && <div className="chat-message ai"><Avatar className="chat-avatar" style={{ backgroundColor: '#722ed1' }}>AI</Avatar><div className="chat-bubble"><Spin size="small" /></div></div>}
            <div ref={chatEndRef} />
          </div>
          <div className="chat-input-area">
            <Space align="center" size="large">
              <Tooltip title={isRecording ? "Stop Listening" : "Start Speaking"}><Button type="primary" shape="circle" className={`mic-button ${isRecording ? 'recording' : ''}`} icon={<AudioOutlined />} onClick={handleVoiceInput} disabled={isLoading || isSpeaking} /></Tooltip>
              <Tooltip title="End Interview & Get Report"><Button type="primary" danger shape="circle" icon={<SendOutlined />} onClick={endInterviewManually} disabled={isLoading || isSpeaking || conversation.length <= 1} style={{ width: '50px', height: '50px' }} /></Tooltip>
            </Space>
            <Paragraph type="secondary" style={{ textAlign: 'center', marginTop: '1rem', height: '20px' }}>
              {isRecording ? 'Listening...' : isLoading ? 'AI is thinking...' : isSpeaking ? 'AI is speaking...' : 'Click the microphone to speak.'}
            </Paragraph>
          </div>
        </div>
      </div>
      
      {summaryData && summaryData.feedback && (
        <Modal
          title={`Interview Report: ${summaryData.jobTitle}`}
          open={showSummary}
          onCancel={() => setShowSummary(false)}
          width={800}
          footer={[<Button key="back" onClick={() => setShowSummary(false)}>Close</Button>, <Button key="new" type="primary" onClick={() => navigate('/app/mock-interview')}>Start New Interview</Button>]}
        >
          <Title level={4}><CheckCircleOutlined style={{color: '#52c41a'}} /> Overall Summary</Title>
          <Paragraph>{summaryData.feedback.overallSummary}</Paragraph>
          <Divider />
          <Title level={4}><BulbOutlined style={{color: '#faad14'}} /> Key Suggestions</Title>
          <List dataSource={summaryData.feedback.suggestions} renderItem={(item) => <List.Item>• {item}</List.Item>} size="small" />
          <Divider />
          <Title level={4}><TrophyOutlined style={{color: '#1890ff'}} /> Performance Scores</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}><Text strong>Clarity</Text><Progress percent={summaryData.feedback.clarity.score} /><Paragraph type="secondary" style={{ fontStyle: 'italic' }}>{summaryData.feedback.clarity.feedback}</Paragraph></Col>
            <Col xs={24} md={8}><Text strong>Relevance</Text><Progress percent={summaryData.feedback.relevance.score} /><Paragraph type="secondary" style={{ fontStyle: 'italic' }}>{summaryData.feedback.relevance.feedback}</Paragraph></Col>
            <Col xs={24} md={8}><Text strong>Impact</Text><Progress percent={summaryData.feedback.impact.score} /><Paragraph type="secondary" style={{ fontStyle: 'italic' }}>{summaryData.feedback.impact.feedback}</Paragraph></Col>
          </Row>
        </Modal>
      )}
    </>
  );
};

export default LiveInterviewPage;