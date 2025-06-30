// src/context/AuthContext.js (Reverted to the original, working version)

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { Spin } from 'antd';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('token'),
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const API_URL = "https://interview-mate-backend-dwadexa8eqgufpdj.japanwest-01.azurewebsites.net/api";
  //const API_URL = "http://localhost:5001/api"

  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

    const logout = useCallback(() => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setAuthState({ token: null, user: null, isAuthenticated: false, isLoading: false });
  }, []);

  const loadUser = useCallback(async (currentToken = localStorage.getItem('token')) => {
    const tokenToUse = currentToken || authState.token;
    if (tokenToUse) {
      setAuthToken(tokenToUse);
      try {
        const decodedToken = jwtDecode(tokenToUse);
        if (decodedToken.exp * 1000 < Date.now()) {
          logout(); // Use your existing logout function
          return null; // Return null if token is expired
        }
        const res = await axios.get(`${API_URL}/auth/me`);
        if (res.data.user) {
          setAuthState(prevState => ({ // Use functional update for safety
            ...prevState,
            token: tokenToUse,
            user: res.data.user,
            isAuthenticated: true,
            isLoading: false,
          }));
          return res.data.user; // ✅ FIX: Return the newly fetched user data
        }
      } catch (error) {
        logout();
        return null;
      }
    } else {
      setAuthState({ token: null, user: null, isAuthenticated: false, isLoading: false });
      return null;
    }
  }, [logout, API_URL]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);
  
  const refreshUser = async () => {
    await loadUser();
  };

  const login = async (email, password) => {
    setAuthState(prevState => ({ ...prevState, isLoading: true }));
    try {
      const res = await axios.post(`${API_URL}/auth/signin`, { email, password });
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      await loadUser(res.data.token);
      return { success: true, user: res.data.user };
    } catch (error) {
      console.error('AuthContext: Login error:', error.response ? error.response.data : error.message);
      setAuthState({ token: null, user: null, isAuthenticated: false, isLoading: false });
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const signup = async (username, email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/signup`, { username, email, password });
      return { success: true, message: res.data.message };
    } catch (error) {
      console.error('Signup error:', error.response ? error.response.data : error.message);
      return { success: false, message: error.response?.data?.message || 'Signup failed' };
    }
  };


  const forgotPassword = async (email) => {
    try {
      const res = await axios.post(`${API_URL}/auth/forgotpassword`, { email });
      return { success: true, message: res.data.message, resetToken: res.data.resetToken };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Request failed' };
    }
  };

  const resetPassword = async (resetToken, password) => {
    try {
      const res = await axios.put(`${API_URL}/auth/resetpassword/${resetToken}`, { password });
      return { success: true, message: res.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Password reset failed' };
    }
  };

  if (authState.isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0D0614' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      ...authState,
      login, signup, logout, loadUser,
      forgotPassword, resetPassword,refreshUser,
      API_URL, setAuthToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
