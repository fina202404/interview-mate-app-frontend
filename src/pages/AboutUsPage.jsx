import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import { SolutionOutlined, RobotOutlined, AudioOutlined } from '@ant-design/icons';
import './AboutUsPage.css';

const { Title, Paragraph } = Typography;

const AboutUsPage = () => {
  return (
    <div className="about-us-page">
      <video autoPlay loop muted playsInline className="about-us-video-bg">
        <source src={`${process.env.PUBLIC_URL}/background.mp4`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="about-us-content-wrapper">
        <div className="about-us-container">
          <div className="about-hero">
            <Title>About InterviewMate</Title>
            <Title level={4} type="secondary" style={{ maxWidth: '700px', margin: '0 auto' }}>
              Our mission is to empower anyone to create high-quality interview practice without limits. We believe you shouldn't need fancy equipment or infinite resources to land your dream job.
            </Title>
          </div>
          
          <div className="features-section">
            <Title level={2} style={{ textAlign: 'center', marginBottom: 48 }}>Our Core Features</Title>
            <Row gutter={[24, 24]} justify="center">
              <Col xs={24} sm={12} md={8}>
                <Card className="feature-card" hoverable>
                  <div className="feature-icon"><RobotOutlined /></div>
                  <Title level={4}>Live AI Interview</Title>
                  <Paragraph>Engage in a real-time, voice-based conversation with our advanced AI interviewer that adapts to your answers.</Paragraph>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card className="feature-card" hoverable>
                  <div className="feature-icon"><SolutionOutlined /></div>
                  <Title level={4}>Resume Analysis</Title>
                  <Paragraph>Upload your resume and a target job title to get an AI-generated feedback report on how to improve.</Paragraph>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card className="feature-card" hoverable>
                  <div className="feature-icon"><AudioOutlined /></div>
                  <Title level={4}>Mock Interview Questions</Title>
                  <Paragraph>Practice with AI-generated questions tailored to a specific job title and get instant feedback on your answers.</Paragraph>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;