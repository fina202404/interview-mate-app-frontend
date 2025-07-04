import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

// --- Icons ---
const SpinnerIcon = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;
const CloseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>;
const UserAddIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>;
const SearchIcon = () => <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>;

// --- Pagination Component ---
const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    if (pageNumbers.length <= 1) return null; // Don't show pagination if there's only one page

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


const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formState, setFormState] = useState({});
  const { token, API_URL } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation();

  // --- State for Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`${API_URL}/admin/users`, config);
      setUsers(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [token, API_URL]);

  useEffect(() => {
    if (token) fetchUsers();
  }, [token, fetchUsers]);

  const openModal = (user = null) => {
    setEditingUser(user);
    if (user) {
      setFormState({ ...user });
    } else {
      setFormState({ role: 'user', subscriptionTier: 'free' });
    }
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingUser(null);
    setFormState({});
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('admin_users_delete_confirm'))) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`${API_URL}/admin/users/${id}`, config);
        toast.success(t('admin_users_delete_success'));
        fetchUsers();
      } catch (err) {
        toast.error(err.response?.data?.message || t('admin_users_delete_fail'));
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      let promise;
      if (editingUser) {
        promise = axios.put(`${API_URL}/admin/users/${editingUser._id}`, formState, config);
      } else {
        promise = axios.post(`${API_URL}/admin/users`, formState, config);
      }
      await promise;
      toast.success(t(editingUser ? 'admin_users_update_success' : 'admin_users_add_success'));
      fetchUsers();
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || t('admin_users_op_fail'));
    }
  };

  const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1); // Reset to first page on new search
  }
  
  const filteredUsers = users.filter(user =>
    (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // --- Pagination Logic ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-white">{t('admin_users_title')}</h1>
        <button onClick={() => openModal()} className="flex items-center bg-bright-blue text-white font-semibold py-2 px-4 rounded-md hover:bg-royal-blue transition-colors">
            <UserAddIcon/> {t('admin_users_add_button')}
        </button>
      </div>
      
      <div className="bg-gray-900/50 border border-white/10 rounded-xl">
        <div className="p-6">
            <div className="relative w-full max-w-sm">
                <SearchIcon />
                <input
                    type="text"
                    placeholder={t('admin_users_search_placeholder')}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md pl-10 pr-4 py-2 text-white placeholder-gray-400"
                />
            </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? ( <div className="flex justify-center items-center h-64"><SpinnerIcon /></div> ) : (
            <table className="min-w-full">
               <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Subscription</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {currentUsers.map(user => (
                  <tr key={user._id}>
                    <td className="px-6 py-4">
                        <p className="font-bold text-white">{user.username}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                    </td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-bold rounded-full ${user.role === 'admin' ? 'bg-red-500/20 text-red-300' : 'bg-sky-500/20 text-sky-300'}`}>{user.role?.toUpperCase()}</span></td>
                    <td className="px-6 py-4"><span className="px-2 py-1 text-xs font-bold rounded-full bg-gray-500/20 text-gray-300 capitalize">{user.subscriptionTier || 'free'}</span></td>
                    <td className="px-6 py-4 text-left space-x-4">
                        <button onClick={() => openModal(user)} className="font-semibold text-neon-pink hover:underline">Edit</button>
                        <button onClick={() => handleDelete(user._id)} className="font-semibold text-red-500 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
         {/* Pagination component added */}
         {filteredUsers.length > itemsPerPage && (
            <div className="p-4 border-t border-white/10">
                <Pagination 
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredUsers.length}
                    paginate={paginate}
                    currentPage={currentPage}
                />
            </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalVisible && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <form onSubmit={handleFormSubmit} className="relative w-full max-w-lg bg-[#121212] border border-white/10 rounded-2xl shadow-2xl flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">{editingUser ? t('admin_users_modal_title_edit') : t('admin_users_modal_title_add')}</h2>
                    <button type="button" onClick={closeModal}><CloseIcon/></button>
                </div>
                <div className="p-6 space-y-4">
                    <input type="text" name="username" value={formState.username || ''} onChange={handleFormChange} placeholder="Username" className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white" required />
                    <input type="email" name="email" value={formState.email || ''} onChange={handleFormChange} placeholder="Email" className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white" required disabled={!!editingUser} />
                    {!editingUser && <input type="password" name="password" onChange={handleFormChange} placeholder="Password (min 6 chars)" className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white" required minLength="6" />}
                    <select name="role" value={formState.role} onChange={handleFormChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"><option value="user">User</option><option value="admin">Admin</option></select>
                    <select name="subscriptionTier" value={formState.subscriptionTier} onChange={handleFormChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"><option value="free">Free</option><option value="pro">Pro</option><option value="enterprise">Enterprise</option></select>
                </div>
                <div className="p-6 flex justify-end gap-4 border-t border-white/10">
                    <button type="button" onClick={closeModal} className="bg-gray-700 text-white font-semibold py-2 px-5 rounded-md hover:bg-gray-600">{t('admin_users_modal_cancel')}</button>
                    <button type="submit" className="bg-bright-blue text-white font-semibold py-2 px-5 rounded-md hover:bg-royal-blue">{t('admin_users_modal_save')}</button>
                </div>
            </form>
        </div>
      )}
    </>
  );
};

export default UserManagementPage;