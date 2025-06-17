import React, { useEffect, useState } from 'react';
import { Card, Progress, Typography, Tag, Button, Tooltip, Modal, Row, Col, message } from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrophyOutlined, ReloadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Paragraph } = Typography;

const getRank = (level) => {
  if (level >= 10) return 'Elite Interviewee';
  if (level >= 5) return 'Rising Star';
  if (level >= 1) return 'Beginner';
  return 'Newbie';
};

const getRankColor = (level) => {
  if (level >= 10) return 'gold';
  if (level >= 5) return 'geekblue';
  if (level >= 1) return 'green';
  return 'default';
};

const ProgressTracker = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/progress', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Only keep valid sessions (clarity + relevance exist)
        const validSessions = res.data.filter(
          (s) => typeof s.clarity === 'number' && typeof s.relevance === 'number'
        );

        setSessions(validSessions);
      } catch (err) {
        console.error('❌ Failed to fetch progress:', err);
        message.error('Failed to load progress data.');
      }
    };

    fetchSessions();
  }, []);

  const getXP = () => sessions.reduce((acc, s) => acc + (s.clarity + s.relevance), 0);
  const getLevel = () => Math.floor(getXP() / 100);
  const nextLevelXP = (getLevel() + 1) * 100;
  const currentXP = getXP();
  const progressPercent = ((currentXP % 100) / 100) * 100;

  const resetProgress = () => {
    Modal.confirm({
      title: 'Reset Progress?',
      content: 'Are you sure you want to clear all your interview history and XP?',
      okText: 'Yes, Reset',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          await axios.post('/api/progress/reset', {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setSessions([]);
          message.success('Progress reset!');
        } catch (err) {
          message.error('Failed to reset progress.');
        }
      }
    });
  };

  return (
    <div style={{ marginTop: 24 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card bordered title={<><TrophyOutlined /> Interview Progress</>}>
            <Title level={4} style={{ marginBottom: 8 }}>
              Level: {getLevel()}{" "}
              <Tag color={getRankColor(getLevel())}>{getRank(getLevel())}</Tag>
            </Title>
            <Tooltip title={`XP toward next level (${currentXP} / ${nextLevelXP})`}>
              <Progress percent={progressPercent} status="active" />
            </Tooltip>
            <Paragraph style={{ marginTop: 10 }}>
              Your progress is calculated based on AI feedback from your mock interviews.
            </Paragraph>
            <Button danger icon={<ReloadOutlined />} onClick={resetProgress}>
              Reset Progress
            </Button>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          {sessions.length > 0 ? (
            <Card bordered title="📊 Session Performance">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={sessions}>
                  <XAxis dataKey="job" />
                  <YAxis />
                  <RechartTooltip />
                  <Legend />
                  <Bar dataKey="clarity" fill="#1890ff" />
                  <Bar dataKey="relevance" fill="#52c41a" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          ) : (
            <Card bordered>
              <Paragraph>No session data available yet.</Paragraph>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ProgressTracker;
