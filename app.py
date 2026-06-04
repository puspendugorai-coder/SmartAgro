from flask import Flask, render_template, request, jsonify
import requests
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
load_dotenv() 

app = Flask(__name__)

# ─── API KEYS (replace with your own) ───────────────────────────────────────
OPENWEATHER_API_KEY = os.environ.get("OPENWEATHER_API_KEY")
CLAUDE_API_KEY = os.environ.get("CLAUDE_API_KEY")

# ─── Routes ─────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/diagnose")
def diagnose():
    return render_template("diagnose.html")

@app.route("/market")
def market():
    return render_template("market.html")

@app.route("/alerts")
def alerts():
    return render_template("alerts.html")

# ─── Weather API ─────────────────────────────────────────────────────────────

@app.route("/api/weather")
def get_weather():
    lat = request.args.get("lat")
    lon = request.args.get("lon")
    if not lat or not lon:
        return jsonify({"error": "Location required"}), 400

    # Current weather
    current_url = (
        f"https://api.openweathermap.org/data/2.5/weather"
        f"?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
    )
    # 7-day forecast (One Call API 3.0 or 2.5)
    forecast_url = (
        f"https://api.openweathermap.org/data/2.5/forecast"
        f"?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric&cnt=56"
    )

    try:
        current_resp = requests.get(current_url, timeout=10)
        forecast_resp = requests.get(forecast_url, timeout=10)
        current_data = current_resp.json()
        forecast_data = forecast_resp.json()

        # Process 7-day forecast (group by day)
        daily = {}
        if forecast_data.get("list"):
            for item in forecast_data["list"]:
                day = datetime.fromtimestamp(item["dt"]).strftime("%Y-%m-%d")
                if day not in daily:
                    daily[day] = {
                        "date": day,
                        "temp_max": item["main"]["temp_max"],
                        "temp_min": item["main"]["temp_min"],
                        "description": item["weather"][0]["description"],
                        "icon": item["weather"][0]["icon"],
                        "humidity": item["main"]["humidity"],
                        "wind_speed": item["wind"]["speed"],
                        "rain": item.get("rain", {}).get("3h", 0),
                    }
                else:
                    if item["main"]["temp_max"] > daily[day]["temp_max"]:
                        daily[day]["temp_max"] = item["main"]["temp_max"]
                    if item["main"]["temp_min"] < daily[day]["temp_min"]:
                        daily[day]["temp_min"] = item["main"]["temp_min"]

        forecast_list = list(daily.values())[:7]

        return jsonify({
            "current": {
                "city": current_data.get("name", "Your Location"),
                "temp": round(current_data["main"]["temp"]),
                "feels_like": round(current_data["main"]["feels_like"]),
                "humidity": current_data["main"]["humidity"],
                "description": current_data["weather"][0]["description"],
                "icon": current_data["weather"][0]["icon"],
                "wind_speed": current_data["wind"]["speed"],
                "pressure": current_data["main"]["pressure"],
                "visibility": current_data.get("visibility", 0) / 1000,
                "uv": 3,  # UV requires paid tier
                "rain": current_data.get("rain", {}).get("1h", 0),
            },
            "forecast": forecast_list
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ─── Crop Recommendations ────────────────────────────────────────────────────

@app.route("/api/crop-recommendations", methods=["POST"])
def crop_recommendations():
    data = request.json
    temp = data.get("temp", 25)
    humidity = data.get("humidity", 60)
    rain = data.get("rain", 0)
    city = data.get("city", "India")
    season = get_season(datetime.now().month)

    crops = recommend_crops(temp, humidity, rain, season)
    calendar = generate_advisory_calendar(crops[:3])

    return jsonify({
        "season": season,
        "crops": crops,
        "calendar": calendar,
        "pesticides": get_pesticide_guide(crops[:3])
    })


def get_season(month):
    if month in [6, 7, 8, 9]:
        return "Kharif (Monsoon)"
    elif month in [10, 11, 12, 1, 2]:
        return "Rabi (Winter)"
    else:
        return "Zaid (Summer)"


def recommend_crops(temp, humidity, rain, season):
    all_crops = [
        {"name": "Rice", "icon": "🌾", "temp_range": (20, 38), "humidity_range": (70, 100),
         "season": "Kharif (Monsoon)", "water": "High", "yield": "3-5 tonnes/ha",
         "profit": "₹45,000-65,000/ha", "duration": "90-150 days",
         "description": "Ideal for high humidity and warm conditions",
         "soil": "Clay loam, alluvial", "fertilizer": "NPK 120:60:60 kg/ha"},
        {"name": "Wheat", "icon": "🌿", "temp_range": (10, 25), "humidity_range": (40, 65),
         "season": "Rabi (Winter)", "water": "Medium", "yield": "4-6 tonnes/ha",
         "profit": "₹50,000-75,000/ha", "duration": "100-150 days",
         "description": "Best suited for cool, dry winters",
         "soil": "Well-drained loam", "fertilizer": "NPK 120:60:40 kg/ha"},
        {"name": "Maize", "icon": "🌽", "temp_range": (18, 35), "humidity_range": (50, 80),
         "season": "Kharif (Monsoon)", "water": "Medium", "yield": "5-8 tonnes/ha",
         "profit": "₹40,000-60,000/ha", "duration": "80-110 days",
         "description": "Versatile crop, good for warm humid weather",
         "soil": "Sandy loam to clay loam", "fertilizer": "NPK 150:75:75 kg/ha"},
        {"name": "Cotton", "icon": "☁️", "temp_range": (25, 40), "humidity_range": (40, 70),
         "season": "Kharif (Monsoon)", "water": "Medium", "yield": "2-3 tonnes/ha",
         "profit": "₹60,000-90,000/ha", "duration": "150-180 days",
         "description": "Thrives in hot dry spells with moderate rain",
         "soil": "Black cotton soil", "fertilizer": "NPK 90:45:45 kg/ha"},
        {"name": "Tomato", "icon": "🍅", "temp_range": (18, 30), "humidity_range": (60, 80),
         "season": "Zaid (Summer)", "water": "Medium", "yield": "20-40 tonnes/ha",
         "profit": "₹80,000-1,50,000/ha", "duration": "60-80 days",
         "description": "High value crop for moderate climates",
         "soil": "Sandy loam, rich organic matter", "fertilizer": "NPK 100:60:60 kg/ha"},
        {"name": "Sugarcane", "icon": "🎋", "temp_range": (24, 38), "humidity_range": (75, 90),
         "season": "Kharif (Monsoon)", "water": "Very High", "yield": "70-100 tonnes/ha",
         "profit": "₹70,000-1,00,000/ha", "duration": "300-360 days",
         "description": "Requires hot climate and heavy rainfall",
         "soil": "Deep loam, good drainage", "fertilizer": "NPK 250:80:100 kg/ha"},
        {"name": "Soybean", "icon": "🫘", "temp_range": (20, 32), "humidity_range": (60, 80),
         "season": "Kharif (Monsoon)", "water": "Medium", "yield": "2-3 tonnes/ha",
         "profit": "₹35,000-55,000/ha", "duration": "90-120 days",
         "description": "Nitrogen-fixing legume for warm monsoon",
         "soil": "Well-drained loam", "fertilizer": "NPK 30:60:40 kg/ha"},
        {"name": "Mustard", "icon": "🌻", "temp_range": (10, 25), "humidity_range": (40, 60),
         "season": "Rabi (Winter)", "water": "Low", "yield": "1-2 tonnes/ha",
         "profit": "₹25,000-40,000/ha", "duration": "90-110 days",
         "description": "Cool weather oil seed crop",
         "soil": "Sandy loam, well-drained", "fertilizer": "NPK 80:40:40 kg/ha"},
    ]

    scored = []
    for crop in all_crops:
        score = 0
        if crop["temp_range"][0] <= temp <= crop["temp_range"][1]:
            score += 40
        elif abs(temp - sum(crop["temp_range"]) / 2) < 5:
            score += 20
        if crop["humidity_range"][0] <= humidity <= crop["humidity_range"][1]:
            score += 30
        if crop["season"] == season:
            score += 30
        crop["score"] = score
        crop["match"] = f"{min(100, score)}%"
        scored.append(crop)

    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored


def generate_advisory_calendar(crops):
    today = datetime.now()
    calendar = []
    activities = [
        {"week": 1, "activity": "Soil preparation & ploughing", "type": "preparation"},
        {"week": 2, "activity": "Seed treatment & sowing", "type": "sowing"},
        {"week": 3, "activity": "First irrigation", "type": "irrigation"},
        {"week": 4, "activity": "Apply basal fertilizer (NPK)", "type": "fertilizer"},
        {"week": 6, "activity": "Weeding & thinning", "type": "maintenance"},
        {"week": 8, "activity": "Apply Urea (top dressing)", "type": "fertilizer"},
        {"week": 10, "activity": "Pest & disease inspection", "type": "pesticide"},
        {"week": 12, "activity": "Spray fungicide if required", "type": "pesticide"},
        {"week": 16, "activity": "Foliar spray micronutrients", "type": "fertilizer"},
        {"week": 20, "activity": "Pre-harvest irrigation stop", "type": "irrigation"},
        {"week": 22, "activity": "Harvest preparation", "type": "harvest"},
    ]
    for act in activities:
        date = today + timedelta(weeks=act["week"])
        calendar.append({
            "date": date.strftime("%d %b %Y"),
            "activity": act["activity"],
            "type": act["type"],
            "week": act["week"]
        })
    return calendar


def get_pesticide_guide(crops):
    guides = {
        "Rice": [
            {"pest": "Brown Plant Hopper", "pesticide": "Imidacloprid 17.8 SL",
             "dose": "125 ml/ha", "timing": "At 30 & 60 days after transplanting", "eco": False},
            {"pest": "Leaf folder", "pesticide": "Neem Oil 5%",
             "dose": "2.5 L/ha", "timing": "At first sign of damage", "eco": True},
        ],
        "Wheat": [
            {"pest": "Aphids", "pesticide": "Dimethoate 30 EC",
             "dose": "1 L/ha", "timing": "At tillering stage", "eco": False},
            {"pest": "Yellow rust", "pesticide": "Propiconazole 25 EC",
             "dose": "500 ml/ha", "timing": "At boot leaf stage", "eco": False},
        ],
        "Maize": [
            {"pest": "Fall Armyworm", "pesticide": "Spinetoram 11.7 SC",
             "dose": "450 ml/ha", "timing": "7-10 days after infestation", "eco": False},
            {"pest": "Stem borer", "pesticide": "Emamectin Benzoate 5 SG",
             "dose": "220 g/ha", "timing": "At whorl stage", "eco": False},
        ],
    }
    result = []
    for crop in crops:
        if crop["name"] in guides:
            result.append({"crop": crop["name"], "guides": guides[crop["name"]]})
    return result


# ─── Diagnose Crop (Anthropic Vision API) ────────────────────────────────────

@app.route("/api/diagnose", methods=["POST"])
def diagnose_crop():
    data = request.json
    image_b64 = data.get("image")
    if not image_b64:
        return jsonify({"error": "No image provided"}), 400

    headers = {
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    }
    body = {
        "model": "claude-opus-4-5",
        "max_tokens": 1024,
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/jpeg",
                            "data": image_b64,
                        },
                    },
                    {
                        "type": "text",
                        "text": (
                            "You are an expert agricultural plant pathologist. "
                            "Analyze this crop image and respond ONLY in valid JSON with this exact structure:\n"
                            "{\n"
                            '  "disease": "Disease name or Healthy",\n'
                            '  "confidence": 85,\n'
                            '  "severity": "Mild/Moderate/Severe",\n'
                            '  "affected_part": "Leaves/Stem/Root/Fruit",\n'
                            '  "cause": "Brief cause description",\n'
                            '  "eco_remedies": [\n'
                            '    {"remedy": "Remedy name", "method": "How to apply", "frequency": "How often", "effectiveness": 80}\n'
                            "  ],\n"
                            '  "chemical_remedies": [\n'
                            '    {"name": "Product name", "dose": "Dosage", "interval": "Application interval"}\n'
                            "  ],\n"
                            '  "prevention": ["Tip 1", "Tip 2"],\n'
                            '  "recovery_timeline": "Expected recovery time"\n'
                            "}"
                        ),
                    },
                ],
            }
        ],
    }

    try:
        resp = requests.post(
            "https://api.anthropic.com/v1/messages",
            headers=headers,
            json=body,
            timeout=30,
        )
        result = resp.json()
        text = result["content"][0]["text"]
        import json, re
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return jsonify(json.loads(match.group()))
        return jsonify({"error": "Could not parse response"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ─── Market Prices (mock realistic data) ─────────────────────────────────────

@app.route("/api/market-prices")
def market_prices():
    location = request.args.get("location", "all").lower()

    market_data = {
        "Delhi": [
            {"crop": "Wheat", "price": 2150, "unit": "₹/quintal", "change": +2.3, "demand": "High"},
            {"crop": "Rice", "price": 3200, "unit": "₹/quintal", "change": -1.2, "demand": "Medium"},
            {"crop": "Maize", "price": 1850, "unit": "₹/quintal", "change": +4.1, "demand": "High"},
            {"crop": "Cotton", "price": 6500, "unit": "₹/quintal", "change": -0.8, "demand": "Medium"},
            {"crop": "Tomato", "price": 2800, "unit": "₹/quintal", "change": +12.5, "demand": "Very High"},
        ],
        "Mumbai": [
            {"crop": "Rice", "price": 3450, "unit": "₹/quintal", "change": +1.5, "demand": "High"},
            {"crop": "Wheat", "price": 2280, "unit": "₹/quintal", "change": +0.8, "demand": "Medium"},
            {"crop": "Sugarcane", "price": 320, "unit": "₹/quintal", "change": +3.2, "demand": "High"},
            {"crop": "Cotton", "price": 6800, "unit": "₹/quintal", "change": +2.1, "demand": "Very High"},
            {"crop": "Onion", "price": 1500, "unit": "₹/quintal", "change": -5.3, "demand": "Low"},
        ],
        "Kolkata": [
            {"crop": "Rice", "price": 3100, "unit": "₹/quintal", "change": +2.8, "demand": "Very High"},
            {"crop": "Jute", "price": 4200, "unit": "₹/quintal", "change": +5.1, "demand": "High"},
            {"crop": "Mustard", "price": 5200, "unit": "₹/quintal", "change": +1.9, "demand": "Medium"},
            {"crop": "Potato", "price": 1200, "unit": "₹/quintal", "change": -2.1, "demand": "Medium"},
            {"crop": "Tomato", "price": 2400, "unit": "₹/quintal", "change": +8.3, "demand": "High"},
        ],
        "Chennai": [
            {"crop": "Rice", "price": 2980, "unit": "₹/quintal", "change": +1.2, "demand": "High"},
            {"crop": "Cotton", "price": 6600, "unit": "₹/quintal", "change": +3.5, "demand": "High"},
            {"crop": "Groundnut", "price": 5800, "unit": "₹/quintal", "change": +2.7, "demand": "Medium"},
            {"crop": "Banana", "price": 2200, "unit": "₹/quintal", "change": -1.8, "demand": "High"},
            {"crop": "Tapioca", "price": 1800, "unit": "₹/quintal", "change": +0.5, "demand": "Low"},
        ],
        "Hyderabad": [
            {"crop": "Rice", "price": 3050, "unit": "₹/quintal", "change": +1.8, "demand": "High"},
            {"crop": "Cotton", "price": 6700, "unit": "₹/quintal", "change": +4.2, "demand": "Very High"},
            {"crop": "Maize", "price": 1920, "unit": "₹/quintal", "change": +3.6, "demand": "High"},
            {"crop": "Chilli", "price": 9500, "unit": "₹/quintal", "change": -3.2, "demand": "Medium"},
            {"crop": "Turmeric", "price": 8200, "unit": "₹/quintal", "change": +6.8, "demand": "Very High"},
        ],
        "Pune": [
            {"crop": "Wheat", "price": 2200, "unit": "₹/quintal", "change": +1.5, "demand": "Medium"},
            {"crop": "Sugarcane", "price": 340, "unit": "₹/quintal", "change": +2.8, "demand": "High"},
            {"crop": "Tomato", "price": 3100, "unit": "₹/quintal", "change": +15.2, "demand": "Very High"},
            {"crop": "Onion", "price": 1800, "unit": "₹/quintal", "change": +4.5, "demand": "High"},
            {"crop": "Grapes", "price": 7500, "unit": "₹/quintal", "change": +2.1, "demand": "Medium"},
        ],
        "Ahmedabad": [
            {"crop": "Cotton", "price": 6900, "unit": "₹/quintal", "change": +5.1, "demand": "Very High"},
            {"crop": "Groundnut", "price": 5600, "unit": "₹/quintal", "change": +1.8, "demand": "High"},
            {"crop": "Wheat", "price": 2100, "unit": "₹/quintal", "change": +0.5, "demand": "Medium"},
            {"crop": "Castor", "price": 5100, "unit": "₹/quintal", "change": +3.3, "demand": "Medium"},
            {"crop": "Cumin", "price": 22000, "unit": "₹/quintal", "change": +8.7, "demand": "Very High"},
        ],
        "Lucknow": [
            {"crop": "Wheat", "price": 2050, "unit": "₹/quintal", "change": +1.8, "demand": "High"},
            {"crop": "Sugarcane", "price": 310, "unit": "₹/quintal", "change": +1.2, "demand": "High"},
            {"crop": "Rice", "price": 3000, "unit": "₹/quintal", "change": +2.1, "demand": "Medium"},
            {"crop": "Potato", "price": 1300, "unit": "₹/quintal", "change": -3.5, "demand": "Low"},
            {"crop": "Mustard", "price": 5100, "unit": "₹/quintal", "change": +2.4, "demand": "Medium"},
        ],
        "Jaipur": [
            {"crop": "Wheat", "price": 2080, "unit": "₹/quintal", "change": +2.2, "demand": "High"},
            {"crop": "Mustard", "price": 5300, "unit": "₹/quintal", "change": +3.8, "demand": "Very High"},
            {"crop": "Bajra", "price": 2200, "unit": "₹/quintal", "change": +1.5, "demand": "Medium"},
            {"crop": "Cumin", "price": 21500, "unit": "₹/quintal", "change": +7.2, "demand": "High"},
            {"crop": "Guar", "price": 4500, "unit": "₹/quintal", "change": +4.1, "demand": "High"},
        ],
        "Bhopal": [
            {"crop": "Soybean", "price": 4200, "unit": "₹/quintal", "change": +3.5, "demand": "High"},
            {"crop": "Wheat", "price": 2120, "unit": "₹/quintal", "change": +1.9, "demand": "Medium"},
            {"crop": "Maize", "price": 1880, "unit": "₹/quintal", "change": +2.8, "demand": "Medium"},
            {"crop": "Cotton", "price": 6550, "unit": "₹/quintal", "change": +1.6, "demand": "Medium"},
            {"crop": "Gram", "price": 5800, "unit": "₹/quintal", "change": +0.9, "demand": "Low"},
        ],
    }

    if location == "all" or location == "":
        return jsonify({"markets": market_data, "locations": list(market_data.keys())})
    else:
        # fuzzy match
        for key in market_data:
            if location in key.lower() or key.lower() in location:
                return jsonify({"markets": {key: market_data[key]}, "locations": [key]})
        return jsonify({"markets": {}, "locations": [], "message": "Location not found"})


# ─── Alerts ──────────────────────────────────────────────────────────────────

@app.route("/api/alerts", methods=["POST"])
def get_alerts():
    data = request.json
    temp = data.get("temp", 25)
    humidity = data.get("humidity", 60)
    wind_speed = data.get("wind_speed", 10)
    rain = data.get("rain", 0)
    description = data.get("description", "").lower()

    alerts = []

    # Weather alerts
    if temp > 40:
        alerts.append({"type": "danger", "category": "Weather", "icon": "🌡️",
                        "title": "Extreme Heat Alert",
                        "message": "Temperature above 40°C. Provide shade netting and increase irrigation frequency.",
                        "action": "Schedule irrigation every 4-5 hours. Avoid afternoon spraying."})
    if temp < 5:
        alerts.append({"type": "danger", "category": "Weather", "icon": "❄️",
                        "title": "Frost Warning",
                        "message": "Sub-zero temperatures expected. Frost can destroy standing crops overnight.",
                        "action": "Cover crops with frost cloth. Use smudge pots or sprinkler irrigation."})
    if humidity > 85:
        alerts.append({"type": "warning", "category": "Disease", "icon": "🍄",
                        "title": "High Fungal Disease Risk",
                        "message": "Humidity above 85% creates ideal conditions for fungal diseases like blight and rust.",
                        "action": "Apply preventive fungicide (Mancozeb 75 WP at 2.5 g/L) immediately."})
    if wind_speed > 50:
        alerts.append({"type": "danger", "category": "Weather", "icon": "💨",
                        "title": "High Wind Speed Alert",
                        "message": "Strong winds can cause lodging in tall crops like maize and wheat.",
                        "action": "Avoid spraying. Support tall crops with stakes. Harvest if near maturity."})
    if rain > 50:
        alerts.append({"type": "warning", "category": "Weather", "icon": "🌧️",
                        "title": "Heavy Rainfall Alert",
                        "message": "Excessive rain may cause waterlogging and root rot.",
                        "action": "Ensure field drainage channels are open. Pause irrigation."})
    if "storm" in description or "thunder" in description:
        alerts.append({"type": "danger", "category": "Weather", "icon": "⛈️",
                        "title": "Thunderstorm Warning",
                        "message": "Thunderstorm conditions detected. Risk of lightning and hail damage.",
                        "action": "Stay indoors. Secure farm equipment. Do not operate machinery."})

    # Pest alerts based on conditions
    if 25 <= temp <= 35 and humidity > 70:
        alerts.append({"type": "warning", "category": "Pest", "icon": "🐛",
                        "title": "Aphid & Whitefly Risk",
                        "message": "Warm humid conditions are ideal for aphid multiplication.",
                        "action": "Spray Neem oil (5 ml/L) or Imidacloprid 0.3 ml/L at dusk."})
    if temp > 30 and humidity < 50:
        alerts.append({"type": "warning", "category": "Pest", "icon": "🕷️",
                        "title": "Spider Mite Alert",
                        "message": "Hot dry conditions favour rapid spider mite population growth.",
                        "action": "Apply Abamectin 1.8 EC (0.5 ml/L). Increase soil moisture."})

    # Crop safety alerts
    harmful_crops = []
    if temp > 38:
        harmful_crops.append("Wheat (causes grain shriveling)")
    if humidity > 85 and rain > 20:
        harmful_crops.append("Cotton (boll rot risk)")
    if temp < 10:
        harmful_crops.append("Rice (cold injury)")

    if harmful_crops:
        alerts.append({"type": "info", "category": "Crop Advisory", "icon": "🌾",
                        "title": "Crops at Risk in Current Conditions",
                        "message": f"Avoid growing: {', '.join(harmful_crops)}",
                        "action": "Consider alternate crops better suited to current climate."})

    return jsonify({"alerts": alerts, "total": len(alerts)})


if __name__ == "__main__":
    app.run(host="localhost", debug=True, port=5000)