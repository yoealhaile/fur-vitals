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
  // Demo Mode: Default to Malcolm the Golden Retriever for external testers
  const [user, setUser] = useState<UserData | null>({
    name: 'Demo User',
    email: 'demo@furvitals.app',
    healthGoals: ['vitals', 'longevity'],
  });
  const [dogData, setDogData] = useState<DogData>(mockSensorsRaw as DogData);
  const [isOnboarded, setIsOnboarded] = useState(true); // Demo mode: pre-onboarded
  const [connectedTrackers, setConnectedTrackers] = useState<string[]>(['fitbark', 'tractive']);

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
