'use client';

import React from 'react';
import { Utensils, Moon, Baby, Footprints, Smile } from 'lucide-react';
import { DogData } from '@/lib/types';

interface ActionBubblesProps {
  dogData: DogData;
}

interface ActionButton {
  id: string;
  icon: React.ReactNode;
  label: string;
  color: string;
  bgColor: string;
  timestamp?: string;
}

export default function ActionBubbles({ dogData }: ActionBubblesProps) {
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

  const recentEvents = (dogData as any).recent_events || {};

  const actions: ActionButton[] = [
    {
      id: 'food',
      icon: <Utensils className="w-6 h-6" />,
      label: 'Food',
      color: 'text-teal-700',
      bgColor: 'bg-gradient-to-br from-teal-200 to-cyan-200',
      timestamp: recentEvents.last_meal,
    },
    {
      id: 'sleep',
      icon: <Moon className="w-6 h-6" />,
      label: 'Sleep',
      color: 'text-purple-700',
      bgColor: 'bg-gradient-to-br from-purple-200 to-lavender-200',
      timestamp: recentEvents.last_sleep_end,
    },
    {
      id: 'poop',
      icon: <Baby className="w-6 h-6" />,
      label: 'Poop',
      color: 'text-amber-700',
      bgColor: 'bg-gradient-to-br from-amber-200 to-orange-200',
      timestamp: recentEvents.last_poop,
    },
    {
      id: 'walk',
      icon: <Footprints className="w-6 h-6" />,
      label: 'Walk',
      color: 'text-emerald-700',
      bgColor: 'bg-gradient-to-br from-emerald-200 to-green-200',
      timestamp: recentEvents.last_walk,
    },
    {
      id: 'play',
      icon: <Smile className="w-6 h-6" />,
      label: 'Play',
      color: 'text-yellow-700',
      bgColor: 'bg-gradient-to-br from-yellow-200 to-amber-200',
      timestamp: recentEvents.last_play,
    },
  ];

  return (
    <div className="w-full py-4 px-4 sm:px-6 lg:px-8 bg-white/60 backdrop-blur-sm border-b-2 border-teal-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-700">Quick Log</h3>
          <p className="text-xs text-gray-500">Tap to add new event</p>
        </div>
        
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          {actions.map((action) => (
            <button
              key={action.id}
              className="flex flex-col items-center gap-2 min-w-[90px] group"
            >
              {/* Circular bubble */}
              <div
                className={`${action.bgColor} w-16 h-16 rounded-full 
                           flex items-center justify-center
                           border-3 border-white shadow-lg
                           transition-all duration-300
                           group-hover:scale-110 group-hover:shadow-xl
                           group-active:scale-95 cursor-pointer`}
              >
                <div className={action.color}>
                  {action.icon}
                </div>
              </div>
              
              {/* Label and time */}
              <div className="text-center">
                <p className="text-xs font-bold text-gray-800">{action.label}</p>
                <p className="text-xs text-gray-500 font-medium">
                  {formatTimeSince(action.timestamp)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
