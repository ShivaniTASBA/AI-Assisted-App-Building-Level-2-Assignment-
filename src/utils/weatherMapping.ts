/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  Snowflake,
  CloudLightning,
  HelpCircle,
  LucideIcon
} from 'lucide-react';

export interface WeatherUI {
  label: string;
  icon: LucideIcon;
  colorClass: string;
  bgGradient: string;
}

export function getWeatherUI(code: number, isDay: boolean = true): WeatherUI {
  switch (code) {
    case 0:
      return {
        label: 'Clear Sky',
        icon: isDay ? Sun : Moon,
        colorClass: 'text-amber-500',
        bgGradient: 'from-amber-500/20 to-orange-500/5',
      };
    case 1:
    case 2:
    case 3:
      return {
        label: code === 1 ? 'Mainly Clear' : code === 2 ? 'Partly Cloudy' : 'Overcast',
        icon: code === 3 ? Cloud : isDay ? CloudSun : CloudMoon,
        colorClass: 'text-sky-500',
        bgGradient: 'from-sky-500/20 to-blue-500/5',
      };
    case 45:
    case 48:
      return {
        label: 'Foggy',
        icon: CloudFog,
        colorClass: 'text-zinc-400',
        bgGradient: 'from-zinc-400/20 to-slate-500/5',
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Drizzle',
        icon: CloudDrizzle,
        colorClass: 'text-teal-400',
        bgGradient: 'from-teal-400/20 to-emerald-500/5',
      };
    case 56:
    case 57:
    case 66:
    case 67:
      return {
        label: 'Freezing Drizzle/Rain',
        icon: Snowflake,
        colorClass: 'text-cyan-300',
        bgGradient: 'from-cyan-300/20 to-blue-500/5',
      };
    case 61:
    case 63:
    case 65:
      return {
        label: code === 61 ? 'Light Rain' : code === 63 ? 'Moderate Rain' : 'Heavy Rain',
        icon: CloudRain,
        colorClass: 'text-blue-500',
        bgGradient: 'from-blue-500/20 to-indigo-600/5',
      };
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return {
        label: 'Snowfall',
        icon: Snowflake,
        colorClass: 'text-indigo-200',
        bgGradient: 'from-indigo-200/20 to-slate-400/5',
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Rain Showers',
        icon: CloudRain,
        colorClass: 'text-blue-400',
        bgGradient: 'from-blue-400/20 to-blue-600/5',
      };
    case 95:
    case 96:
    case 99:
      return {
        label: 'Thunderstorm',
        icon: CloudLightning,
        colorClass: 'text-violet-500',
        bgGradient: 'from-violet-500/20 to-purple-700/5',
      };
    default:
      return {
        label: 'Unknown',
        icon: HelpCircle,
        colorClass: 'text-slate-400',
        bgGradient: 'from-slate-400/20 to-slate-500/5',
      };
  }
}
