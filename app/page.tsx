'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, Sparkles, Star } from 'lucide-react';
import ReadinessGauge from '@/components/ReadinessGauge';
import VitalsCard from '@/components/VitalsCard';
import BiologicalAgeCard from '@/components/BiologicalAgeCard';
import InsightsFeed from '@/components/InsightsFeed';
import ActivityChart from '@/components/ActivityChart';
import DogAvatar from '@/components/DogAvatar';
import ActivityLog from '@/components/ActivityLog';
import GrowthChart from '@/components/GrowthChart';
import VetExport from '@/components/VetExport';
import VaccineTracker from '@/components/VaccineTracker';
import WellnessRecommendations from '@/components/WellnessRecommendations';
import ActionBubbles from '@/components/ActionBubbles';
import ActivityBubbles from '@/components/ActivityBubbles';
import ActivityBarChart from '@/components/ActivityBarChart';
import GrowthPercentileChart from '@/components/GrowthPercentileChart';
import BottomNav from '@/components/BottomNav';
import { calculateHealthMetrics, isSenior } from '@/lib/calculations';
import dogDataRaw from '@/dog_data.json';
import { BreedData } from '@/lib/types';
import { useApp } from '@/context/AppContext';

const breedDatabase = dogDataRaw as BreedData[];

export default function Home() {
  const router = useRouter();
  const { dogData, user, isOnboarded } = useApp();

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (!isOnboarded && typeof window !== 'undefined') {
      router.push('/onboarding');
    }
  }, [isOnboarded, router]);
  // Null checks for critical data
  if (!dogData || !dogData.breed || !dogData.name) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold text-lg mb-2">Missing Dog Data</p>
          <p className="text-sm text-gray-600">
            Please check that MOCK_SENSORS.json contains valid dog information.
          </p>
        </div>
      </div>
    );
  }

  // Find breed data for the dog
  const breedData = breedDatabase.find(
    (breed) => breed.breed === dogData.breed
  );

  if (!breedData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <Heart className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <p className="text-amber-600 font-semibold text-lg mb-2">Breed Not Found</p>
          <p className="text-sm text-gray-600 mb-4">
            Could not find breed data for: <strong>{dogData.breed}</strong>
          </p>
          <p className="text-xs text-gray-500">
            Using default "Medium" breed baseline values for calculations.
          </p>
        </div>
      </div>
    );
  }

  // Calculate all health metrics
  const metrics = calculateHealthMetrics(dogData, breedData);
  const seniorStatus = isSenior(dogData, breedData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b-4 border-teal-300 sticky top-0 z-10 playful-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-2xl shadow-lg animate-wiggle">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
                  FurVitals
                </h1>
                <p className="text-sm text-gray-600 font-semibold">Your Pet's Health Dashboard 🐾</p>
              </div>
            </div>
            <Link href="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
              <DogAvatar breed={dogData.breed} name={dogData.name} size="small" />
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{dogData?.name || 'Unknown'}</p>
                <p className="text-xs text-gray-600">
                  {breedData?.breed || 'Unknown'} • {dogData?.chronological_age?.toFixed(1) || 'N/A'} yrs (Dog) / {metrics.chronologicalHumanAge} yrs (Human)
                </p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {/* Activity Bubbles - Top of Dashboard */}
        <ActivityBubbles dogData={dogData} />
        {/* Hero Section with Avatar */}
        <div className="mb-8 text-center">
          <DogAvatar breed={dogData.breed} name={dogData.name} size="large" />
          <div className="mt-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-6 h-6 text-yellow-500 animate-wiggle" />
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Good Morning, {dogData?.name || 'Friend'}!
              </h2>
              <Star className="w-6 h-6 text-yellow-500 animate-wiggle" />
            </div>
            <p className="text-gray-700 font-medium">
              Here's your health snapshot for{' '}
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })} ✨
            </p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Readiness & Vaccine Tracker */}
          <div className="lg:col-span-1 space-y-6">
            <ReadinessGauge
              score={metrics.readinessScore}
              sleepScore={metrics.sleepScore}
              hrvScore={metrics.hrvRecovery}
              activityScore={metrics.activityBalance}
            />
            <VaccineTracker dogData={dogData} />
          </div>

          {/* Middle Column - Vitals & Bio Age */}
          <div className="lg:col-span-1 space-y-6">
            <VitalsCard vitals={dogData?.current_vitals} dogName={dogData?.name || 'Friend'} />
            <BiologicalAgeCard
              chronologicalAge={dogData?.chronological_age || 0}
              biologicalAge={metrics?.biologicalAge || 0}
              isSenior={seniorStatus}
              dogData={dogData}
              breedData={breedData}
            />
          </div>

          {/* Right Column - Insights & Vet Export */}
          <div className="lg:col-span-1 space-y-6">
            <InsightsFeed 
              alerts={metrics.alerts} 
              dogData={dogData}
              breedData={breedData}
              biologicalAge={metrics.biologicalAge}
            />
            <VetExport dogData={dogData} breedData={breedData} metrics={metrics} />
          </div>
        </div>

        {/* Growth Percentile Chart - Full Width */}
        <div className="mt-6">
          <GrowthPercentileChart dogData={dogData} breedData={breedData} />
        </div>

        {/* Activity Bar Chart - Full Width */}
        <div className="mt-6">
          <ActivityBarChart 
            dogData={dogData}
            targetMinutes={breedData?.activity_budget_mins || 60}
          />
        </div>

        {/* Wellness Recommendations - Full Width */}
        <div className="mt-6">
          <WellnessRecommendations 
            dogData={dogData}
            breedData={breedData}
            biologicalAge={metrics.biologicalAge}
          />
        </div>

        {/* Breed-Specific Health Risks */}
        <div className="mt-6 bubble-card bg-gradient-to-br from-lavender-50 to-purple-50 p-6 playful-shadow">
          <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
            <span>🩺</span> {breedData?.breed || 'Unknown'} Health Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-bold text-purple-700 mb-2">
                Common Health Risks
              </p>
              <div className="flex flex-wrap gap-2">
                {(breedData?.common_risks && breedData.common_risks.length > 0) ? (
                  breedData.common_risks.map((risk) => (
                    <span
                      key={risk}
                      className="px-3 py-2 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full border-2 border-orange-300"
                    >
                      {risk}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500 italic">N/A</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-purple-700 mb-2">
                Breed-Specific Notes
              </p>
              <p className="text-sm text-gray-700 bg-white/60 p-3 rounded-xl border-2 border-white">
                {breedData?.vitals_logic || 'N/A'}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t-2 border-purple-200 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-xs text-purple-600 font-semibold mb-1">Size</p>
              <p className="text-base font-bold text-purple-900">
                {breedData?.size_category || 'N/A'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-purple-600 font-semibold mb-1">Energy</p>
              <p className="text-base font-bold text-purple-900">
                {breedData?.energy_level ? `⚡ ${breedData.energy_level}/5` : 'N/A'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-purple-600 font-semibold mb-1">Activity Goal</p>
              <p className="text-base font-bold text-purple-900">
                {breedData?.activity_budget_mins ? `${breedData.activity_budget_mins} min` : 'N/A'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-purple-600 font-semibold mb-1">Lifespan</p>
              <p className="text-base font-bold text-purple-900">
                {breedData?.lifespan_range && breedData.lifespan_range.length === 2 
                  ? `${breedData.lifespan_range[0]}-${breedData.lifespan_range[1]} yrs`
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center pb-8">
          <div className="inline-block px-8 py-4 bg-gradient-to-r from-teal-100 to-purple-100 rounded-full border-2 border-white playful-shadow">
            <p className="text-sm font-bold text-gray-800">
              🐾 FurVitals • Your Dog's Health BFF
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Made with 💜 for happy, healthy pups
            </p>
          </div>
        </footer>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
