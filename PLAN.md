# PawsPulse Logic & Calculation Engine


This document defines the mathematical models for the PawsPulse dashboard. Use these formulas when generating the `CalculationsEngine.ts`.


---


## 1. Readiness Score (Daily Mood)
Determines the dog's physical and mental capacity for the day.
**Range:** 0-100 (Higher is better)


### Formula:
$$Readiness = (SleepScore \times 0.40) + (HRV_{Recovery} \times 0.40) + (ActivityBalance \times 0.20)$$


- **SleepScore (0-100):** - Calculated as: `100 - (FragmentationIndex * 5)` where Fragmentation is the count of wake-ups > 2 mins.
  - Penalty of -20 if total sleep is < 8 hours.
- **HRV Recovery (0-100):**
  - Compare current night's HRV to the 7-day rolling baseline. 
  - `(CurrentHRV / BaselineHRV) * 100`. (Cap at 100).
- **ActivityBalance (0-100):**
  - 100 if yesterday's activity was +/- 20% of the breed's `activity_budget_mins`.
  - Penalty of -5 for every 10% over/under that range (Over-exertion or Under-stimulation).


---


## 2. Biological Age Index
Translates internal health data into a "Functional Age" compared to chronological age.


### Formula:
$$BioAge = ChronoAge + \Delta Vitals + \Delta Activity$$


- **$\Delta Vitals$ (Years):**
  - If Resting Heart Rate (RHR) is > 10% above size-category baseline: **+0.5 yrs**
  - If Sleeping Respiratory Rate (SRR) is > 25 breaths/min persistently: **+1.0 yrs**
- **$\Delta Activity$ (Years):**
  - If the 30-day average activity is < 70% of breed budget: **+0.5 yrs**
  - If the 30-day average activity matches or exceeds budget with good recovery: **-0.5 yrs**


---


## 3. Disease Prediction Radar (Anomaly Detection)
Trigger the following alerts when thresholds are met.


| Alert ID | Condition | Predicted Condition |
| :--- | :--- | :--- |
| **ALERT_CCD** | `pacing_minutes_night > 30` AND `age > breed_lifespan * 0.75` | Cognitive Dysfunction (Dementia) |
| **ALERT_CHF** | `sleeping_resp_rate > 30` for 3 consecutive nights | Congestive Heart Failure |
| **ALERT_ANX** | `vigilance_score > baseline * 2.0` | Separation Anxiety / Environmental Stress |
| **ALERT_IVDD** | `high_impact_jumps > 5` (for Small/Dachshund breeds) | Spinal Injury Risk |
| **ALERT_LETH** | `activity_index < 40% of baseline` AND `RHR > +15%` | Acute Infection / Systemic Illness |


---


## 4. Breed-Size Vitals Baseline Table
Use these as the "Master Normals" for all logic.


| Size | RHR (BPM) | SRR (Breaths/min) | Sleep Target |
| :--- | :--- | :--- | :--- |
| **Toy/Small** | 100–140 | 15–30 | 14-16 hrs |
| **Medium** | 80–120 | 15–30 | 12-14 hrs |
| **Large** | 60–100 | 10–25 | 12-14 hrs |
| **Giant** | 50–90 | 10–20 | 16-18 hrs |


---


## 5. Senior Logic Trigger
- A dog is classified as **"Senior"** once their `Chronological Age` reaches **75%** of their `breed_lifespan` from `dog_data.json`.
- When Senior: Increase sampling frequency of `SRR` and `Sleep_Wake_Fragmentation`.