import React, { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

// Icons
const IconUsers = () => <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a3.004 3.004 0 015.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>;
const IconSolution = () => <svg className="w-8 h-8 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>;
const IconHealth = () => <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>;
const IconFile = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>;
const SpinnerIcon = () => <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>;
const IconUserFree = () => <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>;
const IconUserPro = () => <svg className="w-8 h-8 text-neon-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l-3 3m0 0l-3-3m3 3V1m0 18v-4m-3 3l3-3m0 0l3 3m-12-3l3-3m0 0l-3-3m3 3h6m-6 0H6"></path></svg>;
const IconUserEnterprise = () => <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>;


const StatCard = ({ title, value, icon, loading }) => (
    <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6 flex items-center gap-6">
        <div className="flex-shrink-0">{icon}</div>
        <div>
            <p className="text-sm text-gray-400 uppercase tracking-wider">{title}</p>
            {loading ? <div className="h-9 w-12 bg-gray-700 animate-pulse rounded-md mt-1"></div> : <p className="text-3xl font-extrabold text-white">{value}</p>}
        </div>
    </div>
);

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    if (pageNumbers.length <= 1) return null;

    return (
        <nav className="flex justify-center items-center gap-2 mt-4">
            {pageNumbers.map(number => (
                <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${currentPage === number ? 'bg-neon-pink text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                    {number}
                </button>
            ))}
        </nav>
    );
};

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ totalUsers: 0, activeInterviews: 0, resumeAnalysesCount: 0, freeUsers: 0, proUsers: 0, enterpriseUsers: 0 });
  const [allAnalyses, setAllAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const { token, API_URL } = useContext(AuthContext);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      if (!token) { setLoading(false); return; }
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const [usersRes, analysesRes, progressRes] = await Promise.all([
          axios.get(`${API_URL}/admin/users`, config),
          axios.get(`${API_URL}/admin/resume-analyses`, config),
          axios.get(`${API_URL}/admin/progress`, config)
        ]);
        
        const users = usersRes.data || [];
        const freeUsers = users.filter(u => u.subscriptionTier === 'free' || !u.subscriptionTier).length;
        const proUsers = users.filter(u => u.subscriptionTier === 'pro').length;
        const enterpriseUsers = users.filter(u => u.subscriptionTier === 'enterprise').length;

        setStats({
          totalUsers: users.length,
          activeInterviews: progressRes.data.length,
          resumeAnalysesCount: analysesRes.data?.analyses?.length || 0,
          freeUsers,
          proUsers,
          enterpriseUsers,
        });

        if (analysesRes.data && Array.isArray(analysesRes.data.analyses)) {
            setAllAnalyses(analysesRes.data.analyses);
        }

      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, API_URL]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAnalyses = allAnalyses.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">{t('admin_dashboard_title')}</h1>
        <p className="text-lg text-gray-400">{t('admin_dashboard_subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatCard title={t('admin_stat_users')} value={stats.totalUsers} icon={<IconUsers />} loading={loading} />
        <StatCard title={t('admin_stat_interviews')} value={stats.activeInterviews} icon={<IconSolution />} loading={loading} />
        <StatCard title={t('admin_stat_resumes')} value={stats.resumeAnalysesCount} icon={<IconHealth />} loading={loading} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title={t('admin_stat_free_users')} value={stats.freeUsers} icon={<IconUserFree />} loading={loading} />
        <StatCard title={t('admin_stat_pro_users')} value={stats.proUsers} icon={<IconUserPro />} loading={loading} />
        <StatCard title={t('admin_stat_enterprise_users')} value={stats.enterpriseUsers} icon={<IconUserEnterprise />} loading={loading} />
      </div>

      <div className="bg-gray-900/50 border border-white/10 rounded-xl">
        <h3 className="text-xl font-bold text-white p-6 border-b border-white/10">{t('admin_dashboard_latest_analyses')}</h3>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-48"><SpinnerIcon/></div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Job Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {currentAnalyses.map(record => (
                  <tr key={record._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{record.userId?.username || record.userId?.email || 'Unknown'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.jobTitle}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(record.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a href={`${API_URL}${record.reportPath}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-neon-pink hover:underline">
                        <IconFile/> Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {allAnalyses.length > itemsPerPage && (
            <div className="p-4 border-t border-white/10">
                <Pagination 
                    itemsPerPage={itemsPerPage}
                    totalItems={allAnalyses.length}
                    paginate={paginate}
                    currentPage={currentPage}
                />
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;