// frontend/src/components/RealInterviewTab.jsx

import React, { useState, useRef, useContext } from 'react';
import { Card, Button, Typography, Input, Space, message, Spin } from 'antd';
import { AudioOutlined, AudioMutedOutlined, SendOutlined } from '@ant-design/icons';
import AuthContext from '../context/AuthContext';

const { Title, Paragraph, Text } = Typography;

const RealInterviewTab = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversation, setConversation] = useState([]);
  const recognitionRef = useRef(null);
  const { token, API_URL } = useContext(AuthContext);

  const speakWithElevenLabs = async (text) => {
    return new Promise(async (resolve) => {
      try {
        setIsSpeaking(true);
        const res = await fetch(`${API_URL}/voice/speak`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text })
        });
        const audioBlob = await res.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.onended = () => {
          setIsSpeaking(false);
          resolve();
        };
        audio.onerror = () => {
          setIsSpeaking(false);
          resolve();
        };
        audio.play();
      } catch (err) {
        console.error('ElevenLabs error:', err);
        setIsSpeaking(false);
        resolve();
      }
    });
  };

  const getAIResponse = async (userText) => {
    try {
      const res = await fetch(`${API_URL}/interview/converse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: userText })
      });
      const data = await res.json();
      return data.reply;
    } catch (err) {
      console.error('Gemini error:', err);
      return "Sorry, I encountered an error processing that.";
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      message.error('Speech recognition not supported in your browser.');
      return;
    }

    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      message.info('Listening...');
    };

    recognition.onresult = async (event) => {
      const userText = event.results[0][0].transcript;
      setConversation(prev => [...prev, { role: 'user', text: userText }]);

      const aiReply = await getAIResponse(userText);
      setConversation(prev => [...prev, { role: 'user', text: userText }, { role: 'ai', text: aiReply }]);
      await speakWithElevenLabs(aiReply);
    };

    recognition.onerror = (event) => {
      console.error('Recognition error:', event);
      message.error(`Speech recognition error: ${event.error}`);
      setIsRecording(false);
    };

    recognition.onend = () => setIsRecording(false);

    recognition.start();
  };

  return (
    <div>
      <Title level={4}>🗣️ Real Interview Mode</Title>
      <Paragraph>Talk with your AI interviewer in a natural, voice-based conversation. Ask questions, explain answers, or ask for clarification—just like a real interview.</Paragraph>
      <Space style={{ marginBottom: '1rem' }}>
        <Button
          type={isRecording ? 'default' : 'dashed'}
          danger={isRecording}
          icon={isRecording ? <AudioMutedOutlined /> : <AudioOutlined />}
          onClick={handleVoiceInput}
        >
          {isRecording ? 'Stop Listening' : 'Speak'}
        </Button>
      </Space>

      <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '1rem', background: '#f9f9f9', borderRadius: 8 }}>
        {conversation.map((msg, index) => (
          <Card key={index} style={{ marginBottom: '0.75rem', backgroundColor: msg.role === 'ai' ? '#fffbe6' : '#e6f7ff' }}>
            <Text strong>{msg.role === 'ai' ? 'AI Interviewer' : 'You'}:</Text>
            <Paragraph style={{ marginTop: '0.25rem' }}>{msg.text}</Paragraph>
          </Card>
        ))}
        {isSpeaking && <Spin tip="AI is speaking..." />}
      </div>
    </div>
  );
};

export default RealInterviewTab;
