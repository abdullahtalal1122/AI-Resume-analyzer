'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Configure axios defaults
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        // Check if user is logged in on app start
        const token = Cookies.get('token');
        if (token) {
            // Set default authorization header
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Verify token and get user data
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/auth/profile`);
            if (response.data.success) {
                setUser(response.data.user);
            }
        } catch (error) {
            // Token is invalid, remove it
            Cookies.remove('token');
            delete axios.defaults.headers.common['Authorization'];
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                email,
                password,
            });

            if (response.data.success) {
                const { token, user } = response.data;

                // Store token in cookie
                Cookies.set('token', token, { expires: 7 }); // Expires in 7 days

                // Set default authorization header
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                setUser(user);
                return { success: true };
            }

            return { success: false, message: response.data.message };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed. Please try again.'
            };
        }
    };

    const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/register`, {
                name,
                email,
                password,
            });

            if (response.data.success) {
                return { success: true };
            }

            return { success: false, message: response.data.message };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed. Please try again.'
            };
        }
    };

    const logout = () => {
        // Remove token from cookie
        Cookies.remove('token');

        // Remove default authorization header
        delete axios.defaults.headers.common['Authorization'];

        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
