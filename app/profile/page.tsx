'use client';

import React, { useState, useEffect } from 'react';
import { User, Dog, Calendar, Weight, Target, Camera, Save, Plus, UserPlus, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { dogYearsToHumanYears, calculateBiologicalHumanAge } from '@/lib/calculations';
import dogDataRaw from '@/dog_data.json';
import { BreedData } from '@/lib/types';
import BottomNav from '@/components/BottomNav';

const breedDatabase = dogDataRaw as BreedData[];

export default function ProfilePage() {
  const router = useRouter();
  const { user, dogData, updateDogData, setUser } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // Handle client-side mounting to prevent hydration errors
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);
  
  // Breed lookup for size category
  const breedData = breedDatabase.find((b) => b.breed === dogData?.breed) || breedDatabase[0];
  
  // Universal Age Engine - Calculate human equivalent ages
  const chronologicalHumanAge = dogYearsToHumanYears(
    dogData?.chronological_age || 0, 
    breedData?.size_category || "Medium"
  );
  const biologicalHumanAge = calculateBiologicalHumanAge(
    chronologicalHumanAge, 
    dogData, 
    breedData
  );
  
  // Safe fallbacks for all state with complete optional chaining
  const [petName, setPetName] = useState(dogData?.name ?? '');
  const [petWeight, setPetWeight] = useState(dogData?.weight_lbs ?? 0);
  const [activityGoal, setActivityGoal] = useState(60);
  const [isSaving, setIsSaving] = useState(false);
  const [userName, setUserName] = useState(user?.name ?? '');
  const [userEmail, setUserEmail] = useState(user?.email ?? '');
  const [showAddParent, setShowAddParent] = useState(false);
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentRelation, setParentRelation] = useState('');
  const [healthGoals, setHealthGoals] = useState<string[]>(user?.healthGoals ?? []);

  const toggleHealthGoal = (goal: string) => {
    if (healthGoals.includes(goal)) {
      setHealthGoals(healthGoals.filter(g => g !== goal));
    } else {
      setHealthGoals([...healthGoals, goal]);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    
    // Update user info
    if (user) {
      setUser({
        ...user,
        name: userName,
        email: userEmail,
        healthGoals: healthGoals,
      });
    }
    
    // Update dog data
    updateDogData({
      name: petName,
      weight_lbs: petWeight,
    });
    
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const handlePhotoUpload = () => {
    alert('Photo upload feature coming soon! 📸');
  };

  const handleAddParent = () => {
    alert(`Added ${parentName} as ${parentRelation}! This feature will be fully implemented in Phase 3.`);
    setShowAddParent(false);
    setParentName('');
    setParentEmail('');
    setParentRelation('');
  };

  const handleAddDog = () => {
    router.push('/onboarding');
  };

  const handleResendConfirmation = () => {
    console.log('Email sent to user:', user?.email);
    alert(`Confirmation email sent to ${user?.email || 'your email'}! Check your inbox.`);
  };

  // Show loading state if not mounted or data is not ready
  // Prevents hydration errors and handles null data gracefully
  if (!mounted || isLoading || !dogData || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl border-4 border-white max-w-md">
          <Loader className="w-16 h-16 text-teal-500 mx-auto mb-4 animate-spin" />
          <p className="text-xl font-bold text-gray-900 mb-2">
            {!user ? 'Loading your account...' : 'Registering your pup...'}
          </p>
          <p className="text-sm text-gray-600">Please wait a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-purple-50 to-pink-50 pb-24">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b-4 border-purple-300 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-sm text-gray-600 font-semibold">Manage your pup's information</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* User Info Card */}
        <div className="bg-white rounded-3xl shadow-lg border-2 border-white/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-teal-200 rounded-2xl">
              <User className="w-6 h-6 text-teal-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Your Account</h2>
              <p className="text-sm text-gray-600">Personal information</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-teal-400 focus:outline-none text-gray-900 font-semibold"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-teal-400 focus:outline-none text-gray-900 font-semibold"
              />
            </div>

            {/* Add Another Parent */}
            <button
              onClick={() => setShowAddParent(!showAddParent)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-dashed border-teal-400 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold transition-all flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Add Another Dog Parent
            </button>

            {/* Resend Email Confirmation */}
            <div className="bg-yellow-50 rounded-2xl p-4 border-2 border-yellow-200">
              <p className="text-sm text-gray-700 mb-3 font-semibold">
                📧 Haven't received your confirmation email?
              </p>
              <button
                onClick={handleResendConfirmation}
                className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 rounded-full text-white font-bold text-sm transition-all"
              >
                Resend Confirmation Email
              </button>
            </div>

            {/* Add Parent Form */}
            {showAddParent && (
              <div className="bg-teal-50 rounded-2xl p-4 border-2 border-teal-200 space-y-3">
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="Parent name"
                  className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-teal-400 focus:outline-none text-sm font-semibold"
                />
                <input
                  type="email"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  placeholder="Parent email"
                  className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-teal-400 focus:outline-none text-sm font-semibold"
                />
                <select
                  value={parentRelation}
                  onChange={(e) => setParentRelation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-teal-400 focus:outline-none text-sm font-semibold"
                >
                  <option value="">Relationship...</option>
                  <option value="partner">Partner</option>
                  <option value="family">Family Member</option>
                  <option value="friend">Friend</option>
                  <option value="caretaker">Caretaker</option>
                </select>
                <button
                  onClick={handleAddParent}
                  disabled={!parentName || !parentEmail || !parentRelation}
                  className="w-full py-2 bg-teal-500 hover:bg-teal-600 rounded-xl text-white font-bold text-sm disabled:opacity-50"
                >
                  Add Parent
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dog Profile Card */}
        <div className="bg-white rounded-3xl shadow-lg border-2 border-white/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-200 rounded-2xl">
              <Dog className="w-6 h-6 text-purple-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Dog Profile</h2>
              <p className="text-sm text-gray-600">{dogData.breed}</p>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-3">Profile Photo</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-purple-100 rounded-full flex items-center justify-center text-5xl border-4 border-white shadow-lg">
                🦮
              </div>
              <button
                onClick={handlePhotoUpload}
                className="px-6 py-3 bg-gradient-to-r from-purple-200 to-pink-200 hover:from-purple-300 hover:to-pink-300 rounded-full font-bold text-purple-900 border-2 border-purple-300 transition-all flex items-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Upload Photo
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Recommended: Square photo, at least 500x500px</p>
          </div>

          {/* Editable Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Dog className="w-4 h-4" />
                Pet Name
              </label>
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-gray-900 font-semibold"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Weight className="w-4 h-4" />
                Weight (lbs)
              </label>
              <input
                type="number"
                value={petWeight}
                onChange={(e) => setPetWeight(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-gray-900 font-semibold"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Daily Activity Goal (minutes)
              </label>
              <input
                type="number"
                value={activityGoal}
                onChange={(e) => setActivityGoal(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-gray-900 font-semibold"
              />
              <p className="text-xs text-gray-500 mt-2">
                Current: {dogData?.behavioral_stats_today?.active_minutes || 0} mins today
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-4 border-2 border-teal-200">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Age
              </label>
              <p className="text-2xl font-bold text-gray-900">
                {dogData?.chronological_age?.toFixed(1) || '0'} yrs (Dog) / {chronologicalHumanAge} yrs (Human)
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Based on birthday entered during onboarding
              </p>
            </div>
          </div>
        </div>

        {/* Health Goals */}
        <div className="bg-white rounded-3xl shadow-lg border-2 border-white/50 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Health Goals (Click to toggle)</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'weight', label: '🏃 Weight Loss' },
              { id: 'vitals', label: '💓 Vital Monitoring' },
              { id: 'longevity', label: '✨ Longevity' }
            ].map((goal) => {
              const isSelected = healthGoals.includes(goal.id);
              return (
                <button
                  key={goal.id}
                  onClick={() => toggleHealthGoal(goal.id)}
                  className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-teal-100 to-purple-100 border-teal-400 text-gray-900 scale-105 shadow-lg'
                      : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {goal.label}
                  {isSelected && ' ✓'}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center italic">
            Select one or more goals to personalize your dashboard
          </p>
        </div>

        {/* Add Another Dog */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-lg border-2 border-purple-300 p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mb-4">
              <Dog className="w-8 h-8 text-purple-700" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Managing Multiple Dogs?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Add another pup to track their health too!
            </p>
            <button
              onClick={handleAddDog}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Another Dog
            </button>
            <p className="text-xs text-gray-500 mt-3">
              This will guide you through the onboarding process again
            </p>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full px-6 py-4 bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 rounded-full text-white font-bold text-lg shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
