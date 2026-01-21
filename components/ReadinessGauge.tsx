import React from 'react';
import { Activity } from 'lucide-react';

interface ReadinessGaugeProps {
  score: number;
  sleepScore: number;
  hrvScore: number;
  activityScore: number;
}

export default function ReadinessGauge({
  score,
  sleepScore,
  hrvScore,
  activityScore,
}: ReadinessGaugeProps) {
  // Determine color based on score
  const getScoreColor = (value: number): string => {
    if (value >= 80) return 'text-emerald-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getScoreLabel = (value: number): string => {
    if (value >= 80) return 'Optimal';
    if (value >= 60) return 'Good';
    if (value >= 40) return 'Fair';
    return 'Low';
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-cyan-50 to-blue-100 p-8 shadow-xl shadow-teal-100 border-2 border-white/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-cyan-200 rounded-2xl animate-float">
          <Activity className="w-6 h-6 text-cyan-700" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Readiness Score</h2>
          <p className="text-sm text-gray-700">Today's energy level ⚡</p>
        </div>
      </div>

      {/* Main Score Display */}
      <div className="relative mb-8 bg-white/70 rounded-3xl p-6 border-2 border-white">
        <div className="flex items-baseline justify-center">
          <span className={`text-8xl font-bold ${getScoreColor(score)}`}>
            {score}
          </span>
          <span className="text-4xl text-gray-400 ml-2">/100</span>
        </div>
        <p className="text-center mt-3 text-xl font-bold text-cyan-900">
          {getScoreLabel(score)} ✨
        </p>
      </div>

      {/* Component Breakdown */}
      <div className="space-y-3">
        <div className="bg-white/70 rounded-2xl p-4 border-2 border-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-900">💤 Sleep Quality</span>
            <span className="text-lg font-bold text-blue-600">{sleepScore}</span>
          </div>
          <div className="w-full h-3 bg-blue-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all"
              style={{ width: `${sleepScore}%` }}
            />
          </div>
        </div>

        <div className="bg-white/70 rounded-2xl p-4 border-2 border-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-900">💚 HRV Recovery</span>
            <span className="text-lg font-bold text-emerald-600">{hrvScore}</span>
          </div>
          <div className="w-full h-3 bg-emerald-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all"
              style={{ width: `${hrvScore}%` }}
            />
          </div>
        </div>

        <div className="bg-white/70 rounded-2xl p-4 border-2 border-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-900">🏃 Activity Balance</span>
            <span className="text-lg font-bold text-purple-600">{activityScore}</span>
          </div>
          <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all"
              style={{ width: `${activityScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Playful Encouragement */}
      <div className="mt-6 pt-4 border-t-2 border-cyan-200">
        <p className="text-sm text-cyan-800 font-semibold text-center">
          {score >= 80 ? "🌟 Amazing! They're ready for anything!" : 
           score >= 60 ? "💚 Looking good! Feeling balanced." :
           "💙 Rest up, buddy. Today's a recovery day."}
        </p>
      </div>
    </div>
  );
}
