# 🧪 Quick Test Guide - Refinements

## ⚡ Fast Test (2 Minutes)

```bash
npm run dev
# Open http://localhost:3000
```

---

## ✅ Test Checklist

### 1. **Growth Chart** (30 seconds)
```
Dashboard → Scroll to "Growth vs. Breed Average"
Expected:
  □ Title shows correct age in months
  □ Malcolm's line at 15lbs (not 65lbs)
  □ Percentile badge shows ~25th
  □ X-axis only goes to current age
```

### 2. **Past Weight Field** (30 seconds)
```
/onboarding → Step 4
Expected:
  □ Optional pink box appears
  □ Dropdown: 2mo, 6mo, 1yr
  □ Can enter past weight
  □ Can skip and continue
```

### 3. **Vaccine Validation** (30 seconds)
```
/onboarding → Step 5
1. Add vaccine name: Rabies
2. Select date BEFORE dog's birthday
Expected:
  □ Red border on date field
  □ Error text appears
  □ Color is #F87171
  □ Message has 🐾 emoji
```

### 4. **Multi-Tracker** (30 seconds)
```
/onboarding → Step 6
1. Click FitBark → Click "Connect Now"
2. Click Whistle → Click "Connect Now"
Expected:
  □ Both show green "Connected"
  □ Bottom text: "✓ 2 trackers connected"
```

### 5. **Email Popup** (30 seconds)
```
Complete all onboarding steps
Click "Complete Setup!"
Expected:
  □ Alert appears immediately
  □ Shows your email address
  □ Message: "Check your inbox!"
```

---

## 🎯 Critical Tests

### Growth Chart Accuracy
**Malcolm (Beagle, 15lbs, 17 months)**:
- Current weight: 15 lbs ✓
- Percentile: 20-30th ✓
- Breed range: 18-30 lbs ✓

### Profile No Crash
Visit `/profile` directly (no onboarding):
- Page loads ✓
- No console errors ✓
- Fields show defaults ✓

---

## 🐛 What to Look For

### ❌ Red Flags:
- Growth chart shows 65lbs instead of 15lbs
- Vaccine validation doesn't show error
- Can only connect 1 tracker
- Profile crashes with "undefined"
- No email popup after onboarding

### ✅ Success Indicators:
- Chart weight matches MOCK_SENSORS.json
- Red error text appears for early vaccine dates
- Multiple trackers connect simultaneously
- Profile handles missing data gracefully
- Email alert appears with correct address

---

## 📊 Quick Verification

**In 5 commands**:
```bash
# 1. Start dev server
npm run dev

# 2. Check onboarding
open http://localhost:3000/onboarding

# 3. Check profile (no crash)
open http://localhost:3000/profile

# 4. Check dashboard
open http://localhost:3000

# 5. Check console for errors
# (Should be zero)
```

---

## 🎉 Pass Criteria

**All 5 tests pass?** → ✅ Ready to deploy!

**1-2 tests fail?** → Check REFINEMENTS_COMPLETE.md for details

**3+ tests fail?** → Run `npm install` and restart server

---

**Happy Testing!** 🐾
