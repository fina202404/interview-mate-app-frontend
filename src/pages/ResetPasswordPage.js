import React, { useState, useContext } from 'react';
import { Form, Input, Button, Typography, Alert, message as antdMessage } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './AuthPage.css';

const { Title } = Typography;

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { resettoken } = useParams();
  const { resetPassword } = useContext(AuthContext);

  const onFinish = async (values) => {
    setLoading(true);
    setError('');
    const result = await resetPassword(resettoken, values.password);
    setLoading(false);
    if (result.success) {
      antdMessage.success(result.message || 'Password reset. Please login.');
      navigate('/login');
    } else {
      setError(result.message || 'Failed to reset password.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <Title level={2} className="auth-title">Reset Your Password</Title>
        {error && <Alert message={error} type="error" showIcon closable style={{ marginBottom: 20 }} onClose={() => setError('')} />}
        <Form name="reset_password" onFinish={onFinish} autoComplete="off" layout="vertical">
          <Form.Item label="New Password" name="password" rules={[{ required: true, message: 'Please input your new Password!' }, { min: 6, message: 'Password must be at least 6 characters!' }]} hasFeedback>
            <Input.Password prefix={<LockOutlined />} placeholder="New Password" size="large" />
          </Form.Item>
          <Form.Item label="Confirm New Password" name="confirmPassword" dependencies={['password']} hasFeedback rules={[{ required: true }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('password') === value) { return Promise.resolve(); } return Promise.reject(new Error('The two passwords do not match!')); } })]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm New Password" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">Set New Password</Button>
          </Form.Item>
          <div className="auth-link-container">
            <Link to="/login">Back to Login</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
