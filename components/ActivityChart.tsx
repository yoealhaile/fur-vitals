import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { HistoricalDataPoint } from '@/lib/types';

interface ActivityChartProps {
  historicalData: HistoricalDataPoint[];
  targetMinutes: number;
}

export default function ActivityChart({
  historicalData,
  targetMinutes,
}: ActivityChartProps) {
  // Reverse to show oldest to newest
  const chartData = [...historicalData].reverse();
  const maxSteps = Math.max(...chartData.map((d) => d.steps));

  const avgSteps =
    chartData.reduce((sum, d) => sum + d.steps, 0) / chartData.length;

  return (
    <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-lg border-2 border-white/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-200 rounded-2xl animate-float">
            <BarChart3 className="w-6 h-6 text-blue-700" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Activity Tracker 🏃
            </h3>
            <p className="text-sm text-gray-600">Last 7 days of steps</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-teal-400 to-emerald-400 px-4 py-2 rounded-full border-2 border-white">
          <div className="flex items-center gap-1 text-white">
            <TrendingUp className="w-5 h-5" />
            <span className="text-base font-bold">
              {Math.round(avgSteps)}
            </span>
          </div>
          <p className="text-xs text-white/80 text-center">avg/day</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white/70 rounded-2xl p-4 border-2 border-white">
        <div className="flex items-end justify-between h-40 gap-2 mb-4">
          {chartData.map((day, index) => {
            const heightPercent = (day.steps / maxSteps) * 100;
            const isToday = index === chartData.length - 1;

            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col justify-end h-full">
                  <div
                    className={`w-full rounded-t-xl transition-all hover:scale-105 cursor-pointer ${
                      isToday
                        ? 'bg-gradient-to-t from-purple-500 to-pink-400 shadow-lg'
                        : 'bg-gradient-to-t from-teal-400 to-cyan-300'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-800">
                    {new Date(day.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                    })}
                  </p>
                  <p className="text-xs font-semibold text-teal-600">{day.steps.toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Target Line Reference */}
        <div className="pt-4 border-t-2 border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-700">🎯 Daily Goal</span>
            <span className="text-base font-bold text-indigo-900">
              {targetMinutes} mins
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
