import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent } from '@mui/material';

function PageTitle({ title, subtitle }) {
  const [position, setPosition] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error obtaining location', error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (position) {
      const API_KEY = '3bb00f8d6c2bb1b3e5757d2ea60de0b4'; // Substitua pela sua chave de API real
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.lat}&lon=${position.lon}&appid=${API_KEY}&units=metric`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          setWeather(data);
        })
        .catch(error => console.error('Error fetching weather data:', error));
    }
  }, [position]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', padding: '20px' }}>
      <div style={{ textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          {subtitle}
        </Typography>
      </div>
      {weather && (
        <Card variant="outlined" style={{ position: 'absolute', top: '20px', right: '20px', maxWidth: '250px', backgroundColor: '#333', color: 'white' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Weather in {weather.name}
            </Typography>
            <Typography variant="subtitle1">
              {weather.weather[0].description}
            </Typography>
            <Typography variant="subtitle1">
              Temp: {weather.main.temp}°C
            </Typography>
            <Typography variant="subtitle1">
              Humidity: {weather.main.humidity}%
            </Typography>
            <Typography variant="subtitle1">
              Wind: {weather.wind.speed} m/s
            </Typography>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default PageTitle;
