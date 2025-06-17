// Create new file: src/pages/HistoryPage.jsx
import React, { useEffect, useState, useContext } from 'react';
import { Card, Typography, Table, Button, message, Select, DatePicker, Row, Col, Tag, Space, Spin } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { saveAs } from 'file-saver';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import './HistoryPage.css';

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, API_URL } = useContext(AuthContext);

  useEffect(() => {
    const fetchHistory = async () => {
      if(!token) return;
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/progress`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const formatted = res.data.map(item => ({
          ...item,
          key: item._id,
          score: (item.clarity || 0) + (item.relevance || 0),
          date: new Date(item.createdAt || item.date).toLocaleString()
        }));
        setHistory(formatted.reverse());
        setFiltered(formatted.reverse());
      } catch (error) {
        message.error('Failed to load interview history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [token, API_URL]);
  
  // Filtering logic can be added here if needed

  const historyColumns = [
    { title: 'Job Title', dataIndex: 'job', key: 'job', sorter: (a, b) => a.job.localeCompare(b.job) },
    { title: 'Question', dataIndex: 'question', key: 'question', ellipsis: true },
    { title: 'Score', dataIndex: 'score', key: 'score', sorter: (a, b) => a.score - b.score, render: (val) => <Tag color={val >= 10 ? 'green' : 'orange'}>{val} / 20</Tag> },
    { title: 'Date', dataIndex: 'date', key: 'date', sorter: (a, b) => new Date(a.date) - new Date(b.date) },
  ];

  if(loading) return <div style={{textAlign: 'center', margin: 50}}><Spin size="large" /></div>;

  return (
    <div className="history-page-container">
      <Title level={2}>Interview History</Title>
      <Paragraph type="secondary">Review the details of all your past interview sessions.</Paragraph>
      <Card>
        {/* We can add filter controls here later if you want them back */}
        <Table
            columns={historyColumns}
            dataSource={history}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
};

export default HistoryPage;