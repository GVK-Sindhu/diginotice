import React, { useState } from 'react';
import { noticeService } from '../services/api';
import { ImageScanner } from '../components';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
    Send,
    FileText,
    Type,
    Link as LinkIcon,
    Paperclip,
    Camera,
    Layers,
    CheckCircle,
    X
} from 'lucide-react';

const CreateNotice = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Academic',
        eventLink: '',
        isPinned: false
    });
    const [files, setFiles] = useState([]);
    const [showScanner, setShowScanner] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

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
        // Convert base64 to file
        const fetchRes = fetch(base64);
        fetchRes.then(res => res.blob()).then(blob => {
            const file = new File([blob], `scanned-notice-${Date.now()}.jpg`, { type: 'image/jpeg' });
            setFiles([...files, file]);
            toast.success('Notice photo captured successfully!');
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        files.forEach(file => data.append('attachments', file));

        try {
            await noticeService.createNotice(data);
            toast.success('Notice created successfully!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create notice');
        } finally {
            setLoading(false);
        }
    };

    const categories = ['Academic', 'Exams', 'Placements', 'Events', 'Circulars'];

    return (
        <div className="create-notice-page">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                <CheckCircle size={32} style={{ color: '#000080' }} />
                <h1 style={{ color: '#000080', margin: 0 }}>Create New Notice</h1>
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
                                placeholder="Enter notice title"
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
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description / Content</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="6"
                            placeholder="Write notice content directly..."
                            style={{ width: '100%', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', outline: 'none', fontFamily: 'inherit' }}
                        ></textarea>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Event Registration Link (Optional)</label>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', padding: '0.75rem 1rem' }}>
                            <LinkIcon size={18} style={{ color: '#999', marginRight: '0.75rem' }} />
                            <input
                                type="url"
                                name="eventLink"
                                value={formData.eventLink}
                                onChange={handleChange}
                                placeholder="https://example.com/register"
                                style={{ border: 'none', width: '100%', outline: 'none' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Attachments (Images/PDFs)</label>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <label className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                                    <Paperclip size={18} />
                                    Upload Files
                                    <input type="file" multiple onChange={handleFileChange} style={{ display: 'none' }} />
                                </label>

                                <button
                                    type="button"
                                    onClick={() => setShowScanner(true)}
                                    className="btn-primary"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.9rem', backgroundColor: '#333' }}
                                >
                                    <Camera size={18} />
                                    Scan Notice
                                </button>
                            </div>

                            {files.length > 0 && (
                                <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {files.map((f, i) => (
                                        <span key={i} style={{ backgroundColor: '#eee', padding: '0.3rem 0.8rem', borderRadius: '15px', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>
                                            {f.name}
                                            <X size={14} style={{ marginLeft: '0.5rem', cursor: 'pointer', color: '#666' }} onClick={() => setFiles(files.filter((_, idx) => idx !== i))} />
                                        </span>
                                    ))}
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
                                style={{ width: '18px', height: '18px' }}
                            />
                            <label htmlFor="isPinned" style={{ fontWeight: 'bold', color: '#000080', cursor: 'pointer' }}>Pin Notice to Top</label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.7rem' }}
                    >
                        {loading ? 'Publishing...' : (
                            <>
                                <Send size={20} />
                                Publish Notice
                            </>
                        )}
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

export default CreateNotice;
