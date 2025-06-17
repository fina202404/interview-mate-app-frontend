
import React, { useState, useContext } from 'react';
import { Form, Input, Button, Typography, Alert } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './AuthPage.css'; // Import the shared CSS

const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const onFinish = async (values) => {
    setLoading(true);
    setError('');
    const result = await login(values.email, values.password);
    setLoading(false);
    if (result.success) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } else {
      setError(result.message || 'Failed to login.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <Title level={2} className="auth-title">Login</Title>
        {error && <Alert message={error} type="error" showIcon closable style={{ marginBottom: 20 }} onClose={() => setError('')} />}
        <Form name="login" onFinish={onFinish} autoComplete="off" layout="vertical">
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your Email!' }, { type: 'email' }]}>
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>
          <div style={{ textAlign: 'right', marginBottom: '24px' }}>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              Log In
            </Button>
          </Form.Item>
          <div className="auth-link-container">
            Don't have an account? <Link to="/signup">Sign up now!</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
