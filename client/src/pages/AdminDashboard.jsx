import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalServices: 0,
        totalBookings: 0,
        activeDisputes: 0
    });
    const [activeTab, setActiveTab] = useState('stats');
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [disputes, setDisputes] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchStats();
    }, [user, navigate]);

    useEffect(() => {
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'categories') fetchCategories();
        if (activeTab === 'disputes') fetchDisputes();
    }, [activeTab]);

    const fetchStats = async () => {
        try {
            setError(null);
            const res = await api.get('/admin/stats', {
                headers: { 'x-auth-token': token }
            });
            setStats(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching stats:', err);
            setError('Failed to fetch stats. ' + (err.response?.data?.msg || err.message));
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users', {
                headers: { 'x-auth-token': token }
            });
            setUsers(res.data);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories', {
                headers: { 'x-auth-token': token }
            });
            setCategories(res.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const fetchDisputes = async () => {
        try {
            const res = await api.get('/disputes', {
                headers: { 'x-auth-token': token }
            });
            setDisputes(res.data);
        } catch (err) {
            console.error('Error fetching disputes:', err);
        }
    };

    const toggleVerifyUser = async (id) => {
        try {
            await api.put(`/admin/users/${id}/verify`, {}, {
                headers: { 'x-auth-token': token }
            });
            fetchUsers();
        } catch (err) {
            console.error('Error verifying user:', err);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/admin/users/${id}`, {
                headers: { 'x-auth-token': token }
            });
            fetchUsers();
        } catch (err) {
            console.error('Error deleting user:', err);
        }
    };

    const addCategory = async (e) => {
        e.preventDefault();
        try {
            await api.post('/categories', { name: newCategory }, {
                headers: { 'x-auth-token': token }
            });
            setNewCategory('');
            fetchCategories();
        } catch (err) {
            console.error('Error adding category:', err);
            alert('Failed to add category');
        }
    };

    const deleteCategory = async (id) => {
        if (!window.confirm('Delete this category?')) return;
        try {
            await api.delete(`/categories/${id}`, {
                headers: { 'x-auth-token': token }
            });
            fetchCategories();
        } catch (err) {
            console.error('Error deleting category:', err);
        }
    };

    const resolveDispute = async (id) => {
        try {
            await api.put(`/disputes/${id}/status`, { status: 'resolved' }, {
                headers: { 'x-auth-token': token }
            });
            fetchDisputes();
        } catch (err) {
            console.error('Error resolving dispute:', err);
        }
    };

    if (loading) return <div className="text-center mt-20 text-xl font-bold text-primary">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                    <p className="text-gray-500">Total Users</p>
                    <p className="text-3xl font-bold">{stats.totalUsers}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                    <p className="text-gray-500">Total Services</p>
                    <p className="text-3xl font-bold">{stats.totalServices}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                    <p className="text-gray-500">Total Bookings</p>
                    <p className="text-3xl font-bold">{stats.totalBookings}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                    <p className="text-gray-500">Active Disputes</p>
                    <p className="text-3xl font-bold">{stats.activeDisputes}</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'stats' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('stats')}
                >
                    Overview
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'users' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('users')}
                >
                    Manage Users
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'categories' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('categories')}
                >
                    Manage Categories
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'disputes' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('disputes')}
                >
                    Disputes
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-lg shadow p-6">
                {activeTab === 'stats' && (
                    <div className="text-center text-gray-500 py-10">
                        <p className="text-xl">Welcome to the Admin Dashboard.</p>
                        <p>Select a tab to manage platform data.</p>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map(u => (
                                    <tr key={u._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{u.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap capitalize">{u.role}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {u.isVerified ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Verified</span>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Unverified</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => toggleVerifyUser(u._id)}
                                                className={`text-${u.isVerified ? 'orange' : 'green'}-600 hover:text-${u.isVerified ? 'orange' : 'green'}-900`}
                                            >
                                                {u.isVerified ? 'Unverify' : 'Verify'}
                                            </button>
                                            <button
                                                onClick={() => deleteUser(u._id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'categories' && (
                    <div>
                        <form onSubmit={addCategory} className="mb-6 flex gap-4">
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="New Category Name"
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary py-2 px-4 border"
                                required
                            />
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                Add Category
                            </button>
                        </form>
                        <ul className="space-y-2">
                            {categories.map(cat => (
                                <li key={cat._id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                                    <span className="font-medium text-gray-700">{cat.name}</span>
                                    <button
                                        onClick={() => deleteCategory(cat._id)}
                                        className="text-red-600 hover:text-red-900 text-sm"
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {activeTab === 'disputes' && (
                    <div className="space-y-4">
                        {disputes.length === 0 ? (
                            <p className="text-gray-500">No active disputes.</p>
                        ) : (
                            disputes.map(d => (
                                <div key={d._id} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-2 py-0.5 text-xs rounded-full ${d.status === 'open' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                {d.status.toUpperCase()}
                                            </span>
                                            <span className="text-sm text-gray-500">{new Date(d.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="font-medium text-gray-900">Reporter: {d.reporter?.name} ({d.reporter?.email})</p>
                                        <p className="text-gray-700">Reported: {d.reportedUser?.name} ({d.reportedUser?.email})</p>
                                        <p className="text-gray-600 mt-2 bg-gray-50 p-2 rounded text-sm italic">"{d.reason}"</p>
                                    </div>
                                    <div className="mt-4 md:mt-0">
                                        {d.status === 'open' && (
                                            <button
                                                onClick={() => resolveDispute(d._id)}
                                                className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                                            >
                                                Mark Resolved
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
