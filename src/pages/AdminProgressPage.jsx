import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';

// --- Reusable Icons & Components ---
const SpinnerIcon = () => <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>;
const ArrowLeftIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>;
const DownloadIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>;
const FilterIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>;

// --- Pagination Component ---
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


const AdminProgressPage = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ email: '', job: '', dateRange: [null, null] });
  const { API_URL, token } = useContext(AuthContext);
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Set number of items per page

  const fetchAllProgress = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/progress`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const processed = res.data.map((item) => ({
        ...item,
        email: item.userId?.email || 'N/A',
        score: (item.clarity || 0) + (item.relevance || 0),
        date: new Date(item.createdAt || item.date).toLocaleString(),
        job: item.job || 'N/A'
      }));

      setData(processed);
      setFilteredData(processed);
    } catch (err) {
      console.error('❌ Error fetching admin progress:', err);
      toast.error('Failed to load progress data');
    } finally {
        setLoading(false);
    }
  }, [API_URL, token]);

  useEffect(() => {
    if (token) {
        fetchAllProgress();
    }
  }, [token, fetchAllProgress]);

  const handleFilterChange = (e) => {
      const { name, value } = e.target;
      setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e, index) => {
      const { value } = e.target;
      const newDateRange = [...filters.dateRange];
      newDateRange[index] = value ? dayjs(value) : null;
      setFilters(prev => ({ ...prev, dateRange: newDateRange }));
  };

  const applyFilters = () => {
    const { email, job, dateRange } = filters;
    let result = [...data];
    if (email) result = result.filter(d => d.email.toLowerCase().includes(email.toLowerCase()));
    if (job) result = result.filter(d => d.job === job);
    if (dateRange[0] && dateRange[1]) {
      const [start, end] = dateRange;
      result = result.filter(d => {
        const dDate = dayjs(d.date);
        return dDate.isAfter(start.startOf('day')) && dDate.isBefore(end.endOf('day'));
      });
    }
    setFilteredData(result);
    setCurrentPage(1); // Reset to first page on filter
  };

  const downloadCSV = () => {
    const headers = ['Email', 'Job Title', 'Question', 'Score', 'Date'];
    const rows = filteredData.map(d => [d.email, `"${d.job}"`, `"${d.question.replace(/"/g, '""')}"`, d.score, d.date]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'interview_progress.csv');
  };

  const uniqueJobs = [...new Set(data.map(d => d.job).filter(j => j !== 'N/A'))];

  // --- Pagination Logic ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div>
      <Link to="/admin/dashboard" className="inline-flex items-center text-neon-pink hover:text-white mb-6">
        <ArrowLeftIcon />
        {t('admin_progress_back_button')}
      </Link>

      <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-white mb-6">{t('admin_progress_title')}</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-4 bg-black/30 rounded-lg">
            <input type="text" name="email" placeholder={t('admin_progress_filter_email')} onChange={handleFilterChange} className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white w-full" />
            <select name="job" onChange={handleFilterChange} defaultValue="" className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white w-full">
                <option value="">{t('admin_progress_filter_job_all')}</option>
                {uniqueJobs.map(job => <option key={job} value={job}>{job}</option>)}
            </select>
            <input type="date" name="startDate" onChange={(e) => handleDateChange(e, 0)} className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white w-full" />
            <input type="date" name="endDate" onChange={(e) => handleDateChange(e, 1)} className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white w-full" />
        </div>
        <div className="flex gap-4 mb-8">
            <button onClick={applyFilters} className="flex items-center bg-bright-blue text-white font-semibold py-2 px-4 rounded-md hover:bg-royal-blue"><FilterIcon/> {t('admin_progress_apply_filters')}</button>
            <button onClick={downloadCSV} className="flex items-center bg-gray-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-600"><DownloadIcon/> {t('admin_progress_export_csv')}</button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
            {loading ? <div className="flex justify-center items-center h-64"><SpinnerIcon /></div> : (
            <table className="min-w-full">
                <thead className="bg-white/5">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Job Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Question</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                    {currentItems.map(item => (
                        <tr key={item._id} className="hover:bg-white/5">
                            <td className="px-6 py-4 whitespace-nowrap">{item.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.job}</td>
                            <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate">{item.question}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${item.score >= 10 ? 'bg-green-500/20 text-green-300' : 'bg-orange-500/20 text-orange-300'}`}>{item.score} / 20</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
        </div>
        {/* Pagination */}
        {filteredData.length > itemsPerPage && (
            <div className="p-4 border-t border-white/10">
                <Pagination 
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredData.length}
                    paginate={paginate}
                    currentPage={currentPage}
                />
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminProgressPage;