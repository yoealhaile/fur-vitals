'use client';

import React from 'react';
import { Moon, Zap, Baby, Utensils } from 'lucide-react';
import { DogData } from '@/lib/types';

interface ActivityBubblesProps {
  dogData: DogData;
}

interface Bubble {
  id: string;
  icon: React.ReactNode;
  label: string;
  emoji: string;
  color: string;
  bgGradient: string;
  timestamp?: string;
}

export default function ActivityBubbles({ dogData }: ActivityBubblesProps) {
  const formatTimeSince = (timestamp?: string): string => {
    if (!timestamp) return 'N/A';
    try {
      const now = new Date();
      const eventTime = new Date(timestamp);
      const diffMs = now.getTime() - eventTime.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (diffHours > 24) {
        const days = Math.floor(diffHours / 24);
        return `${days}d ago`;
      }
      if (diffHours > 0) {
        return `${diffHours}h ago`;
      }
      return `${diffMins}m ago`;
    } catch (e) {
      return 'N/A';
    }
  };

  const recentActivity = (dogData as any).recent_activity || {};

  const bubbles: Bubble[] = [
    {
      id: 'sleep',
      icon: <Moon className="w-8 h-8" />,
      label: 'Sleep',
      emoji: '💤',
      color: 'text-indigo-700',
      bgGradient: 'from-indigo-200 via-purple-200 to-pink-200',
      timestamp: recentActivity.last_sleep_end,
    },
    {
      id: 'active',
      icon: <Zap className="w-8 h-8" />,
      label: 'Active',
      emoji: '🏃',
      color: 'text-emerald-700',
      bgGradient: 'from-emerald-200 via-teal-200 to-cyan-200',
      timestamp: recentActivity.last_active_session,
    },
    {
      id: 'poop',
      icon: <Baby className="w-8 h-8" />,
      label: 'Poop',
      emoji: '💩',
      color: 'text-amber-700',
      bgGradient: 'from-amber-200 via-orange-200 to-yellow-200',
      timestamp: recentActivity.last_poop_time,
    },
    {
      id: 'food',
      icon: <Utensils className="w-8 h-8" />,
      label: 'Food',
      emoji: '🥣',
      color: 'text-rose-700',
      bgGradient: 'from-rose-200 via-pink-200 to-fuchsia-200',
      timestamp: recentActivity.last_meal_time,
    },
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 mb-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {bubbles.map((bubble) => (
            <button
              key={bubble.id}
              className={`group relative rounded-3xl p-6 
                         bg-gradient-to-br ${bubble.bgGradient}
                         border-3 border-white shadow-xl
                         transition-all duration-300
                         hover:scale-105 hover:shadow-2xl
                         active:scale-95
                         flex flex-col items-center gap-3`}
            >
              {/* Icon/Emoji */}
              <div className={`${bubble.color} transform group-hover:scale-110 transition-transform`}>
                <div className="text-5xl mb-2">{bubble.emoji}</div>
              </div>
              
              {/* Label */}
              <div className="text-center">
                <p className="text-lg font-bold text-gray-800 mb-1">{bubble.label}</p>
                <p className="text-sm font-semibold text-gray-600">
                  {formatTimeSince(bubble.timestamp)}
                </p>
              </div>
              
              {/* Hover indicator */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
