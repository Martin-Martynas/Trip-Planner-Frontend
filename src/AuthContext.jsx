import React, { createContext, useState, useContext } from 'react';
import { deleteCookie } from './cookieUtils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
 
  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
     deleteCookie('jwtToken');
     deleteCookie('username');
     deleteCookie('userId');

     setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
