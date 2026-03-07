import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { noticeService } from '../services/api';
import { toast } from 'react-toastify';
import { Save, FileText, Type, Link as LinkIcon, Paperclip, Camera, Layers, CheckCircle, ArrowLeft } from 'lucide-react';
import { ImageScanner } from '../components';

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
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [showScanner, setShowScanner] = useState(false);

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const res = await noticeService.getNotice(id);
                const notice = res.data.data;
                setFormData({
                    title: notice.title,
                    description: notice.description,
                    category: notice.category,
                    eventLink: notice.eventLink || '',
                    isPinned: notice.isPinned
                });
                // Note: Attachments handling could be more complex (showing existing ones, etc.)
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
        setFiles([...files, ...Array.from(e.target.files)]);
    };

    const handleScannerCapture = (base64) => {
        const fetchRes = fetch(base64);
        fetchRes.then(res => res.blob()).then(blob => {
            const file = new File([blob], `updated-notice-${Date.now()}.jpg`, { type: 'image/jpeg' });
            setFiles([...files, file]);
            toast.success('Photo added!');
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
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

    if (fetching) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading notice details...</div>;

    return (
        <div className="edit-notice-page">
            <button onClick={() => navigate('/manage-notices')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#666', cursor: 'pointer', marginBottom: '1rem' }}>
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
                            style={{ width: '100%', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', outline: 'none' }}
                        ></textarea>
                    </div>

                    <div style={{ marginBottom: '2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Actions</label>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <label className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                    <Paperclip size={18} /> Add More Files
                                    <input type="file" multiple onChange={handleFileChange} style={{ display: 'none' }} />
                                </label>
                                <button type="button" onClick={() => setShowScanner(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', backgroundColor: '#333', fontSize: '0.9rem' }}>
                                    <Camera size={18} /> Scan More
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                            <input
                                type="checkbox"
                                name="isPinned"
                                id="isPinned"
                                checked={formData.isPinned}
                                onChange={handleChange}
                                style={{ width: '18px', height: '18px' }}
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

            {showScanner && (
                <ImageScanner
                    onCapture={handleScannerCapture}
                    onClose={() => setShowScanner(false)}
                />
            )}
        </div>
    );
};

export default EditNotice;
