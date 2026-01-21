'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Heart } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* Animated Dog Icon */}
        <div className="mb-8 animate-bounce">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-teal-400 to-purple-400 rounded-full shadow-2xl">
            <span className="text-7xl">🐕</span>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Oops! This pup wandered off the path 🐾
          </h2>
          <p className="text-lg text-gray-700 mb-2">
            The page you're looking for doesn't exist.
          </p>
          <p className="text-md text-gray-600">
            Let's get you back to the pack!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 rounded-full text-white font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 hover:scale-105"
          >
            <Home className="w-6 h-6" />
            Back to Dashboard
          </Link>
          
          <Link
            href="/onboarding"
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 rounded-full text-gray-900 font-bold text-lg shadow-xl border-2 border-gray-200 transition-all flex items-center justify-center gap-3 hover:scale-105"
          >
            <Heart className="w-6 h-6 text-teal-500" />
            Start Fresh
          </Link>
        </div>

        {/* Cute Footer Message */}
        <div className="mt-12 p-6 bg-white/60 rounded-3xl border-2 border-white shadow-lg">
          <p className="text-sm text-gray-600 font-semibold">
            💡 <strong>Did you know?</strong> Dogs can smell emotions! Malcolm would never get lost—he'd follow the scent of treats back home. 🦴
          </p>
        </div>

        {/* FurVitals Branding */}
        <div className="mt-8">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-100 to-purple-100 rounded-full border-2 border-white shadow-md">
            <Heart className="w-5 h-5 text-teal-600" />
            <span className="text-sm font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
              FurVitals
            </span>
            <span className="text-sm text-gray-600">• Your Pet's Health BFF</span>
          </div>
        </div>
      </div>
    </div>
  );
}
