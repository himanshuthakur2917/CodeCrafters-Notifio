"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Models } from 'appwrite';
import { authService } from '@/lib/appwrite';
import { toast } from 'react-hot-toast';

interface AuthContextType {
    user: Models.User<Models.Preferences> | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
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
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [loading, setLoading] = useState(true);

    // Check if user is already logged in on app start
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            setLoading(true);
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            // First, try to delete any existing sessions
            try {
                await authService.deleteAllSessions();
            } catch {
                // Ignore errors if no session exists
            }
            
            await authService.login(email, password);
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            toast.success('Logged in successfully!');
        } catch (error: any) {
            toast.error(error.message || 'Login failed');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signup = async (email: string, password: string, name: string) => {
        try {
            setLoading(true);
            // First, try to delete any existing sessions
            try {
                await authService.deleteAllSessions();
            } catch {
                // Ignore errors if no session exists
            }
            
            await authService.createAccount(email, password, name);
            // Automatically log in after signup
            await authService.login(email, password);
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            toast.success('Account created successfully!');
        } catch (error: any) {
            toast.error(error.message || 'Signup failed');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await authService.logout();
            setUser(null);
            toast.success('Logged out successfully!');
            // Force redirect to login page
            window.location.href = '/login';
        } catch (error: any) {
            console.error('Logout error:', error);
            toast.error(error.message || 'Logout failed');
            // Force logout even if there's an error
            setUser(null);
            window.location.href = '/login';
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
