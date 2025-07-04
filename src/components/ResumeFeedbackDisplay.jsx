import React from 'react';
import { useTranslation } from 'react-i18next';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// --- Icons ---
const CheckIcon = () => <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const WarningIcon = () => <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>;
const BulbIcon = () => <svg className="w-6 h-6 text-neon-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>;
const DownloadIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>;

// --- Sub-components ---
const FeedbackList = ({ items, icon, colorClass }) => (
    <ul className="space-y-3">
        {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
                <div className={`flex-shrink-0 mt-1 ${colorClass}`}>{icon}</div>
                <span className="text-gray-300">{item}</span>
            </li>
        ))}
    </ul>
);

const CircularProgress = ({ score }) => {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg className="w-48 h-48" x-cloak="true" aria-hidden="true">
                <circle className="text-gray-800" strokeWidth="12" stroke="currentColor" fill="transparent" r={radius} cx="96" cy="96" />
                <circle
                    className="text-neon-pink"
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="url(#scoreGradient)"
                    fill="transparent"
                    r={radius}
                    cx="96"
                    cy="96"
                    transform="rotate(-90 96 96)"
                />
                <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#E923F4" />
                        <stop offset="100%" stopColor="#5600F4" />
                    </linearGradient>
                </defs>
            </svg>
            <span className="absolute text-4xl font-bold text-white">{score}%</span>
        </div>
    );
};


const ResumeFeedbackDisplay = ({ feedbackData, jobTitle }) => {
    const { t } = useTranslation();
    if (!feedbackData) return null;

    const { matchScore, overallSummary, strengths, areasForImprovement, actionPlan } = feedbackData;

    // UPDATE: The PDF generation logic is now correctly structured.
    const handleDownload = () => {
        try {
            const doc = new jsPDF();
            let lastY = 10; // Start with an initial Y position

            // ---- Title and Header ----
            doc.setFontSize(22);
            doc.text(t('feedback_report_title'), 14, (lastY += 12));
            
            doc.setFontSize(16);
            doc.text(t('feedback_score_title', { jobTitle }), 14, (lastY += 10));

            doc.setFontSize(12);
            doc.text(`${t('feedback_score_title_short')}: ${matchScore}%`, 14, (lastY += 10));
            
            // ---- Summary Text ----
            doc.setFontSize(11);
            const splitSummary = doc.splitTextToSize(overallSummary, 180); // 180 is the width
            doc.text(splitSummary, 14, (lastY += 10));
            lastY += splitSummary.length * 5; // Adjust Y position based on text height

            // ---- Strengths Table ----
            autoTable(doc, {
                startY: lastY + 5,
                head: [[t('feedback_strengths_title')]],
                body: strengths.map(item => [item]),
                theme: 'grid',
                headStyles: { fillColor: [43, 2, 69] }
            });
            lastY = doc.lastAutoTable.finalY; // Update Y position after the table

            // ---- Improvements Table ----
            autoTable(doc, {
                startY: lastY + 10,
                head: [[t('feedback_improvements_title')]],
                body: areasForImprovement.map(item => [item]),
                theme: 'grid',
                headStyles: { fillColor: [233, 35, 244] }
            });
            lastY = doc.lastAutoTable.finalY; // Update Y position again

            // ---- Action Plan Table ----
            autoTable(doc, {
                startY: lastY + 10,
                head: [[t('feedback_action_plan_title')]],
                body: actionPlan.map(item => [item]),
                theme: 'grid',
                headStyles: { fillColor: [86, 0, 244] }
            });
            
            doc.save(`Resume-Report-${jobTitle.replace(/\s+/g, '_')}.pdf`);
        } catch(e) {
            console.error("Failed to generate PDF:", e);
            alert("Sorry, an error occurred while generating the PDF.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-8 p-4">
             <hr className="border-white/10 my-8" />
             <h2 className="text-3xl font-bold text-center text-white mb-12">{t('feedback_report_title')}</h2>
            
            <div className="text-center bg-gray-900/50 border border-white/10 rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">{t('feedback_score_title', { jobTitle })}</h3>
                <CircularProgress score={matchScore} />
                <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">{overallSummary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><CheckIcon/> {t('feedback_strengths_title')}</h4>
                    <FeedbackList items={strengths} icon={<CheckIcon/>} colorClass="text-green-400" />
                </div>
                <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><WarningIcon/> {t('feedback_improvements_title')}</h4>
                    <FeedbackList items={areasForImprovement} icon={<WarningIcon/>} colorClass="text-yellow-400" />
                </div>
            </div>

            <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6">
                <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><BulbIcon/> {t('feedback_action_plan_title')}</h4>
                <FeedbackList items={actionPlan} icon={<BulbIcon/>} colorClass="text-neon-pink" />
            </div>

            <div className="text-center mt-12">
                <button 
                  onClick={handleDownload}
                  className="inline-flex items-center justify-center text-white font-bold text-lg py-3 px-10 rounded-full transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-neon-pink to-bright-blue hover:shadow-[0_0_25px_theme(colors.neon-pink)]"
                >
                    <DownloadIcon />
                    {t('feedback_download_button')}
                </button>
            </div>
        </div>
    );
};

export default ResumeFeedbackDisplay;