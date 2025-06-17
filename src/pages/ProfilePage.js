// src/pages/ProfilePage.js (Redesigned)

import React, { useContext, useState, useEffect } from 'react';
import { Card, Typography, Form, Input, Button, Row, Col, Spin, Alert, Descriptions, Tag, Space, Avatar, Popconfirm, App as AntdApp } from 'antd';
import { UserOutlined, MailOutlined, SaveOutlined, CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import './ProfilePage.css';
import UsageTracker from '../components/UsageTracker';

const { Title, Text, Paragraph } = Typography;

const ProfilePage = () => {
  const { user, isLoading, loadUser, token, API_URL, logout } = useContext(AuthContext);
  const { message: antdMessageHook } = AntdApp.useApp();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      form.setFieldsValue({ username: user.username, email: user.email });
    }
  }, [user, form]);

  const handleUpdateProfile = async (values) => {
    setIsUpdating(true);
    setError('');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${API_URL}/users/profile`, values, config);
      antdMessageHook.success('Profile updated successfully!');
      await loadUser();
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API_URL}/users/profile`, config);
      antdMessageHook.success('Your account has been successfully deleted.');
      logout();
    } catch (err) {
      antdMessageHook.error(err.response?.data?.message || 'Failed to delete account.');
    }
  };

  if (isLoading) {
    return <div style={{ textAlign: 'center', margin: '50px' }}><Spin size="large" /></div>;
  }

  if (!user) {
    return <Alert message="Could not load user profile. Please try logging in again." type="error" showIcon />;
  }

  return (
    <div className="profile-page-container">
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card className="profile-summary-card">
            <Avatar className="profile-avatar" icon={<UserOutlined />} />
            <Title level={3} className="profile-username">{user.username}</Title>
            <Text type="secondary" className="profile-email">{user.email}</Text>
            <Tag color="purple" className="profile-plan-tag">{user.subscriptionTier || 'Free'} Plan</Tag>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card className="profile-details-card" title="Account Information" extra={!isEditing && <Button type="primary" onClick={() => setIsEditing(true)}>Edit Profile</Button>}>
            {error && <Alert message={error} type="error" showIcon closable style={{ marginBottom: 20 }} onClose={() => setError('')} />}
            {!isEditing ? (
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Username">{user.username}</Descriptions.Item>
                <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                <Descriptions.Item label="Joined On">{new Date(user.createdAt).toLocaleDateString()}</Descriptions.Item>
              </Descriptions>
            ) : (
              <Form form={form} layout="vertical" onFinish={handleUpdateProfile}>
                <Form.Item label="Username" name="username" rules={[{ required: true }]}><Input prefix={<UserOutlined />} /></Form.Item>
                <Form.Item label="Email" name="email"><Input prefix={<MailOutlined />} disabled /></Form.Item>
                <Paragraph type="secondary">Password can be changed via the "Forgot Password" link.</Paragraph>
                <Space>
                  <Button type="primary" htmlType="submit" loading={isUpdating} icon={<SaveOutlined />}>Save Changes</Button>
                  <Button onClick={() => setIsEditing(false)} icon={<CloseCircleOutlined />}>Cancel</Button>
                </Space>
              </Form>
            )}
          </Card>

          <Card title="My Usage Limits" style={{ marginTop: 24 }}>
              <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                      <UsageTracker
                          featureName="Mock Interviews"
                          count={user.voiceInterviewCount}
                          max={user.maxVoiceInterviews}
                          tier={user.subscriptionTier}
                      />
                  </Col>
                  <Col xs={24} md={12}>
                      <UsageTracker
                          featureName="Live Interviews"
                          count={user.realInterviewCount}
                          max={user.maxRealInterviews}
                          tier={user.subscriptionTier}
                      />
                  </Col>
                  <Col xs={24} md={12}>
                      <UsageTracker
                          featureName="Resume Analyses"
                          count={user.resumeAnalysisCount}
                          max={user.maxResumeAnalyses}
                          tier={user.subscriptionTier}
                      />
                  </Col>
              </Row>
          </Card>

          <Card className="danger-zone-card">
            <Paragraph>Once you delete your account, there is no going back. Please be certain.</Paragraph>
            <Popconfirm title="Are you sure you want to delete your account?" onConfirm={handleDeleteAccount} okText="Yes, Delete" okButtonProps={{ danger: true }}>
              <Button type="primary" danger icon={<DeleteOutlined />}>Delete My Account</Button>
            </Popconfirm>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;