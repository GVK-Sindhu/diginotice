import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { noticeService } from '../services/api';
import { DEFAULT_NOTICES } from '../services/mockData';
import { NoticeCard } from '../components';
import { Filter, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const Notices = () => {
    const { setSearchHandler } = useOutletContext();
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: 'All',
        search: '',
    });

    const categories = ['All', 'Academic', 'Exams', 'Placements', 'Events', 'Circulars'];

    useEffect(() => {
        setSearchHandler(() => handleSearch);
        return () => setSearchHandler(null);
    }, []);

    useEffect(() => {
        fetchNotices();
    }, [filters]);

    const fetchNotices = async () => {
        try {
            setLoading(true);
            const res = await noticeService.getNotices(filters);
            const noticeList = res?.data?.data || res?.data;
            if (Array.isArray(noticeList) && noticeList.length > 0) {
                setNotices(noticeList);
            } else {
                setNotices(DEFAULT_NOTICES);
            }
        } catch (error) {
            console.error('Failed to fetch notices', error);
            setNotices(DEFAULT_NOTICES);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (term) => {
        setFilters(prev => ({ ...prev, search: term }));
    };

    const handleCategoryChange = (cat) => {
        setFilters(prev => ({ ...prev, category: cat }));
    };

    return (
        <div className="notices-page fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: '#000080', fontSize: '1.8rem' }}>Notice Board</h1>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Filter size={20} style={{ color: '#666' }} />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    backgroundColor: filters.category === cat ? '#000080' : 'white',
                                    color: filters.category === cat ? 'white' : '#666',
                                    fontSize: '0.9rem',
                                    border: '1px solid #ddd',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>Loading notices...</div>
            ) : notices.length > 0 ? (
                <div className="notices-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {notices.map(notice => (
                        <NoticeCard key={notice._id} notice={notice} />
                    ))}
                </div>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '4rem',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <AlertCircle size={48} style={{ color: '#ccc', marginBottom: '1rem' }} />
                    <p style={{ color: '#999', fontSize: '1.2rem' }}>No notices found matching your filters.</p>
                </div>
            )}
        </div>
    );
};

export default Notices;
