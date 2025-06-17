// src/components/AppFooter.jsx

import React from 'react';
import { Layout, Row, Col, Typography, Space } from 'antd';
import { GithubOutlined, LinkedinOutlined, TwitterOutlined } from '@ant-design/icons';
import './AppFooter.css'; // <-- Import the new CSS file

const { Footer } = Layout;
const { Text, Link: AntLink } = Typography;

const AppFooter = () => {
  return (
    <Footer style={{ padding: '40px 50px', backgroundColor: '#140221' }}>
      <Row justify="space-between" align="middle">
        <Col xs={24} md={8} className="footer-column" style={{ textAlign: 'left' }}>
          <Text style={{ color: 'rgba(255, 255, 255, 0.45)' }}>
            © {new Date().getFullYear()} InterviewMate. All Rights Reserved.
          </Text>
        </Col>
        <Col xs={24} md={8} className="footer-column" style={{ textAlign: 'center' }}>
            <Text style={{color: 'white', fontSize: '1.2rem', fontWeight: 600}}>InterviewMate</Text>
        </Col>
        <Col xs={24} md={8} className="footer-column" style={{ textAlign: 'right' }}>
          <Space size="middle">
            <AntLink href="https://github.com" target="_blank"><GithubOutlined style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '20px' }} /></AntLink>
            <AntLink href="https://twitter.com" target="_blank"><TwitterOutlined style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '20px' }} /></AntLink>
            <AntLink href="https://linkedin.com" target="_blank"><LinkedinOutlined style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '20px' }} /></AntLink>
          </Space>
        </Col>
      </Row>
    </Footer>
  );
};

export default AppFooter;