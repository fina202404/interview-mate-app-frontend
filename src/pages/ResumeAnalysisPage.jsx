// frontend/src/pages/ResumeAnalysisPage.jsx (Final Corrected Version)

import React, { useState, useContext } from 'react';
import { Upload, Button, Typography, Card, App as AntdApp, Input, Row, Col, Spin } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import ResumeFeedbackDisplay from '../components/ResumeFeedbackDisplay';

const { Paragraph, Title } = Typography;
const { Dragger } = Upload;

const ResumeAnalysisPage = () => {
    const [file, setFile] = useState(null);
    const [jobTitle, setJobTitle] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    // ✅ STEP 1: Get the 'loadUser' function from our context
    const { API_URL, token, loadUser } = useContext(AuthContext);
    const { message: antdMessageHook } = AntdApp.useApp();

    const draggerProps = {
        name: 'file',
        multiple: false,
        beforeUpload: (newFile) => {
            const isPDF = newFile.type === 'application/pdf';
            if (!isPDF) {
                antdMessageHook.error('Only PDF files are allowed.');
                return Upload.LIST_IGNORE;
            }
            setFile(newFile);
            setFeedback(null);
            return false;
        },
        onRemove: () => {
            setFile(null);
        },
        fileList: file ? [file] : [],
    };

    const handleAnalyze = async () => {
        if (!file || !jobTitle.trim()) {
            antdMessageHook.warning('Please provide a job title and select a resume.');
            return;
        }
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobTitle', jobTitle);

        setLoading(true);
        setFeedback(null);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                }
            };
            const res = await axios.post(`${API_URL}/resume/job-analyze`, formData, config);
            
            if (res.data.success) {
                antdMessageHook.success('Resume analysis complete!');
                setFeedback(res.data.feedback);
                // ✅ STEP 2: After the analysis is successful, refresh the user's data globally.
                await loadUser();
            } else {
                antdMessageHook.error(res.data.message || 'Something went wrong.');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Resume analysis failed.';
            antdMessageHook.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            {!feedback && (
                <>
                    <Title level={2} style={{textAlign: 'center'}}>Resume Analysis</Title>
                    <Paragraph type="secondary" style={{textAlign: 'center', maxWidth: '600px', margin: 'auto', marginBottom: '2rem'}}>
                        Upload your resume and enter a target job title. Our AI will analyze your resume's suitability for the role and provide a detailed feedback report.
                    </Paragraph>

                    <Row>
                        <Col xs={24} md={24} style={{maxWidth: '800px', margin: 'auto'}}>
                            <Card title="Step 1: Provide Details">
                                <Paragraph strong>Enter the job title you are applying for.</Paragraph>
                                <Input
                                    placeholder="e.g. Senior Frontend Developer"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                    style={{ marginBottom: 24 }}
                                    size="large"
                                />
                                <Paragraph strong>Upload your resume in PDF format.</Paragraph>
                                <Dragger {...draggerProps}>
                                    <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                                    <p className="ant-upload-text">Click or drag your PDF file to this area to upload</p>
                                    <p className="ant-upload-hint">Strictly for a single PDF file. Your resume will be securely analyzed.</p>
                                </Dragger>
                                <Button
                                    type="primary"
                                    onClick={handleAnalyze}
                                    loading={loading}
                                    disabled={!file || loading || !jobTitle.trim()}
                                    style={{ marginTop: 24 }}
                                    size="large"
                                    block
                                >
                                    {loading ? 'Analyzing...' : 'Analyze My Resume'}
                                </Button>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}

            {loading && !feedback && (
                <div style={{textAlign: 'center', paddingTop: '4rem'}}>
                    <Spin size="large" tip="Our AI is analyzing your resume... This may take a moment." />
                </div>
            )}
            
            {feedback && (
                <>
                    <ResumeFeedbackDisplay feedbackData={feedback} jobTitle={jobTitle} />
                    <div style={{textAlign: 'center', marginTop: '2rem'}}>
                        <Button onClick={() => setFeedback(null)}>Analyze Another Resume</Button>
                    </div>
                </>
            )}
        </div>
    );
};

const ResumeAnalysisPageWrapper = () => (
    <AntdApp>
        <ResumeAnalysisPage />
    </AntdApp>
);

export default ResumeAnalysisPageWrapper;