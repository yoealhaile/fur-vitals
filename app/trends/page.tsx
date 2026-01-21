'use client';

import React from 'react';
import { TrendingUp, Calendar, Heart, Activity } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useApp } from '@/context/AppContext';

export default function TrendsPage() {
  const { dogData } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-purple-50 to-pink-50 pb-24">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b-4 border-purple-300 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Health Trends
              </h1>
              <p className="text-sm text-gray-600 font-semibold">Track {dogData.name}'s progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Coming Soon */}
        <div className="bg-white rounded-3xl shadow-lg border-2 border-white/50 p-12 text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mx-auto mb-6 flex items-center justify-center">
            <TrendingUp className="w-16 h-16 text-purple-700" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Coming Soon!
          </h2>
          <p className="text-gray-600 font-semibold mb-8 max-w-md mx-auto">
            We're building beautiful charts to track {dogData.name}'s health trends over time.
          </p>
          
          {/* Preview Icons */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="p-4 bg-purple-100 rounded-2xl">
              <Heart className="w-8 h-8 text-purple-600" />
            </div>
            <div className="p-4 bg-pink-100 rounded-2xl">
              <Activity className="w-8 h-8 text-pink-600" />
            </div>
            <div className="p-4 bg-teal-100 rounded-2xl">
              <Calendar className="w-8 h-8 text-teal-600" />
            </div>
          </div>

          <p className="text-sm text-gray-500">
            Feature launching in Phase 3 🚀
          </p>
        </div>

        {/* Quick Stats Preview */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl shadow-lg border-2 border-white/50 p-6 text-center">
            <p className="text-sm text-gray-600 mb-2 font-semibold">Current Weight</p>
            <p className="text-3xl font-bold text-purple-900">{dogData.weight_lbs} lbs</p>
          </div>
          <div className="bg-white rounded-3xl shadow-lg border-2 border-white/50 p-6 text-center">
            <p className="text-sm text-gray-600 mb-2 font-semibold">Age</p>
            <p className="text-3xl font-bold text-purple-900">{dogData.chronological_age.toFixed(1)} yrs</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
