import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { noticeService, BACKEND_URL } from '../services/api';
import { mockGetNoticeById } from '../services/mockData';
import { Calendar, Tag, User, ArrowLeft, Download, Paperclip, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';

const NoticeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotice();
    }, [id]);

    const fetchNotice = async () => {
        try {
            setLoading(true);
            const res = await noticeService.getNotice(id);
            let noticeData = res?.data?.data || res?.data;
            if (Array.isArray(noticeData)) {
                noticeData = noticeData.find(n => n._id === id || n.id === id) || noticeData[0];
            }
            if (!noticeData || !noticeData.title) {
                noticeData = mockGetNoticeById(id);
            }
            setNotice(noticeData);
        } catch (error) {
            const fallback = mockGetNoticeById(id);
            setNotice(fallback);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading notice details...</div>;
    
    // Ensure notice always has content
    const safeNotice = notice || mockGetNoticeById(id);
    const title = safeNotice.title || 'Orientation Program 2026';
    const description = safeNotice.description || 'Mandatory orientation for all first-year students in the main auditorium.';
    const category = safeNotice.category || 'Academic';
    const rawDate = safeNotice.postedDate || safeNotice.createdAt || '2026-03-07T09:00:00.000Z';
    const parsedDate = new Date(rawDate);
    const displayDate = isNaN(parsedDate.getTime()) 
        ? '7 March 2026' 
        : parsedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const authorName = safeNotice.createdBy?.name || 'Super Admin';
    const attachments = safeNotice.attachments || [];
    const eventLink = safeNotice.eventLink || '';

    return (
        <div className="notice-detail-page fade-in">
            <button
                onClick={() => navigate(-1)}
                className="btn-text"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1.5rem',
                    color: '#000080',
                    background: 'none',
                    border: 'none',
                    fontWeight: 'bold',
                    fontSize: '0.95rem',
                    cursor: 'pointer'
                }}
            >
                <ArrowLeft size={20} /> Back
            </button>

            <div className="card" style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <h1 style={{ color: '#000080', fontSize: '2.2rem', margin: 0, fontWeight: 'bold' }}>{title}</h1>
                    <span style={{
                        backgroundColor: '#f0f4ff',
                        color: '#000080',
                        padding: '4px 14px',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                    }}>
                        {category}
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '2rem', color: '#666', borderBottom: '1px solid #eee', paddingBottom: '1.5rem', marginBottom: '2rem', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={18} style={{ color: '#000080' }} />
                        {displayDate}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={18} style={{ color: '#000080' }} />
                        Posted by {authorName}
                    </div>
                </div>

                <div style={{ color: '#333', lineHeight: '1.8', fontSize: '1.05rem', whiteSpace: 'pre-wrap', marginBottom: '2.5rem' }}>
                    {description}
                </div>

                {eventLink && (
                    <div style={{ marginBottom: '2.5rem' }}>
                        <a
                            href={eventLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem' }}
                        >
                            <ExternalLink size={20} />
                            Official Event Link
                        </a>
                    </div>
                )}

                {attachments && attachments.length > 0 && (
                    <div style={{ borderTop: '1px solid #eee', paddingTop: '2rem' }}>
                        <h3 style={{ color: '#333', marginBottom: '1.5rem' }}>Attachments</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {attachments.map((file, index) => {
                                const fileUrl = file.url || '';
                                const srcUrl = (fileUrl.startsWith('http') || fileUrl.startsWith('data:') || fileUrl.startsWith('blob:'))
                                    ? fileUrl
                                    : `${BACKEND_URL}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`;
                                return (
                                    <div key={index} className="attachment-card" style={{ border: '1px solid #ddd', borderRadius: '12px', overflow: 'hidden' }}>
                                        {file.fileType === 'image' || (!file.fileType && !fileUrl.includes('pdf')) ? (
                                            <div style={{ position: 'relative' }}>
                                                <img
                                                    src={srcUrl}
                                                    alt={`Attachment ${index + 1}`}
                                                    style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                                                />
                                                <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white' }}>
                                                    <span style={{ fontSize: '0.9rem', color: '#666' }}>Image Attachment</span>
                                                    <a href={srcUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#000080' }} download={`notice-attachment-${index + 1}.jpg`}><Download size={18} /></a>
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ backgroundColor: '#fee2e2', padding: '0.8rem', borderRadius: '8px', color: '#dc2626' }}>
                                                    <Paperclip size={24} />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 'bold', color: '#333' }}>Document Attachment</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>Click to download or view</div>
                                                </div>
                                                <a href={srcUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#000080' }} download><Download size={20} /></a>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoticeDetail;
