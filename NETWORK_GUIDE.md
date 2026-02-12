# 🌐 Network Access Update - Installation Guide

## ✨ What's New

This update adds full network access capabilities to Neuro-Sentry Defense:

1. **🔄 Auto-Detection** - API automatically uses the right URL (localhost or network IP)
2. **🌐 Network Panel** - Beautiful UI showing connection info + QR codes
3. **📱 Mobile Access** - Scan QR code to open on your phone instantly
4. **🚀 Smart Startup** - Shows network URLs when you start the app

---

## 📦 Installation Steps

### Step 1: Install QR Code Package

First, you need to install the `qrcode` npm package:

```bash
cd /path/to/neuro-sentry-merged
npm install qrcode
```

### Step 2: Replace/Update Files

Copy the files from the `network-update` folder to your project:

```bash
# From the network-update folder, copy to your project root:

# 1. Services
cp src/services/api.js YOUR_PROJECT/src/services/api.js

# 2. Components
cp src/components/NetworkPanel.jsx YOUR_PROJECT/src/components/NetworkPanel.jsx
cp src/components/index.js YOUR_PROJECT/src/components/index.js

# 3. Main App
cp src/App.jsx YOUR_PROJECT/src/App.jsx

# 4. Configuration
cp .env YOUR_PROJECT/.env

# 5. Startup Script
cp start-all.sh YOUR_PROJECT/start-all.sh
chmod +x YOUR_PROJECT/start-all.sh
```

### Step 3: Verify Package.json

Make sure your `package.json` includes the `qrcode` dependency:

```json
{
  "dependencies": {
    // ... your other dependencies
    "qrcode": "^1.5.3"
  }
}
```

### Step 4: Test It!

Start the application:

```bash
./start-all.sh
```

You should now see:
- ✅ Network IP displayed in startup logs
- ✅ Both local and network URLs shown
- ✅ Network button in bottom-right corner of app
- ✅ Click Network button to see QR codes

---

## 🎯 Quick File Reference

### Files to REPLACE:
- `src/services/api.js` - Smart network detection
- `src/components/NetworkPanel.jsx` - Network UI panel (if exists, or add as new)
- `src/components/index.js` - Component exports
- `src/App.jsx` - Includes NetworkPanel
- `.env` - Updated with auto detection
- `start-all.sh` - Network info display

### Files to ADD (if they don't exist):
- `src/components/NetworkPanel.jsx` - New network panel component

---

## 🔍 What Changed in Each File

### `src/services/api.js`
- Added `getApiBaseUrl()` function that detects hostname
- Automatically uses localhost or network IP based on access method
- Added `getApiUrl()` export for displaying current API URL

### `src/components/NetworkPanel.jsx` (NEW)
- Floating network button in bottom-right
- Modal panel with QR codes
- Shows local and network URLs
- Copy-to-clipboard functionality
- Connection guide

### `src/App.jsx`
- Added `<NetworkPanel backendConnected={backendConnected} />` component
- Imports NetworkPanel from components

### `.env`
- Changed `VITE_API_URL=http://localhost:8000` to `VITE_API_URL=auto`

### `start-all.sh`
- Added network IP detection
- Displays network URLs on startup
- Shows mobile access instructions
- Auto-installs qrcode package if missing

---

## 🧪 Testing

### Test Local Access:
1. Start the app: `./start-all.sh`
2. Open browser: `http://localhost:5173`
3. Should work normally

### Test Network Access:
1. Note the network IP shown in startup (e.g., `192.168.0.100`)
2. On another device on same WiFi, open: `http://192.168.0.100:5173`
3. Should work and show network mode indicator

### Test Network Panel:
1. Click the floating Network button (bottom-right)
2. Should see:
   - Local URL with QR code
   - Network URL with QR code (if on network)
   - Backend API URL
   - Connection guide

### Test Mobile QR Code:
1. Open app on computer
2. Click Network button
3. Use phone camera to scan QR code
4. Should open app on phone

---

## 🔧 Troubleshooting

### Network URL Not Showing
- Make sure you're accessing via the network IP, not localhost
- The script should auto-detect your network IP on startup

### Backend Not Connecting from Network
- Ensure backend is running on `0.0.0.0:8000` (already configured)
- Check firewall settings - ports 5173 and 8000 must be open
- Windows: Allow through Windows Firewall
- macOS: System Preferences → Security & Privacy → Firewall
- Linux: `sudo ufw allow 5173` and `sudo ufw allow 8000`

### QR Code Not Working
- Make sure `qrcode` package is installed: `npm install qrcode`
- Check browser console for errors
- Verify mobile device is on same WiFi network

### "Module not found: qrcode"
Run: `npm install qrcode`

---

## 📱 Usage Guide

### For Local Use:
Just use `http://localhost:5173` as before - everything works the same!

### For Network Use:
1. Start the app with `./start-all.sh`
2. Note the network URL in the startup logs
3. Share that URL with devices on your network
4. Or click Network button and share QR code

### For Mobile Use:
1. Ensure phone is on same WiFi
2. Click Network button in app
3. Scan QR code with phone camera
4. Instant access!

---

## 🎨 Features Overview

### Auto-Detection
The API service automatically determines the right URL:
- Localhost → `http://localhost:8000`
- Network → `http://YOUR_IP:8000`

### Network Panel
- Shows both local and network URLs
- Generates QR codes for easy mobile access
- Copy URLs to clipboard with one click
- Connection status indicators
- Helpful setup guide

### Smart Startup
The startup script now:
- Detects your network IP
- Displays both local and network URLs
- Shows mobile access instructions
- Guides you through sharing access

---

## ✅ Checklist

After installation, verify:

- [ ] `npm install qrcode` completed successfully
- [ ] All files copied to correct locations
- [ ] `.env` has `VITE_API_URL=auto`
- [ ] `start-all.sh` is executable (`chmod +x`)
- [ ] App starts without errors
- [ ] Network button appears in bottom-right
- [ ] Clicking Network button shows panel
- [ ] QR codes are visible
- [ ] Backend connects properly
- [ ] Can access from another device on network

---

## 🆘 Need Help?

Common issues:
1. **Can't install qrcode**: Make sure you're in the project directory
2. **Network panel doesn't show**: Verify NetworkPanel.jsx was copied
3. **No network access**: Check firewall settings for ports 5173 & 8000
4. **QR code errors**: Ensure qrcode package is installed

---

Enjoy your network-enabled Neuro-Sentry Defense! 🚀