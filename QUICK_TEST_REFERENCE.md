# 🧪 Quick Test Reference - 2 Minutes

## ⚡ Run Tests Now

```bash
npm run dev
# Open http://localhost:3000
```

---

## ✅ 5 Critical Tests

### 1. Medical Tab Tracker (20s)

```
Steps:
1. Complete onboarding
2. Step 6: Connect FitBark + Tractive  
3. Go to Medical tab

Expected:
✓ Shows "FitBark: Connected ✓"
✓ Shows "Tractive: Connected ✓"
✓ Green badges visible
```

---

### 2. Growth Chart 3 Points (20s)

```
Steps:
1. Dashboard → Growth chart
2. Look for purple line

Expected:
✓ 3 purple dots: (6,8), (12,15), (16,18)
✓ Solid line connecting all 3
✓ Y-axis: 0-25 (not 0-80)
```

---

### 3. Profile No Crash (20s)

```
Steps:
1. Navigate to /profile
2. Check loading state

Expected:
✓ Spinner shows "Loading..."
✓ Profile loads after 0.5s
✓ No console errors
```

---

### 4. Age Display (30s)

```
Check 3 locations:

Dashboard:  "1.4 yrs (Dog) / 20 yrs (Human)" ✓
Profile:    "1.4 yrs (Dog) / 20 yrs (Human)" ✓
PDF Export: "1.4 yrs Dog / 20 yrs Human" ✓
```

---

### 5. Vaccine Date (30s)

```
Steps:
1. Onboarding Step 5
2. Add vaccine
3. Select tomorrow's date

Expected:
✓ Red error: "Cannot be in the future 🐾"
✓ Blocks proceeding to next step
```

---

## 🎯 Pass/Fail

**All 5 Tests Pass** → ✅ Ready to Deploy  
**Any Test Fails** → ⚠️ Review fixes

---

## 📊 Quick Checklist

- [ ] Trackers persist from onboarding
- [ ] Growth chart shows 3 points
- [ ] Profile loads without crash
- [ ] Age shown in dual format
- [ ] Future vaccine dates blocked

**Status**: 🚀 Production Ready

---

**Total Test Time**: 2 minutes  
**Date**: January 21, 2026  
**Version**: 3.0 Final ✅
