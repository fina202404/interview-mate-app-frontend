import React, { useState, useContext } from 'react';
import { Form, Input, Button, Typography, Alert, App as AntdApp } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import emailjs from '@emailjs/browser';
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
      // Step 1: Call your backend to generate the reset token
      const backendResponse = await fetch(`${API_URL}/auth/forgotpassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email }),
      });
      const backendData = await backendResponse.json();

      if (!backendResponse.ok || !backendData.success) {
        if (!backendData.resetToken && !backendData.success) {
            throw new Error(backendData.message || 'Failed to initiate password reset.');
        }
        if (backendData.success && !backendData.resetToken) {
            antdMessageHook.success(backendData.message || 'If your email is registered, you will receive instructions.');
            form.resetFields();
            setLoading(false);
            return;
        }
      }

      // Step 2: If backend is successful and provides a resetToken, send email via EmailJS
      if (backendData.resetToken) {
        const resetUrl = `${window.location.origin}/resetpassword/${backendData.resetToken}`;
        
        // IMPORTANT: Ensure these keys match the variables in your EmailJS template
        const templateParams = {
          email: values.email,      // For recipient, if your EmailJS "To Email" field is {{email}}
          to_name: values.email,    // For a {{to_name}} placeholder if used in template greeting
          reset_link: resetUrl,     // For {{reset_link}} in the template body
          // from_name: "InterviewMate Team", // Add if your EmailJS "From Name" field uses {{from_name}}
          // app_name: "InterviewMate"      // Add if your template uses {{app_name}}
        };

        // Debugging logs
        console.log('Attempting to send email with templateParams:', templateParams);
        const serviceID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
        const templateID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID_PASSWORD_RESET;
        const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

        console.log('--- DEBUGGING EMAILJS VARS ---');
        console.log('Service ID (raw):', serviceID, '| Type:', typeof serviceID);
        console.log('Template ID (raw):', templateID, '| Type:', typeof templateID);
        console.log('Public Key (raw):', publicKey, '| Type:', typeof publicKey);
        console.log('-----------------------------');
        console.log('Values being passed to emailjs.send:');
        console.log('1. Service ID:', serviceID);
        console.log('2. Template ID:', templateID);
        console.log('3. Template Params:', templateParams);
        console.log('4. Public Key:', publicKey);
        console.log('-----------------------------');

        if (!serviceID || String(serviceID).trim() === "" ||
            !templateID || String(templateID).trim() === "" ||
            !publicKey || String(publicKey).trim() === "") {
            throw new Error("One or more EmailJS environment variables (Service ID, Template ID, or Public Key) are missing or empty. Please check your .env file, ensure values are set, and restart the server.");
        }

        await emailjs.send(serviceID, templateID, templateParams, publicKey);
        
        antdMessageHook.success(backendData.message || 'Password reset instructions sent if email is registered.');
        form.resetFields();
      } else {
        antdMessageHook.success(backendData.message || 'Password reset request processed. If your email is registered, you will receive further instructions.');
        form.resetFields();
      }

    } catch (err) {
      console.error("Forgot Password or EmailJS Error Details:");
      if (err && typeof err === 'object') {
        console.error("Status:", err.status);
        console.error("Text/Message from EmailJS:", err.text);
      }
      console.error("Full error object:", err);
      setError(err.text || err.message || 'Failed to send reset instructions. Please check console for details.');
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