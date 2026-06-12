# 🌿 SmartAgro — AI-Powered Precision Agriculture Platform

<div align="center">

> ![SmartAgro](https://img.shields.io/badge/SmartAgro-Precision%20Agriculture-22c55e?style=for-the-badge&logo=leaf&logoColor=white)

<br/>

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![Deployed on Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?style=flat-square&logo=render&logoColor=white)](https://render.com)
[![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8?style=flat-square&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Made for India](https://img.shields.io/badge/Made%20for-India%20🇮🇳-FF9933?style=flat-square)](https://github.com)

**Empowering India's farmers with real-time market intelligence, AI crop diagnostics, smart weather alerts, and a multilingual voice-enabled AI assistant.**

### 🚀 Live Demo

## [![Click Here to Open 👉](https://img.shields.io/badge/Click%20Here%20to%20Open%20👉-Live%20Demo-FF6B6B?style=for-the-badge)](https://smartagro-1-4czz.onrender.com)

> 📱 Open on mobile and tap **"Add to Home Screen"** to install as a native app!

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [PWA — Install as App](#-pwa--install-as-native-app)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Multilingual Support](#-multilingual-support)
- [Contributing](#-contributing)
- [Acknowledgements](#-acknowledgements)

---

## 🌾 About the Project

**SmartAgro** is a full-stack Progressive Web App (PWA) built for Indian farmers to make data-driven agricultural decisions. It combines real-time mandi (market) price intelligence, AI-powered crop disease diagnosis, weather-based crop recommendations, smart farming alerts, and a voice-enabled AI chatbot assistant — all in one beautiful, multilingual dashboard installable on any mobile device.

> Built with ❤️ for India's 140 million farmers.

---

## ✨ Features

### 📊 Live Market Prices
- Real-time commodity prices across **20+ Indian cities**
- Price trend charts — Line, Bar, and Radar views
- Filter by demand level — Very High, High, Medium, Low
- Filter by price direction — Rising or Falling
- Live scrolling price ticker
- City-wise price comparison table
- Instant city search with loading animation

### 🔬 AI Crop Diagnosis
- Upload or capture a photo of your crop directly from camera
- Powered by **Groq Vision AI (LLaMA 4 Scout & Maverick)**
- Identifies diseases, pests, and nutrient deficiencies with high accuracy
- Provides eco-friendly and chemical remedy plans with dosage
- Shows severity level, affected parts, and estimated recovery timeline
- Effectiveness progress bars for each remedy

### 🌤️ Weather Intelligence
- Real-time weather via OpenWeatherMap
- 7-day forecast with detailed daily breakdown
- AI-powered crop recommendations based on current conditions
- Seasonal farming advisory calendar with week-by-week action plan
- Pesticide and pest control guide tailored to weather conditions

### 🔔 Smart Alerts
- Pest and disease risk alerts based on humidity and temperature
- Extreme weather warnings — heat, frost, storms, heavy rain
- Seasonal pest calendar showing active pests this season
- Pesticide safety guide with safe dosage and harmful combinations
- Crops at risk and safe crops for current conditions
- Risk level overview chart

### 🤖 Kisan Helper — AI Voice Chatbot
- Floating voice + chat assistant available on **all pages**
- Powered by **Groq LLaMA 3.3 70B** for fast, accurate responses
- **Voice input** — speak your question in your language, text auto-fills and sends
- **Typewriter animation** for AI responses, just like ChatGPT
- **Language selector** on first open — choose your preferred language
- **Stop button** to interrupt AI response mid-typing
- **New Chat (+)** button to reset conversation
- Auto-detects language change commands in chat (e.g. "talk in Hindi")
- Syncs with app language selector automatically
- Answers about crops, weather, market prices, government schemes (PM-KISAN, Fasal Bima, KCC)
- **Kisan Helpline 1800-180-1551** button on every page — opens Google search

### 📱 Progressive Web App (PWA)
- **Installable on any mobile** — Android, iPhone, Windows, any OS
- Opens full-screen like a native app, no browser bar
- **Offline support** — cached pages work without internet
- Custom app icon and splash screen
- App shortcuts for Diagnose, Market, and Alerts
- Service worker for background caching

### 🌐 Multilingual Support — 23 Indian Languages
- Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Urdu, Maithili, Santali, Kashmiri, Nepali, Sindhi, Konkani, Manipuri, Bodo, Dogri, Sanskrit, and English
- Instant UI translation on language switch
- Dynamic content (alerts, crop names, advisory text) also translates
- Kisan Helper chatbot replies in the selected language

### 🎨 UI/UX
- Dark/Light theme toggle saved across sessions
- **Mobile bottom navigation bar** — Home, Diagnose, Mandi Prices, Alerts
- Fully responsive — optimized for all screen sizes
- Smooth animations, typewriter effects, ripple buttons
- Floating weather card on dashboard hero

---

## 📱 PWA — Install as Native App

### Android (Chrome)
1. Open Chrome → go to `smartagro-pi6m.onrender.com`
2. Tap **⋮ menu** → **"Add to Home Screen"** or **"Install App"**
3. Tap **Install** ✅

### iPhone (Safari)
1. Open Safari → go to `smartagro-pi6m.onrender.com`
2. Tap **Share button** (bottom center)
3. Tap **"Add to Home Screen"** → **Add** ✅

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python 3.11, Flask 3.0 |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **AI Chatbot** | Groq API — LLaMA 3.3 70B Versatile |
| **AI Vision** | Groq API — LLaMA 4 Scout & Maverick |
| **Market Data** | API Ninjas Commodity Price API |
| **Weather** | OpenWeatherMap API |
| **Charts** | Chart.js |
| **Icons** | Font Awesome 6.5 |
| **Fonts** | Google Fonts — Syne, Inter |
| **PWA** | Service Worker, Web App Manifest |
| **Voice** | Web Speech API (SpeechRecognition) |
| **Deployment** | Render |

---

## 📁 Project Structure

```
SmartAgro/
│
├── app.py                    # Flask app & all API routes
├── requirements.txt          # Python dependencies
├── runtime.txt               # Python version for Render
├── .env                      # Environment variables (not committed)
├── .gitignore
│
├── templates/
│   ├── index.html            # Dashboard
│   ├── diagnose.html         # AI Crop Diagnosis
│   ├── market.html           # Market Prices
│   ├── alerts.html           # Smart Alerts
│   └── offline.html          # PWA offline fallback page
│
└── static/
    ├── css/
    │   ├── main.css           # Global styles, design tokens, mobile nav
    │   ├── dashboard.css      # Dashboard page styles
    │   ├── diagnose.css       # Diagnose page styles
    │   ├── market.css         # Market page styles
    │   └── alerts.css         # Alerts page styles
    ├── js/
    │   ├── main.js            # Global JS — navbar, toast, SW registration
    │   ├── dashboard.js       # Dashboard — weather, crops, calendar
    │   ├── diagnose.js        # Crop diagnosis logic
    │   ├── market.js          # Market prices & charts
    │   ├── alerts.js          # Alerts & pest calendar
    │   ├── translations.js    # 23-language translation engine
    │   └── kisan-helper.js    # AI voice chatbot widget
    ├── manifest.json          # PWA manifest
    ├── service-worker.js      # PWA service worker
    └── icons/
        ├── icon-192.png       # PWA app icon (192×192)
        └── icon-512.png       # PWA app icon (512×512)
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
GROQ_API_KEY=your_groq_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
NINJA_API_KEY=your_ninja_api_key
```

| Variable | Where to Get | Free Tier |
|---|---|---|
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) | ✅ Free |
| `OPENWEATHER_API_KEY` | [openweathermap.org/api](https://openweathermap.org/api) | ✅ Free |
| `NINJA_API_KEY` | [api-ninjas.com](https://api-ninjas.com) | ✅ 50,000 req/month free |

> ⚠️ Never commit your `.env` file to GitHub. It is already listed in `.gitignore`.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Dashboard page |
| `GET` | `/diagnose` | Crop diagnosis page |
| `GET` | `/market` | Market prices page |
| `GET` | `/alerts` | Alerts page |
| `GET` | `/offline` | PWA offline fallback page |
| `GET` | `/api/weather?lat=&lon=` | Current weather + 7-day forecast |
| `GET` | `/api/market?location=` | Market prices with optional city filter |
| `POST` | `/api/diagnose` | AI crop disease diagnosis (vision) |
| `POST` | `/api/crop-recommendations` | Crop recommendations by weather |
| `POST` | `/api/alerts` | Weather-based smart farming alerts |
| `POST` | `/api/chat` | Kisan Helper AI chatbot (multilingual) |

---

## 🌐 Multilingual Support

SmartAgro supports **23 Indian languages** with full UI translation and AI responses:

| Language | Code | Language | Code |
|---|---|---|---|
| English | `en` | Hindi | `hi` |
| Bengali | `bn` | Telugu | `te` |
| Marathi | `mr` | Tamil | `ta` |
| Gujarati | `gu` | Kannada | `kn` |
| Malayalam | `ml` | Punjabi | `pa` |
| Odia | `or` | Assamese | `as` |
| Urdu | `ur` | Maithili | `mai` |
| Nepali | `ne` | Santali | `sat` |
| Kashmiri | `ks` | Sindhi | `sd` |
| Konkani | `kok` | Manipuri | `mni` |
| Bodo | `bodo` | Dogri | `doi` |
| Sanskrit | `sa` | | |

---

## 🙏 Acknowledgements

- [Groq](https://groq.com) — blazing fast AI inference for chatbot and vision
- [OpenWeatherMap](https://openweathermap.org) — reliable weather data
- [API Ninjas](https://api-ninjas.com) — commodity price data
- [Chart.js](https://chartjs.org) — beautiful interactive charts
- [Font Awesome](https://fontawesome.com) — icon library
- [Google Fonts](https://fonts.google.com) — Syne & Inter typography

---

<div align="center">

**Built for India's farmers 🌾**

If this project helped you, please consider giving it a ⭐

[![GitHub stars](https://img.shields.io/github/stars/puspendugorai-coder/SmartAgro?style=social)](https://github.com/puspendugorai-coder/SmartAgro)

</div>
