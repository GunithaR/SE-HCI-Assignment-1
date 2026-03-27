/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

/**
 * AuthProvider — manages JWT and user identity for the entire app.
 * Persists token + user to localStorage so state survives page refresh.
 */
export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch {
            return null;
        }
    });

    const persist = useCallback((authData) => {
        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', JSON.stringify({ email: authData.email, role: authData.role }));
        setToken(authData.token);
        setUser({ email: authData.email, role: authData.role });
    }, []);

    const login = useCallback(async (email, password) => {
        const data = await authService.login(email, password);
        persist(data);
        return data;
    }, [persist]);

    const register = useCallback(async (email, password, role) => {
        const data = await authService.register(email, password, role);
        persist(data);
        return data;
    }, [persist]);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    }, []);

    const isAuthenticated = Boolean(token);
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUB_ADMIN'; // can access admin dashboard
    const isFullAdmin = user?.role === 'ADMIN';   // can create admins / sub-admins
    const isSubAdmin = user?.role === 'SUB_ADMIN';

    return (
        <AuthContext.Provider value={{ token, user, isAuthenticated, isAdmin, isFullAdmin, isSubAdmin, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

/** Hook for consuming auth context in any component. */
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}
