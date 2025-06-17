import React from 'react';
import { Card, Progress, Typography, Row, Col, List, Button, Divider } from 'antd';
import { CheckCircleOutlined, WarningOutlined, BulbOutlined, DownloadOutlined } from '@ant-design/icons';

// ✅ 1. Import jsPDF and autoTable separately and directly
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const { Title, Paragraph, Text } = Typography;

const FeedbackListItem = ({ icon, text, color }) => (
    <List.Item>
        <List.Item.Meta
            avatar={React.cloneElement(icon, { style: { color, fontSize: '20px' } })}
            title={<Text style={{ fontSize: '16px' }}>{text}</Text>}
        />
    </List.Item>
);

const ResumeFeedbackDisplay = ({ feedbackData, jobTitle }) => {
    if (!feedbackData) return null;

    const {
        matchScore,
        overallSummary,
        strengths,
        areasForImprovement,
        actionPlan,
    } = feedbackData;

    const handleDownload = () => {
        const doc = new jsPDF();

        doc.setFontSize(22);
        doc.text("AI Resume Analysis Report", 105, 20, null, null, "center");
        doc.setFontSize(12);
        doc.text(`Target Role: ${jobTitle}`, 14, 35);
        doc.text(`Overall Match Score: ${matchScore}%`, 14, 42);
        const splitSummary = doc.splitTextToSize(overallSummary, 180);
        doc.text(splitSummary, 14, 52);

        // ✅ 2. Call autoTable as a function, passing 'doc' as the first argument
        autoTable(doc, {
            startY: 70,
            head: [['Strengths']],
            body: strengths.map(item => [item]),
            headStyles: { fillColor: '#52c41a' },
            theme: 'grid'
        });

        autoTable(doc, {
            head: [['Areas for Improvement']],
            body: areasForImprovement.map(item => [item]),
            headStyles: { fillColor: '#faad14' },
            theme: 'grid'
        });

        autoTable(doc, {
            head: [['Recommended Action Plan']],
            body: actionPlan.map(item => [item]),
            headStyles: { fillColor: '#72076E' },
            theme: 'grid'
        });

        const pageCount = doc.internal.getNumberOfPages();
        for(let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 25, 287);
            doc.text(`Report generated on: ${new Date().toLocaleDateString()}`, 14, 287);
        }

        doc.save(`Resume-Report-${jobTitle.replace(" ", "_")}.pdf`);
    };

    return (
        <div style={{ maxWidth: '900px', margin: 'auto', marginTop: '32px' }}>
             <Divider />
             <Title level={4} style={{textAlign: 'center', marginBottom: '24px'}}>AI Feedback Report</Title>
            <Card style={{ textAlign: 'center', marginBottom: '24px', background: 'rgba(25, 7, 41, 0.8)', backdropFilter: 'blur(10px)' }}>
                <Title level={3}>Resume Match Score for "{jobTitle}"</Title>
                <Progress type="dashboard" percent={matchScore} format={(percent) => `${percent}%`} strokeColor={{ '0%': '#72076E', '100%': '#E923F4' }} width={200} />
                <Paragraph style={{ marginTop: '16px', fontSize: '16px', maxWidth: '600px', margin: '16px auto 0' }}>{overallSummary}</Paragraph>
            </Card>

            <Row gutter={[24, 24]}>
                <Col xs={24} md={12}><Card title={<><CheckCircleOutlined style={{color: '#52c41a'}}/> Strengths</>}><List dataSource={strengths} renderItem={(item) => (<FeedbackListItem icon={<CheckCircleOutlined />} text={item} color="#52c41a" />)} /></Card></Col>
                <Col xs={24} md={12}><Card title={<><WarningOutlined style={{color: '#faad14'}}/> Areas for Improvement</>}><List dataSource={areasForImprovement} renderItem={(item) => (<FeedbackListItem icon={<WarningOutlined />} text={item} color="#faad14" />)}/></Card></Col>
            </Row>

            <Divider />

            <Card title={<><BulbOutlined /> Recommended Action Plan</>}><List dataSource={actionPlan} renderItem={(item) => (<FeedbackListItem icon={<BulbOutlined />} text={item} color="#E923F4" />)}/></Card>

            <div style={{ textAlign: 'center', marginTop: '32px' }}>
                {/* ✅ 3. The onClick handler doesn't change, but it now calls the corrected function */}
                <Button type="primary" icon={<DownloadOutlined />} size="large" onClick={handleDownload}>
                    Download Full PDF Report
                </Button>
            </div>
        </div>
    );
};

export default ResumeFeedbackDisplay;