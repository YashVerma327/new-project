
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useWeather } from '@/contexts/WeatherContext';

const WeatherSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const { 
    searchHistory, 
    fetchWeatherByCity, 
    getCurrentLocation, 
    clearSearchHistory,
    loading
  } = useWeather();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      fetchWeatherByCity(searchTerm.trim());
      setSearchTerm('');
      setShowHistory(false);
    }
  };

  const handleHistoryClick = (city) => {
    fetchWeatherByCity(city);
    setShowHistory(false);
  };

  return (
    <div className="relative mb-8">
      <form onSubmit={handleSearch} className="relative">
        <div className="flex">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search for a city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowHistory(true)}
              className="pl-10 pr-4 py-3 rounded-l-lg border-r-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <Button 
            type="submit" 
            disabled={loading || !searchTerm.trim()}
            className="rounded-l-none"
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </form>

      <Button
        variant="outline"
        onClick={getCurrentLocation}
        disabled={loading}
        className="mt-2 w-full sm:w-auto flex items-center justify-center"
      >
        <MapPin className="mr-2 h-4 w-4" />
        {loading ? 'Getting location...' : 'Use my current location'}
      </Button>

      {/* Search History Dropdown */}
      {showHistory && searchHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex justify-between items-center p-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="mr-1 h-4 w-4" />
              Recent Searches
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                clearSearchHistory();
                setShowHistory(false);
              }}
              className="h-8 px-2 text-xs"
            >
              Clear
            </Button>
          </div>
          <ul>
            {searchHistory.map((city, index) => (
              <li key={index}>
                <button
                  onClick={() => handleHistoryClick(city)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {city}
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {showHistory && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowHistory(false)}
        />
      )}
    </div>
  );
};

export default WeatherSearch;
