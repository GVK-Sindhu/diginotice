import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { noticeService, BACKEND_URL } from '../services/api';
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
            setNotice(res.data.data);
        } catch (error) {
            toast.error('Failed to load notice details');
            navigate('/notices');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading notice details...</div>;
    if (!notice) return <div style={{ padding: '3rem', textAlign: 'center' }}>Notice not found.</div>;

    const { title, description, category, postedDate, createdBy, attachments, eventLink } = notice;

    return (
        <div className="notice-detail-page fade-in">
            <button
                onClick={() => navigate(-1)}
                className="btn-text"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#666' }}
            >
                <ArrowLeft size={20} /> Back
            </button>

            <div className="card" style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <h1 style={{ color: '#000080', fontSize: '2.2rem', margin: 0 }}>{title}</h1>
                    <span style={{
                        backgroundColor: '#fff3e0',
                        color: '#e65100',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                    }}>
                        {category}
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '2rem', color: '#666', borderBottom: '1px solid #eee', paddingBottom: '1.5rem', marginBottom: '2rem', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={18} />
                        {new Date(postedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={18} />
                        Posted by {createdBy?.name || 'Admin'}
                    </div>
                </div>

                <div style={{ color: '#333', lineHeight: '1.8', fontSize: '1.1rem', whiteSpace: 'pre-wrap', marginBottom: '2.5rem' }}>
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
                            {attachments.map((file, index) => (
                                <div key={index} className="attachment-card" style={{ border: '1px solid #ddd', borderRadius: '12px', overflow: 'hidden' }}>
                                    {file.fileType === 'image' ? (
                                        <div style={{ position: 'relative' }}>
                                            <img
                                                src={file.url.startsWith('http') ? file.url : `${BACKEND_URL}${file.url.startsWith('/') ? '' : '/'}${file.url}`}
                                                alt={`Attachment ${index + 1}`}
                                                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                            />
                                            <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white' }}>
                                                <span style={{ fontSize: '0.9rem', color: '#666' }}>Image Attachment</span>
                                                <a href={file.url} target="_blank" rel="noopener noreferrer" style={{ color: '#000080' }}><Download size={18} /></a>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ backgroundColor: '#fee2e2', padding: '0.8rem', borderRadius: '8px', color: '#dc2626' }}>
                                                <Paperclip size={24} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 'bold', color: '#333' }}>PDF Document</div>
                                                <div style={{ fontSize: '0.8rem', color: '#666' }}>Click to download or view</div>
                                            </div>
                                            <a href={file.url} target="_blank" rel="noopener noreferrer" style={{ color: '#000080' }}><Download size={20} /></a>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoticeDetail;
