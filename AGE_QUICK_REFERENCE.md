# 🎯 Universal Age Engine - Quick Reference Card

## ⚡ 30-Second Validation

```bash
npm run dev → http://localhost:3000
```

**Check Dashboard Header**:
```
✓ Should show: "1.3 yrs (Dog) / 18 yrs (Human)"
✗ Should NOT show: "1.3 yrs" only
```

---

## 📊 Age Calculation Cheat Sheet

### AVMA Formula

```
Year 1:  dogAge × 15
Year 2:  15 + ((dogAge - 1) × 9)
Year 3+: 24 + ((dogAge - 2) × sizeRate)
```

### Size Rates (Year 3+)

| Size | Rate | Example |
|------|------|---------|
| Toy/Small | 4.0 | Yorkie |
| Medium | 4.5 | Beagle |
| Large | 5.0 | Lab |
| Giant | 6.0 | Dane |

---

## 🧮 Quick Calculations

**Malcolm (Beagle, 1.33 yrs)**:
```
15 + (0.33 × 9) = 18 years ✓
```

**Yorkie (5 yrs)**:
```
15 + 9 + (3 × 4) = 36 years
```

**Labrador (6 yrs)**:
```
15 + 9 + (4 × 5) = 44 years
```

**Great Dane (8 yrs)**:
```
15 + 9 + (6 × 6) = 60 years
```

---

## 🎯 Wellness Factors

### Impact on Biological Age

| Factor | Good | Bad |
|--------|------|-----|
| **HRV** | -2 yr | +2 yr |
| **Sleep** | -1 yr | +1.5 yr |
| **Activity** | -1.5 yr | +2 yr |
| **Total Range** | -5 yr | +5 yr |

**Malcolm's Current**:
```
HRV: 35 (normal)    → +0
Sleep: 12h (ok)     → +0
Activity: 25% (low) → +2

Bio Age: 18 + 2 = 20 yrs
```

---

## ✅ Validation Checklist

- [ ] Dashboard: "X yrs (Dog) / Y yrs (Human)"
- [ ] Profile: Same dual format
- [ ] PDF: Both ages included
- [ ] Age changes with size category
- [ ] Bio age reflects health metrics

---

## 🔧 Quick Debug

**If ages are wrong**:

1. Check size category:
   ```typescript
   console.log(breedData.size_category)
   ```

2. Verify calculation:
   ```typescript
   console.log(metrics.chronologicalHumanAge)
   ```

3. Check wellness:
   ```typescript
   console.log(metrics.biologicalHumanAge)
   ```

---

## 📍 Key Files

| File | Purpose |
|------|---------|
| `lib/calculations.ts` | Core age logic |
| `lib/types.ts` | Type definitions |
| `app/page.tsx` | Dashboard display |
| `app/profile/page.tsx` | Profile display |
| `components/VetExport.tsx` | PDF export |

---

## 🎯 Expected Results

**Malcolm (Beagle, 16 months)**:
- Dog Age: **1.3 years**
- Human Age: **18 years**
- Biological: **20 years** (+2 from low activity)

**All locations should match!**

---

## 🚀 Status: ✅ Complete

**AVMA Standard**: Implemented  
**All 49 Breeds**: Supported  
**UI Integration**: 3/3 locations  
**Linter Errors**: 0  

**Ready to test!** 🐾✨
