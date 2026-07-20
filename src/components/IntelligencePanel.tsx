/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WeatherData } from '../types';
import {
  Sparkles,
  Umbrella,
  ThermometerSnowflake,
  Sun,
  ShieldAlert,
  Wind,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

interface IntelligencePanelProps {
  weatherData: WeatherData;
  isCelsius: boolean;
}

export default function IntelligencePanel({ weatherData, isCelsius }: IntelligencePanelProps) {
  const { current_weather, daily } = weatherData;
  const temp = current_weather.temperature;
  const precip = daily.precipitation_sum[0];
  const wind = current_weather.windspeed;
  const code = current_weather.weathercode;

  // 1. Weather intelligence evaluations
  const isRainy = precip > 0 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code);
  const isCold = temp < 15;
  const isStormy = [95, 96, 99].includes(code);
  const isWindy = wind > 25;
  const isHot = temp >= 32;
  const isPerfect = temp >= 15 && temp < 32 && !isRainy;

  // Wardrobe suggestion logic
  const getWardrobeAdvice = () => {
    if (isStormy) {
      return {
        text: 'Dress for stormy conditions. Heavy waterproof coat and sturdy shoes.',
        icon: ShieldAlert,
        colorClass: 'bg-violet-50 text-violet-700 border-violet-100',
      };
    }
    if (isRainy) {
      return {
        text: 'Pack an umbrella today! Wearing a light raincoat is highly recommended.',
        icon: Umbrella,
        colorClass: 'bg-blue-50 text-blue-700 border-blue-100',
      };
    }
    if (isCold) {
      return {
        text: 'Dress warmly in layers today. Don’t forget a jacket or scarf.',
        icon: ThermometerSnowflake,
        colorClass: 'bg-sky-50 text-sky-700 border-sky-100',
      };
    }
    if (isHot) {
      return {
        text: 'Wear lightweight, breathable summer clothes. Apply SPF 30+ sunscreen.',
        icon: Sun,
        colorClass: 'bg-amber-50 text-amber-700 border-amber-100',
      };
    }
    return {
      text: 'Comfortable clothing like t-shirts or light pullovers is ideal.',
      icon: CheckCircle,
      colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    };
  };

  // Activity planning logic
  const getActivityAdvice = () => {
    if (isStormy) {
      return 'Stay indoors if possible. Postpone outdoor travel and activities.';
    }
    if (isRainy) {
      return 'Great day for indoor activities like visiting a museum, reading, or catching up on chores.';
    }
    if (isWindy) {
      return 'Breezy conditions. Good for wind sports but avoid open water or flying kites near power lines.';
    }
    if (isPerfect) {
      return 'Perfect day for outdoor activities! Ideal for hiking, cycling, running, or a park picnic.';
    }
    if (isHot) {
      return 'Limit intense outdoor activities during peak sun hours (11 AM - 4 PM). Stay in shaded areas.';
    }
    return 'Decent conditions. Dress accordingly if you plan on long outdoor walks.';
  };

  const wardrobe = getWardrobeAdvice();
  const WardrobeIcon = wardrobe.icon;

  return (
    <div className="w-full bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
        <h3 className="text-lg font-bold text-slate-800">Weather Intelligence Panel</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left Card: Core recommendation (Mandatory rule-based trigger) */}
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Dynamic Wardrobe Adviser</h4>
          
          <div className={`p-5 rounded-xl border flex gap-4 ${wardrobe.colorClass} transition-colors duration-300`}>
            <div className="shrink-0 p-3 rounded-lg bg-white/80 shadow-xs flex items-center justify-center h-11 w-11">
              <WardrobeIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-base mb-1">Wardrobe Tip</p>
              <p className="text-sm leading-relaxed opacity-90">{wardrobe.text}</p>
            </div>
          </div>

          {/* Quick weather warning banner if critical threshold is reached */}
          {isStormy && (
            <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Severe Weather Alert</p>
                <p className="text-xs mt-0.5">Active thunderstorm warnings. Keep doors and windows closed and avoid using corded appliances.</p>
              </div>
            </div>
          )}

          {isWindy && !isStormy && (
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 flex items-start gap-3">
              <Wind className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
              <div>
                <p className="font-bold text-sm">High Wind Speed Advisory</p>
                <p className="text-xs mt-0.5">Wind speeds are currently around {wind} km/h. Secure loose outdoor objects.</p>
              </div>
            </div>
          )}

          {!isStormy && !isWindy && (
            <div className="p-4 rounded-xl border border-sky-100 bg-sky-50/50 text-sky-800 flex items-start gap-3">
              <Info className="h-5 w-5 shrink-0 text-sky-400 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Climatological State</p>
                <p className="text-xs mt-0.5">
                  Current temperature is {temp}°C ({Math.round((temp * 9) / 5 + 32)}°F) with {precip > 0 ? `${precip}mm of rain` : 'no registered precipitation'}.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Card: Activity Planner & Outdoor Planning */}
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Outdoor activity planning</h4>
          
          <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/60 text-slate-700 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-3 h-3 rounded-full ${isPerfect ? 'bg-emerald-500' : isRainy || isStormy ? 'bg-red-500' : 'bg-amber-500'}`} />
                <span className="font-bold text-sm text-slate-800">Outdoor Feasibility Rating</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-600 mb-4">{getActivityAdvice()}</p>
            </div>

            <div className="border-t border-slate-200/50 pt-4 mt-auto">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest block mb-2">Today's Quick Check</span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white p-2 rounded-lg border border-slate-100">
                  <div className="text-slate-400 font-medium mb-0.5">Rain</div>
                  <div className={`font-bold ${isRainy ? 'text-blue-600' : 'text-slate-700'}`}>
                    {isRainy ? 'Yes 🌧️' : 'None ☀️'}
                  </div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-100">
                  <div className="text-slate-400 font-medium mb-0.5">Temp</div>
                  <div className={`font-bold ${isCold ? 'text-sky-600' : isHot ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {isCold ? 'Cold ❄️' : isHot ? 'Hot 🔥' : 'Mild Leaf'}
                  </div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-100">
                  <div className="text-slate-400 font-medium mb-0.5">Wind</div>
                  <div className={`font-bold ${isWindy ? 'text-amber-600' : 'text-slate-700'}`}>
                    {isWindy ? 'Strong 💨' : 'Calm 🍃'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
