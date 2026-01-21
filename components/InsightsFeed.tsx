'use client';

import React from 'react';
import { AlertTriangle, AlertCircle, Info, Shield, Sparkles } from 'lucide-react';
import { HealthAlert, DogData, BreedData } from '@/lib/types';

interface InsightsFeedProps {
  alerts: HealthAlert[];
  dogData?: DogData;
  breedData?: BreedData;
  biologicalAge?: number;
}

export default function InsightsFeed({ alerts, dogData, breedData, biologicalAge }: InsightsFeedProps) {
  // Check for urgent medical reminders (TODAY)
  const getUrgentReminder = () => {
    if (!dogData) return null;
    const medicalRecords = (dogData as any).medical_records;
    if (!medicalRecords || !medicalRecords.upcoming_reminders) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (const reminder of medicalRecords.upcoming_reminders) {
      const dueDate = new Date(reminder.due_date);
      dueDate.setHours(0, 0, 0, 0);
      
      if (reminder.status === 'urgent' || dueDate.getTime() === today.getTime()) {
        return reminder;
      }
    }
    return null;
  };

  const urgentReminder = getUrgentReminder();

  // Generate contextual insights based on recent events and bio-age
  const generateContextualInsight = (): string | null => {
    if (!dogData || !biologicalAge) return null;
    
    const chronoAge = dogData.chronological_age || 0;
    const ageDiff = biologicalAge - chronoAge;
    
    // Check HRV specifically (priority insight)
    if (dogData.current_vitals?.hrv_ms && dogData.current_vitals.hrv_ms < 40) {
      const recentActivity = (dogData as any).recent_activity || {};
      const lastMeal = recentActivity.last_meal_time;
      return `${dogData.name} is feeling a bit older today due to low HRV (${dogData.current_vitals.hrv_ms}ms). A light walk after his next meal might help! 🚶‍♂️`;
    }
    
    if (ageDiff > 0.5) {
      const recentEvents = dogData.recent_events || {};
      const activeMinutes = dogData.behavioral_stats_today?.active_minutes || 0;
      
      // Check if they had a walk recently
      const lastWalk = recentEvents.last_walk;
      const walkHoursAgo = lastWalk ? 
        Math.floor((new Date().getTime() - new Date(lastWalk).getTime()) / (1000 * 60 * 60)) : 999;
      
      if (walkHoursAgo > 12 || activeMinutes < 30) {
        return `${dogData.name}'s bio-age is slightly elevated today. With only ${activeMinutes} active minutes and limited recent exercise, consider a walk to boost wellness! 🐾`;
      }
      
      return `${dogData.name}'s biological age is ${ageDiff.toFixed(1)} years above chronological age. This reflects current vitals and activity levels. Let's boost those numbers! 💪`;
    }
    
    return null;
  };

  const contextualInsight = generateContextualInsight();

  const getSeverityConfig = (severity: HealthAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-600',
          textColor: 'text-red-900',
          badge: 'bg-red-100 text-red-700',
        };
      case 'warning':
        return {
          icon: AlertCircle,
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          iconColor: 'text-amber-600',
          textColor: 'text-amber-900',
          badge: 'bg-amber-100 text-amber-700',
        };
      default:
        return {
          icon: Info,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600',
          textColor: 'text-blue-900',
          badge: 'bg-blue-100 text-blue-700',
        };
    }
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-lg border-2 border-white/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-200 rounded-2xl animate-float">
          <Shield className="w-6 h-6 text-emerald-700" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Health Insights</h3>
          <p className="text-sm text-gray-600">Smart health monitoring 🔍</p>
        </div>
      </div>

      {/* Urgent Medical Reminder - HIGHEST PRIORITY */}
      {urgentReminder && (
        <div className="mb-4 bg-gradient-to-r from-red-100 via-orange-100 to-coral-100 border-2 border-red-300 rounded-3xl p-5 animate-pulse shadow-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-200 rounded-xl animate-bounce">
              <AlertTriangle className="w-6 h-6 text-red-700" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full -ml-2"></span>
                <h4 className="text-base font-bold text-red-900">
                  🚨 Action Required
                </h4>
              </div>
              <p className="text-sm font-semibold text-gray-800">
                {dogData?.name} is due for {urgentReminder.type} TODAY!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Contextual Insight Card */}
      {contextualInsight && (
        <div className="mb-4 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-3xl p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-yellow-200 rounded-xl">
              <Sparkles className="w-5 h-5 text-yellow-700" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-yellow-900 mb-1">
                Today's Insight
              </h4>
              <p className="text-sm text-gray-700">{contextualInsight}</p>
            </div>
          </div>
        </div>
      )}

      {/* Only show "All Good" if no urgent reminder and no alerts */}
      {!urgentReminder && alerts.length === 0 ? (
        <div className="text-center py-8 bg-white/70 rounded-3xl border-2 border-white">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-100 rounded-full mb-3 animate-float">
            <Shield className="w-10 h-10 text-teal-600" />
          </div>
          <p className="text-base font-bold text-emerald-900">All Good! ✨</p>
          <p className="text-sm text-gray-600 mt-2">
            No health alerts today 🎉
          </p>
        </div>
      ) : alerts.length > 0 ? (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const config = getSeverityConfig(alert.severity);
            const Icon = config.icon;

            return (
              <div
                key={alert.id}
                className={`${config.bgColor} ${config.borderColor} border-2 rounded-3xl p-4 
                           transition-all hover:shadow-lg hover:scale-102 cursor-pointer`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl ${config.bgColor}`}>
                    <Icon className={`w-6 h-6 ${config.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className={`text-base font-bold ${config.textColor}`}>
                        {alert.title}
                      </h4>
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${config.badge}`}
                      >
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{alert.description}</p>
                    <div className="bg-white/60 rounded-xl px-3 py-2 border border-white">
                      <span className="text-xs text-gray-500">Condition: </span>
                      <span className="text-xs font-bold text-gray-800">
                        {alert.condition}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Footer note - only show if we have urgent reminder or alerts */}
      {(urgentReminder || alerts.length > 0) && (
        <div className="mt-4 pt-4 border-t-2 border-emerald-200">
          <p className="text-sm text-gray-700 text-center font-semibold">
            💡 Talk to your vet for guidance
          </p>
        </div>
      )}
    </div>
  );
}
