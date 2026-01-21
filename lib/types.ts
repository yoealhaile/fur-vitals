// Type definitions for PawsPulse

export interface BreedData {
  breed: string;
  size_category: "Toy" | "Small" | "Medium" | "Large" | "Giant";
  lifespan_range: [number, number];
  energy_level: number;
  activity_budget_mins: number;
  common_risks?: string[];
  health_risks?: string[];
  vitals_logic: string;
  vitals_baseline?: {
    min_rhr: number;
    max_rhr: number;
    avg_srr: number;
  };
}

export interface CurrentVitals {
  heart_rate_bpm: number;
  respiratory_rate_srr: number;
  body_temp_f: number;
  hrv_ms: number;
  last_updated: string;
}

export interface BehavioralStats {
  steps: number;
  active_minutes: number;
  pacing_minutes_night: number;
  vigilance_score: number;
  high_impact_jumps: number;
  barking_count: number;
  last_meal_time?: string;
  last_poop_time?: string;
}

export interface HistoricalDataPoint {
  date: string;
  avg_rhr: number;
  avg_srr: number;
  sleep_hours: number;
  steps: number;
  hrv: number;
}

export interface SleepAnalysis {
  total_sleep_minutes: number;
  deep_sleep_minutes: number;
  rem_sleep_minutes: number;
  wake_ups: number;
  fragmentation_index: number;
}

export interface GrowthDataPoint {
  age_months: number;
  weight_lbs: number;
  height_inches?: number;
}

export interface RecentEvents {
  last_meal?: string;
  last_poop?: string;
  last_sleep_end?: string;
  last_walk?: string;
  last_play?: string;
}

export interface Vaccine {
  name: string;
  date: string;
  status: string;
}

export interface MedicalReminder {
  type: string;
  due_date: string;
  status: string;
}

export interface MedicalRecords {
  vaccines: Vaccine[];
  upcoming_reminders: MedicalReminder[];
}

export interface DogData {
  dog_id: string;
  name: string;
  breed: string;
  chronological_age: number;
  weight_lbs: number;
  current_vitals: CurrentVitals;
  behavioral_stats_today: BehavioralStats;
  historical_data_7d: HistoricalDataPoint[];
  sleep_analysis_last_night: SleepAnalysis;
  growth_history?: GrowthDataPoint[];
  recent_events?: RecentEvents;
  medical_records?: MedicalRecords;
}

export interface VitalsBaseline {
  rhr_range: [number, number];
  srr_range: [number, number];
  sleep_target: string;
}

export interface HealthAlert {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  condition: string;
}

export interface CalculationResults {
  readinessScore: number;
  biologicalAge: number;
  sleepScore: number;
  hrvRecovery: number;
  activityBalance: number;
  alerts: HealthAlert[];
  // Universal Age Engine results
  chronologicalHumanAge: number;
  biologicalHumanAge: number;
}
