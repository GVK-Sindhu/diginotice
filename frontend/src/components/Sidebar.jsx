import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Bell,
    PlusCircle,
    Settings,
    LogOut,
    FileText,
    Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();

    const navItems = [
        { title: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
        { title: 'Notices', icon: <Bell size={20} />, path: '/notices' },
    ];

    if (user?.role === 'STUDENT') {
        navItems.push({ title: 'Contact Us', icon: <Mail size={20} />, path: '/contact' });
    }

    if (user?.role === 'ADMIN') {
        navItems.push(
            { title: 'Create Notice', icon: <PlusCircle size={20} />, path: '/create-notice' },
            { title: 'Manage Notices', icon: <Settings size={20} />, path: '/manage-notices' }
        );
    }

    return (
        <div className="sidebar" style={{
            width: '260px',
            height: '100vh',
            backgroundColor: '#000080', // Navy Blue
            color: 'white',
            position: 'fixed',
            left: 0,
            top: 0,
            padding: '2rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            zIndex: 100
        }}>
            <div className="logo" style={{ marginBottom: '3rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
                NoticeHub
            </div>

            <nav style={{ flex: 1 }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            padding: '1rem',
                            color: 'white',
                            borderRadius: '8px',
                            marginBottom: '0.5rem',
                            backgroundColor: isActive ? '#FF8C00' : 'transparent', // Orange if active
                            transition: 'all 0.3s ease'
                        })}
                    >
                        <span style={{ marginRight: '1rem' }}>{item.icon}</span>
                        {item.title}
                    </NavLink>
                ))}
            </nav>

            <button
                onClick={logout}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                    color: 'white',
                    backgroundColor: 'transparent',
                    border: 'none',
                    width: '100%',
                    textAlign: 'left',
                    cursor: 'pointer'
                }}
            >
                <LogOut size={20} style={{ marginRight: '1rem' }} />
                Logout
            </button>
        </div>
    );
};

export default Sidebar;
