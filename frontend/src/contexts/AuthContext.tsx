// frontend/src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/auth';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = authService.getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }
      // Always try to fetch fresh user data
      const currentUser = await authService.getUser();
      setUser(currentUser);
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: any) => {
    try {
      const user = await authService.login(credentials);
      setUser(user);
      return user;
    } catch (error) {
      // Re-throw the error so it can be caught in the component
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const user = await authService.register(userData);
      setUser(user);
      return user;
    } catch (error) {
      // Re-throw the error so it can be caught in the component
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
