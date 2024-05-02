import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

function WeatherComponent() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      const apiKey = '3bb00f8d6c2bb1b3e5757d2ea60de0b4'; // Substitua com sua chave de API real
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("API Response:", data);  // Log the complete response
        setWeather(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    const getPositionAndWeather = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchWeather(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.error('Error obtaining location', error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getPositionAndWeather();
    const intervalId = setInterval(getPositionAndWeather, 300000); // Update every 5 minutes

    return () => clearInterval(intervalId);
  }, []);

  if (!weather) {
    return <Typography>Loading weather...</Typography>;
  }

  return (
    <Card sx={{
      background: 'transparent',
      boxShadow: 'none',
      position: 'absolute',
      right: 0,
      top: 0,
      margin: 0,
      padding: '5px',
      maxWidth: 300,
      zIndex: 1000
    }}>
      <CardContent sx={{ padding: '8px !important' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div">
            {weather.name}
          </Typography>
          <Typography component="div">
            {weather.weather[0].description}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography>
            Feels like: {weather.main.feels_like}°C
          </Typography>
          <Typography>
            Humidity: {weather.main.humidity}%
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography>
            Min Temp: {weather.main.temp_min}°C
          </Typography>
          <Typography>
            Max Temp: {weather.main.temp_max}°C
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default WeatherComponent;
