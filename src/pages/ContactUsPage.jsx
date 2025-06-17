import React from 'react';
import { Card, Typography, Button } from 'antd';
import { MailOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import './ContactUsPage.css';

const { Title, Paragraph } = Typography;

const ContactUsPage = () => {
  return (
    <div className="contact-us-container">
      <Title className="contact-us-title">Let's Connect</Title>
      <Paragraph className="contact-us-subtitle">
        We're here to help you create, scale, and grow.
      </Paragraph>

      <Card
        hoverable
        className="support-card"
        title={
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <QuestionCircleOutlined />
            Support
          </div>
        }
      >
        <Paragraph>
          Having trouble or need guidance? Email our support team with any technical questions or account-related issues — we're here to help.
        </Paragraph>
        <Button
          type="primary"
          icon={<MailOutlined />}
          href="mailto:support@interviewmate.com" // Replace with your actual support email
        >
          Email Support
        </Button>
      </Card>
    </div>
  );
};

export default ContactUsPage;