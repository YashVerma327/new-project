
import React from 'react';
import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWeather } from '@/contexts/WeatherContext';
import { useSettings } from '@/contexts/SettingsContext';
import { getOpenWeatherIconUrl } from '@/lib/weatherApi';

const HourlyForecast = () => {
  const { hourlyForecast, loading } = useWeather();
  const { convertTemperature, getTemperatureUnitSymbol } = useSettings();

  if (loading && !hourlyForecast) { // Show loading only if no data yet
    return (
      <motion.div className="mt-8">
        <Card className="glass-card bg-gradient-to-r from-blue-600/30 to-indigo-600/30">
          <CardHeader className="pb-2"><CardTitle className="text-white">Hourly Forecast</CardTitle></CardHeader>
          <CardContent><p className="text-white/80 text-center py-4">Loading hourly forecast...</p></CardContent>
        </Card>
      </motion.div>
    );
  }
  
  if (!hourlyForecast || hourlyForecast.length === 0) {
    return null;
  }

  const getWeatherIconElement = (iconCode, condition) => {
    const iconUrl = getOpenWeatherIconUrl(iconCode);
    if (iconUrl) {
      return <img src={iconUrl} alt={condition} className="h-10 w-10" />;
    }
    return <img  alt={condition || 'Weather icon'} class="h-10 w-10" src="https://images.unsplash.com/photo-1532548722196-f7143b65060f" />;
  };

  const next12Hours = hourlyForecast.slice(0, 12);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-8"
    >
      <Card className="glass-card bg-gradient-to-r from-blue-600/30 to-indigo-600/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-white">Hourly Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto pb-2">
            <div className="flex space-x-3 min-w-max">
              {next12Hours.map((hour, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg p-3 min-w-[90px] text-center"
                >
                  <span className="text-white text-sm mb-1">{hour.time}</span>
                  {getWeatherIconElement(hour.icon, hour.condition)}
                  <span className="text-white font-medium mt-1">{convertTemperature(hour.temperature).toFixed(0)}{getTemperatureUnitSymbol()}</span>
                  <div className="flex items-center text-white/70 text-xs mt-1">
                    <Droplets className="h-3 w-3 mr-1 text-blue-200" />
                    <span>{hour.precipitation}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HourlyForecast;
