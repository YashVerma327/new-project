
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Sun, Moon, LogOut, User, ThermometerSun, ThermometerSnowflake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme, unit, toggleUnit, getTemperatureUnitSymbol } = useSettings();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const navVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "-100%" },
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </motion.div>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">WeatherApp</span>
          </Link>

          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" onClick={toggleUnit} title={`Switch to ${unit === 'metric' ? 'Fahrenheit' : 'Celsius'}`}>
              {unit === 'metric' ? <ThermometerSnowflake className="h-5 w-5" /> : <ThermometerSun className="h-5 w-5" />}
              <span className="ml-1">{getTemperatureUnitSymbol()}</span>
            </Button>
            <Button variant="ghost" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {currentUser ? (
              <>
                <span className="text-gray-700 dark:text-gray-300">Hello, {currentUser.name}</span>
                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
                <Button onClick={() => navigate('/register')}>Sign Up</Button>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
             <Button variant="ghost" onClick={toggleUnit} className="mr-2">
              {unit === 'metric' ? <ThermometerSnowflake className="h-5 w-5" /> : <ThermometerSun className="h-5 w-5" />}
            </Button>
             <Button variant="ghost" onClick={toggleTheme} className="mr-2">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" onClick={toggleMenu}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      <motion.div
        animate={isOpen ? "open" : "closed"}
        variants={navVariants}
        transition={{ duration: 0.3 }}
        className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-white dark:bg-gray-900 shadow-lg absolute w-full`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {currentUser ? (
            <>
              <div className="px-4 py-2 text-gray-700 dark:text-gray-300">
                <User className="h-5 w-5 inline mr-2" />
                Hello, {currentUser.name}
              </div>
              <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" className="w-full justify-start" onClick={() => { navigate('/login'); setIsOpen(false); }}>
                Login
              </Button>
              <Button className="w-full" onClick={() => { navigate('/register'); setIsOpen(false); }}>
                Sign Up
              </Button>
            </>
          )}
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
