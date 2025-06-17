// src/HomePage.jsx (Corrected and Final)

import React, { useState, useRef, useEffect, useContext } from 'react';
import { Button, Typography } from 'antd';
import { ArrowRightOutlined, SoundOutlined, AudioMutedOutlined, LaptopOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from './context/AuthContext'; 
import './HomePage.css';

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
      });
    }
  }, []);

  return (
    <div className="homepage-container-grid">
      <div className="hero-left-panel">
        <div className="hero-text-content">
          <Title level={1} className="hero-title">
            Generate realistic AI interviews for any role.
          </Title>
          <Paragraph className="hero-paragraph">
            Practice makes perfect. Ace your next interview with personalized feedback and real-world scenarios powered by cutting-edge AI.
          </Paragraph>
          <div className="feature-list">
            <div className="feature-item">AI-Powered Mock Interviews</div>
            <div className="feature-item">Instant, Actionable Feedback</div>
            <div className="feature-item">Resume-to-Job Analysis</div>
          </div>
          
          {isAuthenticated ? (
            <Link to="/app/mock-interview">
              <Button
                type="primary"
                size="large"
                className="hero-signup-button"
                icon={<LaptopOutlined />}
              >
                Let's Strat Practice
              </Button>
            </Link>
          ) : (
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/signup')}
              className="hero-signup-button"
            >
              Sign Up for Free <ArrowRightOutlined />
            </Button>
          )}
        </div>
      </div>
      <div className="hero-right-panel">
        <video ref={videoRef} muted={isMuted} autoPlay loop playsInline id="hero-video">
          <source src="/Emmy.mp4" type="video/mp4" />
        </video>
        <Button
          shape="circle"
          className="mute-button"
          icon={isMuted ? <AudioMutedOutlined /> : <SoundOutlined />}
          onClick={() => setIsMuted(!isMuted)}
        />
      </div>
    </div>
  );
};

export default HomePage;