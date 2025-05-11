
import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Wind } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWeather } from '@/contexts/WeatherContext';
import { useSettings } from '@/contexts/SettingsContext';
import { getOpenWeatherIconUrl } from '@/lib/weatherApi';

const DailyForecast = () => {
  const { forecast, loading } = useWeather();
  const { convertTemperature, getTemperatureUnitSymbol } = useSettings();

  if (loading && !forecast) { // Show loading only if no data yet
     return (
      <motion.div className="mt-8">
        <Card className="glass-card bg-gradient-to-r from-purple-600/30 to-blue-600/30">
          <CardHeader className="pb-2"><CardTitle className="text-white">5-Day Forecast</CardTitle></CardHeader>
          <CardContent><p className="text-white/80 text-center py-4">Loading 5-day forecast...</p></CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!forecast || forecast.length === 0) {
    return null;
  }

  const getWeatherIconElement = (iconCode, condition) => {
    const iconUrl = getOpenWeatherIconUrl(iconCode);
    if (iconUrl) {
      return <img src={iconUrl} alt={condition} className="h-10 w-10" />;
    }
    return <img  alt={condition || 'Weather icon'} class="h-10 w-10" src="https://images.unsplash.com/photo-1532548722196-f7143b65060f" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-8"
    >
      <Card className="glass-card bg-gradient-to-r from-purple-600/30 to-blue-600/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-white">5-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {forecast.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-3"
              >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
                  <div className="flex flex-col items-center sm:items-start mb-2 sm:mb-0 w-full sm:w-1/4">
                    <span className="text-white font-medium">{day.day}</span>
                    <span className="text-white/70 text-sm">{day.date}</span>
                  </div>
                  
                  <div className="flex items-center w-full sm:w-1/4 justify-center sm:justify-start">
                    {getWeatherIconElement(day.icon, day.condition)}
                    <span className="ml-2 text-white hidden md:inline capitalize">{day.condition}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-1/4 justify-around sm:justify-start">
                    <div className="flex items-center" title="Precipitation">
                      <Droplets className="h-4 w-4 text-blue-200 mr-1" />
                      <span className="text-white/80 text-sm">{day.precipitation}%</span>
                    </div>
                    
                    <div className="flex items-center" title="Wind Speed">
                      <Wind className="h-4 w-4 text-gray-200 mr-1" />
                      <span className="text-white/80 text-sm">{day.windSpeed} km/h</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-end mt-2 sm:mt-0">
                    <span className="text-white font-medium">{convertTemperature(day.maxTemp).toFixed(0)}{getTemperatureUnitSymbol()}</span>
                    <span className="text-white/50">/</span>
                    <span className="text-white/70">{convertTemperature(day.minTemp).toFixed(0)}{getTemperatureUnitSymbol()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DailyForecast;
