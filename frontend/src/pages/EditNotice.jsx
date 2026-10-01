import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { noticeService, BACKEND_URL } from '../services/api';
import { toast } from 'react-toastify';
import { Save, Type, Link as LinkIcon, Paperclip, Layers, CheckCircle, ArrowLeft, X, Trash2 } from 'lucide-react';

const EditNotice = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Academic',
        eventLink: '',
        isPinned: false
    });
    const [existingAttachments, setExistingAttachments] = useState([]);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const res = await noticeService.getNotice(id);
                const notice = res?.data?.data || res?.data;
                if (notice) {
                    setFormData({
                        title: notice.title || '',
                        description: notice.description || '',
                        category: notice.category || 'Academic',
                        eventLink: notice.eventLink || '',
                        isPinned: !!notice.isPinned
                    });
                    setExistingAttachments(Array.isArray(notice.attachments) ? notice.attachments : []);
                }
            } catch (error) {
                toast.error('Failed to fetch notice details');
                navigate('/manage-notices');
            } finally {
                setFetching(false);
            }
        };
        fetchNotice();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleFileChange = (e) => {
        setFiles(prev => [...prev, ...Array.from(e.target.files)]);
    };

    const handleRemoveExistingAttachment = (indexToRemove) => {
        setExistingAttachments(prev => prev.filter((_, idx) => idx !== indexToRemove));
        toast.info('Existing attachment removed');
    };

    const handleRemoveNewFile = (indexToRemove) => {
        setFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        data.append('existingAttachments', JSON.stringify(existingAttachments));
        files.forEach(file => data.append('attachments', file));

        try {
            await noticeService.updateNotice(id, data);
            toast.success('Notice updated successfully!');
            navigate('/manage-notices');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const getAttachmentUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) return url;
        return `${BACKEND_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    if (fetching) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading notice details...</div>;

    return (
        <div className="edit-notice-page">
            <button onClick={() => navigate('/manage-notices')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#666', cursor: 'pointer', marginBottom: '1rem', fontWeight: 600 }}>
                <ArrowLeft size={18} /> Back to Management
            </button>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                <CheckCircle size={32} style={{ color: '#000080' }} />
                <h1 style={{ color: '#000080', margin: 0 }}>Edit Notice</h1>
            </div>

            <div className="card fade-in" style={{ padding: '2.5rem' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Notice Title</label>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', padding: '0.75rem 1rem' }}>
                            <Type size={18} style={{ color: '#999', marginRight: '0.75rem' }} />
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                style={{ border: 'none', width: '100%', outline: 'none' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Category</label>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', padding: '0.75rem 1rem' }}>
                            <Layers size={18} style={{ color: '#999', marginRight: '0.75rem' }} />
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                style={{ border: 'none', width: '100%', outline: 'none', background: 'transparent' }}
                            >
                                {['Academic', 'Exams', 'Placements', 'Events', 'Circulars'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="6"
                            style={{ width: '100%', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', outline: 'none', fontFamily: 'inherit' }}
                        ></textarea>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Event Link (Optional)</label>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', padding: '0.75rem 1rem' }}>
                            <LinkIcon size={18} style={{ color: '#999', marginRight: '0.75rem' }} />
                            <input
                                type="url"
                                name="eventLink"
                                value={formData.eventLink}
                                onChange={handleChange}
                                placeholder="https://example.com"
                                style={{ border: 'none', width: '100%', outline: 'none' }}
                            />
                        </div>
                    </div>

                    {/* Existing Attachments Section */}
                    {existingAttachments.length > 0 && (
                        <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#334155' }}>
                                Current Attachments ({existingAttachments.length})
                            </label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                {existingAttachments.map((att, idx) => {
                                    const isImg = att.fileType === 'image' || att.url?.startsWith('data:image') || /\.(jpg|jpeg|png|webp)/i.test(att.url || '');
                                    return (
                                        <div key={idx} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.4rem 0.8rem',
                                            backgroundColor: '#ffffff',
                                            border: '1px solid #cbd5e1',
                                            borderRadius: '6px',
                                            fontSize: '0.85rem'
                                        }}>
                                            {isImg ? (
                                                <img
                                                    src={getAttachmentUrl(att.url)}
                                                    alt="attachment preview"
                                                    style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }}
                                                />
                                            ) : (
                                                <Paperclip size={16} color="#000080" />
                                            )}
                                            <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {att.filename || `Attachment ${idx + 1}`}
                                            </span>
                                            <Trash2
                                                size={15}
                                                style={{ color: '#dc2626', cursor: 'pointer', marginLeft: '0.3rem' }}
                                                onClick={() => handleRemoveExistingAttachment(idx)}
                                                title="Delete attachment"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* New Upload Section */}
                    <div style={{ marginBottom: '2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Add Attachments (Images/PDF)</label>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <label className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                    <Paperclip size={18} /> Add More Files
                                    <input type="file" multiple onChange={handleFileChange} style={{ display: 'none' }} />
                                </label>
                            </div>

                            {/* New Files Preview */}
                            {files.length > 0 && (
                                <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                    {files.map((f, i) => {
                                        const isImg = f.type?.startsWith('image') || /\.(jpg|jpeg|png|webp)$/i.test(f.name);
                                        return (
                                            <div key={i} style={{
                                                backgroundColor: '#f1f5f9',
                                                border: '1px solid #cbd5e1',
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '6px',
                                                fontSize: '0.85rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem'
                                            }}>
                                                {isImg && (
                                                    <img
                                                        src={URL.createObjectURL(f)}
                                                        alt={f.name}
                                                        style={{ width: '28px', height: '28px', objectFit: 'cover', borderRadius: '4px' }}
                                                    />
                                                )}
                                                <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                                                <X size={15} style={{ cursor: 'pointer', color: '#dc2626' }} onClick={() => handleRemoveNewFile(i)} />
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                            <input
                                type="checkbox"
                                name="isPinned"
                                id="isPinned"
                                checked={formData.isPinned}
                                onChange={handleChange}
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <label htmlFor="isPinned" style={{ fontWeight: 'bold', color: '#000080', cursor: 'pointer' }}>Pin Notice</label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.7rem' }}
                    >
                        {loading ? 'Saving...' : <><Save size={20} /> Update Notice</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditNotice;
