import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ReactAnimatedWeather from 'react-animated-weather';
import './weatherPage.css';
import Loader from '../loader/loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import clearSkyImage from '../images/clearsky.jpg';
import brokenCloudsImage from '../images/background.png';
import lightRainImage from '../images/rain.jpg';
import thunderstormImage from '../images/thunderstorm.jpg';
import defaultImage from '../images/background.png';

const weatherImages = {
  'Clear': clearSkyImage,
  'Clouds': brokenCloudsImage,
  'Rain': lightRainImage,
  'Thunderstorm': thunderstormImage,
};

const mapWeatherIconToAnimatedIcon = (iconCode) => {
  switch (iconCode.slice(0, 2)) {
    case '01':
      return 'CLEAR_DAY';
    case '02':
      return 'PARTLY_CLOUDY_DAY';
    case '03':
      return 'CLOUDY';
    case '04':
      return 'CLOUDY';
    case '09':
      return 'RAIN';
    case '10':
      return 'RAIN';
    case '11':
      return 'RAIN';
    case '13':
      return 'SNOW';
    case '50':
      return 'FOG';
    default:
      return 'CLOUDY';
  }
};

const WeatherPage = () => {
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState(null);
  const [unit, setUnit] = useState('metric'); // Default unit is metric
  const { city } = useParams();

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=36e11b04ee435c354424a52afb3f8c1c&units=${unit}`
        );
        setWeatherData(response.data);
        toast.success(`Weather data for ${city} loaded successfully.`);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        toast.error('Failed to fetch weather data. Please try again later.');
      }
    };
    fetchWeatherData();
  }, [city, unit]);

  const toggleUnit = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  };

  if (!weatherData) {
    return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;
  }

  const weatherDescription = weatherData.weather[0].main;

  const weatherIcon = weatherData.weather[0].icon;
  const animatedWeatherIcon = mapWeatherIconToAnimatedIcon(weatherIcon);
  const backgroundImageUrl = weatherImages[weatherDescription] || defaultImage;

  return (
    <> 
    <ToastContainer />
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <div className="absolute inset-0 "></div>
      <div className="backdrop-blur-sm bg-white/30 p-8 rounded-lg shadow-lg z-10  border border-gray-400">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/')}
            className=" bg-cyan-500 hover:bg-cyan-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Back
          </button>
          <button
            onClick={toggleUnit}
            className=" bg-cyan-500 hover:bg-cyan-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Toggle Unit
          </button>
        </div>
        <div className="flex items-center justify-center mb-4">
          <ReactAnimatedWeather icon={animatedWeatherIcon} color="rgb(74 222 128)" animate={true} size={128} />
        </div>
        <h2 className=" text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">{weatherData.name}</h2>
        <p className="text-black mb-2">Temperature: {weatherData.main.temp} {unit === 'metric' ? '°C' : '°F'}</p>
        <p className="text-black mb-2">Weather Description: {weatherDescription}</p>
        <p className="text-black mb-2">Humidity: {weatherData.main.humidity}%</p>
        <p className="text-black mb-2">Wind Speed: {weatherData.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
        <p className="text-black">Atmospheric Pressure: {weatherData.main.pressure} hPa</p>
      </div>
    </div>
    </>
  );
};

export default WeatherPage;


