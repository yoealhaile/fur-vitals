// PawsPulse Calculation Engine
// Implements formulas from PLAN.md

import { DogData, BreedData, HealthAlert, CalculationResults, VitalsBaseline } from "./types";

// ===========================
// UNIVERSAL DOG AGE ENGINE
// ===========================
// Implements AVMA (American Veterinary Medical Association) standard
// with size-category adjustments for accurate aging across all breeds

/**
 * Convert dog years to human years using AVMA standard + size-based aging rates
 * 
 * @param dogAge - Chronological age in years
 * @param sizeCategory - Breed size: "Small" (<20lbs), "Medium" (20-50lbs), "Large" (50-90lbs), "Giant" (>90lbs)
 * @returns Human equivalent age in years
 * 
 * AVMA Standard:
 * - Year 1: ~15 human years (all sizes)
 * - Year 2: ~9 human years (all sizes)
 * - Year 3+: Variable by size (smaller dogs age slower)
 *   - Small/Medium: ~4 years per dog year
 *   - Large: ~5 years per dog year
 *   - Giant: ~6 years per dog year
 */
export function dogYearsToHumanYears(dogAge: number, sizeCategory: string = "Medium"): number {
  // AVMA base: First year = 15, Second year = 9
  if (dogAge <= 1) {
    return Math.round(dogAge * 15);
  } else if (dogAge <= 2) {
    return Math.round(15 + (dogAge - 1) * 9);
  } else {
    // Year 3+ varies by size category
    const baseAge = 15 + 9; // First 2 years = 24 human years
    const remainingYears = dogAge - 2;
    
    // Size-based aging rate (years per dog year)
    let agingRate: number;
    switch (sizeCategory) {
      case "Toy":
      case "Small":
        agingRate = 4; // Smaller dogs age slower
        break;
      case "Medium":
        agingRate = 4.5;
        break;
      case "Large":
        agingRate = 5;
        break;
      case "Giant":
        agingRate = 6; // Giant breeds age faster
        break;
      default:
        agingRate = 4.5; // Default to medium
    }
    
    return Math.round(baseAge + (remainingYears * agingRate));
  }
}

/**
 * Calculate Biological Human Age with Wellness Factors
 * 
 * Takes the chronological human age and adjusts it based on health metrics:
 * - HRV (Heart Rate Variability)
 * - Sleep Quality
 * - Activity Level
 * 
 * @param chronologicalHumanAge - Base human age from dogYearsToHumanYears()
 * @param dogData - Full sensor data including vitals and activity
 * @param breedData - Breed-specific baselines
 * @returns Biological human age (adjusted for wellness)
 */
export function calculateBiologicalHumanAge(
  chronologicalHumanAge: number,
  dogData: DogData,
  breedData: BreedData
): number {
  // Start with chronological age
  let bioAge = chronologicalHumanAge;
  
  // Wellness Factor: -5 to +5 years based on health metrics
  let wellnessFactor = 0;
  
  // 1. HRV Factor (Heart Rate Variability - higher is better)
  const hrv = dogData.current_vitals?.hrv_ms || 40;
  if (hrv > 50) {
    wellnessFactor -= 2; // Excellent HRV = younger bio age
  } else if (hrv < 30) {
    wellnessFactor += 2; // Poor HRV = older bio age
  }
  
  // 2. Sleep Factor (quality and duration)
  const sleepMinutes = dogData.sleep_analysis_last_night?.total_sleep_minutes || 720;
  const sleepHours = sleepMinutes / 60;
  const fragmentation = dogData.sleep_analysis_last_night?.fragmentation_index || 2;
  
  if (sleepHours >= 12 && fragmentation <= 2) {
    wellnessFactor -= 1; // Great sleep = younger
  } else if (sleepHours < 8 || fragmentation > 4) {
    wellnessFactor += 1.5; // Poor sleep = older
  }
  
  // 3. Activity Factor (vs breed baseline)
  const activeMinutes = dogData.behavioral_stats_today?.active_minutes || 0;
  const targetActivity = breedData.activity_budget_mins || 60;
  const activityRatio = activeMinutes / targetActivity;
  
  if (activityRatio >= 0.8) {
    wellnessFactor -= 1.5; // Meeting activity goals = younger
  } else if (activityRatio < 0.3) {
    wellnessFactor += 2; // Very sedentary = older
  }
  
  // Apply wellness factor (capped at ±5 years)
  wellnessFactor = Math.max(-5, Math.min(5, wellnessFactor));
  bioAge += wellnessFactor;
  
  // Ensure bio age is reasonable (never less than 0)
  return Math.max(0, Math.round(bioAge));
}

// Breed-Size Vitals Baseline Table from PLAN.md
const VITALS_BASELINES: Record<string, VitalsBaseline> = {
  "Toy": { rhr_range: [100, 140], srr_range: [15, 30], sleep_target: "14-16 hrs" },
  "Small": { rhr_range: [100, 140], srr_range: [15, 30], sleep_target: "14-16 hrs" },
  "Medium": { rhr_range: [80, 120], srr_range: [15, 30], sleep_target: "12-14 hrs" },
  "Large": { rhr_range: [60, 100], srr_range: [10, 25], sleep_target: "12-14 hrs" },
  "Giant": { rhr_range: [50, 90], srr_range: [10, 20], sleep_target: "16-18 hrs" },
};

/**
 * Calculate Sleep Score (0-100)
 * Formula: 100 - (FragmentationIndex * 5) with -20 penalty if sleep < 8 hours
 */
function calculateSleepScore(dogData: DogData): number {
  // Null checks for sleep data
  if (!dogData?.sleep_analysis_last_night) {
    return 75; // Default moderate score
  }
  
  const { total_sleep_minutes = 720, fragmentation_index = 2 } = dogData.sleep_analysis_last_night;
  const sleepHours = total_sleep_minutes / 60;
  
  let score = 100 - (fragmentation_index * 5);
  
  // Apply penalty if sleep is less than 8 hours
  if (sleepHours < 8) {
    score -= 20;
  }
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate HRV Recovery Score (0-100)
 * Formula: (CurrentHRV / BaselineHRV) * 100, capped at 100
 */
function calculateHRVRecovery(dogData: DogData): number {
  // Null checks for HRV data
  if (!dogData?.current_vitals?.hrv_ms) {
    return 75; // Default moderate score
  }
  
  const currentHRV = dogData.current_vitals.hrv_ms;
  
  // Calculate 7-day baseline HRV with null check
  if (!dogData.historical_data_7d || dogData.historical_data_7d.length === 0) {
    return 75; // Default if no historical data
  }
  
  const baselineHRV = dogData.historical_data_7d.reduce((sum, day) => sum + (day?.hrv || 60), 0) / dogData.historical_data_7d.length;
  
  // Prevent division by zero
  if (baselineHRV === 0) {
    return 75;
  }
  
  const recovery = (currentHRV / baselineHRV) * 100;
  
  return Math.min(100, recovery);
}

/**
 * Calculate Activity Balance Score (0-100)
 * 100 if yesterday's activity is +/- 20% of breed budget
 * -5 penalty for every 10% over/under that range
 */
function calculateActivityBalance(dogData: DogData, breedData: BreedData): number {
  // Null checks for activity data
  if (!dogData?.behavioral_stats_today || !breedData?.activity_budget_mins) {
    return 75; // Default moderate score
  }
  
  const yesterdayActivity = dogData.historical_data_7d?.[0]?.steps || 0;
  const yesterdayActiveMinutes = dogData.behavioral_stats_today.active_minutes || 0;
  
  const targetMinutes = breedData.activity_budget_mins;
  const lowerBound = targetMinutes * 0.8;
  const upperBound = targetMinutes * 1.2;
  
  if (yesterdayActiveMinutes >= lowerBound && yesterdayActiveMinutes <= upperBound) {
    return 100;
  }
  
  let score = 100;
  
  if (yesterdayActiveMinutes < lowerBound) {
    const percentUnder = ((lowerBound - yesterdayActiveMinutes) / targetMinutes) * 100;
    const penalty = Math.floor(percentUnder / 10) * 5;
    score -= penalty;
  } else {
    const percentOver = ((yesterdayActiveMinutes - upperBound) / targetMinutes) * 100;
    const penalty = Math.floor(percentOver / 10) * 5;
    score -= penalty;
  }
  
  return Math.max(0, score);
}

/**
 * Calculate Readiness Score (0-100)
 * Formula: (SleepScore × 0.40) + (HRV_Recovery × 0.40) + (ActivityBalance × 0.20)
 */
export function calculateReadinessScore(
  dogData: DogData,
  breedData: BreedData
): { score: number; components: { sleep: number; hrv: number; activity: number } } {
  // Null checks for required data
  if (!dogData || !breedData) {
    return {
      score: 75,
      components: { sleep: 75, hrv: 75, activity: 75 }
    };
  }
  
  const sleepScore = calculateSleepScore(dogData);
  const hrvRecovery = calculateHRVRecovery(dogData);
  const activityBalance = calculateActivityBalance(dogData, breedData);
  
  const readiness = (sleepScore * 0.4) + (hrvRecovery * 0.4) + (activityBalance * 0.2);
  
  return {
    score: Math.round(readiness),
    components: {
      sleep: Math.round(sleepScore),
      hrv: Math.round(hrvRecovery),
      activity: Math.round(activityBalance),
    },
  };
}

/**
 * Calculate Biological Age
 * Formula: ChronoAge + ΔVitals + ΔActivity
 */
export function calculateBiologicalAge(
  dogData: DogData,
  breedData: BreedData
): number {
  // Null checks for required data
  if (!dogData?.chronological_age || !breedData?.size_category) {
    return 5.0; // Default age
  }
  
  const chronoAge = dogData.chronological_age;
  const sizeCategory = breedData.size_category;
  const baseline = VITALS_BASELINES[sizeCategory] || VITALS_BASELINES["Medium"];
  
  let deltaVitals = 0;
  let deltaActivity = 0;
  
  // Check Resting Heart Rate with null checks
  if (dogData?.current_vitals?.heart_rate_bpm && baseline?.rhr_range) {
    const avgRHR = dogData.current_vitals.heart_rate_bpm;
    const baselineRHRMid = (baseline.rhr_range[0] + baseline.rhr_range[1]) / 2;
    if (avgRHR > baselineRHRMid * 1.1) {
      deltaVitals += 0.5;
    }
  }
  
  // Check Sleeping Respiratory Rate with null check
  if (dogData?.current_vitals?.respiratory_rate_srr) {
    const avgSRR = dogData.current_vitals.respiratory_rate_srr;
    if (avgSRR > 25) {
      deltaVitals += 1.0;
    }
  }
  
  // Check 30-day average activity (using 7-day as proxy) with null checks
  if (dogData?.historical_data_7d && dogData.historical_data_7d.length > 0 && breedData?.activity_budget_mins) {
    const avgActivity = dogData.historical_data_7d.reduce((sum, day) => sum + (day?.steps || 0), 0) / dogData.historical_data_7d.length;
    const targetSteps = breedData.activity_budget_mins * 100; // rough conversion
    
    if (avgActivity < targetSteps * 0.7) {
      deltaActivity += 0.5;
    } else if (avgActivity >= targetSteps) {
      // Good recovery assumed if HRV is healthy
      const avgHRV = dogData.historical_data_7d.reduce((sum, day) => sum + (day?.hrv || 0), 0) / dogData.historical_data_7d.length;
      if (avgHRV > 55) {
        deltaActivity -= 0.5;
      }
    }
  }
  
  return parseFloat((chronoAge + deltaVitals + deltaActivity).toFixed(1));
}

/**
 * Check for health anomalies based on PLAN.md alert thresholds
 */
export function detectHealthAlerts(
  dogData: DogData,
  breedData: BreedData
): HealthAlert[] {
  const alerts: HealthAlert[] = [];
  
  // Null checks for required data
  if (!dogData || !breedData) {
    return alerts;
  }
  
  // ALERT_CCD: Cognitive Dysfunction
  if (breedData?.lifespan_range && breedData.lifespan_range.length === 2 && 
      dogData?.behavioral_stats_today?.pacing_minutes_night !== undefined &&
      dogData?.chronological_age !== undefined) {
    const lifespanMid = (breedData.lifespan_range[0] + breedData.lifespan_range[1]) / 2;
    if (
      dogData.behavioral_stats_today.pacing_minutes_night > 30 &&
      dogData.chronological_age > lifespanMid * 0.75
    ) {
      alerts.push({
        id: "ALERT_CCD",
        severity: "warning",
        title: "Cognitive Dysfunction Risk",
        description: `Increased nighttime pacing (${dogData.behavioral_stats_today.pacing_minutes_night} mins) detected. May indicate early signs of canine cognitive dysfunction.`,
        condition: "Canine Dementia (CCD)",
      });
    }
  }
  
  // ALERT_CHF: Congestive Heart Failure
  if (dogData?.current_vitals?.respiratory_rate_srr && dogData?.historical_data_7d) {
    if (dogData.current_vitals.respiratory_rate_srr > 30) {
      const consecutiveHighSRR = dogData.historical_data_7d.filter(day => day?.avg_srr && day.avg_srr > 30).length;
      if (consecutiveHighSRR >= 3) {
        alerts.push({
          id: "ALERT_CHF",
          severity: "critical",
          title: "Heart Failure Warning",
          description: `Elevated sleeping respiratory rate (${dogData.current_vitals.respiratory_rate_srr} bpm) for ${consecutiveHighSRR} consecutive days. Immediate vet consultation recommended.`,
          condition: "Congestive Heart Failure (CHF)",
        });
      }
    }
  }
  
  // ALERT_ANX: Separation Anxiety
  if (dogData?.behavioral_stats_today?.vigilance_score !== undefined) {
    const baselineVigilance = 1.0; // typical baseline
    if (dogData.behavioral_stats_today.vigilance_score > baselineVigilance * 2.0) {
      alerts.push({
        id: "ALERT_ANX",
        severity: "info",
        title: "Elevated Stress Levels",
        description: `Vigilance score (${dogData.behavioral_stats_today.vigilance_score.toFixed(1)}) is elevated. May indicate environmental stress or anxiety.`,
        condition: "Separation Anxiety",
      });
    }
  }
  
  // ALERT_IVDD: Spinal Injury Risk (Small breeds, Dachshunds)
  if (breedData?.size_category && breedData?.breed && 
      dogData?.behavioral_stats_today?.high_impact_jumps !== undefined) {
    if (
      (breedData.size_category === "Small" || breedData.breed.includes("Dachshund")) &&
      dogData.behavioral_stats_today.high_impact_jumps > 5
    ) {
      alerts.push({
        id: "ALERT_IVDD",
        severity: "warning",
        title: "Spinal Injury Risk",
        description: `High-impact jumps (${dogData.behavioral_stats_today.high_impact_jumps}) detected. Small breeds are prone to IVDD—consider limiting jumping.`,
        condition: "Intervertebral Disc Disease (IVDD)",
      });
    }
  }
  
  // ALERT_LETH: Acute Infection / Lethargy
  if (dogData?.historical_data_7d && dogData.historical_data_7d.length > 0 &&
      dogData?.behavioral_stats_today?.steps !== undefined &&
      dogData?.current_vitals?.heart_rate_bpm !== undefined) {
    const avgActivity = dogData.historical_data_7d.reduce((sum, day) => sum + (day?.steps || 0), 0) / dogData.historical_data_7d.length;
    const todayActivity = dogData.behavioral_stats_today.steps;
    const baselineRHR = dogData.historical_data_7d.reduce((sum, day) => sum + (day?.avg_rhr || 70), 0) / dogData.historical_data_7d.length;
    
    if (
      avgActivity > 0 && // Prevent division by zero
      todayActivity < avgActivity * 0.4 &&
      dogData.current_vitals.heart_rate_bpm > baselineRHR * 1.15
    ) {
      alerts.push({
        id: "ALERT_LETH",
        severity: "critical",
        title: "Acute Lethargy Detected",
        description: `Activity dropped to ${Math.round((todayActivity / avgActivity) * 100)}% of baseline with elevated heart rate. May indicate infection or illness.`,
        condition: "Systemic Illness",
      });
    }
  }
  
  return alerts;
}

/**
 * Main calculation function - returns all metrics
 */
export function calculateHealthMetrics(
  dogData: DogData,
  breedData: BreedData
): CalculationResults {
  // Return safe defaults if data is missing
  if (!dogData || !breedData) {
    return {
      readinessScore: 75,
      biologicalAge: 5.0,
      sleepScore: 75,
      hrvRecovery: 75,
      activityBalance: 75,
      alerts: [],
      chronologicalHumanAge: 36, // Default ~6 years medium dog
      biologicalHumanAge: 36,
    };
  }
  
  const readiness = calculateReadinessScore(dogData, breedData);
  const biologicalAge = calculateBiologicalAge(dogData, breedData);
  const alerts = detectHealthAlerts(dogData, breedData);
  
  // Universal Age Engine - Calculate human equivalent ages
  const chronologicalHumanAge = dogYearsToHumanYears(
    dogData.chronological_age || 0, 
    breedData.size_category || "Medium"
  );
  const biologicalHumanAge = calculateBiologicalHumanAge(
    chronologicalHumanAge, 
    dogData, 
    breedData
  );
  
  return {
    readinessScore: readiness.score,
    biologicalAge,
    sleepScore: readiness.components.sleep,
    hrvRecovery: readiness.components.hrv,
    activityBalance: readiness.components.activity,
    alerts,
    chronologicalHumanAge,
    biologicalHumanAge,
  };
}

/**
 * Determine if dog is in "Senior" category
 * Senior = chronological age >= 75% of lifespan
 */
export function isSenior(dogData: DogData, breedData: BreedData): boolean {
  // Null checks
  if (!dogData?.chronological_age || !breedData?.lifespan_range || breedData.lifespan_range.length !== 2) {
    return false;
  }
  
  const lifespanMid = (breedData.lifespan_range[0] + breedData.lifespan_range[1]) / 2;
  return dogData.chronological_age >= lifespanMid * 0.75;
}

/**
 * Get vitals baseline for a size category
 */
export function getVitalsBaseline(sizeCategory: string): VitalsBaseline {
  return VITALS_BASELINES[sizeCategory] || VITALS_BASELINES["Medium"];
}
