'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DogData } from '@/lib/types';
import mockSensorsRaw from '@/MOCK_SENSORS.json';

interface UserData {
  name: string;
  email: string;
  healthGoals: string[];
  connectedTrackers?: string[]; // Fitness trackers (FitBark, Whistle, etc.)
}

interface AppContextType {
  user: UserData | null;
  dogData: DogData;
  setUser: (user: UserData) => void;
  updateDogData: (updates: Partial<DogData>) => void;
  isOnboarded: boolean;
  completeOnboarding: () => void;
  connectedTrackers: string[];
  setConnectedTrackers: (trackers: string[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage or use demo mode as fallback
  const [user, setUser] = useState<UserData | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('furvitals_user');
      if (savedUser) return JSON.parse(savedUser);
    }
    // Demo Mode fallback: Malcolm the Golden Retriever for external testers
    return {
      name: 'Demo User',
      email: 'demo@furvitals.app',
      healthGoals: ['vitals', 'longevity'],
    };
  });
  
  const [dogData, setDogData] = useState<DogData>(mockSensorsRaw as DogData);
  
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const onboardingComplete = localStorage.getItem('onboardingComplete');
      // If localStorage has explicit value, use it
      if (onboardingComplete !== null) {
        return onboardingComplete === 'true';
      }
    }
    // Demo mode: Show Malcolm immediately for external visitors
    return true;
  });
  
  const [connectedTrackers, setConnectedTrackers] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('connectedTrackers');
      if (saved) return JSON.parse(saved);
    }
    return ['fitbark', 'tractive']; // Demo mode default
  });

  const updateDogData = (updates: Partial<DogData>) => {
    setDogData((prev) => ({ ...prev, ...updates }));
  };

  const completeOnboarding = () => {
    setIsOnboarded(true);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        dogData,
        setUser,
        updateDogData,
        isOnboarded,
        completeOnboarding,
        connectedTrackers,
        setConnectedTrackers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
