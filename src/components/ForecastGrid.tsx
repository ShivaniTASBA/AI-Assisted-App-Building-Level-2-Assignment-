/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DailyForecast } from '../types';
import { getWeatherUI } from '../utils/weatherMapping';
import { Umbrella, CalendarRange } from 'lucide-react';

interface ForecastGridProps {
  dailyData: DailyForecast;
  isCelsius: boolean;
}

export default function ForecastGrid({ dailyData, isCelsius }: ForecastGridProps) {
  const { time, temperature_2m_max, temperature_2m_min, weathercode, precipitation_sum } = dailyData;

  // Format Celsius/Fahrenheit
  const formatTemp = (temp: number) => {
    if (!isCelsius) {
      return `${Math.round((temp * 9) / 5 + 32)}°`;
    }
    return `${Math.round(temp)}°`;
  };

  // Humanize weekdays
  const formatDayName = (dateString: string, index: number) => {
    if (index === 0) return 'Today';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } catch {
      return dateString;
    }
  };

  // Format short date, e.g. "Jul 20"
  const formatShortDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="w-full bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <CalendarRange className="h-5 w-5 text-slate-500" />
        <h3 className="text-lg font-bold text-slate-800">7-Day Extended Outlook</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {time.map((dateStr, index) => {
          const code = weathercode[index];
          const weatherUI = getWeatherUI(code, true);
          const Icon = weatherUI.icon;
          const maxTemp = temperature_2m_max[index];
          const minTemp = temperature_2m_min[index];
          const precip = precipitation_sum[index];
          const isToday = index === 0;

          return (
            <div
              id={`forecast-card-day-${index}`}
              key={dateStr}
              className={`flex flex-col items-center p-4 rounded-xl border text-center transition-all duration-300 relative ${
                isToday
                  ? 'bg-sky-50/40 border-sky-200/80 ring-2 ring-sky-500/10'
                  : 'bg-slate-50/40 border-slate-100 hover:bg-slate-50 hover:border-slate-200'
              }`}
            >
              {isToday && (
                <span className="absolute top-1.5 px-2 py-0.5 rounded-full bg-sky-500 text-[9px] font-extrabold text-white uppercase tracking-wider">
                  Today
                </span>
              )}

              <span className={`text-sm font-bold text-slate-800 ${isToday ? 'mt-3' : 'mt-1'}`}>
                {formatDayName(dateStr, index)}
              </span>
              <span className="text-[10px] font-medium text-slate-400 mb-2.5">
                {formatShortDate(dateStr)}
              </span>

              <div className={`p-2.5 rounded-xl bg-white shadow-3xs ${weatherUI.colorClass} mb-3`}>
                <Icon className="h-6 w-6 stroke-[1.8]" />
              </div>

              <div className="text-xs font-semibold text-slate-500 truncate max-w-full px-1 mb-3">
                {weatherUI.label}
              </div>

              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-sm font-extrabold text-slate-800">
                  {formatTemp(maxTemp)}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {formatTemp(minTemp)}
                </span>
              </div>

              {/* Rain indicator */}
              <div className="flex items-center gap-1 mt-auto">
                <Umbrella className={`h-3 w-3 ${precip > 0 ? 'text-blue-500 animate-pulse' : 'text-slate-300'}`} />
                <span className={`text-[10px] font-semibold ${precip > 0 ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
                  {precip > 0 ? `${precip.toFixed(1)}mm` : '0 mm'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
