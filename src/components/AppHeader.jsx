import React, { useState, useContext } from 'react';
import { Layout, Menu, Button, Space, Avatar, Dropdown, App as AntdApp, theme, Drawer, Tooltip } from 'antd';
import {
  DownOutlined, UserOutlined, LineChartOutlined, HistoryOutlined,
  LogoutOutlined, MenuOutlined,DashboardOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './AppHeader.css';

const { Header } = Layout;

const AppHeader = () => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();
  const { token } = theme.useToken();

  const handleLogout = () => {
    logout();
    message.success('Logged out successfully.');
    navigate('/');
  };


  const profileMenu = {
    items: [
      { key: 'profile', icon: <UserOutlined />, label: <Link to="/app/profile">My Profile</Link> },
      { key: 'progress', icon: <LineChartOutlined />, label: <Link to="/app/progress">Progress</Link> },
      { key: 'history', icon: <HistoryOutlined />, label: <Link to="/app/history">History</Link> },
      { type: 'divider' },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', onClick: handleLogout, danger: true },
    ]
  };

  const interviewMenu = { 
    items: [ 
      { key: 'mock', label: <Link to="/app/mock-interview">Mock Interview</Link> }, 
      { key: 'live', label: <Link to="/app/live-interview">Live Interview</Link> } 
    ] 
  };
  
  const resumeMenu = { 
    items: [ 
      { key: 'analyze', label: <Link to="/app/resume-analysis">Resume Analysis</Link> } 
    ] 
  };
  
  const learnMenu = { 
    items: [ 
      { key: 'videos', label: <Link to="/">Videos (Coming Soon)</Link> }, 
      { key: 'lang', label: <Link to="/">Learn Language (Coming Soon)</Link> } 
    ] 
  };
  
  const packagesMenu = { 
    items: [ 
    { key: 'view-plans', label: <Link to="/packages">View Plans</Link> } 
    ] 
  };
  
  const aboutMenu = {
    items: [
      { key: 'about', label: <Link to="/about-us">About Us</Link> },
      { key: 'contact', label: <Link to="/contact-us">Contact Us</Link> }
    ]
  };
  


  const MainMenu = ({ mode = 'horizontal' }) => (
    <Space direction={mode === 'vertical' ? 'vertical' : 'horizontal'} size={mode === 'vertical' ? 'large' : 32} align={mode === 'vertical' ? 'start' : 'center'}>
      <Dropdown menu={interviewMenu} trigger={['hover']}><a className="header-menu-item" onClick={(e) => e.preventDefault()}>Interview <DownOutlined style={{ fontSize: '10px' }} /></a></Dropdown>
      <Dropdown menu={resumeMenu} trigger={['hover']}><a className="header-menu-item" onClick={(e) => e.preventDefault()}>Resume <DownOutlined style={{ fontSize: '10px' }} /></a></Dropdown>
      <Dropdown menu={learnMenu} trigger={['hover']}><a className="header-menu-item" onClick={(e) => e.preventDefault()}>Learn <DownOutlined style={{ fontSize: '10px' }} /></a></Dropdown>
      <Dropdown menu={packagesMenu} trigger={['hover']}><a className="header-menu-item" onClick={(e) => e.preventDefault()}>Packages <DownOutlined style={{ fontSize: '10px' }} /></a></Dropdown>
      <Dropdown menu={aboutMenu} trigger={['hover']}><a className="header-menu-item" onClick={(e) => e.preventDefault()}>About Us <DownOutlined style={{ fontSize: '10px' }} /></a></Dropdown>
    </Space>
  );
  
  return (
    <>
      <Header className="app-header">
        <Space align="center" className="header-logo-section">
          <Link to="/" className="logo-link">
            <img src="/logo.jpg" alt="InterviewMate Logo" className="logo-image" />
            <span className="logo-text">InterviewMate</span>
          </Link>
        </Space>

        <div className="header-menu-desktop"><MainMenu /></div>
        
        <Space align="center" size="middle" className="header-controls-section">
          {isAuthenticated ? (
            <Dropdown menu={profileMenu} trigger={['click']} placement="bottomRight">
              <Avatar size="default" icon={<UserOutlined />} className="profile-avatar" />
            </Dropdown>
          ) : (
            <Space className="desktop-auth-buttons">
              <Button type="text" onClick={() => navigate('/login')} className="login-button">Login</Button>
              <Button type="primary" onClick={() => navigate('/signup')} className="signup-button">Sign Up</Button>
            </Space>
          )}

          {isAuthenticated && user?.role === 'admin' && (
            <Tooltip title="Admin dashboard">
              <Link to="/admin/dashboard">
                <Button
                  type="text"
                  icon={<DashboardOutlined style={{ color: token.colorSecondary }} />} 
                />
              </Link>
            </Tooltip>
          )}
          
          <Button type="text" className="lang-button">EN</Button>
          <Button className="mobile-menu-button" type="text" icon={<MenuOutlined style={{ color: token.colorText }} />} onClick={() => setIsDrawerVisible(true)} />
        </Space>
      </Header>

      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setIsDrawerVisible(false)}
        open={isDrawerVisible}
        styles={{ body: { padding: '24px' } }}
      >
        <MainMenu mode="vertical" />
        <hr style={{ margin: '24px 0', borderColor: 'rgba(255,255,255,0.1)' }} />
        {!isAuthenticated && (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="text" onClick={() => {navigate('/login'); setIsDrawerVisible(false);}} block>Login</Button>
            <Button type="primary" onClick={() => {navigate('/signup'); setIsDrawerVisible(false);}} block>Sign Up</Button>
          </Space>
        )}
      </Drawer>
    </>
  );
};
 
export default AppHeader;