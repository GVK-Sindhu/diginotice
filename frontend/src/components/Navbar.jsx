import React from 'react';
import { Search, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onSearch }) => {
    const { user } = useAuth();

    return (
        <div className="navbar" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            backgroundColor: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
            {onSearch && (
                <div className="search-bar" style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f0f2f5', padding: '0.5rem 1rem', borderRadius: '8px', width: '300px' }}>
                    <Search size={18} style={{ color: '#666', marginRight: '0.5rem' }} />
                    <input
                        type="text"
                        placeholder="Search notices..."
                        onChange={(e) => onSearch(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%' }}
                    />
                </div>
            )}

            {!onSearch && <div style={{ width: '300px' }}></div>}

            <div className="user-info" style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ textAlign: 'right', marginRight: '1rem' }}>
                    <div style={{ fontWeight: 'bold' }}>{user?.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{user?.role}</div>
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#000080', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
                    <UserIcon size={20} />
                </div>
            </div>
        </div>
    );
};

export default Navbar;
