
import React from 'react';
import { motion } from 'framer-motion';
import { Wind, Droplets, Thermometer, Sunrise, Sunset, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWeather } from '@/contexts/WeatherContext';
import { useSettings } from '@/contexts/SettingsContext';
import { getOpenWeatherIconUrl } from '@/lib/weatherApi';

const CurrentWeather = () => {
  const { currentWeather, loading } = useWeather();
  const { convertTemperature, getTemperatureUnitSymbol } = useSettings();

  if (loading) {
    return (
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-white">Loading weather data...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="h-16 w-16 text-white opacity-80 bg-white/20 rounded-full flex items-center justify-center"
          >
            <img  alt="Loading icon" class="h-10 w-10" src="https://images.unsplash.com/photo-1700564581140-d4d1e341ee06" />
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  if (!currentWeather) {
    return (
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-white">No weather data</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-white">
          <p>Search for a city or use your current location to see weather information.</p>
        </CardContent>
      </Card>
    );
  }

  const getWeatherIconElement = (iconCode, condition) => {
    const iconUrl = getOpenWeatherIconUrl(iconCode, "4x");
    if (iconUrl) {
      return <img src={iconUrl} alt={condition} className="h-20 w-20 weather-icon-real" />;
    }
    return <img  alt={condition || 'Weather icon'} class="h-20 w-20 weather-icon" src="https://images.unsplash.com/photo-1563763589685-e68b572e9e62" />;
  };
  
  const getBackgroundClass = (condition) => {
    const conditionLower = condition?.toLowerCase() || "";
    if (conditionLower.includes('clear')) return 'weather-gradient-clear';
    if (conditionLower.includes('cloud')) return 'weather-gradient-cloudy';
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return 'weather-gradient-rainy';
    if (conditionLower.includes('thunderstorm')) return 'weather-gradient-stormy';
    if (conditionLower.includes('snow')) return 'weather-gradient-snowy';
    if (conditionLower.includes('mist') || conditionLower.includes('fog') || conditionLower.includes('haze')) return 'weather-gradient-foggy';
    return 'weather-gradient';
  };

  const displayTemp = convertTemperature(currentWeather.temperature).toFixed(0);
  const displayFeelsLike = convertTemperature(parseFloat(currentWeather.feelsLike)).toFixed(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`overflow-hidden ${getBackgroundClass(currentWeather.condition)}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex justify-between items-center text-lg sm:text-xl">
            <span>{currentWeather.city}, {currentWeather.country}</span>
            <span className="text-sm font-normal">Updated: {currentWeather.updatedAt}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
              <div className="text-5xl sm:text-6xl font-bold text-white">{displayTemp}{getTemperatureUnitSymbol()}</div>
              <div className="text-lg sm:text-xl text-white mt-1 capitalize">{currentWeather.description}</div>
              <div className="text-white/80 mt-1">Feels like: {displayFeelsLike}{getTemperatureUnitSymbol()}</div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {getWeatherIconElement(currentWeather.icon, currentWeather.condition)}
            </motion.div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center text-center">
              <Droplets className="h-5 w-5 text-white mb-1" />
              <span className="text-xs text-white/80">Humidity</span>
              <span className="text-white font-medium">{currentWeather.humidity}%</span>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center text-center">
              <Wind className="h-5 w-5 text-white mb-1" />
              <span className="text-xs text-white/80">Wind</span>
              <span className="text-white font-medium">{currentWeather.windSpeed.toFixed(1)} km/h</span>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center text-center">
              <Thermometer className="h-5 w-5 text-white mb-1" />
              <span className="text-xs text-white/80">Pressure</span>
              <span className="text-white font-medium">{currentWeather.pressure} hPa</span>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center text-center">
              <Eye className="h-5 w-5 text-white mb-1" />
              <span className="text-xs text-white/80">Visibility</span>
              <span className="text-white font-medium">{currentWeather.visibility.toFixed(1)} km</span>
            </div>
          </div>
          
          {(currentWeather.sunrise !== 'N/A' || currentWeather.sunset !== 'N/A') && (
            <div className="mt-6 flex justify-around items-center bg-white/20 backdrop-blur-sm rounded-lg p-3">
              {currentWeather.sunrise !== 'N/A' && (
                <div className="flex flex-col items-center">
                  <Sunrise className="h-6 w-6 text-yellow-300 mb-1" />
                  <span className="text-xs text-white/80">Sunrise</span>
                  <span className="text-white font-medium">{currentWeather.sunrise}</span>
                </div>
              )}
              
              {currentWeather.sunrise !== 'N/A' && currentWeather.sunset !== 'N/A' && (
                <div className="h-8 w-px bg-white/30"></div>
              )}
              
              {currentWeather.sunset !== 'N/A' && (
                <div className="flex flex-col items-center">
                  <Sunset className="h-6 w-6 text-orange-300 mb-1" />
                  <span className="text-xs text-white/80">Sunset</span>
                  <span className="text-white font-medium">{currentWeather.sunset}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CurrentWeather;
