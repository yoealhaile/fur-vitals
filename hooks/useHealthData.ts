/**
 * useHealthData Hook
 * Fetches and manages live health data from all connected sources
 * (Google Fit, Apple Health, Dog Wearables)
 */

import { useState, useEffect } from 'react';
import {
  NormalizedHealthData,
  normalizeGoogleFitData,
  normalizeAppleHealthData,
  mergeHealthData,
  calculateReadinessScore,
  getActivityInsights,
  formatHealthDataForDashboard,
} from '@/lib/healthDataNormalizer';

interface UseHealthDataReturn {
  healthData: NormalizedHealthData | null;
  isLoading: boolean;
  error: string | null;
  readinessScore: number;
  activityInsights: ReturnType<typeof getActivityInsights> | null;
  lastSync: Date | null;
  refetch: () => Promise<void>;
  isConnected: {
    googleFit: boolean;
    appleHealth: boolean;
  };
}

export function useHealthData(
  dogBreed?: string,
  dogAge?: number
): UseHealthDataReturn {
  const [healthData, setHealthData] = useState<NormalizedHealthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState({
    googleFit: false,
    appleHealth: false,
  });

  const fetchHealthData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const sources: NormalizedHealthData[] = [];

      // Check connection status from cookies
      const googleFitConnected = typeof window !== 'undefined' && 
        document.cookie.includes('google_fit_connected=true');
      const appleHealthConnected = typeof window !== 'undefined' && 
        document.cookie.includes('apple_health_connected=true');

      setIsConnected({
        googleFit: googleFitConnected,
        appleHealth: appleHealthConnected,
      });

      // Fetch Google Fit data if connected
      if (googleFitConnected) {
        try {
          const googleResponse = await fetch('/api/health/google');
          if (googleResponse.ok) {
            const googleData = await googleResponse.json();
            if (googleData.success && googleData.data) {
              sources.push(normalizeGoogleFitData(googleData.data));
            }
          }
        } catch (err) {
          console.error('Failed to fetch Google Fit data:', err);
        }
      }

      // Fetch Apple Health data if connected
      if (appleHealthConnected) {
        try {
          const appleResponse = await fetch('/api/health/apple');
          if (appleResponse.ok) {
            const appleData = await appleResponse.json();
            if (appleData.success && appleData.data) {
              sources.push(normalizeAppleHealthData(appleData.data));
            }
          }
        } catch (err) {
          console.error('Failed to fetch Apple Health data:', err);
        }
      }

      // Merge data from all sources (prioritize most recent)
      if (sources.length > 0) {
        const merged = mergeHealthData(sources);
        setHealthData(merged);
        setLastSync(new Date(merged.timestamp));
      } else {
        // No health data available - will use mock data fallback
        setHealthData(null);
      }
    } catch (err) {
      console.error('Health data fetch error:', err);
      setError('Failed to load health data');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchHealthData();
  }, []);

  // Calculate readiness score
  const readinessScore = healthData
    ? calculateReadinessScore({
        activityMinutes: healthData.dailyActivityMinutes,
        sleepMinutes: healthData.sleepMinutes,
        heartRate: healthData.heartRate,
      })
    : 0;

  // Get activity insights if breed and age provided
  const activityInsights =
    healthData && dogBreed && dogAge
      ? getActivityInsights(
          healthData.dailyActivityMinutes,
          dogBreed,
          dogAge
        )
      : null;

  return {
    healthData,
    isLoading,
    error,
    readinessScore,
    activityInsights,
    lastSync,
    refetch: fetchHealthData,
    isConnected,
  };
}

/**
 * useHealthDataForDashboard Hook
 * Simplified hook specifically for dashboard display
 */
export function useHealthDataForDashboard() {
  const [displayData, setDisplayData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sources: NormalizedHealthData[] = [];

        // Check for Google Fit
        if (
          typeof window !== 'undefined' &&
          document.cookie.includes('google_fit_connected=true')
        ) {
          try {
            const res = await fetch('/api/health/google');
            if (res.ok) {
              const data = await res.json();
              if (data.success && data.data) {
                sources.push(normalizeGoogleFitData(data.data));
              }
            }
          } catch (err) {
            console.error('Google Fit fetch failed:', err);
          }
        }

        // Check for Apple Health
        if (
          typeof window !== 'undefined' &&
          document.cookie.includes('apple_health_connected=true')
        ) {
          try {
            const res = await fetch('/api/health/apple');
            if (res.ok) {
              const data = await res.json();
              if (data.success && data.data) {
                sources.push(normalizeAppleHealthData(data.data));
              }
            }
          } catch (err) {
            console.error('Apple Health fetch failed:', err);
          }
        }

        // Merge and format for display
        if (sources.length > 0) {
          const merged = mergeHealthData(sources);
          const formatted = formatHealthDataForDashboard(merged);
          setDisplayData(formatted);
        } else {
          setDisplayData(null); // Use mock data fallback
        }
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setDisplayData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { displayData, isLoading };
}

/**
 * Utility: Get connection status
 */
export function useConnectionStatus() {
  const [status, setStatus] = useState({
    googleFit: false,
    appleHealth: false,
    anyConnected: false,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const googleFit = document.cookie.includes('google_fit_connected=true');
      const appleHealth = document.cookie.includes('apple_health_connected=true');
      
      setStatus({
        googleFit,
        appleHealth,
        anyConnected: googleFit || appleHealth,
      });
    }
  }, []);

  return status;
}
