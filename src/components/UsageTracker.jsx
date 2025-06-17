// Create new file: src/components/UsageTracker.jsx
import React from 'react';
import { Progress, Typography, Card, Tooltip, Tag } from 'antd'; 
import { InfoCircleOutlined } from '@ant-design/icons';
import './UsageTracker.css';

const { Text } = Typography; 

const UsageTracker = ({ featureName, count, max, tier }) => {
  if (tier === 'enterprise') {
    return (
      <Card className="usage-tracker-card" bordered={false}>
        <div className="usage-tracker-content">
          <Text strong>{featureName} Usage</Text>
          <Tag color="gold">UNLIMITED</Tag>
        </div>
      </Card>
    );
  }

  const remaining = max - count;
  const percentage = max > 0 ? (count / max) * 100 : 0;

  return (
    <Card className="usage-tracker-card" bordered={false}>
      <div className="usage-tracker-content">
        <Text strong>
          {featureName} Usage{' '}
          <Tooltip title={`Your plan includes ${max} uses this month. You have ${remaining} left.`}>
            <InfoCircleOutlined style={{ cursor: 'pointer' }} />
          </Tooltip>
        </Text>
        <Text type="secondary" style={{ fontWeight: 500 }}>
          {count} / {max}
        </Text>
      </div>
      <Progress percent={percentage} showInfo={false} size="small" style={{ margin: '8px 0 0 0' }} />
    </Card>
  );
};

export default UsageTracker;