import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { toast } from 'react-toastify';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success('Message sent successfully! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="contact-page fade-in">
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ color: '#000080', fontSize: '2rem', marginBottom: '0.5rem' }}>Contact Support</h1>
                <p style={{ color: '#666' }}>Have questions? We're here to help you.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2.5rem' }}>
                <div className="contact-info">
                    <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ color: '#000080' }}><Mail size={24} /></div>
                            <div>
                                <h4 style={{ margin: 0, color: '#333' }}>Email Us</h4>
                                <p style={{ margin: '0.2rem 0', color: '#666', fontSize: '0.9rem' }}>support@noticehub.edu</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ color: '#000080' }}><Phone size={24} /></div>
                            <div>
                                <h4 style={{ margin: 0, color: '#333' }}>Call Us</h4>
                                <p style={{ margin: '0.2rem 0', color: '#666', fontSize: '0.9rem' }}>+91 1234 567 890</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ color: '#000080' }}><MapPin size={24} /></div>
                            <div>
                                <h4 style={{ margin: 0, color: '#333' }}>Visit Us</h4>
                                <p style={{ margin: '0.2rem 0', color: '#666', fontSize: '0.9rem' }}>Engineering College Campus, Admin Block, Floor 2</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="contact-form">
                    <div className="card" style={{ padding: '2.5rem' }}>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Your Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Subject</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
                                    placeholder="How can we help?"
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Message</label>
                                <textarea
                                    required
                                    rows="5"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', resize: 'vertical' }}
                                    placeholder="Tell us more about your inquiry..."
                                ></textarea>
                            </div>

                            <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}>
                                <Send size={20} />
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
