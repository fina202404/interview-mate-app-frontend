import React, { useContext, useState } from 'react';
import { Card, Typography, Button, Row, Col, List, message, Spin, Tag, App as AntdApp } from 'antd';
import { CheckCircleOutlined, StarOutlined, ArrowLeftOutlined} from '@ant-design/icons';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate,Link } from 'react-router-dom';
import './PackagesPage.css';

const { Title, Paragraph } = Typography;

const plans = [
    { name: 'Free', price: '¥0', period: '/ month', features: ['5 Mock Interviews', '5 Resume Analyses', 'Basic Feedback'], tier: 'free' },
    { name: 'Pro', price: '¥1000', period: '/ month', features: ['Unlimited Mock Interviews', '20 Resume Analyses', 'Advanced AI Feedback', 'Performance Tracking'], tier: 'pro', popular: true },
    { name: 'Enterprise', price: 'Custom', period: '', features: ['Unlimited Everything', 'Team Management', 'Custom Integrations', 'Priority Support'], tier: 'enterprise' }
];

const PackagesPage = () => {
    const [loadingPlan, setLoadingPlan] = useState(null);
    const { token, API_URL, user } = useContext(AuthContext);
    const { message: antdMessageHook } = AntdApp.useApp();
    const navigate = useNavigate();

    const handleSubscribe = async (plan) => {
        if (!token) {
            antdMessageHook.warning('Please log in to choose a plan.');
            navigate('/login');
            return;
        }
        if (plan.tier === 'enterprise') {
            antdMessageHook.info('Please contact our sales team for enterprise pricing.');
            return;
        }

        setLoadingPlan(plan.tier);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.post(`${API_URL}/checkout/create-checkout-session`, { plan: plan.tier }, config);
            if (res.data.url) {
                window.location.href = res.data.url; // Redirect user to Stripe
            }
        } catch (err) {
            antdMessageHook.error("Failed to start subscription process. Please try again.");
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <div className="packages-container">
            <Link to="/">
                <Button type="text" icon={<ArrowLeftOutlined />} style={{ position: 'absolute', top: 24, left: 24 }}>
                    Back to Home
                </Button>
            </Link>
            <Title style={{ textAlign: 'center' }}>Choose Your Plan</Title>
            <Paragraph type="secondary" style={{ textAlign: 'center', marginBottom: 48 }}>
                Unlock your potential with the plan that's right for you.
            </Paragraph>
            <Row gutter={[24, 24]} justify="center" align="stretch">
                {plans.map(plan => (
                    <Col key={plan.name} xs={24} md={8}>
                        <Card title={plan.name} className={`plan-card ${plan.popular ? 'plan-card-popular' : ''}`} extra={plan.popular && <Tag color="gold" icon={<StarOutlined/>}>Popular</Tag>}>
                            <div className="plan-price">
                                <span className="price-amount">{plan.price}</span>
                                <span className="price-period">{plan.period}</span>
                            </div>
                            <List className="feature-list" dataSource={plan.features} renderItem={(item) => (<li><CheckCircleOutlined /> {item}</li>)} />
                            <Button
                                type={plan.popular ? "primary" : "default"}
                                size="large" block
                                onClick={() => handleSubscribe(plan)}
                                loading={loadingPlan === plan.tier}
                                disabled={user?.subscriptionTier === plan.tier}
                            >
                                {user?.subscriptionTier === plan.tier ? 'Your Current Plan' : plan.tier === 'enterprise' ? 'Contact Sales' : 'Upgrade to Pro'}
                            </Button>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default PackagesPage;