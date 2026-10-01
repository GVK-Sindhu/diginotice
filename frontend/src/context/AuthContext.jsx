import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('demo_user');

            if (token) {
                try {
                    const res = await authService.getMe();
                    if (res?.data?.data) {
                        setUser(res.data.data);
                    } else if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    }
                } catch (error) {
                    if (storedUser) {
                        try {
                            setUser(JSON.parse(storedUser));
                        } catch (e) {
                            localStorage.removeItem('token');
                            localStorage.removeItem('demo_user');
                            setUser(null);
                        }
                    } else {
                        localStorage.removeItem('token');
                        setUser(null);
                    }
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (credentials) => {
        const res = await authService.login(credentials);
        const { token, data } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('demo_user', JSON.stringify(data));
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('demo_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
