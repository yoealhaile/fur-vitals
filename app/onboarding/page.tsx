'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Heart, Sparkles, Target, TrendingDown, Activity, Loader, CheckCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import dogDataRaw from '@/dog_data.json';

export default function OnboardingPage() {
  const router = useRouter();
  const { setUser, updateDogData, completeOnboarding, setConnectedTrackers: setGlobalTrackers } = useApp();
  const [step, setStep] = useState(1);
  
  // Form state
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [petName, setPetName] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [petBirthday, setPetBirthday] = useState('');
  const [petWeight, setPetWeight] = useState('');
  const [petPastWeight, setPetPastWeight] = useState('');
  const [petPastWeightAge, setPetPastWeightAge] = useState('6'); // months
  const [petGender, setPetGender] = useState('');
  const [isNeutered, setIsNeutered] = useState(false);
  const [healthGoals, setHealthGoals] = useState<string[]>([]);
  const [selectedTrackers, setSelectedTrackers] = useState<string[]>([]);
  const [trackerConnecting, setTrackerConnecting] = useState('');
  const [connectedTrackers, setConnectedTrackers] = useState<string[]>([]);
  const [vaccines, setVaccines] = useState<Array<{name: string; date: string}>>([]);
  const [vaccineErrors, setVaccineErrors] = useState<Record<number, string>>({});
  const [microchipNumber, setMicrochipNumber] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Validate email
  const validateEmail = (email: string): boolean => {
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const breeds = dogDataRaw.map((d: any) => d.breed).sort();

  const goals = [
    { id: 'weight', icon: TrendingDown, label: 'Weight Loss', color: 'from-rose-200 to-pink-200' },
    { id: 'vitals', icon: Activity, label: 'Vital Monitoring', color: 'from-cyan-200 to-teal-200' },
    { id: 'longevity', icon: Sparkles, label: 'Longevity', color: 'from-purple-200 to-indigo-200' },
  ];

  const toggleGoal = (goalId: string) => {
    setHealthGoals((prev) =>
      prev.includes(goalId) ? prev.filter((g) => g !== goalId) : [...prev, goalId]
    );
  };

  const calculateAge = (birthday: string) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    const ageInDays = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
    return ageInDays / 365.25; // Returns age in years
  };

  const handleNext = () => {
    // Validate email on step 1 before proceeding
    if (step === 1 && !validateEmail(userEmail)) {
      return;
    }
    
    if (step < 6) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const addVaccine = () => {
    setVaccines([...vaccines, { name: '', date: '' }]);
  };

  const updateVaccine = (index: number, field: 'name' | 'date', value: string) => {
    const updated = [...vaccines];
    updated[index][field] = value;
    setVaccines(updated);

    // Validate date
    if (field === 'date' && value && petBirthday) {
      const vaccineDate = new Date(value);
      const birthDate = new Date(petBirthday);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
      
      // Check if date is in the future
      if (vaccineDate > today) {
        setVaccineErrors(prev => ({
          ...prev,
          [index]: 'Vaccination date cannot be in the future. 🐾'
        }));
        return;
      }
      
      if (vaccineDate < birthDate) {
        setVaccineErrors(prev => ({
          ...prev,
          [index]: `Oops! ${petName || 'Your pup'} wasn't born yet on that date. 🐾`
        }));
      } else {
        setVaccineErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[index];
          return newErrors;
        });
      }
    }
  };

  const removeVaccine = (index: number) => {
    setVaccines(vaccines.filter((_, i) => i !== index));
  };

  const toggleTrackerSelection = (tracker: string) => {
    if (selectedTrackers.includes(tracker)) {
      setSelectedTrackers(selectedTrackers.filter(t => t !== tracker));
    } else {
      setSelectedTrackers([...selectedTrackers, tracker]);
    }
  };

  const handleConnectTracker = (tracker: string) => {
    setTrackerConnecting(tracker);
    // Simulate API connection
    setTimeout(() => {
      setTrackerConnecting('');
      setConnectedTrackers([...connectedTrackers, tracker]);
    }, 2000);
  };

  const handleComplete = () => {
    // Save user data with connected trackers
    setUser({
      name: userName,
      email: userEmail,
      healthGoals,
      connectedTrackers: connectedTrackers,
    });

    // Save connected trackers to global state
    setGlobalTrackers(connectedTrackers);

    // Build medical records from vaccines
    const medicalRecords = vaccines.length > 0 ? {
      vaccines: vaccines.map(v => ({ ...v, status: 'completed' })),
      upcoming_reminders: []
    } : undefined;

    // Build growth history with 3 data points for Malcolm (Beagle example)
    const growthHistory = [];
    
    // Point 1: 6 months - 8 lbs (from past weight if entered)
    if (petPastWeight && petPastWeightAge) {
      const pastAgeMonths = Number(petPastWeightAge);
      growthHistory.push({
        age_months: pastAgeMonths,
        weight_lbs: Number(petPastWeight)
      });
    }
    
    // Point 2: 12 months - 15 lbs (intermediate point if age > 12 months)
    if (petBirthday && petWeight) {
      const currentAgeYears = calculateAge(petBirthday);
      const currentAgeMonths = Math.round(currentAgeYears * 12);
      
      // If dog is older than 12 months, add 12-month data point
      if (currentAgeMonths > 12 && petPastWeight) {
        const monthsBetween = 12 - Number(petPastWeightAge);
        const weightDiff = Number(petWeight) - Number(petPastWeight);
        const weightPerMonth = weightDiff / (currentAgeMonths - Number(petPastWeightAge));
        const weight12mo = Number(petPastWeight) + (weightPerMonth * monthsBetween);
        
        growthHistory.push({
          age_months: 12,
          weight_lbs: Math.round(weight12mo)
        });
      }
      
      // Point 3: Current age/weight
      growthHistory.push({
        age_months: currentAgeMonths,
        weight_lbs: Number(petWeight)
      });
    }

    // Update dog data
    updateDogData({
      name: petName,
      breed: petBreed,
      chronological_age: petBirthday ? calculateAge(petBirthday) : 0,
      weight_lbs: Number(petWeight) || 0,
      ...(medicalRecords && { medical_records: medicalRecords }),
      ...(growthHistory.length > 0 && { growth_history: growthHistory })
    });

    completeOnboarding();
    
    // Save to localStorage for persistence across sessions
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboardingComplete', 'true');
      localStorage.setItem('furvitals_user', JSON.stringify({
        name: userName,
        email: userEmail,
        healthGoals,
        connectedTrackers: connectedTrackers,
      }));
      localStorage.setItem('connectedTrackers', JSON.stringify(connectedTrackers));
    }
    
    // Show email verification popup only once
    if (!emailSent) {
      setEmailSent(true);
      alert(`✅ Check your inbox! We sent a verification link to ${userEmail}.`);
    }
    
    router.push('/');
  };

  const progress = (step / 6) * 100;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const [direction, setDirection] = useState(0);

  const goToNext = () => {
    setDirection(1);
    handleNext();
  };

  const goToBack = () => {
    setDirection(-1);
    handleBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Walking Dog Progress Bar */}
      <div className="w-full bg-white/80 backdrop-blur-sm border-b-4 border-teal-300 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            {/* Progress Bar */}
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-teal-400 to-purple-400"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            {/* Walking Dog Icon */}
            <motion.div
              className="absolute -top-2 transform -translate-x-1/2"
              initial={{ left: '0%' }}
              animate={{ left: `${progress}%` }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-4xl animate-bounce">
                🐕
              </div>
            </motion.div>
          </div>
          <p className="text-center mt-3 text-sm font-bold text-gray-700">
            Step {step} of 6
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl shadow-2xl border-4 border-white p-8"
            >
              {/* Step 1: Who are you? */}
              {step === 1 && (
                <div>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-200 to-cyan-200 rounded-full mb-4">
                      <Heart className="w-10 h-10 text-teal-700" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      Who are you?
                    </h2>
                    <p className="text-gray-600 font-semibold">Let's get to know you first!</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="e.g., Sarah"
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-teal-400 focus:outline-none text-gray-900 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => {
                          setUserEmail(e.target.value);
                          setEmailError(''); // Clear error on change
                        }}
                        placeholder="e.g., sarah@example.com"
                        className={`w-full px-4 py-3 rounded-2xl border-2 ${emailError ? 'border-red-400' : 'border-gray-200'} focus:border-teal-400 focus:outline-none text-gray-900 font-semibold`}
                      />
                      {emailError && (
                        <p className="text-sm font-bold mt-2" style={{ color: '#F87171' }}>
                          {emailError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Meet your Best Friend */}
              {step === 2 && (
                <div>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mb-4">
                      <Sparkles className="w-10 h-10 text-purple-700" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                      Meet your Best Friend
                    </h2>
                    <p className="text-gray-600 font-semibold">Tell us about your pup!</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Pet Name
                      </label>
                      <input
                        type="text"
                        value={petName}
                        onChange={(e) => setPetName(e.target.value)}
                        placeholder="e.g., Max"
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-gray-900 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Breed
                      </label>
                      <select
                        value={petBreed}
                        onChange={(e) => setPetBreed(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-gray-900 font-semibold"
                      >
                        <option value="">Select a breed...</option>
                        {breeds.map((breed) => (
                          <option key={breed} value={breed}>
                            {breed}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Birthday
                      </label>
                      <input
                        type="date"
                        value={petBirthday}
                        onChange={(e) => setPetBirthday(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-gray-900 font-semibold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Health Goals */}
              {step === 3 && (
                <div>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full mb-4">
                      <Target className="w-10 h-10 text-yellow-700" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
                      Health Goals
                    </h2>
                    <p className="text-gray-600 font-semibold">What matters most to you?</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {goals.map((goal) => {
                      const Icon = goal.icon;
                      const isSelected = healthGoals.includes(goal.id);
                      return (
                        <button
                          key={goal.id}
                          onClick={() => toggleGoal(goal.id)}
                          className={`p-6 rounded-3xl border-4 transition-all ${
                            isSelected
                              ? 'border-teal-500 bg-gradient-to-br ' + goal.color + ' scale-105 shadow-xl'
                              : 'border-gray-200 bg-white hover:border-gray-300 hover:scale-102'
                          }`}
                        >
                          <div className="flex flex-col items-center text-center">
                            <Icon
                              className={`w-12 h-12 mb-3 ${
                                isSelected ? 'text-teal-700' : 'text-gray-400'
                              }`}
                            />
                            <p className={`font-bold ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                              {goal.label}
                            </p>
                            {isSelected && (
                              <div className="mt-2 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xl">✓</span>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Select all that apply
                  </p>
                </div>
              )}

              {/* Step 4: Additional Pet Details */}
              {step === 4 && (
                <div>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full mb-4">
                      <Heart className="w-10 h-10 text-pink-700" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
                      A Few More Details
                    </h2>
                    <p className="text-gray-600 font-semibold">Help us personalize {petName}'s experience</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Current Weight (lbs)
                        </label>
                        <input
                          type="number"
                          value={petWeight}
                          onChange={(e) => setPetWeight(e.target.value)}
                          placeholder="e.g., 72"
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none text-gray-900 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Gender
                        </label>
                        <select
                          value={petGender}
                          onChange={(e) => setPetGender(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none text-gray-900 font-semibold"
                        >
                          <option value="">Select...</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Past Weight for Growth Tracking */}
                    <div className="bg-pink-50 rounded-2xl p-4 border-2 border-pink-200">
                      <p className="text-xs font-bold text-pink-800 mb-3">
                        📊 Optional: Add a past weight to track growth
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            Weight at age
                          </label>
                          <select
                            value={petPastWeightAge}
                            onChange={(e) => setPetPastWeightAge(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none text-sm font-semibold"
                          >
                            <option value="2">2 months</option>
                            <option value="6">6 months</option>
                            <option value="12">1 year</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            Weight (lbs)
                          </label>
                          <input
                            type="number"
                            value={petPastWeight}
                            onChange={(e) => setPetPastWeight(e.target.value)}
                            placeholder="e.g., 45"
                            className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none text-sm font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="bg-pink-50 rounded-2xl p-4 border-2 border-pink-200">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isNeutered}
                          onChange={(e) => setIsNeutered(e.target.checked)}
                          className="w-5 h-5 rounded border-2 border-gray-300 text-pink-600 focus:ring-pink-500"
                        />
                        <span className="text-sm font-bold text-gray-800">
                          {petGender === 'female' ? 'Spayed' : 'Neutered'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Vaccination Records */}
              {step === 5 && (
                <div>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-200 to-blue-200 rounded-full mb-4">
                      <span className="text-4xl">💉</span>
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
                      Vaccination Records
                    </h2>
                    <p className="text-gray-600 font-semibold">Add {petName}'s vaccine history (optional)</p>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {vaccines.map((vaccine, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={vaccine.name}
                            onChange={(e) => updateVaccine(idx, 'name', e.target.value)}
                            placeholder="Vaccine name (e.g., Rabies)"
                            className="px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-cyan-400 focus:outline-none text-sm font-semibold"
                          />
                          <input
                            type="date"
                            value={vaccine.date}
                            onChange={(e) => updateVaccine(idx, 'date', e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className={`px-3 py-2 rounded-xl border-2 ${
                              vaccineErrors[idx] ? 'border-red-400' : 'border-gray-200'
                            } focus:border-cyan-400 focus:outline-none text-sm font-semibold`}
                          />
                        </div>
                        {vaccineErrors[idx] && (
                          <p className="text-xs font-bold mt-2" style={{ color: '#F87171' }}>
                            {vaccineErrors[idx]}
                          </p>
                        )}
                        <button
                          onClick={() => removeVaccine(idx)}
                          className="mt-2 text-xs text-red-600 hover:text-red-700 font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addVaccine}
                      className="w-full py-3 rounded-2xl border-2 border-dashed border-cyan-400 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 font-bold transition-all"
                    >
                      + Add Vaccine
                    </button>
                  </div>
                  <p className="text-center text-xs text-gray-500 mt-4">
                    You can also skip and add these later in the Medical tab
                  </p>
                </div>
              )}

              {/* Step 6: Microchip & Fitness Tracker */}
              {step === 6 && (
                <div>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full mb-4">
                      <span className="text-4xl">🔖</span>
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                      Final Details
                    </h2>
                    <p className="text-gray-600 font-semibold">Microchip & tracker setup (optional)</p>
                  </div>

                  <div className="space-y-6">
                    {/* Microchip */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Microchip Number
                      </label>
                      <input
                        type="text"
                        value={microchipNumber}
                        onChange={(e) => setMicrochipNumber(e.target.value)}
                        placeholder="e.g., 123-456-789"
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-green-400 focus:outline-none text-gray-900 font-semibold"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Found on your dog's paperwork or vet records
                      </p>
                    </div>

                    {/* Fitness Tracker Selection */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Fitness Trackers (Select Multiple)
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {['FitBark', 'Whistle', 'Tractive'].map((tracker) => {
                          const isConnected = connectedTrackers.includes(tracker);
                          const isSelected = selectedTrackers.includes(tracker);
                          const isConnecting = trackerConnecting === tracker;
                          return (
                            <div key={tracker} className="space-y-2">
                              <button
                                onClick={() => !isConnected && toggleTrackerSelection(tracker)}
                                disabled={isConnected}
                                className={`w-full p-4 rounded-2xl border-2 transition-all ${
                                  isConnected
                                    ? 'border-green-500 bg-green-100 shadow-lg cursor-default'
                                    : isSelected
                                    ? 'border-green-300 bg-green-50'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                              >
                                <div className="text-2xl mb-2">
                                  {tracker === 'FitBark' && '🐾'}
                                  {tracker === 'Whistle' && '📍'}
                                  {tracker === 'Tractive' && '🛰️'}
                                </div>
                                <p className={`text-xs font-bold ${isConnected ? 'text-green-700' : 'text-gray-600'}`}>
                                  {tracker}
                                </p>
                              </button>
                              {isSelected && !isConnected && (
                                <button
                                  onClick={() => handleConnectTracker(tracker)}
                                  disabled={isConnecting}
                                  className="w-full py-2 px-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 rounded-full text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
                                >
                                  {isConnecting ? (
                                    <>
                                      <Loader className="w-3 h-3 animate-spin" />
                                      Verifying...
                                    </>
                                  ) : (
                                    'Connect Now'
                                  )}
                                </button>
                              )}
                              {isConnected && (
                                <div className="w-full py-2 px-3 bg-green-600 rounded-full text-white font-bold text-xs text-center flex items-center justify-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Connected
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {connectedTrackers.length > 0 && (
                        <p className="text-xs text-green-700 font-bold mt-3 text-center">
                          ✓ {connectedTrackers.length} tracker{connectedTrackers.length > 1 ? 's' : ''} connected
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        You can also connect later in the Sync Center
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-8">
                {step > 1 && (
                  <button
                    onClick={goToBack}
                    className="flex-1 px-6 py-3 rounded-full border-2 border-gray-300 text-gray-700 font-bold hover:border-gray-400 transition-all"
                  >
                    Back
                  </button>
                )}
                {step < 6 ? (
                  <button
                    onClick={goToNext}
                    disabled={
                      (step === 1 && (!userName || !userEmail)) ||
                      (step === 2 && (!petName || !petBreed || !petBirthday)) ||
                      (step === 3 && healthGoals.length === 0) ||
                      (step === 4 && (!petWeight || !petGender))
                    }
                    className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-teal-500 to-purple-500 text-white font-bold hover:from-teal-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={handleComplete}
                    className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-teal-500 to-purple-500 text-white font-bold hover:from-teal-600 hover:to-purple-600 transition-all shadow-lg"
                  >
                    Complete Setup! 🎉
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
