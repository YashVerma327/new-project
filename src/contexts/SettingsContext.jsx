
import React, { createContext, useState, useContext, useEffect } from 'react';

const SettingsContext = createContext(null);

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [unit, setUnit] = useState('metric'); // 'metric' for Celsius, 'imperial' for Fahrenheit
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'

  useEffect(() => {
    const storedUnit = localStorage.getItem('weatherAppUnit');
    if (storedUnit) {
      setUnit(storedUnit);
    }
    const storedTheme = localStorage.getItem('weatherAppTheme');
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleUnit = () => {
    const newUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(newUnit);
    localStorage.setItem('weatherAppUnit', newUnit);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('weatherAppTheme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };
  
  const convertTemperature = (tempCelsius) => {
    if (unit === 'imperial') {
      return (tempCelsius * 9/5) + 32;
    }
    return tempCelsius;
  };

  const getTemperatureUnitSymbol = () => {
    return unit === 'metric' ? '°C' : '°F';
  };

  const value = {
    unit,
    theme,
    toggleUnit,
    toggleTheme,
    convertTemperature,
    getTemperatureUnitSymbol,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
