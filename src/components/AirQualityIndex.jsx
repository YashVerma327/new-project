
import React from 'react';
import { motion } from 'framer-motion';
import { Wind, AlertCircle, CheckCircle, Smile, Frown, Meh } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWeather } from '@/contexts/WeatherContext';

const AirQualityIndex = () => {
  const { airQuality, loading } = useWeather();

  if (loading || !airQuality) {
    return null; 
  }

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'text-green-400';
    if (aqi <= 100) return 'text-yellow-400';
    if (aqi <= 150) return 'text-orange-400';
    if (aqi <= 200) return 'text-red-500';
    if (aqi <= 300) return 'text-purple-500';
    return 'text-maroon-500'; // For AQI > 300
  };

  const getAQIIcon = (aqi) => {
    if (aqi <= 50) return <Smile className={`h-10 w-10 ${getAQIColor(aqi)}`} />;
    if (aqi <= 100) return <Meh className={`h-10 w-10 ${getAQIColor(aqi)}`} />;
    return <Frown className={`h-10 w-10 ${getAQIColor(aqi)}`} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className="glass-card bg-teal-600/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center">
            <Wind className="h-6 w-6 mr-2" /> Air Quality Index (AQI)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center text-center">
            {getAQIIcon(airQuality.value)}
            <div className={`text-5xl font-bold my-2 ${getAQIColor(airQuality.value)}`}>
              {airQuality.value}
            </div>
            <div className={`text-xl font-semibold ${getAQIColor(airQuality.value)}`}>
              {airQuality.level}
            </div>
            <p className="text-white/80 text-sm mt-2">Dominant Pollutant: {airQuality.dominantPollutant}</p>
            <p className="text-white/70 text-xs mt-3">{airQuality.healthImplications}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AirQualityIndex;
