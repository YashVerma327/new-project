
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWeather } from '@/contexts/WeatherContext';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map center updates
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

const WeatherMap = () => {
  const { currentWeather, loading } = useWeather();
  const [mapCenter, setMapCenter] = useState([20, 0]); // Default center
  const [mapKey, setMapKey] = useState(0); // Key for forcing map remount

  useEffect(() => {
    if (currentWeather?.coords) {
      setMapCenter([currentWeather.coords.lat, currentWeather.coords.lon]);
      setMapKey(prev => prev + 1); // Force map remount when location changes significantly
    }
  }, [currentWeather?.coords]);

  if (loading) {
    return (
      <Card className="mt-8 glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-white">Weather Map</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="text-white/80">Loading map...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-8"
    >
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-white">Weather Map</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[400px] w-full rounded-b-xl overflow-hidden">
            <MapContainer
              key={mapKey}
              center={mapCenter}
              zoom={10}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {currentWeather?.coords && (
                <Marker position={[currentWeather.coords.lat, currentWeather.coords.lon]}>
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-semibold">{currentWeather.city}</h3>
                      <p>{currentWeather.description}</p>
                      <p className="text-sm text-gray-600">{currentWeather.temperature}°C</p>
                    </div>
                  </Popup>
                </Marker>
              )}
              <MapUpdater center={mapCenter} />
              
              {/* Weather layer - you can add additional weather overlay layers here */}
              <TileLayer
                url="https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid={apikey}"
                apikey={import.meta.env.VITE_OPENWEATHER_API_KEY}
                opacity={0.5}
              />
            </MapContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WeatherMap;
