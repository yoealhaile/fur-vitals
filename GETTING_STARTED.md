# 🚀 Getting Started with PawsPulse

## What You Have Now

Your PawsPulse dashboard is **fully built and ready to run**! Here's what's been created:

### ✅ Complete File Structure

```
PawsPulse/
├── 📱 App (Next.js 14 App Router)
│   ├── page.tsx          → Main dashboard with all calculations
│   ├── layout.tsx        → Root layout wrapper
│   └── globals.css       → Calm aesthetic styling
│
├── 🧩 Components (Reusable UI)
│   ├── ReadinessGauge.tsx       → Daily readiness score (0-100)
│   ├── VitalsCard.tsx           → Heart rate, respiratory, temp, HRV
│   ├── BiologicalAgeCard.tsx    → Bio age vs chrono age comparison
│   ├── InsightsFeed.tsx         → Health alerts (CCD, CHF, etc)
│   └── ActivityChart.tsx        → 7-day activity bar chart
│
├── 🧮 Logic Engine
│   ├── lib/calculations.ts  → All formulas from PLAN.md
│   └── lib/types.ts         → TypeScript interfaces
│
├── 📊 Data Files
│   ├── dog_data.json        → 50+ breed baselines
│   ├── MOCK_SENSORS.json    → Max's current vitals
│   └── PLAN.md              → Calculation specifications
│
└── ⚙️ Config Files
    ├── package.json         → Dependencies
    ├── tsconfig.json        → TypeScript settings
    ├── tailwind.config.ts   → Tailwind customization
    ├── next.config.js       → Next.js config
    └── postcss.config.js    → PostCSS setup
```

## 🏃 How to Run

### Step 1: Install Dependencies

Open a terminal in the project directory and run:

```bash
npm install
```

This will install:
- Next.js 14.2.0
- React 18.3.1
- TypeScript 5.3.3
- Tailwind CSS 3.4.1
- Lucide React (icons)

### Step 2: Start Development Server

```bash
npm run dev
```

### Step 3: Open in Browser

Navigate to: **http://localhost:3000**

You should see Max's beautiful health dashboard! 🎉

## 🎨 What You'll See

### Dashboard Features

1. **Hero Section**
   - Greeting with dog's name and current date
   - Breed and age information

2. **Readiness Gauge** (Left Column)
   - Overall score (0-100)
   - Component breakdown:
     - Sleep Quality (40% weight)
     - HRV Recovery (40% weight)
     - Activity Balance (20% weight)
   - Color-coded: Green (80+), Yellow (60-79), Orange (<60)

3. **Vitals Card** (Middle Column)
   - Real-time heart rate (74 BPM)
   - Respiratory rate (22 BrPM)
   - Body temperature (101.5°F)
   - Heart Rate Variability (58 ms)

4. **Biological Age Card** (Middle Column)
   - Chronological: 6.2 years
   - Biological: Calculated based on vitals
   - Shows if Max is "aging" faster or slower
   - Senior status badge (if applicable)

5. **Health Insights Feed** (Right Column)
   - Critical, Warning, or Info alerts
   - Triggers based on PLAN.md thresholds:
     - CCD (Cognitive Dysfunction)
     - CHF (Heart Failure)
     - Anxiety
     - IVDD (Spinal Risk)
     - Lethargy/Illness

6. **Activity Chart** (Full Width)
   - 7-day step history
   - Visual bar chart with daily averages
   - Comparison to breed's activity target

7. **Breed Profile Card** (Full Width)
   - Golden Retriever-specific health risks
   - Breed logic notes
   - Size category, energy level, activity budget

## 🧮 Calculation Examples

### Max's Readiness Score

Based on `MOCK_SENSORS.json`:

1. **Sleep Score**
   - Total sleep: 740 mins (12.3 hrs)
   - Fragmentation index: 2.1
   - Score: 100 - (2.1 × 5) = 89.5 ✅

2. **HRV Recovery**
   - Current HRV: 58 ms
   - 7-day baseline: ~60 ms
   - Score: (58/60) × 100 = 96.7 ✅

3. **Activity Balance**
   - Target for Golden Retriever: 90 mins
   - Yesterday's activity: 65 mins
   - Within ±20%? 72-108 mins range
   - 65 < 72, so penalty applied: ~85 ⚠️

**Final Readiness**: (89.5 × 0.4) + (96.7 × 0.4) + (85 × 0.2) = **91.5/100** 🎉

### Max's Biological Age

- Chronological: **6.2 years**
- Heart rate: 74 BPM (normal for Large breed baseline 60-100)
- Respiratory rate: 22 BrPM (normal, <25 threshold)
- Activity: Slightly below target but not critical
- **Biological Age**: ~**6.2 years** (age-appropriate health!)

## 🎯 Customizing for Your Dog

### Edit `MOCK_SENSORS.json`

```json
{
  "dog_id": "your_dog_001",
  "name": "YourDogName",
  "breed": "Labrador Retriever",  // Must match dog_data.json
  "chronological_age": 4.5,
  "weight_lbs": 68,
  "current_vitals": {
    "heart_rate_bpm": 80,
    "respiratory_rate_srr": 18,
    "body_temp_f": 101.2,
    "hrv_ms": 65,
    "last_updated": "2026-01-21T10:00:00Z"
  },
  // ... update behavioral stats and historical data
}
```

## 🐛 Troubleshooting

### "Module not found" errors
```bash
npm install
```

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### TypeScript errors
Check that all JSON files are in the root directory

### Styling not working
```bash
npm run build
```

## 🚀 Next Steps

1. **Test the Dashboard**: Change values in `MOCK_SENSORS.json` and refresh
2. **Try Different Breeds**: Update the breed field to see breed-specific logic
3. **Simulate Alerts**: Set `pacing_minutes_night: 35` to trigger CCD alert
4. **Build for Production**: Run `npm run build && npm start`

## 📚 Key Files to Explore

- **`lib/calculations.ts`** - All the math magic happens here
- **`app/page.tsx`** - Main dashboard assembly
- **`components/InsightsFeed.tsx`** - Alert logic and UI
- **`PLAN.md`** - Original calculation specifications

## 🎨 Design Philosophy

The dashboard follows a "Calm Aesthetic":
- **Colors**: Indigo-900 text, Blue-50/100 backgrounds
- **Spacing**: Generous padding with rounded-2xl cards
- **Shadows**: Soft, subtle elevation
- **Typography**: Clean, sans-serif with clear hierarchy
- **Icons**: Lucide React (simple, consistent)

Inspired by: Oura Ring, Apple Health, Calm App, Whoop

## 🆘 Need Help?

- Check `README_SETUP.md` for detailed docs
- Review `PLAN.md` for calculation logic
- Inspect `dog_data.json` for breed baselines

---

**Built with ❤️ for dogs everywhere** 🐾

Enjoy your PawsPulse dashboard!
