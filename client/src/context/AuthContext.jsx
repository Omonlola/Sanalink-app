import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Configure axios base URL
    const api = axios.create({
        baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('sanalink_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        setUser(res.data);
        localStorage.setItem('sanalink_user', JSON.stringify(res.data));
        return res.data;
    };

    const register = async (name, email, password, type) => {
        const res = await api.post('/auth/register', { name, email, password, type });
        // Auto login after register? Or just return.
        // Let's just return for now and let user login
        return res.data;
    };

    const updateProfile = async (id, data) => {
        const res = await api.put(`/profile/${id}`, data);
        setUser(prev => ({ ...prev, ...res.data })); // Update local state
        localStorage.setItem('sanalink_user', JSON.stringify({ ...user, ...res.data }));
        return res.data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('sanalink_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, updateProfile, logout, loading, api }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
