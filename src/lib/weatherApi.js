
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchOpenWeatherData = async (params, apiKey) => {
  const paramString = new URLSearchParams({ ...params, appid: apiKey, units: 'metric' }).toString();
  
  const currentWeatherUrl = `${API_BASE_URL}/weather?${paramString}`;
  const forecastUrl = `${API_BASE_URL}/forecast?${paramString}`;
  const airQualityUrl = `http://api.openweathermap.org/data/2.5/air_pollution?${paramString}`;

  try {
    const [currentResponse, forecastResponse, airQualityResponse] = await Promise.all([
      fetch(currentWeatherUrl),
      fetch(forecastUrl),
      fetch(airQualityUrl)
    ]);

    if (!currentResponse.ok) {
      const errorData = await currentResponse.json();
      throw new Error(`Current weather fetch failed: ${errorData.message || currentResponse.statusText}`);
    }
    if (!forecastResponse.ok) {
      const errorData = await forecastResponse.json();
      throw new Error(`Forecast fetch failed: ${errorData.message || forecastResponse.statusText}`);
    }
    if (!airQualityResponse.ok) {
      const errorData = await airQualityResponse.json();
      console.warn("Air quality data fetch failed:", errorData.message || airQualityResponse.statusText);
    }

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();
    const airQualityData = airQualityResponse.ok ? await airQualityResponse.json() : null;
    
    return { currentData, forecastData, airQualityData };

  } catch (error) {
    console.error("Error fetching OpenWeather data:", error);
    throw error;
  }
};

export const transformCurrentWeather = (data, cityNameOverride = null) => {
  if (!data || !data.main || !data.weather || !data.wind) {
    console.error("Invalid current weather data structure:", data);
    return null; 
  }
  return {
    city: cityNameOverride || data.name,
    country: data.sys?.country || 'N/A',
    condition: data.weather[0]?.main || 'N/A',
    description: data.weather[0]?.description || 'N/A',
    icon: data.weather[0]?.icon,
    temperature: data.main.temp,
    feelsLike: data.main.feels_like,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed * 3.6, // m/s to km/h
    pressure: data.main.pressure,
    visibility: data.visibility / 1000, // meters to km
    sunrise: data.sys?.sunrise ? new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
    sunset: data.sys?.sunset ? new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
    updatedAt: new Date(data.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    coords: {
      lat: data.coord.lat,
      lon: data.coord.lon
    }
  };
};

export const transformAirQuality = (data) => {
  if (!data || !data.list || !data.list[0]) {
    return null;
  }

  const aqi = data.list[0].main.aqi;
  const components = data.list[0].components;

  const getAQILevel = (aqi) => {
    switch(aqi) {
      case 1: return { level: 'Good', implications: 'Air quality is satisfactory, and air pollution poses little or no risk.' };
      case 2: return { level: 'Fair', implications: 'Air quality is acceptable. However, there may be a risk for some people.' };
      case 3: return { level: 'Moderate', implications: 'Members of sensitive groups may experience health effects.' };
      case 4: return { level: 'Poor', implications: 'Everyone may begin to experience health effects.' };
      case 5: return { level: 'Very Poor', implications: 'Health warnings of emergency conditions.' };
      default: return { level: 'Unknown', implications: 'Air quality data is unavailable.' };
    }
  };

  const getDominantPollutant = (components) => {
    const pollutants = {
      pm2_5: 'PM2.5',
      pm10: 'PM10',
      no2: 'NO₂',
      o3: 'O₃',
      so2: 'SO₂',
      co: 'CO'
    };

    const highest = Object.entries(components).reduce((a, b) => 
      (a[1] > b[1] ? a : b)
    );

    return pollutants[highest[0]] || highest[0];
  };

  const { level, implications } = getAQILevel(aqi);

  return {
    value: aqi,
    level,
    dominantPollutant: getDominantPollutant(components),
    healthImplications: implications,
    components
  };
};

export const transformForecast = (data) => {
  if (!data || !data.list) {
    console.error("Invalid forecast data structure:", data);
    return [];
  }
  const dailyData = {};
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    if (!dailyData[date]) {
      dailyData[date] = {
        dateObj: new Date(item.dt * 1000),
        temps: [],
        minTemp: item.main.temp_min,
        maxTemp: item.main.temp_max,
        conditions: {},
        precipitations: [],
        humidities: [],
        windSpeeds: []
      };
    }
    dailyData[date].temps.push(item.main.temp);
    dailyData[date].minTemp = Math.min(dailyData[date].minTemp, item.main.temp_min);
    dailyData[date].maxTemp = Math.max(dailyData[date].maxTemp, item.main.temp_max);
    const condition = item.weather[0]?.main || 'N/A';
    dailyData[date].conditions[condition] = (dailyData[date].conditions[condition] || 0) + 1;
    dailyData[date].precipitations.push(item.pop * 100);
    dailyData[date].humidities.push(item.main.humidity);
    dailyData[date].windSpeeds.push(item.wind.speed * 3.6);
  });

  return Object.values(dailyData).slice(0, 5).map(dayData => {
    const dominantCondition = Object.keys(dayData.conditions).reduce((a, b) => 
      dayData.conditions[a] > dayData.conditions[b] ? a : b, 'N/A'
    );
    const avgPrecipitation = dayData.precipitations.reduce((sum, p) => sum + p, 0) / dayData.precipitations.length;
    const avgHumidity = dayData.humidities.reduce((sum, h) => sum + h, 0) / dayData.humidities.length;
    const avgWindSpeed = dayData.windSpeeds.reduce((sum, w) => sum + w, 0) / dayData.windSpeeds.length;

    return {
      date: dayData.dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      day: dayData.dateObj.toLocaleDateString('en-US', { weekday: 'long' }),
      condition: dominantCondition,
      icon: data.list.find(item => 
        new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) === 
        dayData.dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      )?.weather[0]?.icon,
      maxTemp: dayData.maxTemp,
      minTemp: dayData.minTemp,
      precipitation: Math.round(avgPrecipitation),
      humidity: Math.round(avgHumidity),
      windSpeed: Math.round(avgWindSpeed)
    };
  });
};

export const transformHourlyForecast = (data) => {
  if (!data || !data.list) {
    console.error("Invalid hourly forecast data structure:", data);
    return [];
  }
  return data.list.slice(0, 24).map(item => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: 'numeric', hour12: true }),
    condition: item.weather[0]?.main || 'N/A',
    description: item.weather[0]?.description || 'N/A',
    icon: item.weather[0]?.icon,
    temperature: item.main.temp,
    precipitation: Math.round((item.pop || 0) * 100), // Probability of precipitation
    windSpeed: Math.round(item.wind.speed * 3.6) // m/s to km/h
  }));
};

export const getOpenWeatherIconUrl = (iconCode, size = "2x") => {
  if (!iconCode) return null;
  const sizeSuffix = size === "4x" ? "@4x" : (size === "2x" ? "@2x" : "");
  return `https://openweathermap.org/img/wn/${iconCode}${sizeSuffix}.png`;
};
