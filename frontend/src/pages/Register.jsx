import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { toast } from 'react-toastify';
import { User, Mail, Lock, BookOpen, GraduationCap } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        department: '',
        year: '',
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.register(formData);
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const departments = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT'];
    const years = ['1', '2', '3', '4'];

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f4f7f6',
            padding: '2rem'
        }}>
            <div className="card fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ color: '#000080', fontSize: '2rem', marginBottom: '0.5rem' }}>Join NoticeHub</h1>
                    <p style={{ color: '#666' }}>Create your student account</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Full Name</label>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', padding: '0.75rem 1rem' }}>
                            <User size={18} style={{ color: '#999', marginRight: '0.75rem' }} />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="John Doe"
                                style={{ border: 'none', width: '100%', outline: 'none' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email Address</label>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', padding: '0.75rem 1rem' }}>
                            <Mail size={18} style={{ color: '#999', marginRight: '0.75rem' }} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="john@college.edu"
                                style={{ border: 'none', width: '100%', outline: 'none' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Password</label>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', padding: '0.75rem 1rem' }}>
                            <Lock size={18} style={{ color: '#999', marginRight: '0.75rem' }} />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Min. 6 characters"
                                style={{ border: 'none', width: '100%', outline: 'none' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Department</label>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', padding: '0.75rem 1rem' }}>
                                <BookOpen size={18} style={{ color: '#999', marginRight: '0.75rem' }} />
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    required
                                    style={{ border: 'none', width: '100%', outline: 'none', background: 'transparent' }}
                                >
                                    <option value="">Select</option>
                                    {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                                </select>
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Year</label>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', padding: '0.75rem 1rem' }}>
                                <GraduationCap size={18} style={{ color: '#999', marginRight: '0.75rem' }} />
                                <select
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    required
                                    style={{ border: 'none', width: '100%', outline: 'none', background: 'transparent' }}
                                >
                                    <option value="">Select</option>
                                    {years.map(y => <option key={y} value={y}>{y} Year</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <button
                        className="btn-primary"
                        type="submit"
                        disabled={loading}
                        style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                    >
                        {loading ? 'Registering...' : 'Create Account'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666' }}>
                    Already have an account? <Link to="/login" style={{ color: '#FF8C00', fontWeight: 'bold' }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
