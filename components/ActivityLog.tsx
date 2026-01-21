'use client';

import React from 'react';
import { Moon, Activity, Utensils, Baby, Clock } from 'lucide-react';
import { DogData } from '@/lib/types';

interface ActivityLogProps {
  dogData: DogData;
}

interface LogEntry {
  icon: React.ReactNode;
  title: string;
  detail: string;
  time: string;
  color: string;
  bgColor: string;
}

export default function ActivityLog({ dogData }: ActivityLogProps) {
  const formatTimeAgo = (timestamp: string): string => {
    if (!timestamp) return 'N/A';
    const now = new Date();
    const eventTime = new Date(timestamp);
    const diffMs = now.getTime() - eventTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMins}m ago`;
    }
    return `${diffMins}m ago`;
  };

  // Build activity log entries
  const logEntries: LogEntry[] = [];

  // Sleep entry
  if (dogData.sleep_analysis_last_night) {
    const sleepHours = (dogData.sleep_analysis_last_night.total_sleep_minutes / 60).toFixed(1);
    const quality = dogData.sleep_analysis_last_night.fragmentation_index < 3 ? 'Good' : 'Fair';
    logEntries.push({
      icon: <Moon className="w-5 h-5" />,
      title: 'Sleep Last Night',
      detail: `${sleepHours} hrs • ${quality} quality • ${dogData.sleep_analysis_last_night.wake_ups} wake-ups`,
      time: 'Last night',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    });
  }

  // Activity entry
  if (dogData.behavioral_stats_today) {
    const steps = dogData.behavioral_stats_today.steps.toLocaleString();
    const activeMin = dogData.behavioral_stats_today.active_minutes;
    logEntries.push({
      icon: <Activity className="w-5 h-5" />,
      title: 'Activity Today',
      detail: `${steps} steps • ${activeMin} active minutes`,
      time: 'Today',
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
    });
  }

  // Last meal
  if (dogData.behavioral_stats_today?.last_meal_time) {
    logEntries.push({
      icon: <Utensils className="w-5 h-5" />,
      title: 'Last Meal',
      detail: 'Fed & happy',
      time: formatTimeAgo(dogData.behavioral_stats_today.last_meal_time),
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    });
  }

  // Last poop
  if (dogData.behavioral_stats_today?.last_poop_time) {
    logEntries.push({
      icon: <Baby className="w-5 h-5" />,
      title: 'Last Bathroom',
      detail: 'All done!',
      time: formatTimeAgo(dogData.behavioral_stats_today.last_poop_time),
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    });
  }

  return (
    <div className="rounded-3xl bg-gradient-to-br from-yellow-50 to-amber-50 p-6 shadow-lg border-2 border-white/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-yellow-200 rounded-2xl animate-float">
          <Clock className="w-6 h-6 text-yellow-700" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Activity Log</h3>
          <p className="text-sm text-gray-600">Recent events & activities</p>
        </div>
      </div>

      {/* Scrollable log entries */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {logEntries.map((entry, idx) => (
          <div
            key={idx}
            className="bg-white/80 rounded-2xl p-4 border-2 border-white shadow-sm 
                       hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 ${entry.bgColor} rounded-xl group-hover:scale-110 transition-transform`}>
                <div className={entry.color}>{entry.icon}</div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">{entry.title}</p>
                <p className="text-xs text-gray-600 mt-1">{entry.detail}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-gray-500">{entry.time}</p>
              </div>
            </div>
          </div>
        ))}

        {logEntries.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">No activities recorded yet</p>
          </div>
        )}
      </div>

      {/* Add event button */}
      <button className="mt-4 w-full py-3 bg-gradient-to-r from-yellow-400 to-amber-400 
                         hover:from-yellow-500 hover:to-amber-500
                         text-white font-semibold rounded-2xl 
                         transition-all transform hover:scale-105 shadow-md">
        + Log New Event
      </button>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #fbbf24;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #f59e0b;
        }
      `}</style>
    </div>
  );
}
