import React, { useState } from 'react';
import { X, Send, Calendar, Users, Type, FileText, Loader2, UploadCloud } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const NoticeForm = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'GENERAL',
        department: 'All',
        year: 'All',
        publish_date: new Date().toISOString().split('T')[0],
        file_url: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/notices', formData);
            toast.success('Notice published successfully!');
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(error.message || 'Failed to publish notice');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <div className="modal-header">
                    <div>
                        <h2>Create New Notice</h2>
                        <p>Fill in the details to broadcast a new announcement</p>
                    </div>
                    <button onClick={onClose} className="btn-close">
                        <X size={20} />
                    </button>
                    <div className="header-accent" />
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Notice Title</label>
                        <div className="input-wrapper">
                            <Type className="input-icon" size={18} />
                            <input
                                name="title"
                                className="input-field"
                                placeholder="Enter a descriptive title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Detailed Description</label>
                        <textarea
                            name="description"
                            className="input-field"
                            placeholder="Write your announcement message here..."
                            rows="4"
                            style={{ minHeight: '120px', resize: 'vertical' }}
                            value={formData.description}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Notice Category</label>
                            <div className="input-wrapper">
                                <FileText className="input-icon" size={18} />
                                <select name="category" className="input-field" value={formData.category} onChange={handleChange}>
                                    <option value="GENERAL">General Announcement</option>
                                    <option value="EXAM">Examination</option>
                                    <option value="DRIVE">Placement Drive</option>
                                    <option value="EVENT">Event/Workshop</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group" style={{ opacity: 0, pointerEvents: 'none' }}>
                            {/* Spacer to keep grid alignment */}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Target Department</label>
                            <div className="input-wrapper">
                                <Users className="input-icon" size={18} />
                                <select name="department" className="input-field" value={formData.department} onChange={handleChange}>
                                    <option value="All">All Departments</option>
                                    <option value="CS">Computer Science</option>
                                    <option value="IT">Information Tech</option>
                                    <option value="EE">Electrical Eng</option>
                                    <option value="ME">Mechanical Eng</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Target Year</label>
                            <div className="input-wrapper">
                                <Calendar className="input-icon" size={18} />
                                <select name="year" className="input-field" value={formData.year} onChange={handleChange}>
                                    <option value="All">All Years</option>
                                    <option value="1">1st Year</option>
                                    <option value="2">2nd Year</option>
                                    <option value="3">3rd Year</option>
                                    <option value="4">4th Year</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Publish Date (Scheduling)</label>
                        <div className="input-wrapper">
                            <Calendar className="input-icon" size={18} />
                            <input
                                name="publish_date"
                                type="date"
                                className="input-field"
                                value={formData.publish_date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Attachment Link</label>
                        <div className="input-wrapper">
                            <UploadCloud className="input-icon" size={18} />
                            <input
                                name="file_url"
                                className="input-field"
                                placeholder="https://drive.google.com/file/..."
                                value={formData.file_url}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Broadcast Notice</>}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(15, 23, 42, 0.4);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 1.5rem;
                }

                .modal-card {
                    background: var(--card);
                    width: 100%;
                    max-width: 620px;
                    border-radius: 24px;
                    padding: 3rem;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    border: 1px solid var(--border);
                    position: relative;
                    overflow: hidden;
                }

                .modal-header {
                    margin-bottom: 2.5rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }

                .header-accent {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 6px;
                    background: linear-gradient(90deg, var(--primary), #8b85ff);
                }

                .modal-header h2 {
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: var(--text);
                    margin-bottom: 0.5rem;
                }

                .modal-header p {
                    color: var(--text-light);
                    font-size: 0.9375rem;
                }

                .btn-close {
                    background: var(--background);
                    color: var(--text-light);
                    padding: 0.5rem;
                    border-radius: 12px;
                    display: flex;
                    transition: all 0.2s;
                    border: 1px solid var(--border);
                }

                .btn-close:hover {
                    color: var(--error);
                    border-color: #fecaca;
                    background: #fff1f2;
                }

                .modal-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .form-group label {
                    font-size: 0.875rem;
                    font-weight: 700;
                    color: var(--text);
                    margin-left: 0.25rem;
                }

                .input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .input-icon {
                    position: absolute;
                    left: 1rem;
                    color: var(--text-light);
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }

                .input-wrapper .input-field {
                    padding-left: 3rem;
                }

                .form-actions {
                    margin-top: 1rem;
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                }

                .btn-secondary {
                    background: #fff;
                    color: var(--text-light);
                    border: 1px solid var(--border);
                }

                .btn-secondary:hover {
                    background: var(--background);
                    color: var(--text);
                }

                .animate-spin {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 640px) {
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                    .modal-card {
                        padding: 2rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default NoticeForm;
