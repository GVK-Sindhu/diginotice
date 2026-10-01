import React, { useState } from 'react';
import { noticeService } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
    Send,
    Type,
    Link as LinkIcon,
    Paperclip,
    Layers,
    X
} from 'lucide-react';

const CreateNotice = () => {
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
                            </div>

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
                                                <X size={15} style={{ cursor: 'pointer', color: '#dc2626' }} onClick={() => setFiles(files.filter((_, idx) => idx !== i))} />
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
        </div>
    );
};

export default CreateNotice;
