
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Users, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useWeather } from '@/contexts/WeatherContext';

const AlertsSection = () => {
  const { alerts, loading } = useWeather();

  if (loading) return null;

  if (!alerts || alerts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8"
      >
        <Card className="glass-card bg-green-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Info className="h-6 w-6 mr-2 text-green-300" /> No Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/80">Currently, there are no active weather alerts for this location.</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const getAlertIcon = (type, severity) => {
    let color = "text-yellow-300";
    if (severity === "High") color = "text-red-400";
    if (severity === "Medium") color = "text-orange-400";

    if (type === "Community Alert") {
      return <Users className={`h-5 w-5 mr-2 ${color}`} />;
    }
    return <AlertTriangle className={`h-5 w-5 mr-2 ${color}`} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-8"
    >
      <Card className="glass-card bg-red-600/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="h-6 w-6 mr-2 text-red-300" /> Weather Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-3"
              >
                <div className="flex items-start">
                  {getAlertIcon(alert.type, alert.severity)}
                  <div>
                    <h4 className="text-md font-semibold text-white">{alert.title}</h4>
                    <p className="text-sm text-white/80 mt-1">{alert.description}</p>
                    <div className="flex items-center justify-between mt-2 text-xs text-white/60">
                      <span>Source: {alert.source}</span>
                      <span>{new Date(alert.timestamp).toLocaleString()}</span>
                    </div>
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

export default AlertsSection;
