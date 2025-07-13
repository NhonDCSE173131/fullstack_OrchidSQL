// src/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { isAuthenticated } from './utils/authUtils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const result = isAuthenticated(); // kiểm tra token trong localStorage
            setAuth(result);
        };
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
