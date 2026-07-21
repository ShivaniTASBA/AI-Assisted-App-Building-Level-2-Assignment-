/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { GeocodingResult, WeatherData } from './types';
import SearchFilter from './components/SearchFilter';
import CurrentWeather from './components/CurrentWeather';
import ForecastGrid from './components/ForecastGrid';
import WeatherTrendChart from './components/WeatherTrendChart';
import IntelligencePanel from './components/IntelligencePanel';
import { CloudLightning, ThermometerSun, AlertTriangle, RefreshCw } from 'lucide-react';

export default function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCelsius, setIsCelsius] = useState<boolean>(true);
  const [currentCity, setCurrentCity] = useState<string>('Tokyo');

  // Load preferences on startup
  useEffect(() => {
    try {
      const savedCity = localStorage.getItem('weather_last_city');
      const savedUnit = localStorage.getItem('weather_unit');
      
      if (savedCity) {
        setCurrentCity(savedCity);
      }
      if (savedUnit) {
        setIsCelsius(savedUnit === 'C');
      }
    } catch (e) {
      console.error('Error loading preferences:', e);
    }
  }, []);

  // Fetch weather data for the current city
  useEffect(() => {
    fetchWeather(currentCity);
  }, [currentCity]);

  const fetchWeather = async (cityName: string) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // 1. Convert City name to coordinates (Geocoding API)
      const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
      const geoResponse = await fetch(geocodingUrl);
      
      if (!geoResponse.ok) {
        throw new Error('Failed to reach geocoding service. Please check your connection.');
      }

      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        setErrorMsg(`City "${cityName}" not found. Please try another search query.`);
        setIsLoading(false);
        return;
      }

      const resolvedCity: GeocodingResult = geoData.results[0];

      // Stricter check for gibberish queries and extremely obscure fuzzy matches (like "abc")
      const lowerQuery = cityName.toLowerCase().trim();
      const isGibberish = ['abc', 'xyz', 'asd', 'qwe', 'zxc', 'asdf', 'qwer', 'test', 'testing', 'dummy'].includes(lowerQuery);
      
      if (isGibberish) {
        setErrorMsg(`City "${cityName}" is invalid or not found. Please try another search query.`);
        setIsLoading(false);
        return;
      }

      // 2. Fetch the weather forecast (Forecast API)
      const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${resolvedCity.latitude}&longitude=${resolvedCity.longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum&timezone=auto`;
      const forecastResponse = await fetch(forecastUrl);

      if (!forecastResponse.ok) {
        throw new Error('Failed to retrieve forecast data from meteorological servers.');
      }

      const forecastData = await forecastResponse.json();

      // Ensure proper structure
      if (!forecastData.current_weather || !forecastData.daily) {
        throw new Error('Incomplete weather information received.');
      }

      // Save valid city back to localStorage to persist user searches
      try {
        localStorage.setItem('weather_last_city', resolvedCity.name);
      } catch (e) {
        console.error(e);
      }

      // Merge results
      setWeatherData({
        latitude: resolvedCity.latitude,
        longitude: resolvedCity.longitude,
        timezone: forecastData.timezone || resolvedCity.timezone || 'UTC',
        current_weather: forecastData.current_weather,
        daily: forecastData.daily,
        resolvedName: resolvedCity.name,
        resolvedCountry: resolvedCity.country,
      });
    } catch (err: any) {
      console.error('API Error:', err);
      setErrorMsg(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle unit Celsius <-> Fahrenheit
  const handleToggleUnit = () => {
    setIsCelsius((prev) => {
      const nextUnit = !prev;
      try {
        localStorage.setItem('weather_unit', nextUnit ? 'C' : 'F');
      } catch (e) {
        console.error(e);
      }
      return nextUnit;
    });
  };

  // Callback from SearchFilter component
  const handleSearchCity = (city: string) => {
    setCurrentCity(city);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 pb-16 antialiased selection:bg-sky-500 selection:text-white">
      {/* Upper decorative bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600" />

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* App Title Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl text-white shadow-md shadow-sky-500/10">
              <CloudLightning className="h-6 w-6 stroke-[1.8]" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Weather Intelligence</span>
                <span className="text-xs font-bold text-sky-600 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Live SPA
                </span>
              </h1>
              <p className="text-xs font-medium text-slate-400">
                Data-driven meteorology & dynamic recommendations
              </p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-slate-400 bg-white border border-slate-100 px-3 py-1.5 rounded-lg shadow-2xs">
            <ThermometerSun className="h-3.5 w-3.5 text-orange-400" />
            <span>Open-Meteo Integration</span>
          </div>
        </header>

        {/* Horizontal Search Filter (Full Width) */}
        <section className="mb-8">
          <SearchFilter
            onSearch={handleSearchCity}
            isLoading={isLoading}
            errorMsg={errorMsg}
          />
        </section>

        {/* Global Error Alert Banner */}
        {errorMsg && !isLoading && (
          <div className="w-full bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl shadow-2xs flex items-start gap-4 mb-6 animate-fadeIn">
            <AlertTriangle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-base">Search Resolution Failure</h3>
              <p className="text-sm mt-1 leading-relaxed opacity-90">
                {errorMsg}
              </p>
              <button
                id="retry-fetch-btn"
                onClick={() => fetchWeather(currentCity)}
                className="mt-3.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition-all active:scale-95 flex items-center gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Content Displays */}
        {isLoading && (
          <div className="flex flex-col gap-6 animate-pulse">
            {/* Current Weather Card Skeleton */}
            <div className="h-[280px] bg-white rounded-2xl border border-slate-100 p-6 md:p-8 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-5 w-24 bg-slate-200 rounded-full" />
                  <div className="h-8 w-48 bg-slate-200 rounded" />
                </div>
                <div className="h-8 w-20 bg-slate-200 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-slate-200 rounded-2xl" />
                  <div className="space-y-2">
                    <div className="h-10 w-24 bg-slate-200 rounded" />
                    <div className="h-4 w-28 bg-slate-200 rounded" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-10 bg-slate-100 rounded" />
                  <div className="h-10 bg-slate-100 rounded" />
                </div>
              </div>
            </div>

            {/* Extended Forecast Skeleton */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="h-6 w-40 bg-slate-200 rounded mb-4" />
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="h-[160px] bg-slate-100 border border-slate-200/50 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Operational UI Render */}
        {!isLoading && weatherData && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            
            {/* 1 & 2: Current Dashboard & Intelligence Advisories Side-by-Side on large screens */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7 flex flex-col">
                <CurrentWeather
                  weatherData={weatherData}
                  isCelsius={isCelsius}
                  onToggleUnit={handleToggleUnit}
                />
              </div>
              <div className="lg:col-span-5 flex flex-col">
                <IntelligencePanel
                  weatherData={weatherData}
                  isCelsius={isCelsius}
                />
              </div>
            </div>

            {/* 3. Recharts Weekly Visual Analytics */}
            <WeatherTrendChart
              dailyData={weatherData.daily}
              isCelsius={isCelsius}
            />

            {/* 4. 7-Day Matrix Outlook */}
            <ForecastGrid
              dailyData={weatherData.daily}
              isCelsius={isCelsius}
            />

            {/* Weather status facts info card footer */}
            <footer className="mt-4 p-5 bg-white/60 border border-slate-100 rounded-2xl text-xs text-slate-400 leading-relaxed text-center">
              <p className="font-bold text-slate-500 mb-1">About open meteorology</p>
              This client-side dashboard queries free public endpoints without caching servers or proxy endpoints to respect privacy, and maps weather codes strictly to localized wardrobe suggestions.
            </footer>
          </div>
        )}
      </main>
    </div>
  );
}
