'use client';

import React from 'react';
import { Sparkles, Heart, Moon, Utensils } from 'lucide-react';
import { DogData, BreedData } from '@/lib/types';

interface WellnessRecommendationsProps {
  dogData: DogData;
  breedData: BreedData | null;
  biologicalAge: number;
}

export default function WellnessRecommendations({ 
  dogData, 
  breedData, 
  biologicalAge 
}: WellnessRecommendationsProps) {
  const chronoAge = dogData.chronological_age;
  const ageGap = biologicalAge - chronoAge;
  const ageGapYears = Math.abs(ageGap).toFixed(1);
  
  // Calculate recommendations based on actual data
  const recommendations = [
    {
      id: 'activity',
      icon: <Heart className="w-6 h-6" />,
      gradient: 'from-rose-200 via-pink-200 to-rose-300',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-700',
      title: 'Boost Heart Health',
      tip: `${dogData.name} is ${ageGapYears} year${ageGapYears !== '1.0' ? 's' : ''} older biologically! Let's hit 8,000 steps today to get that heart feeling younger.`,
      action: 'Track Activity',
      status: 'High Impact'
    },
    {
      id: 'sleep',
      icon: <Moon className="w-6 h-6" />,
      gradient: 'from-indigo-200 via-purple-200 to-indigo-300',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-700',
      title: 'Improve Sleep Quality',
      tip: `His deep sleep was a bit low last night (${dogData.sleep_analysis_last_night?.deep_sleep_mins || 0} mins). Try a calming lavender-scented pet spray near his bed.`,
      action: 'Sleep Tips',
      status: 'Moderate'
    },
    {
      id: 'nutrition',
      icon: <Utensils className="w-6 h-6" />,
      gradient: 'from-amber-200 via-yellow-200 to-amber-300',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-700',
      title: 'Optimize Nutrition',
      tip: `Switching to a 'Senior Support' kibble blend might help lower his internal inflammation and support joint health.`,
      action: 'Diet Guide',
      status: 'Long-term'
    }
  ];

  return (
    <div className="rounded-3xl bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 p-6 shadow-xl border-2 border-white/50">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-purple-200 to-pink-200 rounded-2xl animate-pulse">
          <Sparkles className="w-6 h-6 text-purple-700" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            💡 Let's optimize {dogData.name}'s wellness together!
          </h3>
          <p className="text-sm text-gray-600 font-semibold">
            Personalized recommendations based on his health data
          </p>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="space-y-4">
        {recommendations.map((rec, idx) => (
          <div 
            key={rec.id}
            className={`bg-gradient-to-r ${rec.gradient} rounded-2xl p-5 border-2 border-white/80 
                       shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`${rec.iconBg} p-3 rounded-xl border-2 border-white/60 flex-shrink-0`}>
                <div className={rec.iconColor}>
                  {rec.icon}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-lg font-bold text-gray-900">{rec.title}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    rec.status === 'High Impact' 
                      ? 'bg-rose-200 text-rose-800 border border-rose-300'
                      : rec.status === 'Moderate'
                      ? 'bg-indigo-200 text-indigo-800 border border-indigo-300'
                      : 'bg-amber-200 text-amber-800 border border-amber-300'
                  }`}>
                    {rec.status}
                  </span>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed mb-3 font-medium">
                  {rec.tip}
                </p>
                <button 
                  className="px-4 py-2 bg-white/80 hover:bg-white rounded-full text-xs font-bold 
                           text-gray-800 border-2 border-white shadow-sm hover:shadow-md 
                           transition-all duration-200"
                >
                  {rec.action} →
                </button>
              </div>
            </div>

            {/* Priority Indicator */}
            {idx === 0 && (
              <div className="mt-3 pt-3 border-t-2 border-white/40">
                <p className="text-xs font-bold text-rose-700 flex items-center gap-1">
                  <span className="animate-ping inline-block w-2 h-2 bg-rose-500 rounded-full"></span>
                  <span className="w-2 h-2 bg-rose-500 rounded-full -ml-2"></span>
                  Priority Action - Start Today!
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="bg-white/70 rounded-2xl p-3 text-center border-2 border-white">
          <p className="text-xs text-gray-600 mb-1 font-semibold">Bio-Age Gap</p>
          <p className="text-xl font-bold text-purple-700">+{ageGapYears}y</p>
        </div>
        <div className="bg-white/70 rounded-2xl p-3 text-center border-2 border-white">
          <p className="text-xs text-gray-600 mb-1 font-semibold">Active Mins</p>
          <p className="text-xl font-bold text-pink-700">{dogData.behavioral_stats_today.active_minutes}</p>
        </div>
        <div className="bg-white/70 rounded-2xl p-3 text-center border-2 border-white">
          <p className="text-xs text-gray-600 mb-1 font-semibold">HRV Status</p>
          <p className="text-xl font-bold text-rose-700">{dogData.current_vitals.hrv_ms}ms</p>
        </div>
      </div>

    </div>
  );
}
