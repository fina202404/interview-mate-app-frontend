// src/pages/AdminDashboardPage.js (Corrected to display real data)

import React, { useEffect, useState, useContext } from 'react';
import { Card, Typography, Row, Col, Statistic, Table, message, Spin, Button } from 'antd';
import { UserOutlined, SolutionOutlined, SettingOutlined, FileTextOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import './AdminDashboardPage.css';

const { Title, Paragraph } = Typography;

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ totalUsers: 0, activeInterviews: 0 });
  const [resumeAnalyses, setResumeAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, API_URL } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const [usersRes, analysesRes, progressRes] = await Promise.all([
          axios.get(`${API_URL}/admin/users`, config),
          axios.get(`${API_URL}/admin/resume-analyses`, config),
          axios.get(`${API_URL}/admin/progress`, config)
        ]);

        console.log("Data received from backend:", analysesRes.data);

        if (analysesRes.data && Array.isArray(analysesRes.data.analyses)) {
            setResumeAnalyses(analysesRes.data.analyses);
        }
        
        setStats({
          totalUsers: usersRes.data.length,
          activeInterviews: progressRes.data.length,
        });

        if (analysesRes.data && Array.isArray(analysesRes.data.analyses)) {
            setResumeAnalyses(analysesRes.data.analyses);
        }

      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        message.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, API_URL]);

  const columns = [
    {
      title: 'Customer',
      key: 'customer',
      render: (_, record) => record.userId?.username || record.userId?.email || 'Unknown User'
    },
    {
      title: 'Job Title',
      dataIndex: 'jobTitle',
      key: 'jobTitle'
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString()
    },
    {
      title: 'Report',
      key: 'report',
      render: (_, record) => (
        <a href={`${API_URL}${record.reportPath}`} target="_blank" rel="noopener noreferrer">
          <FileTextOutlined /> Download
        </a>
      )
    }
  ];

  return (
    <div className="admin-dashboard">
      <Title level={2} style={{ marginBottom: '8px' }}>Admin Overview</Title>
      <Paragraph type="secondary" style={{ marginBottom: '24px' }}>
        Welcome to the admin control panel. Here's a quick overview of your application.
      </Paragraph>

      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card className="stat-card">
            <Statistic title="Total Users" value={stats.totalUsers} prefix={<UserOutlined />} loading={loading} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="stat-card">
            <Statistic title="Active Interviews (Mock)" value={stats.activeInterviews} prefix={<SolutionOutlined />} loading={loading} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="stat-card">
            <Statistic title="System Health (Mock)" value={"Good"} prefix={<SettingOutlined />} loading={loading} />
          </Card>
        </Col>
      </Row>

      <Card title="Latest Resume Analyses" className="users-table-card" style={{ marginTop: '32px' }}>
        <Table
          loading={loading}
          rowKey="_id"
          columns={columns}
          dataSource={resumeAnalyses}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default AdminDashboardPage;