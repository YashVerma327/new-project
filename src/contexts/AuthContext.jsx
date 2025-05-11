
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const user = localStorage.getItem('weatherAppUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to your backend
      const storedUsers = JSON.parse(localStorage.getItem('weatherAppUsers') || '[]');
      const user = storedUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Remove password before storing in state/localStorage
      const { password: _, ...userWithoutPassword } = user;
      
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('weatherAppUser', JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
        duration: 3000,
      });
      
      navigate('/');
      return true;
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
        duration: 3000,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to your backend
      const storedUsers = JSON.parse(localStorage.getItem('weatherAppUsers') || '[]');
      
      if (storedUsers.some(u => u.email === email)) {
        throw new Error('Email already in use');
      }
      
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
      };
      
      storedUsers.push(newUser);
      localStorage.setItem('weatherAppUsers', JSON.stringify(storedUsers));
      
      // Remove password before storing in state/localStorage
      const { password: _, ...userWithoutPassword } = newUser;
      
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('weatherAppUser', JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created.",
        duration: 3000,
      });
      
      navigate('/');
      return true;
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
        duration: 3000,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('weatherAppUser');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      duration: 3000,
    });
    navigate('/login');
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
