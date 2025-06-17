// src/pages/SignupPage.js
import React, { useState, useContext } from 'react';
import { Form, Input, Button, Typography, Alert, App as AntdApp } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './AuthPage.css';

const { Title } = Typography;

const SignupPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signup } = useContext(AuthContext);
  const { message: antdMessage } = AntdApp.useApp();

  const onFinish = async (values) => {
    setLoading(true);
    setError('');
    const result = await signup(values.username, values.email, values.password);
    setLoading(false);
    if (result.success) {
      antdMessage.success(result.message || 'Signup successful! Please login.');
      navigate('/login');
    } else {
      setError(result.message || 'Failed to sign up.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <Title level={2} className="auth-title">Create Account</Title>
        {error && <Alert message={error} type="error" showIcon closable style={{ marginBottom: 20 }} onClose={() => setError('')} />}
        <Form name="signup" onFinish={onFinish} autoComplete="off" layout="vertical">
          <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please input your Username!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Username" size="large" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your Email!' }, { type: 'email' }]}>
            <Input prefix={<MailOutlined />} placeholder="Email" size="large"/>
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters!'}]} hasFeedback>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large"/>
          </Form.Item>
          <Form.Item label="Confirm Password" name="confirmPassword" dependencies={['password']} hasFeedback rules={[{ required: true }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('password') === value) { return Promise.resolve(); } return Promise.reject(new Error('The two passwords do not match!')); } })]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" size="large"/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">Sign Up</Button>
          </Form.Item>
          <div className="auth-link-container">
            Already have an account? <Link to="/login">Log in!</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SignupPage;