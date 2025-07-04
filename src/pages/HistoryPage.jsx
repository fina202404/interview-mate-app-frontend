import React, { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

// --- Reusable Icons ---
const SpinnerIcon = () => <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const ErrorIcon = () => <svg className="w-12 h-12 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, API_URL } = useContext(AuthContext);
  const { t } = useTranslation();

  console.log("HistoryPage: Component rendering or re-rendering.");

  useEffect(() => {
    console.log("HistoryPage: useEffect triggered.");
    
    const fetchHistory = async () => {
      console.log("HistoryPage: fetchHistory function called.");
      if (!token) {
        console.error("HistoryPage: No token found. Aborting fetch.");
        setLoading(false);
        setError("You must be logged in to view your history.");
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        console.log(`HistoryPage: Fetching data from ${API_URL}/progress`);
        const res = await axios.get(`${API_URL}/progress`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log("HistoryPage: API call successful. Data received:", res.data);
        
        const formatted = res.data.map(item => ({
          ...item,
          score: (item.clarity || 0) + (item.relevance || 0),
          date: new Date(item.createdAt || item.date).toLocaleDateString('en-CA')
        })).sort((a, b) => new Date(b.date) - new Date(a.date));
        
        console.log("HistoryPage: Data formatted. Setting history state.", formatted);
        setHistory(formatted);

      } catch (err) {
        console.error('HistoryPage: API call failed.', err);
        setError('Could not load your interview history. The server might be down or an error occurred. Please try again later.');
      } finally {
        console.log("HistoryPage: Fetch process finished. Setting loading to false.");
        setLoading(false);
      }
    };
    fetchHistory();
  }, [token, API_URL]);
  
  // --- Render States ---
  if (loading) {
    console.log("HistoryPage: Rendering Loading State.");
    return (
        <div className="flex justify-center items-center h-[50vh] bg-black">
            <SpinnerIcon />
        </div>
    );
  }

  if (error) {
      console.log("HistoryPage: Rendering Error State.");
      return (
          <div className="text-center py-20 px-6">
              <ErrorIcon />
              <h2 className="mt-4 text-2xl font-bold text-white">An Error Occurred</h2>
              <p className="mt-2 text-lg text-red-400">{error}</p>
          </div>
      );
  }

  console.log("HistoryPage: Rendering data table. History length:", history.length);
  return (
    <div className="bg-black text-gray-200 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">{t('history_title')}</h1>
            <p className="text-lg text-gray-400">{t('history_subtitle')}</p>
        </div>

        <div className="bg-black/50 border border-deep-purple/30 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-deep-purple/30">
                    <thead className="bg-white/5">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">{t('history_table_job')}</th>
                            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">{t('history_table_question')}</th>
                            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">{t('history_table_score')}</th>
                            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">{t('history_table_date')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-deep-purple/30">
                        {history.length > 0 ? (
                            history.map((item) => (
                                <tr key={item._id} className="hover:bg-white/5 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{item.job}</td>
                                    <td className="px-6 py-4 whitespace-normal text-gray-300 max-w-md">{item.question}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 text-sm font-bold rounded-full ${item.score >= 10 ? 'bg-green-500/20 text-green-300' : 'bg-orange-500/20 text-orange-300'}`}>
                                            {item.score} / 20
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-400">{item.date}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-10 text-gray-400">{t('history_table_empty')}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;