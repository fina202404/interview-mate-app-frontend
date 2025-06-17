import React, { useEffect, useState } from 'react';
import { Card, Typography, List, Button, message, Select, DatePicker, Row, Col } from 'antd';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import axios from 'axios';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const InterviewHistory = () => {
  const [history, setHistory] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [jobFilter, setJobFilter] = useState('All');
  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/progress', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const formatted = res.data.map(item => ({
          ...item,
          score: (item.clarity || 0) + (item.relevance || 0),
          date: item.date || new Date(item.createdAt).toLocaleString()
        }));

        setHistory(formatted.reverse());
        setFiltered(formatted.reverse());
      } catch (error) {
        console.error('❌ Error fetching history:', error);
        message.error('Failed to load interview history.');
      }
    };

    fetchHistory();
  }, []);

  // 🔍 Handle filtering
  useEffect(() => {
    let filteredData = [...history];

    if (jobFilter !== 'All') {
      filteredData = filteredData.filter((item) => item.job === jobFilter);
    }

    if (dateRange.length === 2) {
      filteredData = filteredData.filter((item) => {
        const date = new Date(item.createdAt);
        return date >= dateRange[0].toDate() && date <= dateRange[1].toDate();
      });
    }

    setFiltered(filteredData);
  }, [jobFilter, dateRange, history]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Interview History Report', 20, 20);

    filtered.forEach((session, i) => {
      const y = 30 + i * 30;
      doc.setFontSize(12);
      doc.text(`Job: ${session.job || 'N/A'}`, 20, y);
      doc.text(`Score: ${session.score || 'N/A'}`, 20, y + 10);
      doc.text(`Date: ${session.date}`, 20, y + 20);
    });

    doc.save('interview_history.pdf');
  };

  const downloadCSV = () => {
    const header = ['Job', 'Score', 'Date'];
    const rows = filtered.map((item) => [item.job || '', item.score || '', item.date]);

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += header.join(',') + '\n';
    rows.forEach((row) => {
      csvContent += row.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    saveAs(blob, 'interview_history.csv');
  };

  const jobOptions = ['All', ...new Set(history.map(item => item.job || 'Unknown'))];

  return (
    <Card title="📝 Interview History" style={{ marginTop: '2rem' }}>
      <Title level={5}>Your Past Interviews</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}>
          <Select value={jobFilter} onChange={setJobFilter} style={{ width: '100%' }}>
            {jobOptions.map((job) => (
              <Option key={job} value={job}>
                {job}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} md={10}>
          <RangePicker onChange={setDateRange} style={{ width: '100%' }} />
        </Col>
        <Col xs={24} md={6}>
          <Button type="primary" onClick={downloadCSV} style={{ marginRight: 8 }}>
            Download CSV
          </Button>
          {filtered.length > 0 && (
            <Button onClick={downloadPDF}>Download PDF</Button>
          )}
        </Col>
      </Row>

      <List
        itemLayout="horizontal"
        dataSource={filtered}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              title={`Interview for ${item.job || 'N/A'}`}
              description={`Score: ${item.score} | Date: ${item.date}`}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default InterviewHistory;
