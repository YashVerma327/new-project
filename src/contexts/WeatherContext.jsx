
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  generateMockAlerts,
} from '@/lib/mockData'; 
import { 
  fetchOpenWeatherData,
  transformCurrentWeather,
  transformForecast,
  transformHourlyForecast,
  transformAirQuality
} from '@/lib/weatherApi';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const WeatherContext = createContext(null);

export const useWeather = () => useContext(WeatherContext);

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const initialWeatherState = {
  currentWeather: null,
  forecast: null,
  hourlyForecast: null,
  alerts: [],
  airQuality: null,
  loading: false,
  error: null,
  currentLocation: null,
};

const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0
};

export const WeatherProvider = ({ children }) => {
  const [weatherState, setWeatherState] = useState(initialWeatherState);
  const [searchHistory, setSearchHistory] = useLocalStorage('weatherSearchHistory', []);
  const { toast } = useToast();

  const updateWeatherState = (updates) => {
    setWeatherState(prevState => ({ ...prevState, ...updates }));
  };

  const processWeatherData = (currentData, forecastData, airQualityData, cityOverride = null) => {
    const cityName = cityOverride || currentData.name;
    
    updateWeatherState({
      currentWeather: transformCurrentWeather(currentData, cityName),
      forecast: transformForecast(forecastData),
      hourlyForecast: transformHourlyForecast(forecastData),
      alerts: generateMockAlerts(cityName),
      airQuality: transformAirQuality(airQualityData),
      loading: false,
      error: null,
      currentLocation: cityOverride === "Current Location" ? "Current Location" : weatherState.currentLocation,
    });

    if (cityName !== "Current Location" && !searchHistory.find(item => item.toLowerCase() === cityName.toLowerCase())) {
      const newHistory = [cityName, ...searchHistory.filter(item => item.toLowerCase() !== cityName.toLowerCase()).slice(0, 4)];
      setSearchHistory(newHistory);
    }
    
    toast({
      title: "Weather Updated",
      description: `Weather data for ${cityName} has been updated.`,
      duration: 3000,
    });
  };
  
  const handleError = (errorMessage, userMessage) => {
    console.error(errorMessage);
    updateWeatherState({ error: userMessage, loading: false });
    toast({
      title: "Error",
      description: userMessage,
      variant: "destructive",
      duration: 3000,
    });
  };

  const fetchWeatherData = async (params, cityOverride = null) => {
    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === "YOUR_OPENWEATHER_API_KEY_HERE") {
      handleError(
        "OpenWeather API key is missing or not configured.",
        "API Key is not configured. Please add your OpenWeather API key."
      );
      return;
    }

    updateWeatherState({ loading: true, error: null });

    try {
      const { currentData, forecastData, airQualityData } = await fetchOpenWeatherData(params, OPENWEATHER_API_KEY);
      processWeatherData(currentData, forecastData, airQualityData, cityOverride);
    } catch (err) {
      handleError(err.message, 'Failed to fetch weather data. Please try again.');
    }
  };

  const fetchWeatherByCity = async (city) => {
    if (!city) return;
    fetchWeatherData({ q: city });
  };

  const fetchWeatherByCoords = async (latitude, longitude) => {
    fetchWeatherData({ lat: latitude, lon: longitude }, "Current Location");
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      handleError('Geolocation not supported.', 'Geolocation is not supported by your browser.');
      return;
    }

    updateWeatherState({ loading: true, error: null });

    const onSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      fetchWeatherByCoords(latitude, longitude);
    };

    const onError = (error) => {
      let errorMessage = 'Failed to get your location. ';
      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMessage += 'Please allow location access in your browser settings.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage += 'Location information is unavailable.';
          break;
        case error.TIMEOUT:
          errorMessage += 'Location request timed out.';
          break;
        default:
          errorMessage += 'An unknown error occurred.';
      }
      handleError(error.message, errorMessage);
    };

    navigator.geolocation.getCurrentPosition(
      onSuccess,
      onError,
      GEOLOCATION_OPTIONS
    );
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    toast({
      title: "History Cleared",
      description: "Your search history has been cleared.",
      duration: 3000,
    });
  };

  const value = {
    ...weatherState,
    searchHistory,
    fetchWeatherByCity,
    fetchWeatherByCoords,
    getCurrentLocation,
    clearSearchHistory
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};
