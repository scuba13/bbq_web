import React, { useEffect, useState } from 'react';
import ReactWeather from 'react-open-weather';
import { useVisualCrossing } from 'react-open-weather';

function WeatherDetails() {
  const [coords, setCoords] = useState({ lat: '48.137154', lon: '11.576124' });
  const { data, isLoading, errorMessage } = useVisualCrossing({
    key: 'ESD7LZQJYHEPG563B74GXF8EM',
    lat: coords.lat,
    lon: coords.lon,
    lang: 'en',
    unit: 'metric', // values are (metric, standard, imperial)
  });

  useEffect(() => {
    const getPositionAndWeather = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCoords({ lat: position.coords.latitude, lon: position.coords.longitude });
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
    const intervalId = setInterval(getPositionAndWeather, 600000); // Update every 5 minutes

    return () => clearInterval(intervalId);
  }, []);

  // Logs para verificar o estado da carga e a resposta da API
  console.log("Loading:", isLoading);
  console.log("Error Message:", errorMessage);
  console.log("Data:", data);

  const customStyles = {
    fontFamily: 'Montserrat, sans-serif',
    gradientStart: '#000',
    gradientMid: '#000',
    gradientEnd: '#000',
    locationFontColor: '#FFF',
    todayTempFontColor: '#FFF',
    todayDateFontColor: '#FFF',
    todayRangeFontColor: '#FFF',
    todayDescFontColor: '#FFF',
    todayInfoFontColor: '#FFF',
    todayIconColor: '#FFF',
    forecastBackgroundColor: '#000',
    forecastSeparatorColor: '#FFF',
    forecastDateColor: '#FFF',
    forecastDescColor: '#FFF',
    forecastRangeColor: '#FFF',
    forecastIconColor: '#FFF',
  };

  // const customStyles = {
  //   fontFamily:  'Helvetica, sans-serif',
  //   gradientStart:  '#0181C2',
  //   gradientMid:  '#04A7F9',
  //   gradientEnd:  '#4BC4F7',
  //   locationFontColor:  '#FFF',
  //   todayTempFontColor:  '#FFF',
  //   todayDateFontColor:  '#B5DEF4',
  //   todayRangeFontColor:  '#B5DEF4',
  //   todayDescFontColor:  '#B5DEF4',
  //   todayInfoFontColor:  '#B5DEF4',
  //   todayIconColor:  '#FFF',
  //   forecastBackgroundColor:  '#FFF',
  //   forecastSeparatorColor:  '#DDD',
  //   forecastDateColor:  '#777',
  //   forecastDescColor:  '#777',
  //   forecastRangeColor:  '#777',
  //   forecastIconColor:  '#4BC4F7',
  // };

  return (
    <ReactWeather
      theme={customStyles}
      isLoading={isLoading}
      errorMessage={errorMessage}
      data={data}
      lang="en"
      locationLabel="Your Location"
      unitsLabels={{ temperature: 'C', windSpeed: 'Km/h' }}
      showForecast
    />
  );
}

export default WeatherDetails;
