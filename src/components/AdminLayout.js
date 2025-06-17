import React, { useState, useContext } from 'react';
import { Layout, Menu, Button, Space, Typography } from 'antd';
import {
  MenuUnfoldOutlined, MenuFoldOutlined, TeamOutlined,
  DashboardOutlined, HomeOutlined,
} from '@ant-design/icons';
import { Link, useLocation, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './AdminLayout.css';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const siderMenuItems = [
    { key: '/admin/dashboard', icon: <DashboardOutlined />, label: <Link to="/admin/dashboard">Dashboard</Link> },
    { key: '/admin/users', icon: <TeamOutlined />, label: <Link to="/admin/users">User Management</Link> },
    { type: 'divider' },
    { key: '/', icon: <HomeOutlined />, label: <Link to="/">Back to Main Site</Link> },
  ];

  return (
    <Layout className="admin-layout" style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
        <div className="admin-logo-container">
          <img src="/logo.jpg" alt="Logo" />
          {!collapsed && <span className="admin-logo-text">InterviewMate</span>}
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['/admin/dashboard']} selectedKeys={[location.pathname]} items={siderMenuItems} />
      </Sider>
      <Layout>
        <Header>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ color: 'white' }}
          />
          <Space className="header-controls">
            <Text style={{color: 'white'}}>{user?.username || 'Admin'}</Text>
          </Space>
        </Header>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;