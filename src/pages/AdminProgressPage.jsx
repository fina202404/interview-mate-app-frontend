// frontend/src/pages/AdminProgressPage.jsx
import React, { useEffect, useState, useContext } from 'react';
import {
  Table, Card, Typography, Tag, message, Row, Col, Input, DatePicker, Button, Select
} from 'antd';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const AdminProgressPage = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({ email: '', job: '', dateRange: [] });
  const { API_URL } = useContext(AuthContext);

  useEffect(() => {
    const fetchAllProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/admin/progress`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const processed = res.data.map((item) => ({
          ...item,
          email: item.userId?.email || 'N/A',
          score: (item.clarity || 0) + (item.relevance || 0),
          date: item.date || new Date(item.createdAt).toLocaleString(),
          job: item.job || 'N/A'
        }));

        setData(processed);
        setFilteredData(processed);
      } catch (err) {
        console.error('❌ Error fetching admin progress:', err);
        message.error('Failed to load progress data');
      }
    };

    fetchAllProgress();
  }, [API_URL]);

  const handleFilter = () => {
    const { email, job, dateRange } = filters;
    let result = [...data];
    if (email) result = result.filter(d => d.email.includes(email));
    if (job) result = result.filter(d => d.job === job);
    if (dateRange.length === 2) {
      const [start, end] = dateRange;
      result = result.filter(d => {
        const dDate = new Date(d.date);
        return dDate >= start.toDate() && dDate <= end.toDate();
      });
    }
    setFilteredData(result);
  };

  const downloadCSV = () => {
    const headers = ['Email', 'Job Title', 'Question', 'Score', 'Date'];
    const rows = filteredData.map(d => [d.email, d.job, d.question, d.score, d.date]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'interview_progress.csv');
  };

  const getTopUser = () => {
    const counts = {};
    data.forEach(d => {
      counts[d.email] = (counts[d.email] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  };

  const getCommonJob = () => {
    const counts = {};
    data.forEach(d => {
      counts[d.job] = (counts[d.job] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  };

  const avgScore = data.length ? (data.reduce((sum, d) => sum + d.score, 0) / data.length).toFixed(2) : 0;

  const columns = [
    { title: 'User Email', dataIndex: 'email' },
    { title: 'Job Title', dataIndex: 'job' },
    { title: 'Question', dataIndex: 'question', ellipsis: true },
    {
      title: 'Score',
      dataIndex: 'score',
      render: (val) => <Tag color={val >= 10 ? 'green' : 'orange'}>{val} / 20</Tag>
    },
    { title: 'Date', dataIndex: 'date' },
  ];

  return (
    <>
      <Link to="/app/admin/dashboard">
        <Button icon={<ArrowLeftOutlined />} style={{ margin: '16px 0' }}>
          Back to Dashboard
        </Button>
      </Link>

      <Card title="📊 All User Interview Progress (Admin View)" style={{ margin: 24 }}>
        <Title level={5}>Filters</Title>

        <Row gutter={12} style={{ marginBottom: 16 }}>
          <Col>
            <Input placeholder="Filter by Email" onChange={e => setFilters(f => ({ ...f, email: e.target.value }))} />
          </Col>
          <Col>
            <Select
              placeholder="Filter by Job"
              allowClear
              style={{ width: 150 }}
              onChange={val => setFilters(f => ({ ...f, job: val }))}
            >
              {[...new Set(data.map(d => d.job))].map(job => (
                <Option key={job} value={job}>{job}</Option>
              ))}
            </Select>
          </Col>
          <Col>
            <RangePicker onChange={val => setFilters(f => ({ ...f, dateRange: val || [] }))} />
          </Col>
          <Col>
            <Button onClick={handleFilter}>Apply</Button>
          </Col>
          <Col>
            <Button icon={<DownloadOutlined />} onClick={downloadCSV}>Export CSV</Button>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}><Card title="Total Entries">{filteredData.length}</Card></Col>
          <Col span={6}><Card title="Average Score">{avgScore}</Card></Col>
          <Col span={6}><Card title="Top User">{getTopUser()}</Card></Col>
          <Col span={6}><Card title="Popular Job">{getCommonJob()}</Card></Col>
        </Row>

        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="_id"
          scroll={{ x: true }}
          pagination={{ pageSize: 6 }}
        />
      </Card>
    </>
  );
};

export default AdminProgressPage;
