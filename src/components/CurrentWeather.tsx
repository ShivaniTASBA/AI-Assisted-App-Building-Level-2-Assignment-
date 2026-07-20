/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurrentWeather as CurrentWeatherType, WeatherData } from '../types';
import { getWeatherUI } from '../utils/weatherMapping';
import { Wind, Navigation, Calendar, Droplets } from 'lucide-react';

interface CurrentWeatherProps {
  weatherData: WeatherData;
  isCelsius: boolean;
  onToggleUnit: () => void;
}

export default function CurrentWeather({ weatherData, isCelsius, onToggleUnit }: CurrentWeatherProps) {
  const { current_weather, resolvedName, resolvedCountry } = weatherData;
  const isDay = current_weather.is_day === 1;
  const weatherUI = getWeatherUI(current_weather.weathercode, isDay);
  const Icon = weatherUI.icon;

  // Temperature conversion
  const formatTemp = (temp: number) => {
    if (!isCelsius) {
      return `${Math.round((temp * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(temp)}°C`;
  };

  // Wind direction helper to get compass direction
  const getWindDirection = (degree: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const idx = Math.round(((degree % 360) / 45)) % 8;
    return directions[idx];
  };

  // Format date-time
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return isoString;
    }
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className={`w-full bg-gradient-to-br ${weatherUI.bgGradient} border border-slate-100 p-6 md:p-8 rounded-2xl shadow-sm relative overflow-hidden transition-all duration-500`}>
      {/* Decorative large faint background icon */}
      <div className="absolute right-[-4%] bottom-[-8%] opacity-5 text-slate-800 select-none pointer-events-none">
        <Icon className="h-48 w-48 stroke-[1]" />
      </div>

      <div className="flex justify-between items-start relative z-10">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/75 border border-slate-100 text-xs font-semibold text-slate-500 shadow-2xs">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            {formattedDate}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight mt-3">
            {resolvedName}
          </h2>
          <p className="text-sm font-medium text-slate-500">{resolvedCountry}</p>
        </div>

        {/* Unit Toggle Button */}
        <button
          id="unit-toggle-btn"
          onClick={onToggleUnit}
          className="px-3.5 py-1.5 rounded-lg bg-white/80 hover:bg-white text-xs font-bold text-slate-700 shadow-sm border border-slate-100 hover:border-slate-200 transition-all active:scale-95 flex items-center gap-1"
        >
          <span>Unit: {isCelsius ? '°C' : '°F'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 relative z-10">
        {/* Left Column: Temperature and Condition */}
        <div className="flex items-center gap-5">
          <div className={`p-4 rounded-2xl bg-white/80 backdrop-blur-md shadow-xs ${weatherUI.colorClass}`}>
            <Icon className="h-16 w-16 stroke-[1.5]" />
          </div>
          <div>
            <div className="text-5xl md:text-6xl font-extrabold text-slate-800 tracking-tighter">
              {formatTemp(current_weather.temperature)}
            </div>
            <div className="text-base font-semibold text-slate-700 mt-1 flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${weatherUI.colorClass} bg-current inline-block`} />
              {weatherUI.label}
            </div>
          </div>
        </div>

        {/* Right Column: Other Telemetries */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/50 border border-white/60 shadow-2xs backdrop-blur-xs">
            <div className="flex items-center gap-2 text-slate-400 mb-1.5">
              <Wind className="h-4 w-4 shrink-0" />
              <span className="text-xs font-medium uppercase tracking-wider">Wind Speed</span>
            </div>
            <div className="text-base font-bold text-slate-700">
              {current_weather.windspeed} <span className="text-xs font-medium text-slate-500">km/h</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/50 border border-white/60 shadow-2xs backdrop-blur-xs">
            <div className="flex items-center gap-2 text-slate-400 mb-1.5">
              <Navigation className="h-4 w-4 shrink-0 rotate-[45deg]" />
              <span className="text-xs font-medium uppercase tracking-wider">Wind Dir</span>
            </div>
            <div className="text-base font-bold text-slate-700 flex items-center gap-1.5">
              <span>{getWindDirection(current_weather.winddirection)}</span>
              <span className="text-xs font-medium text-slate-500">({current_weather.winddirection}°)</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/50 border border-white/60 shadow-2xs backdrop-blur-xs col-span-2">
            <div className="flex justify-between items-center text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
              <span className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-400 shrink-0" />
                <span>Today's Total Rainfall</span>
              </span>
              <span className="text-slate-500 font-bold">
                {weatherData.daily.precipitation_sum[0]} mm
              </span>
            </div>
            <div className="w-full bg-slate-200/50 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((weatherData.daily.precipitation_sum[0] / 15) * 100, 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Last updated: {formatTime(current_weather.time)} local time
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
