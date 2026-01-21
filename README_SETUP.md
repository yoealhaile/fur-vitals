# 🐾 PawsPulse - Apple Health for Dogs

A beautiful, high-end Next.js 14+ dashboard for comprehensive canine health monitoring. Built with TypeScript, Tailwind CSS, and a calm wellness aesthetic inspired by Oura and Apple Health.

## ✨ Features

- **Readiness Score** - Daily capacity calculation based on sleep quality, HRV recovery, and activity balance
- **Biological Age Index** - Functional age vs chronological age using vitals and activity data
- **Health Insights Feed** - AI-powered anomaly detection for conditions like CCD, CHF, anxiety, IVDD, and systemic illness
- **Activity Trends** - 7-day step tracking with visual charts
- **Breed-Specific Baselines** - Tailored health monitoring for 50+ dog breeds
- **Real-time Vitals** - Heart rate, respiratory rate, body temperature, and HRV monitoring

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Project Structure

```
PawsPulse/
├── app/
│   ├── page.tsx          # Main dashboard
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── ReadinessGauge.tsx       # Readiness score display
│   ├── VitalsCard.tsx           # Current vitals grid
│   ├── BiologicalAgeCard.tsx    # Age comparison card
│   ├── InsightsFeed.tsx         # Health alerts feed
│   └── ActivityChart.tsx        # 7-day activity chart
├── lib/
│   ├── calculations.ts   # Core health metrics engine
│   └── types.ts          # TypeScript interfaces
├── dog_data.json         # Breed baselines (50+ breeds)
├── MOCK_SENSORS.json     # Sample dog data (Max)
└── PLAN.md              # Calculation formulas & logic

```

## 🧮 Calculation Engine

The dashboard implements scientifically-inspired formulas:

### Readiness Score (0-100)
```
Readiness = (SleepScore × 0.40) + (HRV_Recovery × 0.40) + (ActivityBalance × 0.20)
```

### Biological Age
```
BioAge = ChronoAge + ΔVitals + ΔActivity
```

Where:
- **ΔVitals**: +0.5 yrs if RHR >10% above baseline, +1.0 yrs if SRR >25
- **ΔActivity**: +0.5 yrs if 30-day avg <70% of breed budget, -0.5 yrs if meeting goals with good recovery

### Health Anomaly Detection

| Alert | Trigger Condition |
|-------|------------------|
| **CCD** (Cognitive Dysfunction) | `pacing_minutes_night > 30` AND `age > 75% lifespan` |
| **CHF** (Heart Failure) | `sleeping_resp_rate > 30` for 3+ nights |
| **Anxiety** | `vigilance_score > 2x baseline` |
| **IVDD** (Spinal Risk) | `high_impact_jumps > 5` (Small breeds) |
| **Lethargy** | `activity < 40% baseline` AND `RHR > +15%` |

## 🎨 Design System

- **Palette**: Indigo-900 text, Blue-50/100 backgrounds
- **Components**: Rounded-2xl cards with soft shadows
- **Icons**: Lucide-react
- **Layout**: Mobile-first, responsive grid

## 📊 Data Sources

- **dog_data.json** - Master breed database with health risks and vitals logic
- **MOCK_SENSORS.json** - Live sensor data for "Max" (sample Golden Retriever)
- **PLAN.md** - Mathematical formulas and thresholds

## 🐕 Customizing for Your Dog

To monitor a different dog, update `MOCK_SENSORS.json` with:
- Breed (must match `dog_data.json`)
- Current vitals (HR, RR, temp, HRV)
- 7-day historical data
- Sleep analysis

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Data**: Static JSON (ready for API integration)

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🔮 Future Enhancements

- [ ] Real sensor integration (Whistle, Fi, Halo collars)
- [ ] Historical trend graphs (30-day, 90-day)
- [ ] Multi-dog support
- [ ] Export health reports (PDF)
- [ ] Vet appointment reminders
- [ ] Medication tracking

## 📄 License

MIT License - Built for the love of dogs 🐾

---

**Note**: This is a demo dashboard. Always consult a licensed veterinarian for professional medical advice about your pet.
