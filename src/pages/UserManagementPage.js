// src/pages/UserManagementPage.js (Corrected Subscription Column)

import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm, Tag, Row, Col, Typography, Card, Avatar, Input as AntdInput } from 'antd';
import { UserAddOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import './AdminDashboardPage.css'; // Reusing dashboard styles for consistency

const { Option } = Select;
const { Title } = Typography;

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const { token, API_URL } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`${API_URL}/admin/users`, config);
      setUsers(data);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token, API_URL]);

  const showAddModal = () => {
    setEditingUser(null);
    form.resetFields();
    form.setFieldsValue({ role: 'user', subscriptionTier: 'free' });
    setIsModalVisible(true);
  };

  const showEditModal = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API_URL}/admin/users/${id}`, config);
      message.success('User deleted successfully');
      fetchUsers();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      let promise;
      if (editingUser) {
        promise = axios.put(`${API_URL}/admin/users/${editingUser._id}`, values, config);
      } else {
        promise = axios.post(`${API_URL}/admin/users`, values, config);
      }
      await promise;
      message.success(`User ${editingUser ? 'updated' : 'added'} successfully`);
      fetchUsers();
      setIsModalVisible(false);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Operation failed. Please check the form fields.';
      message.error(errorMsg);
    }
  };

  const columns = [
    {
      title: 'NAME',
      dataIndex: 'username',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <Typography.Text strong>{text}</Typography.Text><br />
            <Typography.Text type="secondary">{record.email}</Typography.Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'ROLE',
      dataIndex: 'role',
      key: 'role',
      render: (role) => <Tag color={role === 'admin' ? 'volcano' : 'geekblue'}>{role?.toUpperCase()}</Tag>
    },
    {
      // ✅ FIX: This column now correctly displays the subscription tier
      title: 'SUBSCRIPTION',
      dataIndex: 'subscriptionTier',
      key: 'subscriptionTier',
      render: (tier) => {
        const tierText = tier || 'free'; // Default to 'free' if undefined
        let color = 'default';
        if (tier === 'pro') color = 'purple';
        if (tier === 'enterprise') color = 'gold';
        return <Tag color={color} style={{textTransform: 'capitalize'}}>{tierText}</Tag>
      }
    },
    {
      title: 'ACTION',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => showEditModal(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes, Delete"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredUsers = users.filter(user =>
    (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <Row justify="space-between" align="center" style={{ marginBottom: 24 }}>
        <Col><Title level={3} style={{ margin: 0 }}>User Management</Title></Col>
        <Col><Button type="primary" icon={<UserAddOutlined />} onClick={showAddModal}>Add User</Button></Col>
      </Row>
      <Card bordered={false} className="users-table-card">
        <AntdInput
          prefix={<SearchOutlined />}
          placeholder="Search by username or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: 20, maxWidth: 400 }}
        />
        <Table
          columns={columns}
          dataSource={filteredUsers}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 8 }}
        />
      </Card>
      <Modal
        title={editingUser ? `Edit User: ${editingUser.username}` : 'Add New User'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Save"
        destroyOnClose
      >
        <Form form={form} layout="vertical" name="userForm" initialValues={{ role: 'user', subscriptionTier: 'free' }}>
          <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please enter a username.' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input disabled={!!editingUser} />
          </Form.Item>
          {!editingUser && (
            <Form.Item name="password" label="Password" rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters.' }]}>
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select>
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
          <Form.Item name="subscriptionTier" label="Subscription Tier" rules={[{ required: true }]}>
            <Select>
              <Option value="free">Free</Option>
              <Option value="pro">Pro</Option>
              <Option value="enterprise">Enterprise</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserManagementPage;