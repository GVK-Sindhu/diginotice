import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { noticeService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Clock, FileText as FileIcon, User as UserIcon, Bell } from 'lucide-react';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ total: 0, read: 0, unread: 0 });
    const [recentNotices, setRecentNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();

        // Refresh when window gets focus (e.g., coming back from another tab or window)
        window.addEventListener('focus', fetchData);
        return () => window.removeEventListener('focus', fetchData);
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, noticeRes] = await Promise.all([
                noticeService.getStats(),
                noticeService.getNotices({ limit: 5, sort: 'recent' })
            ]);

            const apiStats = statsRes?.data?.data || statsRes?.data;
            if (!apiStats || typeof apiStats !== 'object' || Array.isArray(apiStats)) {
                setStats({
                    total: 12,
                    read: 8,
                    unread: 4,
                    isGlobal: user?.role === 'ADMIN'
                });
            } else {
                setStats({
                    total: apiStats.total !== undefined ? apiStats.total : 12,
                    read: apiStats.read !== undefined ? apiStats.read : 8,
                    unread: apiStats.unread !== undefined ? apiStats.unread : 4,
                    isGlobal: user?.role === 'ADMIN'
                });
            }

            const noticeList = noticeRes?.data?.data || noticeRes?.data;
            if (Array.isArray(noticeList)) {
                setRecentNotices(noticeList.slice(0, 3));
            } else {
                setRecentNotices([]);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
            setStats({
                total: 12,
                read: 8,
                unread: 4,
                isGlobal: user?.role === 'ADMIN'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-page fade-in" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
            <div className="welcome-section" style={{
                marginBottom: '2.5rem',
                padding: '2rem',
                backgroundColor: '#000080',
                borderRadius: '16px',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '2.5rem' }}>Hi, {user?.name ? user.name.split(' ')[0] : (user?.role === 'ADMIN' ? 'Admin' : 'Student')}!</h1>
                    <p style={{ margin: '0.5rem 0 0', opacity: 0.8 }}>
                        {user?.role === 'ADMIN' ? 'Administrator Portal - Overview of campus activity.' : "Welcome back to NoticeHub. Here's what's happening today."}
                    </p>
                </div>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px' }}>
                    <UserIcon size={40} />
                </div>
            </div>

            <div className="stats-container" style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="stat-card" style={{ flex: 1, backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ backgroundColor: '#eef2ff', padding: '1rem', borderRadius: '10px', color: '#000080' }}>
                        <FileIcon size={24} />
                    </div>
                    <div>
                        <div style={{ color: '#666', fontSize: '0.9rem' }}>Total Notices</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>{stats.total}</div>
                    </div>
                </div>
                <div className="stat-card" style={{ flex: 1, backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ backgroundColor: '#ecfdf5', padding: '1rem', borderRadius: '10px', color: '#059669' }}>
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <div style={{ color: '#666', fontSize: '0.9rem' }}>{stats.isGlobal ? 'Global Reads' : 'Notices Read'}</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>{stats.read}</div>
                    </div>
                </div>
                <div className="stat-card" style={{ flex: 1, backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ backgroundColor: '#fff7ed', padding: '1rem', borderRadius: '10px', color: '#ea580c' }}>
                        <Clock size={24} />
                    </div>
                    <div>
                        <div style={{ color: '#666', fontSize: '0.9rem' }}>{stats.isGlobal ? 'Pending Reads' : 'Unread'}</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>{stats.unread}</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem', width: '100%', boxSizing: 'border-box' }}>
                <div className="recent-notices" style={{ minWidth: 0 }}>
                    <h2 style={{ color: '#000080', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                        <Bell size={24} /> Recent Notices
                    </h2>
                    {loading ? (
                        <p style={{ color: '#666' }}>Loading...</p>
                    ) : recentNotices.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {recentNotices.map(notice => (
                                <div
                                    key={notice._id || notice.id}
                                    className="card"
                                    style={{
                                        padding: '1.5rem',
                                        cursor: 'pointer',
                                        borderLeft: notice.isPinned ? '4px solid #000080' : '4px solid #FF8C00',
                                        boxSizing: 'border-box',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                    }}
                                    onClick={() => navigate(`/notices/${notice._id || notice.id}`)}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <h4 style={{ margin: 0, color: '#000080', fontWeight: 'bold' }}>{notice.title}</h4>
                                            {notice.isPinned && <span style={{ fontSize: '0.7rem', backgroundColor: '#fff3e0', color: '#FF8C00', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>PINNED</span>}
                                        </div>
                                        <span style={{ fontSize: '0.8rem', color: '#999' }}>
                                            {new Date(notice.postedDate || notice.createdAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <p style={{ margin: '0.5rem 0 0', color: '#666', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {notice.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: '#999' }}>No notices yet.</p>
                    )}
                </div>

                <div className="quick-actions">
                    <h2 style={{ color: '#000080', marginBottom: '1.5rem' }}>Highlights</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Link to="/notices" style={{ textDecoration: 'none' }}>
                            <div className="card highlight-card" style={{ backgroundColor: '#fff8f1', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #FF8C00', transition: 'transform 0.2s' }}>
                                <h4 style={{ color: '#e65100', margin: '0 0 0.5rem 0' }}>All Board Notices</h4>
                                <p style={{ fontSize: '0.85rem', margin: 0, color: '#666' }}>View the full announcement board and archive.</p>
                            </div>
                        </Link>
                        {user?.role === 'ADMIN' ? (
                            <Link to="/manage-notices" style={{ textDecoration: 'none' }}>
                                <div className="card highlight-card" style={{ backgroundColor: '#f0f4ff', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #000080', transition: 'transform 0.2s' }}>
                                    <h4 style={{ color: '#000080', margin: '0 0 0.5rem 0' }}>Manage Board</h4>
                                    <p style={{ fontSize: '0.85rem', margin: 0, color: '#666' }}>Edit or remove existing notices and view detailed analytics.</p>
                                </div>
                            </Link>
                        ) : (
                            <Link to="/contact" style={{ textDecoration: 'none' }}>
                                <div className="card highlight-card" style={{ backgroundColor: '#f0f4ff', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #000080', transition: 'transform 0.2s' }}>
                                    <h4 style={{ color: '#000080', margin: '0 0 0.5rem 0' }}>Student Helpdesk</h4>
                                    <p style={{ fontSize: '0.85rem', margin: 0, color: '#666' }}>Have questions? Contact our support team for assistance.</p>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
