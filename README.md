# 🌿 SmartAgro — AI-Powered Precision Agriculture Platform

<div align="center">

![SmartAgro Banner](https://img.shields.io/badge/SmartAgro-Precision%20Agriculture-22c55e?style=for-the-badge&logo=leaf&logoColor=white)

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![Deployed on Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?style=flat-square&logo=render&logoColor=white)](https://render.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Made for India](https://img.shields.io/badge/Made%20for-India%20🇮🇳-FF9933?style=flat-square)](https://github.com)

**Empowering India's farmers with real-time market intelligence, AI crop diagnostics, and smart weather alerts.**

[Live Demo](https://smartagro-pi6m.onrender.com) · [Report Bug](../../issues) · [Request Feature](../../issues)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)

---

## 🌾 About the Project

**SmartAgro** is a full-stack web application built for Indian farmers to make data-driven agricultural decisions. It combines real-time mandi (market) price intelligence, AI-powered crop disease diagnosis, weather-based crop recommendations, and smart farming alerts — all in one beautiful, multilingual dashboard.

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
- Upload a photo of your crop
- Powered by **Groq Vision AI (LLaMA 4 Scout & Maverick)**
- Identifies diseases, pests, and nutrient deficiencies
- Provides eco-friendly and chemical remedies
- Shows severity level and estimated recovery timeline

### 🌤️ Weather Intelligence
- Real-time weather via OpenWeatherMap
- 7-day forecast with detailed daily breakdown
- AI-powered crop recommendations based on current conditions
- Seasonal farming advisory calendar

### 🔔 Smart Alerts
- Pest and disease risk alerts based on humidity and temperature
- Extreme weather warnings — heat, frost, storms, heavy rain
- Crop-specific advisories
- Pesticide usage guides with dosage

### 🌐 Multilingual Support
- Supports **10+ Indian languages** including Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, and more

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python 3.11, Flask 3.0 |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **AI / Vision** | Groq API — LLaMA 4 Scout & Maverick |
| **Market Data** | API Ninjas Commodity Price API |
| **Weather** | OpenWeatherMap API |
| **Charts** | Chart.js |
| **Icons** | Font Awesome 6 |
| **Fonts** | Google Fonts — Syne, Inter |
| **Deployment** | Render |

---

## 📁 Project Structure

```
SmartAgro/
│
├── app.py                   # Flask application & all API routes
├── requirements.txt         # Python dependencies
├── runtime.txt              # Python version for Render
├── .env.example             # Example environment variables
├── .gitignore
│
├── templates/
│   ├── index.html           # Dashboard
│   ├── diagnose.html        # AI Crop Diagnosis
│   ├── market.html          # Market Prices
│   └── alerts.html          # Smart Alerts
│
└── static/
    ├── css/
    │   ├── main.css          # Global styles & design tokens
    │   └── market.css        # Market page styles
    └── js/
        ├── main.js           # Global JS — navbar, toast, animations
        ├── market.js         # Market page logic
        └── translations.js   # Multilingual support
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11 or higher
- pip

### Local Setup

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/smartagro.git
cd smartagro
```

**2. Create a virtual environment**
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

**3. Install dependencies**
```bash
pip install -r requirements.txt
```

**4. Set up environment variables**

Create a `.env` file in the root directory and add your API keys:
```env
GROQ_API_KEY=your_groq_api_key_here
OPENWEATHER_API_KEY=your_openweather_key_here
NINJA_API_KEY=your_ninja_api_key_here
```

**5. Run the app**
```bash
python app.py
```

Visit `http://127.0.0.1:5000` in your browser.

---

## 🔑 Environment Variables

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
| `GET` | `/api/weather?lat=&lon=` | Current weather + 7-day forecast |
| `GET` | `/api/market?location=` | Market prices with optional city filter |
| `POST` | `/api/diagnose` | AI crop disease diagnosis |
| `POST` | `/api/crop-recommendations` | Crop recommendations by weather data |
| `POST` | `/api/alerts` | Weather-based smart farming alerts |

---

## 🤝 Contributing

Contributions are welcome and appreciated!

1. Fork the project
2. Create your feature branch
```bash
git checkout -b feature/YourFeatureName
```
3. Commit your changes
```bash
git commit -m "Add: YourFeatureName"
```
4. Push to the branch
```bash
git push origin feature/YourFeatureName
```
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

## 🙏 Acknowledgements

- [Groq](https://groq.com) — blazing fast AI inference
- [OpenWeatherMap](https://openweathermap.org) — reliable weather data
- [API Ninjas](https://api-ninjas.com) — commodity price data
- [Chart.js](https://chartjs.org) — beautiful interactive charts
- [Font Awesome](https://fontawesome.com) — icon library

---

<div align="center">

**Built for India's farmers 🌾**

If this project helped you, please consider giving it a ⭐

</div>
