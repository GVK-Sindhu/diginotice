import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('admin@college.edu');
    const [password, setPassword] = useState('password123');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            await login({ email, password });
            toast.success('Login successful!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleQuickLogin = async (userRole) => {
        const demoEmail = userRole === 'ADMIN' ? 'admin@college.edu' : 'john@college.edu';
        setEmail(demoEmail);
        setPassword('password123');
        setLoading(true);
        try {
            await login({ email: demoEmail, password: 'password123', role: userRole });
            toast.success(`Logged in as ${userRole === 'ADMIN' ? 'Administrator' : 'Student'}!`);
            navigate('/');
        } catch (error) {
            toast.error('Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f4f7f6',
            padding: '2rem'
        }}>
            <div className="card fade-in" style={{
                width: '100%',
                maxWidth: '420px',
                padding: '2.5rem',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ color: '#000080', fontSize: '2.2rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>NoticeHub</h1>
                    <p style={{ color: '#666', fontSize: '0.95rem', margin: 0 }}>Sign in to continue</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem', color: '#333' }}>
                            Email Address
                        </label>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            padding: '0.75rem 1rem',
                            backgroundColor: '#ffffff'
                        }}>
                            <Mail size={18} style={{ color: '#999', marginRight: '0.75rem', flexShrink: 0 }} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="example@college.edu"
                                style={{ border: 'none', width: '100%', outline: 'none', fontSize: '0.95rem', color: '#333' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.75rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem', color: '#333' }}>
                            Password
                        </label>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            padding: '0.75rem 1rem',
                            backgroundColor: '#ffffff'
                        }}>
                            <Lock size={18} style={{ color: '#999', marginRight: '0.75rem', flexShrink: 0 }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                style={{ border: 'none', width: '100%', outline: 'none', fontSize: '0.95rem', color: '#333' }}
                            />
                        </div>
                    </div>

                    <button
                        className="btn-primary"
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.85rem',
                            backgroundColor: '#000080',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        <LogIn size={18} />
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.75rem', color: '#666', fontSize: '0.95rem' }}>
                    Don't have an account? <Link to="/register" style={{ color: '#FF8C00', fontWeight: 'bold', textDecoration: 'none' }}>Sign up</Link>
                </p>

                {/* Subtle Quick Demo Credentials Selector */}
                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.78rem', color: '#888', marginBottom: '0.5rem' }}>
                        Demo Accounts:
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button
                            type="button"
                            onClick={() => handleQuickLogin('ADMIN')}
                            style={{
                                fontSize: '0.75rem',
                                padding: '4px 10px',
                                backgroundColor: '#f0f4ff',
                                color: '#000080',
                                border: '1px solid #d0d7f7',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            Super Admin
                        </button>
                        <button
                            type="button"
                            onClick={() => handleQuickLogin('STUDENT')}
                            style={{
                                fontSize: '0.75rem',
                                padding: '4px 10px',
                                backgroundColor: '#fff7ed',
                                color: '#ea580c',
                                border: '1px solid #fed7aa',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            Student (johndoe)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
