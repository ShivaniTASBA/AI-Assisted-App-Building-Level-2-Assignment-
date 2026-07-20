/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  country_code: string;
  timezone?: string;
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  time: string;
  is_day: number;
}

export interface DailyForecast {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weathercode: number[];
  precipitation_sum: number[];
  uv_index_max?: number[];
  wind_speed_10m_max?: number[];
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  current_weather: CurrentWeather;
  daily: DailyForecast;
  resolvedName: string;
  resolvedCountry: string;
}

export interface WeatherCodeDetails {
  label: string;
  iconName: string;
  colorClass: string;
  bgGradient: string;
}
