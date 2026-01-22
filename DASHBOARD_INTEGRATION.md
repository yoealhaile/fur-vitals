# 📊 Dashboard Live Health Data Integration

**Guide for integrating live health data into the FurVitals dashboard**  
**Date**: January 21, 2026  
**Status**: Ready to implement

---

## 🎯 Overview

This guide shows how to update the dashboard to use **live health data** from Google Fit and Apple Health instead of mock data.

---

## 🔧 Implementation Steps

### Step 1: Import the Hook

Add the health data hook to your dashboard page:

```typescript
// app/page.tsx
import { useHealthData, useConnectionStatus } from '@/hooks/useHealthData';
```

### Step 2: Use the Hook in Your Component

```typescript
export default function Home() {
  const { dogData, user, isOnboarded } = useApp();
  
  // Add this - fetch live health data
  const {
    healthData,
    isLoading: healthLoading,
    readinessScore,
    activityInsights,
    isConnected,
  } = useHealthData(dogData?.breed, dogData?.age_years);
  
  // ... rest of your component
}
```

### Step 3: Use Live Data with Fallback

Update your metrics to use live data when available:

```typescript
// OLD (mock data only)
const dailyActivity = dogData.activity?.active_minutes || 0;
const steps = 8000; // hardcoded

// NEW (live data with fallback)
const dailyActivity = healthData?.dailyActivityMinutes || 
                      dogData.activity?.active_minutes || 
                      0;

const steps = healthData?.steps || 
              dogData.activity?.steps || 
              8000;

const heartRate = healthData?.heartRate || 
                  dogData.vitals?.heart_rate || 
                  72;
```

### Step 4: Show Connection Status

Add a visual indicator when health data is connected:

```typescript
{isConnected.googleFit || isConnected.appleHealth ? (
  <div className="bg-green-100 rounded-full px-4 py-2 flex items-center gap-2">
    <CheckCircle className="w-4 h-4 text-green-600" />
    <span className="text-xs font-bold text-green-700">
      Live Data: {isConnected.googleFit ? 'Google Fit' : 'Apple Health'}
    </span>
  </div>
) : (
  <div className="bg-yellow-100 rounded-full px-4 py-2 flex items-center gap-2">
    <AlertCircle className="w-4 h-4 text-yellow-600" />
    <span className="text-xs font-bold text-yellow-700">
      Using Mock Data
    </span>
  </div>
)}
```

### Step 5: Update Readiness Score

Use the calculated readiness score from live data:

```typescript
// OLD
const readiness = calculateHealthMetrics(dogData, breedData).readinessScore;

// NEW
const readiness = healthData 
  ? readinessScore 
  : calculateHealthMetrics(dogData, breedData).readinessScore;
```

### Step 6: Display Activity Insights

Show breed-specific recommendations:

```typescript
{activityInsights && (
  <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
    <p className="text-sm font-bold text-blue-900 mb-2">
      Activity Status: {activityInsights.status}
    </p>
    <p className="text-xs text-gray-700">
      {activityInsights.recommendation}
    </p>
    <p className="text-xs text-gray-600 mt-2">
      Target: {activityInsights.targetMinutes} min/day for {dogData.breed}
    </p>
  </div>
)}
```

---

## 📋 Complete Example

Here's a full example of how to integrate live health data:

```typescript
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useHealthData } from '@/hooks/useHealthData';
import ReadinessGauge from '@/components/ReadinessGauge';
import VitalsCard from '@/components/VitalsCard';
import ActivityChart from '@/components/ActivityChart';

export default function Home() {
  const router = useRouter();
  const { dogData, user, isOnboarded } = useApp();
  
  // Fetch live health data
  const {
    healthData,
    isLoading: healthLoading,
    readinessScore,
    activityInsights,
    lastSync,
    isConnected,
  } = useHealthData(dogData?.breed, dogData?.age_years);

  // Redirect if not onboarded
  useEffect(() => {
    if (!isOnboarded && typeof window !== 'undefined') {
      router.push('/onboarding');
    }
  }, [isOnboarded, router]);

  // Loading state
  if (!dogData) {
    return <div>Loading...</div>;
  }

  // Prepare metrics with live data fallback
  const metrics = {
    activityMinutes: healthData?.dailyActivityMinutes || 
                     dogData.activity?.active_minutes || 
                     0,
    steps: healthData?.steps || 
           dogData.activity?.steps || 
           8000,
    heartRate: healthData?.heartRate || 
               dogData.vitals?.heart_rate || 
               72,
    sleep: healthData?.sleepMinutes || 
           dogData.sleep?.total || 
           420,
    readiness: healthData ? readinessScore : 75,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b-4 border-teal-300 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">FurVitals</h1>
            
            {/* Connection Status Badge */}
            <div className="flex items-center gap-3">
              {isConnected.googleFit || isConnected.appleHealth ? (
                <div className="bg-green-100 rounded-full px-4 py-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-bold text-green-700">
                    {isConnected.googleFit ? 'Google Fit' : 'Apple Health'}
                  </span>
                </div>
              ) : (
                <div className="bg-yellow-100 rounded-full px-4 py-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-xs font-bold text-yellow-700">
                    Mock Data
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Readiness Gauge */}
        <div className="mb-8">
          <ReadinessGauge score={metrics.readiness} />
          {lastSync && (
            <p className="text-xs text-gray-600 text-center mt-2">
              Last updated: {lastSync.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Activity Insights */}
        {activityInsights && (
          <div className="mb-8 bg-blue-50 rounded-3xl p-6 border-2 border-blue-200">
            <h3 className="font-bold text-blue-900 mb-2">
              Activity Status: {activityInsights.status}
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              {activityInsights.recommendation}
            </p>
            <p className="text-xs text-gray-600">
              Daily Target: {activityInsights.targetMinutes} minutes for {dogData.breed}
            </p>
          </div>
        )}

        {/* Vitals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <VitalsCard
            title="Steps"
            value={metrics.steps.toLocaleString()}
            icon="🐾"
            color="teal"
          />
          <VitalsCard
            title="Activity"
            value={`${metrics.activityMinutes} min`}
            icon="🏃"
            color="purple"
          />
          <VitalsCard
            title="Heart Rate"
            value={`${metrics.heartRate} bpm`}
            icon="❤️"
            color="pink"
          />
          <VitalsCard
            title="Sleep"
            value={`${Math.round(metrics.sleep / 60)}h ${metrics.sleep % 60}m`}
            icon="💤"
            color="blue"
          />
        </div>

        {/* Activity Chart */}
        <div className="mt-8">
          <ActivityChart 
            activityMinutes={metrics.activityMinutes}
            steps={metrics.steps}
          />
        </div>
      </main>
    </div>
  );
}
```

---

## 🎨 UI Components to Update

### 1. ReadinessGauge Component

```typescript
// components/ReadinessGauge.tsx
interface Props {
  score: number;
  isLiveData?: boolean;
}

export default function ReadinessGauge({ score, isLiveData = false }: Props) {
  return (
    <div className="relative">
      {/* Gauge visualization */}
      <CircularGauge value={score} />
      
      {/* Live data indicator */}
      {isLiveData && (
        <div className="absolute top-2 right-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
}
```

### 2. VitalsCard Component

```typescript
// components/VitalsCard.tsx
interface Props {
  title: string;
  value: string;
  icon: string;
  color: string;
  source?: 'live' | 'mock';
  lastUpdated?: Date;
}

export default function VitalsCard({ 
  title, 
  value, 
  icon, 
  color,
  source = 'mock',
  lastUpdated 
}: Props) {
  return (
    <div className={`bg-white rounded-3xl p-6 shadow-lg border-2 border-${color}-200`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {source === 'live' && (
          <span className="text-xs text-green-600 font-bold">LIVE</span>
        )}
      </div>
      <h3 className="text-sm font-bold text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {lastUpdated && (
        <p className="text-xs text-gray-500 mt-2">
          {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
```

### 3. ActivityChart Component

Update to show live vs mock data:

```typescript
// components/ActivityChart.tsx
interface Props {
  activityMinutes: number;
  steps: number;
  source?: 'google_fit' | 'apple_health' | 'mock';
}

export default function ActivityChart({ activityMinutes, steps, source = 'mock' }: Props) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Today's Activity</h3>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
          source === 'mock' 
            ? 'bg-gray-100 text-gray-600' 
            : 'bg-green-100 text-green-700'
        }`}>
          {source === 'google_fit' ? '📊 Google Fit' : 
           source === 'apple_health' ? '🍎 Apple Health' : 
           '🎲 Demo Data'}
        </div>
      </div>
      
      {/* Chart content */}
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          {/* ... chart config */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

---

## 🔄 Refresh Strategy

### Auto-Refresh Implementation

```typescript
// Add to your dashboard component
useEffect(() => {
  // Refresh health data every 5 minutes
  const interval = setInterval(() => {
    if (isConnected.googleFit || isConnected.appleHealth) {
      refetch(); // From useHealthData hook
    }
  }, 5 * 60 * 1000); // 5 minutes

  return () => clearInterval(interval);
}, [isConnected, refetch]);
```

### Manual Refresh Button

```typescript
<button
  onClick={() => refetch()}
  disabled={isLoading}
  className="px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded-full text-white font-bold flex items-center gap-2"
>
  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
  Refresh Data
</button>
```

---

## 📊 Data Priority Logic

When multiple sources are available:

```
Priority (Highest to Lowest):
1. Google Fit (most recent sync)
2. Apple Health (most recent sync)
3. Dog Wearables (device data)
4. Mock Data (fallback)
```

Implementation:

```typescript
const getMetric = (
  metricName: 'steps' | 'activityMinutes' | 'heartRate' | 'sleep'
) => {
  if (healthData) {
    // Live data from Google/Apple
    return healthData[metricName];
  } else if (dogData.activity?.[metricName]) {
    // Dog wearable data
    return dogData.activity[metricName];
  } else {
    // Mock data fallback
    return DEFAULT_VALUES[metricName];
  }
};
```

---

## 🧪 Testing

### Test Scenarios

1. **No Connection**:
   - Visit dashboard without connecting health sources
   - Verify mock data displays correctly
   - Check for "Mock Data" badge

2. **Google Fit Connected**:
   - Connect Google Fit
   - Wait for sync
   - Verify live data appears
   - Check for "Google Fit" badge

3. **Apple Health Connected**:
   - Run Apple Health shortcut
   - Refresh dashboard
   - Verify data updates
   - Check for "Apple Health" badge

4. **Both Connected**:
   - Connect both sources
   - Verify most recent data is used
   - Check merge logic works correctly

---

## 🎯 Success Criteria

Dashboard integration is complete when:

✅ Live data from Google Fit displays correctly  
✅ Live data from Apple Health displays correctly  
✅ Mock data fallback works when nothing connected  
✅ Connection status badge shows current source  
✅ Readiness score uses live data  
✅ Activity insights are breed-specific  
✅ Last sync timestamp displays  
✅ Manual refresh button works  
✅ Auto-refresh every 5 minutes  

---

## 📚 Related Files

- `hooks/useHealthData.ts` - Main data fetching hook
- `lib/healthDataNormalizer.ts` - Data normalization
- `app/sync/page.tsx` - Connection management UI
- `HEALTH_SYNC_GUIDE.md` - Complete health sync guide

---

**Ready to integrate!** Follow the steps above to replace mock data with live health metrics. 🚀

---

**Made with ❤️ for data-driven wellness** 📊
