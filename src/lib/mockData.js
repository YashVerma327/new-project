
export const generateMockCurrentWeather = (city) => {
  const conditions = ['Clear', 'Partly Cloudy', 'Cloudy', 'Rain', 'Thunderstorm', 'Snow', 'Fog'];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  
  let baseTemp;
  if (city.toLowerCase().includes("dubai") || city.toLowerCase().includes("sahara")) {
    baseTemp = Math.floor(Math.random() * 15) + 30; // 30-45°C
  } else if (city.toLowerCase().includes("moscow") || city.toLowerCase().includes("siberia")) {
    baseTemp = Math.floor(Math.random() * 15) - 10; // -10 to 5°C
  } else if (city.toLowerCase().includes("london") || city.toLowerCase().includes("paris")) {
    baseTemp = Math.floor(Math.random() * 10) + 8; // 8-18°C
  } else {
    baseTemp = Math.floor(Math.random() * 20) + 5; // 5-25°C for generic locations
  }

  const tempVariation = Math.floor(Math.random() * 5); // +/- 0-4 degrees from base
  const temp = baseTemp + (Math.random() > 0.5 ? tempVariation : -tempVariation);
  
  const feelsLike = temp + (Math.random() * 4 - 2); // +/- 2 degrees
  const humidity = Math.floor(Math.random() * 50) + 40; // 40% to 90%
  const windSpeed = Math.floor(Math.random() * 25) + 5; // 5 to 30 km/h
  
  return {
    city,
    country: 'Mockland',
    condition,
    temperature: temp,
    feelsLike: feelsLike.toFixed(1),
    humidity,
    windSpeed,
    pressure: Math.floor(Math.random() * 30) + 990, // 990 to 1020 hPa
    visibility: Math.floor(Math.random() * 8) + 2, // 2 to 10 km
    sunrise: '06:15 AM',
    sunset: '07:30 PM',
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
};

export const generateMockForecast = (city) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const conditions = ['Clear', 'Partly Cloudy', 'Cloudy', 'Showers', 'Rain', 'Thunderstorm', 'Snow'];
  const today = new Date();
  
  return Array.from({ length: 5 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    let baseMaxTemp, baseMinTemp;
    if (city.toLowerCase().includes("dubai")) {
      baseMaxTemp = Math.floor(Math.random() * 5) + 35; // 35-40°C
      baseMinTemp = baseMaxTemp - (Math.floor(Math.random() * 5) + 5); // 5-10°C cooler
    } else if (city.toLowerCase().includes("moscow")) {
      baseMaxTemp = Math.floor(Math.random() * 8) - 5; // -5 to 3°C
      baseMinTemp = baseMaxTemp - (Math.floor(Math.random() * 5) + 3); // 3-8°C cooler
    } else {
      baseMaxTemp = Math.floor(Math.random() * 15) + 10; // 10-25°C
      baseMinTemp = baseMaxTemp - (Math.floor(Math.random() * 8) + 5); // 5-13°C cooler
    }

    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      day: days[date.getDay()],
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      maxTemp: baseMaxTemp,
      minTemp: baseMinTemp,
      precipitation: Math.floor(Math.random() * 70), // 0-70%
      humidity: Math.floor(Math.random() * 40) + 50, // 50-90%
      windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
    };
  });
};

export const generateMockHourlyForecast = (city) => {
  const conditions = ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Scattered Showers'];
  const now = new Date();
  
  return Array.from({ length: 24 }, (_, i) => {
    const time = new Date(now);
    time.setHours(now.getHours() + i);
    
    let baseTemp;
     if (city.toLowerCase().includes("dubai")) {
      baseTemp = Math.floor(Math.random() * 10) + 30; 
    } else if (city.toLowerCase().includes("moscow")) {
      baseTemp = Math.floor(Math.random() * 10) - 8;
    } else {
      baseTemp = Math.floor(Math.random() * 15) + 8;
    }
    // Simulate slight temperature changes over the hours
    const tempFluctuation = Math.sin(i * Math.PI / 12) * 3; // Sin wave for temp change, max +/- 3 deg
    const currentTemp = Math.round(baseTemp + tempFluctuation);

    return {
      time: time.toLocaleTimeString([], { hour: 'numeric', hour12: true }),
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      temperature: currentTemp,
      precipitation: Math.floor(Math.random() * 40), // 0-40%
      windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
    };
  });
};

export const generateMockAlerts = (city) => {
  const alertTypes = ["Heat Advisory", "Flood Watch", "Wind Warning", "Air Quality Alert", "Fog Advisory"];
  const shouldHaveAlert = Math.random() > 0.7; // 30% chance of having alerts
  if (!shouldHaveAlert) return [];

  const numAlerts = Math.floor(Math.random() * 2) + 1; // 1 or 2 alerts
  const alerts = [];
  for (let i = 0; i < numAlerts; i++) {
    const randomTypeIndex = Math.floor(Math.random() * alertTypes.length);
    const alertTitle = alertTypes[randomTypeIndex];
    alerts.push({
      id: `alert-${i}-${Date.now()}`,
      type: Math.random() > 0.4 ? "Simple Alert" : "Community Alert",
      title: alertTitle,
      description: `A ${alertTitle.toLowerCase()} is in effect for ${city}. Exercise caution and stay informed.`,
      severity: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
      source: Math.random() > 0.4 ? "National Weather Service" : "Local Emergency Management",
      timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 3).toISOString(), // Within last 3 hours
    });
  }
  return alerts;
};

export const generateMockAirQuality = (city) => {
  const aqi = Math.floor(Math.random() * 250) + 10; // AQI between 10 and 260
  let level, healthImplications;
  if (aqi <= 50) {
    level = "Good";
    healthImplications = "Air quality is satisfactory, and air pollution poses little or no risk.";
  } else if (aqi <= 100) {
    level = "Moderate";
    healthImplications = "Some people who are unusually sensitive to air pollution may experience health effects.";
  } else if (aqi <= 150) {
    level = "Unhealthy for Sensitive Groups";
    healthImplications = "General public is not likely to be affected. Members of sensitive groups may experience health effects.";
  } else if (aqi <= 200) {
    level = "Unhealthy";
    healthImplications = "Everyone may begin to experience health effects. Members of sensitive groups may experience more serious health effects.";
  } else { // aqi > 200
    level = "Very Unhealthy";
    healthImplications = "Health alert: The risk of health effects is increased for everyone.";
  }
  return {
    value: aqi,
    level,
    healthImplications,
    dominantPollutant: ["PM2.5", "Ozone", "NO2", "SO2"][Math.floor(Math.random()*4)]
  };
};
