# 🧪 Universal Age Engine - Testing Guide

## ⚡ Quick 3-Minute Test

```bash
npm run dev
# Open http://localhost:3000
```

---

## ✅ Critical Validation Tests

### Test 1: Dashboard Header (30 seconds)

**Check**: Dashboard → Top right corner

**Expected**:
```
Malcolm
Beagle • 1.3 yrs (Dog) / 18 yrs (Human)
```

**Validation**:
- [ ] Shows dual age format
- [ ] Human age is ~18 (not 20 from old formula)
- [ ] Updates dynamically if dog data changes

---

### Test 2: Profile Page (30 seconds)

**Check**: Profile tab → Age section

**Expected**:
```
Age: 1.3 yrs (Dog) / 18 yrs (Human)
```

**Validation**:
- [ ] Both ages visible
- [ ] Human age matches dashboard
- [ ] Format is consistent

---

### Test 3: Size Category Impact (1 minute)

**Test Different Breeds**:

Change Malcolm's breed in MOCK_SENSORS.json and observe:

| Breed | Size | Dog Age | Expected Human Age | Formula |
|-------|------|---------|-------------------|---------|
| Chihuahua | Toy | 5.0 yrs | 36 yrs | 15 + 9 + (3×4) |
| Beagle | Medium | 1.33 yrs | 18 yrs | 15 + (0.33×9) |
| Labrador | Large | 6.0 yrs | 44 yrs | 15 + 9 + (4×5) |
| Great Dane | Giant | 8.0 yrs | 60 yrs | 15 + 9 + (6×6) |

**Validation**:
- [ ] Age changes based on size category
- [ ] Larger breeds show higher human ages
- [ ] Calculations match expected values

---

### Test 4: Biological Age with Wellness (1 minute)

**Check**: Dashboard → Biological Age Card

**Current Malcolm**:
```typescript
HRV: 35 ms (Normal)         → 0 years
Sleep: 12 hrs, frag=2 (OK)  → 0 years
Activity: 15/60 mins (25%)  → +2 years

Biological Human Age = 18 + 2 = 20 years
```

**Expected**:
- [ ] Bio age shows as older due to low activity
- [ ] Wellness factors visible in card
- [ ] Recommendations link to improving bio age

---

### Test 5: PDF Export (1 minute)

**Steps**:
1. Dashboard → "Export Health Report" button
2. Click "Generate PDF"
3. Open downloaded PDF

**Expected in PDF**:
```
Age: 1.3 yrs Dog / 18 yrs Human
Bio: 1.4 yrs Dog / 20 yrs Human
```

**Validation**:
- [ ] PDF shows dual format
- [ ] Both chronological and biological ages
- [ ] Human ages are accurate

---

## 🎯 Edge Case Testing

### Edge Case 1: Puppy (6 months)

**Input**:
```typescript
chronological_age: 0.5
size_category: "Medium"
```

**Expected**:
```
Human Age: 0.5 × 15 = 8 years
```

**Pass**: [ ]

---

### Edge Case 2: Senior (12 years)

**Input**:
```typescript
chronological_age: 12.0
size_category: "Large"
```

**Expected**:
```
Human Age: 15 + 9 + (10 × 5) = 74 years
```

**Pass**: [ ]

---

### Edge Case 3: Giant Breed Young (2 years)

**Input**:
```typescript
chronological_age: 2.0
size_category: "Giant"
```

**Expected**:
```
Human Age: 15 + 9 = 24 years (same for all sizes)
```

**Pass**: [ ]

---

### Edge Case 4: Toy Breed Senior (15 years)

**Input**:
```typescript
chronological_age: 15.0
size_category: "Toy"
```

**Expected**:
```
Human Age: 15 + 9 + (13 × 4) = 76 years
```

**Pass**: [ ]

---

## 🔬 Formula Verification

### Manual Calculation Steps

**For Malcolm (Beagle, 1.33 years, Medium)**:

```
Step 1: Identify size category
        Beagle → Medium

Step 2: Apply AVMA formula
        Age ≤ 1: Use 15 × age
        Age 1-2: Use 15 + ((age - 1) × 9)
        Age > 2: Use 24 + ((age - 2) × size_rate)

Step 3: Calculate
        Malcolm is 1.33 years
        15 + (0.33 × 9) = 15 + 3 = 18 years

Step 4: Verify in UI
        Dashboard should show "18 yrs (Human)"
```

---

## 🧠 Wellness Factor Testing

### Test Scenario 1: Optimal Health

**Change Malcolm's data**:
```json
"hrv_ms": 55,
"total_sleep_minutes": 780,
"active_minutes": 50
```

**Expected**:
```
HRV: 55 (>50)          → -2 years
Sleep: 13 hrs, good    → -1 year
Activity: 50/60 (83%)  → -1.5 years

Total: -4.5 years (capped at -5)
Biological: 18 - 4.5 = 13.5 → 14 years
```

**Result**: Malcolm appears younger than chronological age!

---

### Test Scenario 2: Poor Health

**Change Malcolm's data**:
```json
"hrv_ms": 25,
"total_sleep_minutes": 420,
"active_minutes": 10
```

**Expected**:
```
HRV: 25 (<30)          → +2 years
Sleep: 7 hrs, poor     → +1.5 years
Activity: 10/60 (17%)  → +2 years

Total: +5.5 years (capped at +5)
Biological: 18 + 5 = 23 years
```

**Result**: Malcolm appears older than chronological age.

---

## 📊 Comparison Table

### Before vs. After (Malcolm @ 1.33 years)

| Aspect | Old System | New System | Improvement |
|--------|------------|------------|-------------|
| Human Age | ~20 years | 18 years | ✅ More accurate (AVMA) |
| Size Aware | ❌ No | ✅ Yes | ✅ Breed-specific |
| Bio Age | ❌ No human equiv | ✅ 20 years (with wellness) | ✅ Health-adjusted |
| UI Display | "1.3 yrs" | "1.3 yrs (Dog) / 18 yrs (Human)" | ✅ Clear dual format |

---

## 🎯 Pass/Fail Criteria

### ✅ PASS (All Systems Go!)

- All 5 critical tests pass
- Dashboard shows dual age format
- Profile shows dual age format
- PDF includes both ages
- Size category impacts calculation
- Wellness factors adjust biological age

### ⚠️ PARTIAL (Review Needed)

- 3-4 critical tests pass
- Age calculation off by 1-2 years
- UI shows format inconsistently

### ❌ FAIL (Needs Fix)

- <3 critical tests pass
- Age calculation doesn't vary by size
- Old formula still in use

---

## 🚀 Quick Validation Commands

### Check Current Implementation

```bash
# 1. Verify function exists
grep -n "dogYearsToHumanYears" /Users/yoealhaile/Desktop/PawPulse/lib/calculations.ts

# 2. Check UI integration
grep -n "chronologicalHumanAge" /Users/yoealhaile/Desktop/PawPulse/app/page.tsx

# 3. Verify PDF export
grep -n "chronologicalHumanAge" /Users/yoealhaile/Desktop/PawPulse/components/VetExport.tsx
```

---

## 🎉 Expected Final Results

**Malcolm (Beagle, 16 months, Medium)**:

```
┌─────────────────────────────────────────────┐
│ Dashboard Header                            │
│ ─────────────────────────────────────────── │
│ Malcolm                                     │
│ Beagle • 1.3 yrs (Dog) / 18 yrs (Human)    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Profile Page                                │
│ ─────────────────────────────────────────── │
│ Age: 1.3 yrs (Dog) / 18 yrs (Human)        │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Biological Age Card                         │
│ ─────────────────────────────────────────── │
│ Chronological: 1.3 yrs (18 human years)    │
│ Biological: 1.4 yrs (20 human years)       │
│ Status: Aging slightly faster (+2 years)   │
└─────────────────────────────────────────────┘
```

---

## 🔍 Debug Checklist

If ages don't match expected:

1. **Check Size Category**:
   ```typescript
   console.log(breedData.size_category); // Should be "Medium" for Beagle
   ```

2. **Verify Age Calculation**:
   ```typescript
   const humanAge = dogYearsToHumanYears(1.33, "Medium");
   console.log(humanAge); // Should be 18
   ```

3. **Check Wellness Factors**:
   ```typescript
   console.log(dogData.current_vitals.hrv_ms); // 35
   console.log(dogData.behavioral_stats_today.active_minutes); // 15
   ```

4. **Validate Metrics Object**:
   ```typescript
   console.log(metrics.chronologicalHumanAge); // 18
   console.log(metrics.biologicalHumanAge); // 20
   ```

---

## ✅ Final Checklist

- [ ] Dashboard shows "X yrs (Dog) / Y yrs (Human)"
- [ ] Profile shows dual format
- [ ] PDF export includes both ages
- [ ] Age varies by size category (test multiple breeds)
- [ ] Biological age reflects wellness factors
- [ ] All 49 breeds have size_category in dog_data.json
- [ ] No linter errors
- [ ] Calculations match AVMA standard

---

**Status**: 🚀 Ready to Test!

Run `npm run dev` and verify all 5 critical tests pass.

**Version**: 1.0  
**Date**: January 21, 2026  
**Standard**: AVMA ✅  
**Breeds Supported**: 49 (All sizes)  
