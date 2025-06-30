import React, { useState, useContext } from 'react';
import { Form, Input, Button, Typography, Alert, App as AntdApp } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './AuthPage.css';

const { Title, Paragraph } = Typography;

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { API_URL } = useContext(AuthContext);
  const [form] = Form.useForm();
  const { message: antdMessageHook } = AntdApp.useApp();

  const onFinish = async (values) => {
    setLoading(true);
    setError('');
    try {
   
        const response = await fetch(`${API_URL}/auth/forgotpassword`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: values.email }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'An error occurred.');
        }

        antdMessageHook.success(data.message || 'Request processed. Please check your email.');
        form.resetFields();

    } catch (err) {
        setError(err.message || 'Failed to send reset instructions.');
    } finally {
        setLoading(false);
    }
  };

  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <Title level={2} className="auth-title">Forgot Password</Title>
        <Paragraph style={{ textAlign: 'center', marginBottom: 24, color: 'rgba(234, 230, 240, 0.65)' }}>
          Enter your email and we'll send a reset link.
        </Paragraph>
        {error && <Alert message={error} type="error" showIcon closable style={{ marginBottom: 20 }} onClose={() => setError('')} />}
        <Form form={form} name="forgot_password" onFinish={onFinish} autoComplete="off" layout="vertical">
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your Email!' }, { type: 'email' }]}>
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">Send Reset Link</Button>
          </Form.Item>
          <div className="auth-link-container">
            <Link to="/login">Back to Login</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
