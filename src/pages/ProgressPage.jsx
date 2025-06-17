import React, { useEffect, useState, useContext } from 'react';
import { Card, Progress, Typography, Tag, Row, Col, message, Spin, Tooltip, Statistic } from 'antd';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { TrophyOutlined } from '@ant-design/icons';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import moment from 'moment';
import './ProgressPage.css';

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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-recharts-tooltip">
        <p className="recharts-tooltip-label">{`Job: ${data.job}`}</p>
        <p style={{color: '#E923F4', fontWeight: 'bold'}}>{`Total Score : ${data.score}`}</p>
        {/* ✅ FIX: Use the pre-formatted date string */}
        <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.8em' }}>{`Date: ${data.formattedDate}`}</p>
      </div>
    );
  }
  return null;
};

const ProgressPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, API_URL } = useContext(AuthContext);

  useEffect(() => {
    const fetchSessions = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/progress`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const validSessions = res.data.map((s) => ({
          ...s,
          score: (s.clarity || 0) + (s.relevance || 0),
          // ✅ FIX: Use moment for reliable date parsing and formatting
          name: moment(s.createdAt).format('MMM D'), // Short format for X-axis (e.g., "Jun 14")
          formattedDate: moment(s.createdAt).format('L LT'), // Full format for Tooltip
          job: s.job || 'General'
        })).filter(s => s.score > 0);
        
        validSessions.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        setSessions(validSessions);
      } catch (err) {
        message.error('Failed to load progress data.');
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [token, API_URL]);

  const totalXP = sessions.reduce((acc, s) => acc + s.score, 0);
  const level = Math.floor(totalXP / 100);
  const nextLevelXP = (level + 1) * 100;
  const progressPercent = nextLevelXP > 0 ? parseFloat(((totalXP % 100) / 100 * 100).toFixed(2)) : 0;

  if(loading) return <div style={{textAlign: 'center', margin: 50}}><Spin size="large" /></div>;

  return (
    <div className="progress-page-container">
      <Title level={2}>My Progress</Title>
      <Paragraph type="secondary">Track your interview performance and level up your skills over time.</Paragraph>
      <Row gutter={[24, 24]}>
        <Col xs={24}>
            <Card title={<><TrophyOutlined /> Your Rank & Level</>}>
                <Row align="middle" gutter={[24, 24]}>
                    <Col xs={24} md={8}>
                        <Statistic title="Current Level" value={level} />
                    </Col>
                    <Col xs={24} md={8}>
                        <Statistic title="Rank" valueRender={() => <Tag color={getRankColor(level)} className="progress-rank-tag">{getRank(level)}</Tag>} />
                    </Col>
                    <Col xs={24} md={8}>
                        <Tooltip title={`Total XP: ${totalXP}`}>
                            <Statistic title="XP to Next Level" value={progressPercent} suffix="%" />
                        </Tooltip>
                        <Progress percent={progressPercent} showInfo={false} status="active" strokeColor={{ from: '#5600F4', to: '#E923F4' }} />
                    </Col>
                </Row>
            </Card>
        </Col>

        <Col xs={24}>
             <Card title="Performance Trend Over Time">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={sessions} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E923F4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#E923F4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 20]} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="score" name="Score" stroke="#E923F4" fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
             </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProgressPage;