'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, TrendingUp } from 'lucide-react';
import { DogData } from '@/lib/types';

interface ActivityBarChartProps {
  dogData: DogData;
  targetMinutes: number;
}

export default function ActivityBarChart({ dogData, targetMinutes }: ActivityBarChartProps) {
  // Prepare data from historical_data_7d
  const chartData = dogData.historical_data_7d.map((day) => {
    // Estimate active minutes from steps (rough conversion: 100 steps = 1 minute)
    const estimatedMinutes = Math.round(day.steps / 100);
    const date = new Date(day.date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    return {
      day: dayName,
      minutes: estimatedMinutes,
      isTarget: estimatedMinutes >= targetMinutes,
      date: day.date,
    };
  }).reverse(); // Reverse to show oldest to newest

  // Calculate average
  const avgMinutes = Math.round(
    chartData.reduce((sum, d) => sum + d.minutes, 0) / chartData.length
  );

  // Pastel color palette
  const getBarColor = (minutes: number, index: number) => {
    if (minutes >= targetMinutes) return '#a78bfa'; // Lavender (good)
    if (minutes >= targetMinutes * 0.7) return '#5eead4'; // Teal (okay)
    return '#fbbf24'; // Yellow (needs improvement)
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-6 shadow-xl border-2 border-white/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-200 to-pink-200 rounded-2xl">
            <Activity className="w-6 h-6 text-purple-700" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Daily Activity Tracker</h3>
            <p className="text-sm text-gray-600">Last 7 days of movement</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 bg-gradient-to-r from-purple-400 to-pink-400 px-4 py-2 rounded-full border-2 border-white shadow-lg">
            <TrendingUp className="w-5 h-5 text-white" />
            <div>
              <p className="text-xs text-white/90 font-semibold">Avg/Day</p>
              <p className="text-xl font-bold text-white">{avgMinutes}m</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white/80 rounded-2xl p-6 border-2 border-white">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" vertical={false} />
            <XAxis 
              dataKey="day" 
              stroke="#9333ea"
              style={{ fontSize: '14px', fontWeight: 600 }}
            />
            <YAxis 
              stroke="#9333ea"
              label={{ value: 'Active Minutes', angle: -90, position: 'insideLeft', style: { fontWeight: 600 } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '2px solid #a78bfa', 
                borderRadius: '16px',
                padding: '12px',
                boxShadow: '0 4px 12px rgba(167, 139, 250, 0.2)'
              }}
              labelStyle={{ fontWeight: 'bold', color: '#9333ea' }}
            />
            <Bar 
              dataKey="minutes" 
              radius={[10, 10, 0, 0]}
              label={{ position: 'top', style: { fontWeight: 'bold', fontSize: '12px' } }}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getBarColor(entry.minutes, index)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple-400"></div>
            <span className="text-xs font-semibold text-gray-700">Goal Met ✓</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-teal-400"></div>
            <span className="text-xs font-semibold text-gray-700">Good Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
            <span className="text-xs font-semibold text-gray-700">Needs More</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="bg-white/70 rounded-2xl p-4 text-center border-2 border-white">
          <p className="text-xs text-gray-600 mb-1 font-semibold">Today's Goal</p>
          <p className="text-2xl font-bold text-purple-900">{targetMinutes}m</p>
        </div>
        <div className="bg-white/70 rounded-2xl p-4 text-center border-2 border-white">
          <p className="text-xs text-gray-600 mb-1 font-semibold">Best Day</p>
          <p className="text-2xl font-bold text-emerald-600">
            {Math.max(...chartData.map(d => d.minutes))}m
          </p>
        </div>
        <div className="bg-white/70 rounded-2xl p-4 text-center border-2 border-white">
          <p className="text-xs text-gray-600 mb-1 font-semibold">Days on Target</p>
          <p className="text-2xl font-bold text-purple-900">
            {chartData.filter(d => d.isTarget).length}/7
          </p>
        </div>
      </div>

      {/* Insight */}
      {avgMinutes < targetMinutes * 0.7 && (
        <div className="mt-4 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-2xl p-4 border-2 border-yellow-200">
          <p className="text-sm text-gray-700">
            <span className="font-bold text-amber-900">💡 Activity Tip:</span> {dogData.name} averaged {avgMinutes} minutes/day this week. Let's aim for {targetMinutes}+ minutes to hit the daily goal! 🎯
          </p>
        </div>
      )}
    </div>
  );
}
