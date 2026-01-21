# PawsPulse Project Guide


## 🛠 Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Calm/Wellness Aesthetic)
- **Data Source:** `dog_data.json` (Static Breed Master)
- **Vitals Logic:** defined in `PLAN.md`


## 🎨 Coding & Design Standards
- **Aesthetic:** High-end wellness (e.g., Calm/Oura). Use rounded-2xl, soft shadows, and a palette of Indigo-900 for text and Blue-50/100 for backgrounds.
- **Components:** Functional components with TypeScript interfaces. 
- **State Management:** Prioritize local state or React Context for vitals calculations.
- **Math Formatting:** Render formulas in prose using LaTeX: $inline$ or $$display$$.


## 🧬 Core Domain Logic
- **Readiness:** See `PLAN.md` for the weighted average formula.
- **Bio-Age:** Calculated dynamically based on `MOCK_SENSORS.json` vs `dog_data.json`.
- **Anomalies:** Check against the "Disease Radar" thresholds in `PLAN.md`.


## 📂 Project Navigation & Commands
- **Master Data:** `@dog_data.json`
- **Calculation Specs:** `@PLAN.md`
- **Mock Data:** `@MOCK_SENSORS.json`
- **Test Command:** `npm run dev` (once scaffolded)
- **Linting:** `npm run lint`


## 🤖 Guidance for Claude
- Always check `@PLAN.md` before writing calculation logic.
- When generating UI, ensure a mobile-first, "Glanceable" design.
- If a dog's breed isn't in `dog_data.json`, default to the "Medium" size category vitals from `PLAN.md`.