/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { DailyForecast } from '../types';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { TrendingUp, BarChart2, ThermometerSun } from 'lucide-react';

interface WeatherTrendChartProps {
  dailyData: DailyForecast;
  isCelsius: boolean;
}

export default function WeatherTrendChart({ dailyData, isCelsius }: WeatherTrendChartProps) {
  const [activeTab, setActiveTab] = useState<'temperature' | 'precipitation'>('temperature');

  // Map daily forecast arrays to a structured array format for Recharts
  const chartData = dailyData.time.map((timeStr, idx) => {
    const date = new Date(timeStr);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Temperatures
    const rawMax = dailyData.temperature_2m_max[idx];
    const rawMin = dailyData.temperature_2m_min[idx];
    const maxTemp = isCelsius ? rawMax : (rawMax * 9) / 5 + 32;
    const minTemp = isCelsius ? rawMin : (rawMin * 9) / 5 + 32;

    return {
      name: dayName,
      fullDate: formattedDate,
      Max: Math.round(maxTemp),
      Min: Math.round(minTemp),
      Precipitation: parseFloat(dailyData.precipitation_sum[idx].toFixed(1)),
    };
  });

  return (
    <div className="w-full bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-slate-500" />
          <h3 className="text-lg font-bold text-slate-800">Visual Weather Trends</h3>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-100/80 p-1 rounded-xl border border-slate-200/50">
          <button
            id="trend-tab-temp"
            onClick={() => setActiveTab('temperature')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'temperature'
                ? 'bg-white text-sky-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ThermometerSun className="h-3.5 w-3.5" />
            <span>Temperature Trend</span>
          </button>
          <button
            id="trend-tab-precip"
            onClick={() => setActiveTab('precipitation')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'precipitation'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart2 className="h-3.5 w-3.5" />
            <span>Rainfall Outlook</span>
          </button>
        </div>
      </div>

      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={11}
              fontWeight={600}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              fontWeight={600}
              tickLine={false}
              axisLine={false}
              unit={activeTab === 'temperature' ? (isCelsius ? '°C' : '°F') : 'mm'}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #f1f5f9',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
              }}
              labelStyle={{ fontWeight: 700, color: '#334155', fontSize: '12px' }}
              itemStyle={{ fontSize: '12px', padding: '2px 0' }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}
            />

            {activeTab === 'temperature' ? (
              <>
                <Line
                  type="monotone"
                  dataKey="Max"
                  name={`Max Temp (${isCelsius ? '°C' : '°F'})`}
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="Min"
                  name={`Min Temp (${isCelsius ? '°C' : '°F'})`}
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </>
            ) : (
              <Bar
                dataKey="Precipitation"
                name="Expected Rainfall (mm)"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                barSize={32}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
