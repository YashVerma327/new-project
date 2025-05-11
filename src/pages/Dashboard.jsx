
import React from 'react';
import WeatherSearch from '@/components/WeatherSearch';
import CurrentWeather from '@/components/CurrentWeather';
import HourlyForecast from '@/components/HourlyForecast';
import DailyForecast from '@/components/DailyForecast';
import AlertsSection from '@/components/AlertsSection';
import AirQualityIndex from '@/components/AirQualityIndex';
import WeatherTrivia from '@/components/WeatherTrivia';
import WeatherMap from '@/components/WeatherMap';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <WeatherSearch />
      <CurrentWeather />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AirQualityIndex />
        <AlertsSection />
      </div>
      <HourlyForecast />
      <DailyForecast />
      <WeatherMap />
      <WeatherTrivia />
    </div>
  );
};

export default Dashboard;
