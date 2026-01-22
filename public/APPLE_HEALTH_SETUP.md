# 🍎 Apple Health Integration Guide

**Version**: 1.0  
**Date**: January 21, 2026  
**Platform**: iOS 15+ (iPhone/iPad)

---

## 📱 What You'll Need

- iPhone or iPad with iOS 15 or later
- Apple Health app (pre-installed)
- **Shortcuts** app (pre-installed on iOS 13+)
- FurVitals account

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Download the FurVitals Shortcut

1. Open **Safari** on your iPhone (this won't work in Chrome)
2. Visit: `https://fur-vitals.vercel.app/`
3. Go to **Medical Center → Wearables Tab**
4. Click **"Connect Apple Health"**
5. Click **"Download FurVitals Shortcut"**

### Step 2: Add the Shortcut

1. You'll see a preview of the shortcut
2. Tap **"Add Shortcut"** at the bottom
3. Grant Health app permissions when prompted:
   - ✅ **Steps** (Read access)
   - ✅ **Active Energy** (Read access)
   - ✅ **Heart Rate** (Read access - optional)
   - ✅ **Sleep Analysis** (Read access - optional)

### Step 3: Run the Shortcut

1. Open the **Shortcuts** app
2. Find **"FurVitals Health Sync"**
3. Tap to run it
4. Your data will be sent to FurVitals automatically!

### Step 4: Automate (Optional)

**Make it automatic:**

1. Long-press the **FurVitals Health Sync** shortcut
2. Tap **"Automation"**
3. Choose **"Time of Day"**
4. Set it to run every day at 9 PM (or whenever you prefer)
5. Tap **"Done"**

Now your health data syncs automatically every day! 🎉

---

## 🔧 How It Works

The shortcut does 3 things:

1. **Reads Health Data**: Pulls today's steps, active minutes, heart rate, and sleep from Apple Health
2. **Formats Data**: Converts it to JSON format
3. **Sends to FurVitals**: POSTs the data securely to our endpoint

### What Data is Collected?

| Metric | Description | Required |
|--------|-------------|----------|
| **Steps** | Total steps today | ✅ Yes |
| **Active Minutes** | Minutes of activity (moderate-vigorous) | ✅ Yes |
| **Heart Rate** | Average resting heart rate | Optional |
| **Sleep** | Total sleep duration (hours) | Optional |
| **Date** | Today's date (YYYY-MM-DD) | ✅ Yes |

---

## 🛡️ Privacy & Security

### What We Access
- ✅ Daily activity metrics (steps, active minutes)
- ✅ Heart rate and sleep (if you choose to share)
- ❌ **Never** your location
- ❌ **Never** your personal health records
- ❌ **Never** identifiable information

### How We Store It
- Encrypted in transit (HTTPS)
- Stored securely in our database
- Associated with your FurVitals account only
- **You can disconnect anytime**

### Your Control
- View all synced data in the app
- Disconnect in **Medical Center → Wearables**
- Delete your data by deleting your account

---

## 📊 What Gets Updated?

Once connected, your **FurVitals Dashboard** will show:

1. **Readiness Score**: Updated based on your activity
2. **Activity Chart**: Real data instead of mock data
3. **Wellness Recommendations**: Personalized for your activity level
4. **Daily Activity Minutes**: Live count from Apple Health

---

## 🧪 Testing the Connection

### Run the Shortcut Manually

1. Open **Shortcuts** app
2. Tap **FurVitals Health Sync**
3. You should see: "✅ Data sent successfully!"

### Check FurVitals

1. Open FurVitals app
2. Go to **Medical Center → Wearables**
3. You should see: **"Apple Health: Connected ✓"**

---

## 🐛 Troubleshooting

### Issue: "Could not send data"

**Solution**:
- Check your internet connection
- Make sure you're using Safari (not Chrome)
- Re-download the shortcut

### Issue: "Health access denied"

**Solution**:
1. Open **Settings → Privacy → Health**
2. Find **Shortcuts**
3. Enable all the health categories
4. Re-run the shortcut

### Issue: "Shortcut not found"

**Solution**:
- Make sure you're using Safari on iOS
- Download the `.shortcut` file again
- Check that you tapped "Add Shortcut"

### Issue: "Data not showing in FurVitals"

**Solution**:
1. Run the shortcut manually
2. Wait 30 seconds
3. Refresh the FurVitals dashboard
4. Check **Medical Center → Wearables** for connection status

---

## 📱 Shortcut Code Structure

For advanced users, here's what the shortcut does:

```
1. Get Today's Date
   └─> Format: YYYY-MM-DD

2. Get Health Samples (Steps)
   └─> From: Today
   └─> Sum total steps

3. Get Health Samples (Active Energy)
   └─> From: Today
   └─> Convert to minutes (calories ÷ 5)

4. Get Health Samples (Heart Rate) [Optional]
   └─> From: Today
   └─> Average resting HR

5. Get Health Samples (Sleep) [Optional]
   └─> From: Last night
   └─> Total duration in minutes

6. Build JSON Dictionary
   {
     "steps": <total_steps>,
     "activeMinutes": <active_minutes>,
     "heartRate": <avg_heart_rate>,
     "sleep": <sleep_duration>,
     "date": "YYYY-MM-DD",
     "deviceId": "iPhone"
   }

7. POST to API
   └─> URL: https://fur-vitals.vercel.app/api/health/apple
   └─> Method: POST
   └─> Headers: Content-Type: application/json
   └─> Body: JSON from step 6

8. Show Notification
   └─> "✅ FurVitals data synced!"
```

---

## 🔄 Manual Shortcut Creation

If the download doesn't work, you can build it yourself:

### 1. Create New Shortcut

1. Open **Shortcuts** app
2. Tap **"+"** (new shortcut)
3. Name it **"FurVitals Health Sync"**

### 2. Add Actions

**Action 1**: Current Date
- Search for **"Current Date"**
- Add it

**Action 2**: Format Date
- Search for **"Format Date"**
- Format: **Custom**
- Format String: `YYYY-MM-DD`

**Action 3**: Get Steps
- Search for **"Find Health Samples"**
- Type: **Step Count**
- Time: **Today**
- Sort: **Latest First**

**Action 4**: Calculate Statistics
- Search for **"Calculate Statistics"**
- On: **Health Samples**
- Type: **Sum**

**Action 5**: Set Variable
- Search for **"Set Variable"**
- Name: `Steps`
- Value: **Statistics Result**

**Action 6**: Get Active Energy
- Search for **"Find Health Samples"**
- Type: **Active Energy Burned**
- Time: **Today**

**Action 7**: Calculate Active Minutes
- Divide **Active Energy** by 5
- Set Variable: `ActiveMinutes`

**Action 8**: Build Dictionary
- Search for **"Dictionary"**
- Add keys:
  ```
  steps: <Steps variable>
  activeMinutes: <ActiveMinutes variable>
  date: <Formatted Date>
  deviceId: "iPhone"
  ```

**Action 9**: Get Contents of URL
- URL: `https://fur-vitals.vercel.app/api/health/apple`
- Method: **POST**
- Headers:
  - `Content-Type`: `application/json`
- Request Body: **Dictionary**

**Action 10**: Show Notification
- Title: "FurVitals Sync Complete"
- Body: "Your health data has been synced!"

### 3. Save & Test

1. Tap **Done**
2. Run the shortcut
3. Grant Health permissions
4. Check FurVitals for data

---

## 🎯 Expected Results

### After First Sync

You should see in FurVitals:

```
✅ Apple Health: Connected
📊 Today's Steps: 8,432
🏃 Active Minutes: 45
❤️ Heart Rate: 72 bpm
💤 Sleep: 7.5 hours
🕐 Last Sync: Just now
```

### After Automation

- Syncs automatically every day at 9 PM
- No manual action needed
- Always up-to-date data
- Notification confirms sync

---

## 🔗 Additional Resources

- **Apple Shortcuts User Guide**: [support.apple.com/guide/shortcuts](https://support.apple.com/guide/shortcuts/welcome/ios)
- **Health App Guide**: [support.apple.com/en-us/HT203037](https://support.apple.com/en-us/HT203037)
- **FurVitals Support**: support@furvitals.app

---

## 📝 Changelog

### Version 1.0 (Jan 21, 2026)
- Initial release
- Support for Steps, Active Minutes, Heart Rate, Sleep
- Automatic daily sync option
- Secure HTTPS endpoint

---

## 🎉 You're All Set!

Your Apple Health data is now syncing with FurVitals. Your wellness insights will be more accurate and personalized!

**Questions?** Contact us at support@furvitals.app 🐾

---

**Made with ❤️ for better health tracking** 🍎
