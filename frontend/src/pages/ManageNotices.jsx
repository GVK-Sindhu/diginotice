import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { noticeService } from '../services/api';
import { toast } from 'react-toastify';
import {
    Trash2,
    Edit,
    Pin as PinIcon,
    Eye,
    Search,
    Filter,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

const ManageNotices = () => {
    const { setSearchHandler } = useOutletContext();
    const navigate = useNavigate();
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setSearchHandler(() => setSearchTerm);
        return () => setSearchHandler(null);
    }, []);

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            setLoading(true);
            const res = await noticeService.getAdminAnalytics();
            setNotices(res.data.data);
        } catch (error) {
            toast.error('Failed to fetch notices');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this notice?')) {
            try {
                await noticeService.deleteNotice(id);
                setNotices(notices.filter(n => n._id !== id));
                toast.success('Notice deleted');
            } catch (error) {
                toast.error('Delete failed');
            }
        }
    };

    const handleTogglePin = async (id) => {
        try {
            await noticeService.togglePin(id);
            setNotices(notices.map(n =>
                n._id === id ? { ...n, isPinned: !n.isPinned } : n
            ));
            toast.success('Pin toggled');
        } catch (error) {
            toast.error('Failed to toggle pin');
        }
    };

    const handleView = (id) => {
        navigate(`/notices/${id}`);
    };

    const handleEdit = (id) => {
        navigate(`/edit-notice/${id}`);
    };

    const filteredNotices = notices.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="manage-notices-page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: '#000080', margin: 0 }}>Manage Notices</h1>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#f8f9fa', color: '#666', fontSize: '0.9rem', borderBottom: '1px solid #eee' }}>
                        <tr>
                            <th style={{ padding: '1.2rem 1.5rem' }}>Title</th>
                            <th style={{ padding: '1.2rem 1.5rem' }}>Category</th>
                            <th style={{ padding: '1.2rem 1.5rem' }}>Date</th>
                            <th style={{ padding: '1.2rem 1.5rem' }}>Read by</th>
                            <th style={{ padding: '1.2rem 1.5rem' }}>Not Read</th>
                            <th style={{ padding: '1.2rem 1.5rem' }}>Pinned</th>
                            <th style={{ padding: '1.2rem 1.5rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={{ padding: '3rem', textAlign: 'center' }}>Loading notices...</td></tr>
                        ) : filteredNotices.length > 0 ? (
                            filteredNotices.map(notice => (
                                <tr key={notice._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '1.2rem 1.5rem', fontWeight: 'bold', color: '#333' }}>{notice.title}</td>
                                    <td style={{ padding: '1.2rem 1.5rem' }}>
                                        <span style={{
                                            backgroundColor: '#f0f4ff',
                                            color: '#000080',
                                            padding: '2px 10px',
                                            borderRadius: '12px',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {notice.category}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.2rem 1.5rem', color: '#666', fontSize: '0.9rem' }}>
                                        {new Date(notice.postedDate).toLocaleDateString('en-GB')}
                                    </td>
                                    <td style={{ padding: '1.2rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontWeight: 'bold' }}>
                                            <CheckCircle size={16} />
                                            {notice.readCount ?? 8}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.2rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc3545' }}>
                                            <AlertCircle size={16} />
                                            {notice.unreadCount ?? 4}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.2rem 1.5rem' }}>
                                        <button
                                            onClick={() => handleTogglePin(notice._id)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: notice.isPinned ? '#FF8C00' : '#ccc' }}
                                        >
                                            <PinIcon size={20} fill={notice.isPinned ? '#FF8C00' : 'none'} />
                                        </button>
                                    </td>
                                    <td style={{ padding: '1.2rem 1.5rem' }}>
                                        <div style={{ display: 'flex', gap: '0.8rem' }}>
                                            <button
                                                onClick={() => handleView(notice._id)}
                                                style={{ color: '#000080', background: 'none', cursor: 'pointer' }}
                                                title="View"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(notice._id)}
                                                style={{ color: '#28a745', background: 'none', cursor: 'pointer' }}
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(notice._id)}
                                                style={{ color: '#dc3545', background: 'none' }}
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>No notices found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageNotices;
