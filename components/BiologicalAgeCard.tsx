'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, TrendingDown, TrendingUp, HelpCircle, X, Activity, Moon, Utensils } from 'lucide-react';
import { DogData, BreedData } from '@/lib/types';

interface BiologicalAgeCardProps {
  chronologicalAge: number;
  biologicalAge: number;
  isSenior: boolean;
  dogData?: DogData;
  breedData?: BreedData;
}

type GuideType = 'activity' | 'sleep' | 'diet' | null;

export default function BiologicalAgeCard({
  chronologicalAge,
  biologicalAge,
  isSenior,
  dogData,
  breedData,
}: BiologicalAgeCardProps) {
  // Hooks must be called at top level unconditionally
  const router = useRouter();
  const [showInsights, setShowInsights] = useState(false);
  const [activeGuide, setActiveGuide] = useState<GuideType>(null);
  const [showPopup, setShowPopup] = useState<'sleep' | 'diet' | null>(null);
  const ageDifference = biologicalAge - chronologicalAge;
  const isYounger = ageDifference < 0;
  const isOlder = ageDifference > 0;

  // Calculate guide content based on actual data
  const activeMinutes = dogData?.behavioral_stats_today?.active_minutes || 0;
  const targetMinutes = breedData?.activity_budget_mins || 60;
  const minutesNeeded = Math.max(0, targetMinutes - activeMinutes);
  const weight = dogData?.weight_lbs || 0;
  const age = dogData?.chronological_age || 0;

  const getGuideContent = (type: GuideType) => {
    switch (type) {
      case 'activity':
        return {
          icon: <Activity className="w-6 h-6" />,
          title: 'Track Activity',
          color: 'from-rose-100 to-pink-100',
          borderColor: 'border-rose-300',
          textColor: 'text-rose-900',
          content: `${dogData?.name || 'Your dog'} needs ${minutesNeeded} more active minutes today to reach their 'Youthful Heart' goal of ${targetMinutes} minutes. Current: ${activeMinutes} mins.`,
          tip: 'Try a 20-minute walk after his next meal to boost heart health and reduce biological age!'
        };
      case 'sleep':
        return {
          icon: <Moon className="w-6 h-6" />,
          title: 'Sleep Tips',
          color: 'from-indigo-100 to-purple-100',
          borderColor: 'border-indigo-300',
          textColor: 'text-indigo-900',
          content: 'Reduce blue light exposure, maintain a consistent 9 PM bedtime, and ensure the room is between 65-70°F for optimal recovery.',
          tip: 'Better sleep quality = lower stress hormones = younger biological age!'
        };
      case 'diet':
        return {
          icon: <Utensils className="w-6 h-6" />,
          title: 'Diet Guide',
          color: 'from-green-100 to-emerald-100',
          borderColor: 'border-green-300',
          textColor: 'text-green-900',
          content: `Based on ${dogData?.name || 'your dog'}'s ${weight}lb weight and ${age.toFixed(1)}-year age, we recommend a high-protein diet with added glucosamine for joint health.`,
          tip: 'Consider switching to a senior formula with anti-inflammatory ingredients!'
        };
      default:
        return null;
    }
  };

  const guide = activeGuide ? getGuideContent(activeGuide) : null;

  // Generate data-driven insights
  const generateInsights = () => {
    if (!dogData || !breedData) return [];
    
    const insights: string[] = [];
    const baseline = {
      rhrMin: breedData.vitals_baseline?.min_rhr || 60,
      rhrMax: breedData.vitals_baseline?.max_rhr || 100,
      avgSrr: breedData.vitals_baseline?.avg_srr || 17,
    };
    
    const baselineRHRMid = (baseline.rhrMin + baseline.rhrMax) / 2;
    const currentRHR = dogData.current_vitals?.heart_rate_bpm || 0;
    const currentSRR = dogData.current_vitals?.respiratory_rate_srr || 0;
    const currentHRV = dogData.current_vitals?.hrv_ms || 0;
    
    // RHR Analysis
    if (currentRHR > baselineRHRMid * 1.1) {
      const percentAbove = ((currentRHR - baselineRHRMid) / baselineRHRMid * 100).toFixed(0);
      insights.push(`Resting heart rate (${currentRHR} bpm) is ${percentAbove}% above breed average, suggesting cardiovascular stress.`);
    } else if (currentRHR < baselineRHRMid * 0.9) {
      insights.push(`Resting heart rate (${currentRHR} bpm) is excellent - below breed average indicates strong cardiovascular fitness.`);
    }
    
    // SRR Analysis
    if (currentSRR > 25) {
      insights.push(`Elevated sleeping respiratory rate (${currentSRR} breaths/min) may indicate respiratory or cardiac stress.`);
    }
    
    // HRV Analysis
    const avgHRV = dogData.historical_data_7d?.reduce((sum, day) => sum + (day?.hrv || 0), 0) / (dogData.historical_data_7d?.length || 1);
    if (currentHRV < avgHRV * 0.9) {
      const percentBelow = ((avgHRV - currentHRV) / avgHRV * 100).toFixed(0);
      insights.push(`Heart rate variability (${currentHRV}ms) is ${percentBelow}% below 7-day average, indicating reduced recovery capacity.`);
    } else if (currentHRV > avgHRV * 1.1) {
      insights.push(`Strong HRV (${currentHRV}ms) suggests excellent recovery and stress resilience.`);
    }
    
    // Activity Analysis
    const avgActivity = dogData.historical_data_7d?.reduce((sum, day) => sum + (day?.steps || 0), 0) / (dogData.historical_data_7d?.length || 1);
    const targetActivity = breedData.activity_budget_mins * 100; // rough conversion
    if (avgActivity < targetActivity * 0.7) {
      const percentBelow = ((targetActivity - avgActivity) / targetActivity * 100).toFixed(0);
      insights.push(`Activity levels are ${percentBelow}% below breed recommendation, which may accelerate aging markers.`);
    }
    
    return insights;
  };

  const insights = generateInsights();

  return (
    <div className="rounded-3xl bg-gradient-to-br from-purple-100 via-lavender-100 to-pink-100 p-6 shadow-lg border-2 border-white/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-200 rounded-2xl animate-float">
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-purple-900">Biological Age</h3>
            <p className="text-sm text-purple-700">Internal health indicator</p>
          </div>
        </div>
        {isOlder && insights.length > 0 && (
          <button
            onClick={() => setShowInsights(!showInsights)}
            className="p-2 bg-yellow-300 hover:bg-yellow-400 rounded-full transition-colors animate-wiggle"
            title="Why is bio-age different?"
          >
            <HelpCircle className="w-5 h-5 text-purple-900" />
          </button>
        )}
      </div>

      {/* Insights Modal */}
      {showInsights && (
        <div className="mb-4 bg-white/90 backdrop-blur-sm bubble-card p-4 border-2 border-yellow-300 relative">
          <button
            onClick={() => setShowInsights(false)}
            className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
          <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
            <span>💡</span> Why the Difference?
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            {insights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-teal-500 font-bold mt-0.5">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-500 mt-3 italic">
            Based on current vitals from sensor data vs. breed baseline
          </p>
        </div>
      )}

      <div className="space-y-4">
        {/* Age Comparison */}
        <div className="flex items-center justify-between bg-white/70 rounded-2xl p-4 border-2 border-white">
          <div>
            <p className="text-xs text-purple-600 mb-1 font-semibold">Chronological</p>
            <p className="text-3xl font-bold text-purple-900">
              {chronologicalAge.toFixed(1)} <span className="text-lg text-gray-500">yrs</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-purple-600 mb-1 font-semibold">Biological</p>
            <p className="text-3xl font-bold text-purple-900">
              {biologicalAge.toFixed(1)} <span className="text-lg text-gray-500">yrs</span>
            </p>
          </div>
        </div>

        {/* Age Status */}
        {ageDifference !== 0 && (
          <div
            className={`flex items-center gap-2 p-4 rounded-2xl border-2 ${
              isYounger
                ? 'bg-teal-100 border-teal-300'
                : 'bg-coral-100 border-orange-300'
            }`}
          >
            {isYounger ? (
              <TrendingDown className="w-6 h-6 text-teal-600" />
            ) : (
              <TrendingUp className="w-6 h-6 text-orange-600" />
            )}
            <div className="flex-1">
              <p
                className={`text-base font-bold ${
                  isYounger ? 'text-teal-900' : 'text-orange-900'
                }`}
              >
                {isYounger
                  ? `${Math.abs(ageDifference).toFixed(1)} years younger! 🎉`
                  : `${ageDifference.toFixed(1)} years older 📊`}
              </p>
              <p className="text-sm text-gray-600">
                {isYounger
                  ? 'Excellent health markers detected'
                  : 'Optimize vitals for better wellness'}
              </p>
            </div>
          </div>
        )}

        {/* Popups for Sleep and Diet */}
        {showPopup && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPopup(null)}>
                <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                  {showPopup === 'sleep' && (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
                          <Moon className="w-6 h-6" />
                          Sleep Tips
                        </h3>
                        <button onClick={() => setShowPopup(null)} className="p-2 hover:bg-gray-100 rounded-full">
                          <X className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                      <p className="text-gray-800 font-semibold mb-4">
                        Consistency is key! Keep {dogData?.name || 'your dog'}'s bedtime at 9 PM and ensure a cool room (68°F) for better deep sleep recovery.
                      </p>
                      <div className="bg-indigo-50 rounded-2xl p-4 border-2 border-indigo-200">
                        <p className="text-sm text-indigo-900 font-bold">
                          💡 Pro Tip: Avoid heavy play 2 hours before bed for optimal rest quality.
                        </p>
                      </div>
                    </>
                  )}
                  {showPopup === 'diet' && (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-green-700 flex items-center gap-2">
                          <Utensils className="w-6 h-6" />
                          Diet Guide
                        </h3>
                        <button onClick={() => setShowPopup(null)} className="p-2 hover:bg-gray-100 rounded-full">
                          <X className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                      <p className="text-gray-800 font-semibold mb-4">
                        For a {dogData?.weight_lbs || 0}lb {breedData?.breed || 'dog'}, prioritize high-protein kibble with joint support (glucosamine) to keep {dogData?.name || 'them'} lean and active.
                      </p>
                      <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-200">
                        <p className="text-sm text-green-900 font-bold">
                          💡 Pro Tip: Split meals into 2-3 portions daily for better digestion and energy.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Guide Content - Expanded Section */}
            {guide && (
              <div className={`mt-4 bg-gradient-to-br ${guide.color} border-2 ${guide.borderColor} rounded-2xl p-4 animate-in slide-in-from-top-2`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`${guide.textColor}`}>
                      {guide.icon}
                    </div>
                    <h4 className={`font-bold ${guide.textColor}`}>
                      {guide.title}
                    </h4>
                  </div>
                  <button
                    onClick={() => setActiveGuide(null)}
                    className="p-1 hover:bg-white/60 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <p className="text-sm text-gray-800 mb-3 leading-relaxed">
                  {guide.content}
                </p>
                <div className="bg-white/60 rounded-xl p-3 border border-white">
                  <p className="text-xs font-semibold text-gray-700">
                    💡 FurVitals Tip: {guide.tip}
                  </p>
                </div>
              </div>
            )}

        {ageDifference === 0 && (
          <div className="flex items-center gap-2 p-4 rounded-2xl bg-cyan-100 border-2 border-cyan-300">
            <Calendar className="w-6 h-6 text-cyan-600" />
            <div>
              <p className="text-base font-bold text-cyan-900">Perfect match! ✨</p>
              <p className="text-sm text-gray-600">
                Biological age matches chronological age
              </p>
            </div>
          </div>
        )}

        {/* Senior Badge */}
        {isSenior && (
          <div className="p-4 bg-yellow-200 border-2 border-yellow-400 rounded-2xl">
            <p className="text-sm font-bold text-yellow-900">🏅 Senior Pup Status</p>
            <p className="text-sm text-yellow-800 mt-1">
              Extra care & monitoring active
            </p>
          </div>
        )}

        {/* Playful Description with Activity Link */}
        <div className="pt-4 border-t-2 border-purple-200">
          <p className="text-sm text-purple-700 font-semibold text-center">
            {isOlder ? (
              <span>
                💡 Let's optimize {dogData?.name || 'your dog'}'s wellness together! Lower activity levels this week 
                ({dogData?.behavioral_stats_today?.active_minutes || 0} mins today) are bumping up their Bio-Age. 
                Try the Activity Tracker above!
              </span>
            ) : isYounger ? (
              `✨ ${dogData?.name || 'Your dog'} is thriving like a young pup!`
            ) : (
              "🎯 Perfect balance achieved!"
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
