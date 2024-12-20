// src/contexts/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { jwtDecode } from 'jwt-decode';  // Ensure correct default import
                                      // If you get an error, use: import jwtDecode from 'jwt-decode';

interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  id: number;
  email: string;
  name?: string; // Add more fields if your /api/users/me/ returns more
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

interface DecodedToken {
  exp: number;
  // Add other token properties if needed
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const setAxiosAuthToken = (token: string) => {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const removeAxiosAuthToken = () => {
    delete axiosInstance.defaults.headers.common['Authorization'];
  };

  const checkTokenValidity = (token: string): boolean => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  };

  const fetchCurrentUser = async (): Promise<User | null> => {
    try {
      const response = await axiosInstance.get('/users/me/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (accessToken && checkTokenValidity(accessToken)) {
        setAxiosAuthToken(accessToken);
        const currentUser = await fetchCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        } else {
          // If user fetch fails, logout
          logout();
        }
      } else if (refreshToken) {
        try {
          const response = await axiosInstance.post('/token/refresh/', { refresh: refreshToken });
          const { access } = response.data;
          localStorage.setItem('accessToken', access);
          setAxiosAuthToken(access);

          const currentUser = await fetchCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Token refresh failed:', err);
          logout();
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/token/', credentials);
      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      setAxiosAuthToken(access);

      const currentUser = await fetchCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
        navigate('/'); // Redirect to home or desired route
      } else {
        logout();
      }

    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response && err.response.status === 401) {
        setError('Invalid credentials. Please try again.');
      } else {
        setError('An error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    removeAxiosAuthToken();
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login'); // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};