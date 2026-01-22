/**
 * Health Data Normalization Utilities
 * Converts data from different sources (Google Fit, Apple Health, FitBark, etc.)
 * into a unified format for the FurVitals dashboard
 */

export interface NormalizedHealthData {
  dailyActivityMinutes: number;
  steps: number;
  heartRate?: number;
  sleepMinutes?: number;
  date: string;
  timestamp: string;
  source: 'google_fit' | 'apple_health' | 'fitbark' | 'tractive' | 'whistle' | 'manual';
  deviceId?: string;
}

export interface ReadinessScoreInputs {
  activityMinutes: number;
  sleepMinutes?: number;
  heartRate?: number;
  hrv?: number;
}

/**
 * Normalize Google Fit data
 */
export function normalizeGoogleFitData(data: any): NormalizedHealthData {
  return {
    dailyActivityMinutes: data.activeMinutes || 0,
    steps: data.steps || 0,
    heartRate: data.heartRate || undefined,
    sleepMinutes: data.sleep || undefined,
    date: new Date(data.timestamp).toISOString().split('T')[0],
    timestamp: data.timestamp,
    source: 'google_fit',
    deviceId: data.deviceId,
  };
}

/**
 * Normalize Apple Health data
 */
export function normalizeAppleHealthData(data: any): NormalizedHealthData {
  return {
    dailyActivityMinutes: data.activeMinutes || 0,
    steps: data.steps || 0,
    heartRate: data.heartRate || undefined,
    sleepMinutes: data.sleep || undefined,
    date: data.date,
    timestamp: data.timestamp,
    source: 'apple_health',
    deviceId: data.deviceId,
  };
}

/**
 * Normalize FitBark data
 */
export function normalizeFitBarkData(data: any): NormalizedHealthData {
  return {
    dailyActivityMinutes: data.activity?.minutes || 0,
    steps: data.activity?.steps || 0,
    heartRate: data.vitals?.heartRate || undefined,
    sleepMinutes: data.sleep?.totalMinutes || undefined,
    date: data.date || new Date().toISOString().split('T')[0],
    timestamp: data.timestamp || new Date().toISOString(),
    source: 'fitbark',
    deviceId: data.deviceId,
  };
}

/**
 * Calculate Readiness Score from normalized health data
 * Formula: (Activity × 40%) + (Sleep × 30%) + (HRV × 30%)
 */
export function calculateReadinessScore(inputs: ReadinessScoreInputs): number {
  const {
    activityMinutes,
    sleepMinutes = 480, // Default 8 hours
    heartRate = 70,
    hrv = 50,
  } = inputs;

  // Normalize each metric to 0-100 scale
  const activityScore = Math.min((activityMinutes / 60) * 100, 100); // 60 min = 100%
  const sleepScore = Math.min((sleepMinutes / 480) * 100, 100); // 8 hours = 100%
  const hrvScore = Math.min((hrv / 100) * 100, 100); // 100 HRV = 100%

  // Weighted formula
  const readinessScore = 
    (activityScore * 0.4) + 
    (sleepScore * 0.3) + 
    (hrvScore * 0.3);

  return Math.round(readinessScore);
}

/**
 * Determine readiness level based on score
 */
export function getReadinessLevel(score: number): {
  label: string;
  color: string;
  icon: string;
} {
  if (score >= 85) {
    return { label: 'Optimal', color: 'text-green-600', icon: '🌟' };
  } else if (score >= 70) {
    return { label: 'Good', color: 'text-blue-600', icon: '✅' };
  } else if (score >= 50) {
    return { label: 'Fair', color: 'text-yellow-600', icon: '⚠️' };
  } else {
    return { label: 'Needs Attention', color: 'text-red-600', icon: '🚨' };
  }
}

/**
 * Merge data from multiple sources (prioritize most recent)
 */
export function mergeHealthData(
  sources: NormalizedHealthData[]
): NormalizedHealthData {
  if (sources.length === 0) {
    throw new Error('No health data sources provided');
  }

  // Sort by timestamp (most recent first)
  const sorted = sources.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Use most recent source as base
  const merged = { ...sorted[0] };

  // Fill in missing values from other sources
  for (const source of sorted.slice(1)) {
    if (!merged.heartRate && source.heartRate) {
      merged.heartRate = source.heartRate;
    }
    if (!merged.sleepMinutes && source.sleepMinutes) {
      merged.sleepMinutes = source.sleepMinutes;
    }
  }

  return merged;
}

/**
 * Convert activity minutes to dog-specific insights
 */
export function getActivityInsights(
  activityMinutes: number,
  dogBreed: string,
  dogAge: number
): {
  status: string;
  recommendation: string;
  targetMinutes: number;
} {
  // Breed-specific activity targets (minutes per day)
  const breedTargets: { [key: string]: number } = {
    'Golden Retriever': 90,
    'Beagle': 60,
    'Labrador Retriever': 90,
    'German Shepherd': 120,
    'French Bulldog': 40,
    'Chihuahua': 30,
    'Border Collie': 120,
    default: 60,
  };

  const targetMinutes = breedTargets[dogBreed] || breedTargets.default;

  // Adjust for age (seniors need less)
  const ageAdjustedTarget = dogAge > 7 ? targetMinutes * 0.8 : targetMinutes;

  let status: string;
  let recommendation: string;

  if (activityMinutes >= ageAdjustedTarget) {
    status = 'Excellent';
    recommendation = `${dogBreed} is hitting their daily activity target! Keep it up! 🎉`;
  } else if (activityMinutes >= ageAdjustedTarget * 0.7) {
    status = 'Good';
    const remaining = Math.round(ageAdjustedTarget - activityMinutes);
    recommendation = `Just ${remaining} more minutes to reach the daily goal!`;
  } else {
    status = 'Needs More';
    const remaining = Math.round(ageAdjustedTarget - activityMinutes);
    recommendation = `Try adding a ${remaining}-minute walk today to boost wellness.`;
  }

  return {
    status,
    recommendation,
    targetMinutes: Math.round(ageAdjustedTarget),
  };
}

/**
 * Check if data is stale (older than 24 hours)
 */
export function isDataStale(timestamp: string): boolean {
  const dataTime = new Date(timestamp).getTime();
  const now = Date.now();
  const hoursSinceUpdate = (now - dataTime) / (1000 * 60 * 60);
  return hoursSinceUpdate > 24;
}

/**
 * Format health data for dashboard display
 */
export function formatHealthDataForDashboard(data: NormalizedHealthData) {
  return {
    activityMinutes: data.dailyActivityMinutes,
    steps: data.steps,
    heartRate: data.heartRate || 'N/A',
    sleep: data.sleepMinutes ? `${Math.round(data.sleepMinutes / 60)}h ${data.sleepMinutes % 60}m` : 'N/A',
    lastUpdated: new Date(data.timestamp).toLocaleString(),
    source: data.source.replace('_', ' ').toUpperCase(),
    isStale: isDataStale(data.timestamp),
  };
}
