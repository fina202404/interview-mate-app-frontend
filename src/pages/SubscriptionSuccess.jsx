// src/pages/SubscriptionSuccess.jsx (Corrected with Robust Polling)
import React, { useEffect, useContext, useState, useCallback } from 'react';
import { Result, Button, Spin, Alert, message } from 'antd';
import { Link, useSearchParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const SubscriptionSuccess = () => {
    const { loadUser, token, API_URL } = useContext(AuthContext);
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const verifySubscription = useCallback(async () => {
        message.info("Finalizing your subscription... Please wait.");
        
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // This function will try to confirm the subscription up to 5 times over 10 seconds
        for (let i = 0; i < 5; i++) {
            try {
                const { data } = await axios.get(`${API_URL}/users/subscription-status`, config);
                if (data.success && data.subscriptionTier === 'pro') {
                    // SUCCESS! Now refresh the main context and stop loading.
                    await loadUser();
                    message.success("Your 'Pro' plan is now active!");
                    setLoading(false);
                    return;
                }
            } catch(e) {
                console.error("Polling error:", e);
            }
            // If not pro yet, wait 2 seconds before checking again
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // If it's still not 'pro' after multiple tries, show an error.
        setError('There was a delay activating your subscription. Please check your profile in a few minutes or contact support.');
        setLoading(false);
    }, [loadUser, token, API_URL, message]);

    useEffect(() => {
        if (searchParams.get('payment_status') === 'success') {
            verifySubscription();
        } else {
            setLoading(false);
            setError('Payment process was not completed successfully.');
        }
    }, [verifySubscription, searchParams]);
    
    if (loading) {
      return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
          <Spin size="large" tip="Confirming your subscription status... This may take a moment." />
        </div>
      );
    }

    if (error) {
         return <Result status="warning" title="Subscription Update Pending" subTitle={error} />;
    }

    return (
        <Result
            status="success"
            title="Subscription Activated!"
            subTitle="Your plan has been upgraded to Pro. You can now access all your new features."
            extra={[
                <Link to="/app/profile" key="profile">
                    <Button type="primary">View My Profile & Usage</Button>
                </Link>,
            ]}
        />
    );
};

export default SubscriptionSuccess;