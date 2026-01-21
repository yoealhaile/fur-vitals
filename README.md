# PawsPulse: Longevity & Disease Prediction Engine 🐾


**PawsPulse** is an AI-native health dashboard for dogs, focused on extending lifespan through proactive vitals monitoring and behavioral biomarker analysis. It functions as "Apple Health for Dogs," translating raw sensor data into clinical-grade health insights and "Readiness" scores.


---


## 🌟 Core Philosophy
- **Proactive, not Reactive:** We don't just track steps; we predict diseases (CCD, CHF, IVDD) before they become emergencies.
- **Calm Aesthetic:** The UI should feel like a wellness retreat—soft blues, deep indigos, rounded corners, and generous whitespace. No clutter.
- **Data-Driven Empathy:** Every data point is used to help the owner "hear" what their dog can't say.


---


## 🛠 Project Structure
- `dog_data.json`: The "Source of Truth" for breed-specific longevity, energy levels, and health risks for the top 50 breeds.
- `PLAN.md`: Contains the proprietary formulas for Biological Age, Readiness Scores, and the 10 Behavioral Biomarkers.
- `MOCK_SENSORS.json`: Simulated real-time data stream for development and testing.


---


## 🧬 Primary Health Features


### 1. Readiness Score (Daily Mood)
A 0–100 score calculated every morning based on Sleep Quality, HRV (Heart Rate Variability), and previous day's exertion. It tells the owner if it's a "Play Day" or a "Rest Day."


### 2. Biological Age Index
A comparison of the dog’s internal vitals (Heart Rate, Respiratory Rate) and activity levels against their chronological age and breed-specific baseline. 


### 3. Disease Prediction Radar
Monitors for specific "Behavioral Biomarkers" including:
- **Sundowning Detection:** Nighttime pacing patterns indicative of Dementia (CCD).
- **CHF Warning:** Persistent elevation in Sleeping Respiratory Rate (SRR).
- **Anxiety Vigilance:** Sudden spikes in heart rate and barking frequency relative to the 7-day baseline.


---


## 🎨 Design System (The "Vibe")
- **Primary Palette:** `#F0F4F8` (Soft Gray), `#1E3A8A` (Deep Indigo), `#60A5FA` (Calm Blue).
- **Typography:** Sans-serif, clean, high readability (Inter or SF Pro).
- **Components:** Card-based layout with soft shadows (`shadow-sm`) and large border-radii (`rounded-2xl`).


---


## 🚀 Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Logic:** TypeScript