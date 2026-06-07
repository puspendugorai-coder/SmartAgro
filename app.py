from flask import Flask, render_template, request, jsonify
import requests
import os
import json
import re
import random
from datetime import datetime, timedelta
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

app = Flask(__name__)

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")
GROQ_API_KEY        = os.getenv("GROQ_API_KEY", "")
KINDWISE_API_KEY    = os.getenv("KINDWISE_API_KEY", "")

print(f"[SmartAgro] Weather key : {'OK' if OPENWEATHER_API_KEY else 'MISSING'}")
print(f"[SmartAgro] Groq key    : {'OK (' + GROQ_API_KEY[:8] + '...)' if GROQ_API_KEY else 'MISSING'}")
print(f"[SmartAgro] Kindwise key: {'OK' if KINDWISE_API_KEY else 'MISSING'}")

# ─── Routes ───────────────────────────────────────────────────────────────────
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

# ─── Weather API ──────────────────────────────────────────────────────────────
@app.route("/api/weather")
def get_weather():
    lat = request.args.get("lat")
    lon = request.args.get("lon")
    if not lat or not lon:
        return jsonify({"error": "Location required"}), 400

    current_url  = (f"https://api.openweathermap.org/data/2.5/weather"
                    f"?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric")
    forecast_url = (f"https://api.openweathermap.org/data/2.5/forecast"
                    f"?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric&cnt=56")

    try:
        current_resp  = requests.get(current_url,  timeout=10)
        forecast_resp = requests.get(forecast_url, timeout=10)

        if current_resp.status_code != 200:
            return jsonify({"error": f"Weather API error: {current_resp.text}"}), 500

        current_data  = current_resp.json()
        forecast_data = forecast_resp.json()

        daily = {}
        if forecast_data.get("list"):
            for item in forecast_data["list"]:
                day = datetime.fromtimestamp(item["dt"]).strftime("%Y-%m-%d")
                if day not in daily:
                    daily[day] = {
                        "date":        day,
                        "temp_max":    item["main"]["temp_max"],
                        "temp_min":    item["main"]["temp_min"],
                        "description": item["weather"][0]["description"],
                        "icon":        item["weather"][0]["icon"],
                        "humidity":    item["main"]["humidity"],
                        "wind_speed":  item["wind"]["speed"],
                        "rain":        item.get("rain", {}).get("3h", 0),
                    }
                else:
                    if item["main"]["temp_max"] > daily[day]["temp_max"]:
                        daily[day]["temp_max"] = item["main"]["temp_max"]
                    if item["main"]["temp_min"] < daily[day]["temp_min"]:
                        daily[day]["temp_min"] = item["main"]["temp_min"]

        forecast_list = list(daily.values())[:7]

        return jsonify({
            "current": {
                "city":        current_data.get("name", "Your Location"),
                "temp":        round(current_data["main"]["temp"]),
                "feels_like":  round(current_data["main"]["feels_like"]),
                "humidity":    current_data["main"]["humidity"],
                "description": current_data["weather"][0]["description"],
                "icon":        current_data["weather"][0]["icon"],
                "wind_speed":  current_data["wind"]["speed"],
                "pressure":    current_data["main"]["pressure"],
                "visibility":  current_data.get("visibility", 0) / 1000,
                "rain":        current_data.get("rain", {}).get("1h", 0),
            },
            "forecast": forecast_list
        })
    except Exception as e:
        print(f"[Weather error] {e}")
        return jsonify({"error": str(e)}), 500


# ─── Crop Recommendations ─────────────────────────────────────────────────────
@app.route("/api/crop-recommendations", methods=["POST"])
def crop_recommendations():
    data     = request.json or {}
    temp     = data.get("temp", 25)
    humidity = data.get("humidity", 60)
    rain     = data.get("rain", 0)
    season   = get_season(datetime.now().month)
    crops    = recommend_crops(temp, humidity, rain, season)
    calendar = generate_advisory_calendar(crops[:3])
    return jsonify({
        "season":     season,
        "crops":      crops,
        "calendar":   calendar,
        "pesticides": get_pesticide_guide(crops[:3])
    })


def get_season(month):
    if month in [6,7,8,9]:        return "Kharif (Monsoon)"
    elif month in [10,11,12,1,2]: return "Rabi (Winter)"
    else:                          return "Zaid (Summer)"


def recommend_crops(temp, humidity, rain, season):
    all_crops = [
        {"name":"Rice",      "icon":"🌾","temp_range":(20,38),"humidity_range":(70,100),"season":"Kharif (Monsoon)","water":"High",     "yield":"3-5 t/ha",  "profit":"₹45,000-65,000/ha","duration":"90-150 days","description":"Best for high humidity & warm weather","soil":"Clay loam","fertilizer":"NPK 120:60:60 kg/ha"},
        {"name":"Wheat",     "icon":"🌿","temp_range":(10,25),"humidity_range":(40,65), "season":"Rabi (Winter)",   "water":"Medium",   "yield":"4-6 t/ha",  "profit":"₹50,000-75,000/ha","duration":"100-150 days","description":"Cool dry winters — most popular rabi crop","soil":"Loam","fertilizer":"NPK 120:60:40 kg/ha"},
        {"name":"Maize",     "icon":"🌽","temp_range":(18,35),"humidity_range":(50,80), "season":"Kharif (Monsoon)","water":"Medium",   "yield":"5-8 t/ha",  "profit":"₹40,000-60,000/ha","duration":"80-110 days","description":"Versatile crop for warm humid weather","soil":"Sandy loam","fertilizer":"NPK 150:75:75 kg/ha"},
        {"name":"Cotton",    "icon":"☁️","temp_range":(25,40),"humidity_range":(40,70), "season":"Kharif (Monsoon)","water":"Medium",   "yield":"2-3 t/ha",  "profit":"₹60,000-90,000/ha","duration":"150-180 days","description":"Hot dry spells with moderate rain","soil":"Black cotton soil","fertilizer":"NPK 90:45:45 kg/ha"},
        {"name":"Tomato",    "icon":"🍅","temp_range":(18,30),"humidity_range":(60,80), "season":"Zaid (Summer)",   "water":"Medium",   "yield":"20-40 t/ha","profit":"₹80,000-1,50,000/ha","duration":"60-80 days","description":"High value crop for moderate climates","soil":"Sandy loam","fertilizer":"NPK 100:60:60 kg/ha"},
        {"name":"Sugarcane", "icon":"🎋","temp_range":(24,38),"humidity_range":(75,90), "season":"Kharif (Monsoon)","water":"Very High","yield":"70-100 t/ha","profit":"₹70,000-1,00,000/ha","duration":"300-360 days","description":"Hot climate and heavy rainfall needed","soil":"Deep loam","fertilizer":"NPK 250:80:100 kg/ha"},
        {"name":"Soybean",   "icon":"🫘","temp_range":(20,32),"humidity_range":(60,80), "season":"Kharif (Monsoon)","water":"Medium",   "yield":"2-3 t/ha",  "profit":"₹35,000-55,000/ha","duration":"90-120 days","description":"Nitrogen-fixing legume for warm monsoon","soil":"Well-drained loam","fertilizer":"NPK 30:60:40 kg/ha"},
        {"name":"Mustard",   "icon":"🌻","temp_range":(10,25),"humidity_range":(40,60), "season":"Rabi (Winter)",   "water":"Low",      "yield":"1-2 t/ha",  "profit":"₹25,000-40,000/ha","duration":"90-110 days","description":"Cool weather oil seed crop","soil":"Sandy loam","fertilizer":"NPK 80:40:40 kg/ha"},
        {"name":"Onion",     "icon":"🧅","temp_range":(13,28),"humidity_range":(50,75), "season":"Rabi (Winter)",   "water":"Medium",   "yield":"15-25 t/ha","profit":"₹50,000-1,00,000/ha","duration":"100-120 days","description":"High demand vegetable — good income","soil":"Sandy loam","fertilizer":"NPK 100:50:50 kg/ha"},
        {"name":"Potato",    "icon":"🥔","temp_range":(10,22),"humidity_range":(60,80), "season":"Rabi (Winter)",   "water":"Medium",   "yield":"20-30 t/ha","profit":"₹40,000-80,000/ha","duration":"70-90 days","description":"Cool weather staple — high yield","soil":"Sandy loam","fertilizer":"NPK 120:80:100 kg/ha"},
        {"name":"Chilli",    "icon":"🌶️","temp_range":(20,35),"humidity_range":(60,80), "season":"Zaid (Summer)",   "water":"Medium",   "yield":"6-10 t/ha", "profit":"₹60,000-1,20,000/ha","duration":"90-120 days","description":"Warm climate spice with high market value","soil":"Sandy loam","fertilizer":"NPK 100:50:50 kg/ha"},
        {"name":"Groundnut", "icon":"🥜","temp_range":(22,36),"humidity_range":(50,75), "season":"Kharif (Monsoon)","water":"Medium",   "yield":"1.5-3 t/ha","profit":"₹30,000-55,000/ha","duration":"90-130 days","description":"Warm season oilseed — good for dry areas","soil":"Sandy loam","fertilizer":"NPK 25:50:25 kg/ha"},
    ]
    scored = []
    for crop in all_crops:
        score = 0
        if crop["temp_range"][0] <= temp <= crop["temp_range"][1]:              score += 40
        elif abs(temp - sum(crop["temp_range"])/2) < 5:                         score += 20
        if crop["humidity_range"][0] <= humidity <= crop["humidity_range"][1]:  score += 30
        if crop["season"] == season:                                             score += 30
        crop["score"] = score
        crop["match"] = f"{min(100, score)}%"
        scored.append(crop)
    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored


def generate_advisory_calendar(crops):
    today = datetime.now()
    activities = [
        {"week":1,  "activity":"Soil preparation & ploughing",     "type":"preparation"},
        {"week":2,  "activity":"Seed treatment & sowing",          "type":"sowing"},
        {"week":3,  "activity":"First irrigation",                 "type":"irrigation"},
        {"week":4,  "activity":"Apply basal fertilizer (NPK)",     "type":"fertilizer"},
        {"week":6,  "activity":"Weeding & thinning",               "type":"maintenance"},
        {"week":8,  "activity":"Apply Urea (top dressing)",        "type":"fertilizer"},
        {"week":10, "activity":"Pest & disease inspection",        "type":"pesticide"},
        {"week":12, "activity":"Spray fungicide if required",      "type":"pesticide"},
        {"week":16, "activity":"Foliar spray micronutrients",      "type":"fertilizer"},
        {"week":20, "activity":"Pre-harvest irrigation stop",      "type":"irrigation"},
        {"week":22, "activity":"Harvest preparation",              "type":"harvest"},
    ]
    calendar = []
    for act in activities:
        date = today + timedelta(weeks=act["week"])
        calendar.append({
            "date":     date.strftime("%d %b %Y"),
            "activity": act["activity"],
            "type":     act["type"],
            "week":     act["week"]
        })
    return calendar


def get_pesticide_guide(crops):
    guides = {
        "Rice":     [{"pest":"Brown Plant Hopper","pesticide":"Imidacloprid 17.8 SL","dose":"125 ml/ha","timing":"At 30 & 60 days after transplanting","eco":False},
                     {"pest":"Leaf folder",        "pesticide":"Neem Oil 5%",         "dose":"2.5 L/ha", "timing":"At first sign of damage","eco":True}],
        "Wheat":    [{"pest":"Aphids",             "pesticide":"Dimethoate 30 EC",    "dose":"1 L/ha",   "timing":"At tillering stage","eco":False},
                     {"pest":"Yellow rust",        "pesticide":"Propiconazole 25 EC", "dose":"500 ml/ha","timing":"At boot leaf stage","eco":False}],
        "Maize":    [{"pest":"Fall Armyworm",      "pesticide":"Spinetoram 11.7 SC",  "dose":"450 ml/ha","timing":"7-10 days after infestation","eco":False},
                     {"pest":"Stem borer",         "pesticide":"Emamectin Benzoate",  "dose":"220 g/ha", "timing":"At whorl stage","eco":False}],
        "Cotton":   [{"pest":"Bollworm",           "pesticide":"Chlorpyriphos 20 EC", "dose":"2.5 ml/L", "timing":"At first boll formation","eco":False},
                     {"pest":"Whitefly",           "pesticide":"Neem Oil 5%",         "dose":"5 ml/L",   "timing":"Every 7 days","eco":True}],
        "Tomato":   [{"pest":"Early Blight",       "pesticide":"Mancozeb 75 WP",      "dose":"2.5 g/L",  "timing":"Every 7-10 days","eco":False},
                     {"pest":"Fruit borer",        "pesticide":"Neem Oil 5%",         "dose":"5 ml/L",   "timing":"At flowering","eco":True}],
        "Onion":    [{"pest":"Thrips",             "pesticide":"Spinosad 45 SC",      "dose":"0.5 ml/L", "timing":"At 30 & 60 days","eco":False},
                     {"pest":"Purple blotch",      "pesticide":"Mancozeb 75 WP",      "dose":"2.5 g/L",  "timing":"Every 10 days","eco":False}],
    }
    result = []
    for crop in crops:
        if crop["name"] in guides:
            result.append({"crop": crop["name"], "guides": guides[crop["name"]]})
    return result


# ─── Diagnose via Kindwise API ────────────────────────────────────────────────
@app.route("/api/diagnose", methods=["POST"])
def diagnose_crop():
    if not KINDWISE_API_KEY:
        return jsonify({"error": "KINDWISE_API_KEY not set"}), 500

    data      = request.json or {}
    image_b64 = data.get("image", "")
    if not image_b64:
        return jsonify({"error": "No image data received"}), 400

    try:
        print("[Diagnose] Trying Kindwise crop.health API...")

        # Kindwise Crop Health API
        kindwise_resp = requests.post(
            "https://crop.kindwise.com/api/v1/identification",
            headers={
                "Api-Key": KINDWISE_API_KEY,
                "Content-Type": "application/json"
            },
            json={
                "images": [f"data:image/jpeg;base64,{image_b64}"],
                "latitude":  28.6,
                "longitude": 77.2,
                "similar_images": True
            },
            timeout=30
        )

        print(f"[Diagnose] Kindwise status: {kindwise_resp.status_code}")

        if kindwise_resp.status_code == 200:
            kw_data = kindwise_resp.json()
            result  = parse_kindwise_response(kw_data)
            if result:
                print(f"[Diagnose] ✅ Kindwise success: {result.get('disease')}")
                return jsonify(result)

    except Exception as e:
        print(f"[Diagnose] Kindwise error: {e}")

    # Fallback to Groq if Kindwise fails
    print("[Diagnose] Falling back to Groq vision...")
    return diagnose_via_groq(image_b64)


def parse_kindwise_response(kw_data):
    """Convert Kindwise API response to our standard format."""
    try:
        result = kw_data.get("result", {})
        disease_info = result.get("disease", {})
        suggestions  = disease_info.get("suggestions", [])

        if not suggestions:
            # No disease found — plant is healthy
            return {
                "disease":           "Healthy Plant",
                "confidence":        95,
                "severity":          "None",
                "affected_part":     "N/A",
                "cause":             "No disease or pest damage detected. Plant appears healthy.",
                "eco_remedies":      [{"remedy": "Continue regular care", "method": "Maintain proper irrigation and fertilization", "frequency": "As needed", "effectiveness": 100}],
                "chemical_remedies": [],
                "prevention":        ["Maintain proper spacing for air circulation", "Water at base of plant", "Monitor regularly for early signs of disease"],
                "recovery_timeline": "Plant is healthy — no treatment needed"
            }

        top = suggestions[0]
        disease_name  = top.get("name", "Unknown Disease")
        confidence    = round(top.get("probability", 0) * 100)
        details       = top.get("details", {})
        description   = details.get("description", "")
        treatment     = details.get("treatment", {})

        # Build eco remedies from Kindwise treatment data
        bio_control   = treatment.get("biological", [])
        chemical_ctrl = treatment.get("chemical", [])
        prevention    = treatment.get("prevention", [])

        eco_remedies = []
        for i, remedy in enumerate(bio_control[:3]):
            eco_remedies.append({
                "remedy":        remedy if isinstance(remedy, str) else str(remedy),
                "method":        "Apply as directed on the affected area",
                "frequency":     "Every 7 days until symptoms improve",
                "effectiveness": max(60, 90 - i * 10)
            })
        if not eco_remedies:
            eco_remedies = [{"remedy": "Neem oil spray", "method": "Mix 5ml per litre water, spray on affected parts", "frequency": "Every 5-7 days", "effectiveness": 75}]

        chem_remedies = []
        for chem in chemical_ctrl[:3]:
            chem_remedies.append({
                "name":     chem if isinstance(chem, str) else str(chem),
                "dose":     "As per label instructions",
                "interval": "Every 10-14 days"
            })

        prev_tips = []
        for tip in prevention[:4]:
            prev_tips.append(tip if isinstance(tip, str) else str(tip))
        if not prev_tips:
            prev_tips = [
                "Ensure proper plant spacing for air circulation",
                "Avoid overhead watering",
                "Remove and destroy infected plant material",
                "Use certified disease-free seeds"
            ]

        # Determine severity from confidence
        if confidence > 80:   severity = "Severe"
        elif confidence > 55: severity = "Moderate"
        else:                  severity = "Mild"

        return {
            "disease":           disease_name,
            "confidence":        confidence,
            "severity":          severity,
            "affected_part":     details.get("classification", {}).get("crop", ["Leaves"])[0] if details.get("classification") else "Leaves",
            "cause":             description[:300] if description else f"{disease_name} — identified by AI plant pathology model.",
            "eco_remedies":      eco_remedies,
            "chemical_remedies": chem_remedies,
            "prevention":        prev_tips,
            "recovery_timeline": "2-4 weeks with proper treatment"
        }

    except Exception as e:
        print(f"[parse_kindwise] Error: {e}")
        return None


def diagnose_via_groq(image_b64):
    """Fallback: use Groq vision if Kindwise fails."""
    if not GROQ_API_KEY:
        return jsonify({"error": "Both Kindwise and Groq API keys missing"}), 500

    prompt = """You are an expert agricultural plant pathologist AI.
Look carefully at this crop image and identify the disease, pest damage, or nutrient deficiency.

Respond ONLY with valid JSON, no markdown or backticks:
{
  "disease": "Exact disease name",
  "confidence": 85,
  "severity": "Mild or Moderate or Severe",
  "affected_part": "Leaves/Stem/Fruit/Root",
  "cause": "Specific pathogen and how it spreads",
  "eco_remedies": [
    {"remedy": "Remedy name", "method": "How to apply", "frequency": "How often", "effectiveness": 80}
  ],
  "chemical_remedies": [
    {"name": "Chemical name", "dose": "Dose per litre", "interval": "Days between sprays"}
  ],
  "prevention": ["Tip 1", "Tip 2", "Tip 3"],
  "recovery_timeline": "2-4 weeks with treatment"
}"""

    headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}
    vision_models = [
        "meta-llama/llama-4-scout-17b-16e-instruct",
        "meta-llama/llama-4-maverick-17b-128e-instruct",
    ]

    for model in vision_models:
        try:
            body = {
                "model": model,
                "messages": [
                    {"role": "system", "content": "You are an expert plant pathologist. Return ONLY valid JSON."},
                    {"role": "user", "content": [
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_b64}"}},
                        {"type": "text", "text": prompt}
                    ]}
                ],
                "temperature": 0.2,
                "max_tokens":  1200,
            }
            resp = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=body, timeout=45)
            if resp.status_code == 429: continue
            if resp.status_code != 200: continue

            raw  = resp.json()["choices"][0]["message"]["content"].strip()
            clean = re.sub(r"```(?:json)?", "", raw).replace("```", "").strip()
            match = re.search(r"\{.*\}", clean, re.DOTALL)
            if match:
                return jsonify(json.loads(match.group()))
        except Exception as e:
            print(f"[Groq fallback] {model} error: {e}")
            continue

    return jsonify({"error": "All diagnosis models failed. Please try again."}), 500


# ─── Alerts ───────────────────────────────────────────────────────────────────
@app.route("/api/alerts", methods=["POST"])
def get_alerts():
    data        = request.json or {}
    temp        = data.get("temp", 25)
    humidity    = data.get("humidity", 60)
    wind_speed  = data.get("wind_speed", 10)
    rain        = data.get("rain", 0)
    description = data.get("description", "").lower()
    alerts_list = []

    if temp > 40:
        alerts_list.append({"type":"danger","category":"Weather","icon":"🌡️","title":"Extreme Heat Alert","message":"Temperature above 40°C. Risk of crop wilting and soil moisture loss.","action":"Provide shade netting. Irrigate every 4-5 hours. Avoid afternoon work."})
    if temp < 5:
        alerts_list.append({"type":"danger","category":"Weather","icon":"❄️","title":"Frost Warning","message":"Very cold temperature. Frost can destroy standing crops overnight.","action":"Cover crops with frost cloth. Use sprinkler irrigation at night."})
    if humidity > 85:
        alerts_list.append({"type":"warning","category":"Disease","icon":"🍄","title":"High Fungal Disease Risk","message":"Humidity above 85% — ideal for blight, rust and other fungal diseases.","action":"Apply Mancozeb 75 WP (2.5 g/L) as preventive spray immediately."})
    if wind_speed > 50:
        alerts_list.append({"type":"danger","category":"Weather","icon":"💨","title":"High Wind Alert","message":"Strong winds can lodge tall crops like maize and wheat.","action":"Avoid spraying. Support tall crops. Harvest if near maturity."})
    if rain > 50:
        alerts_list.append({"type":"warning","category":"Weather","icon":"🌧️","title":"Heavy Rainfall Alert","message":"Excess rain may cause waterlogging and root rot.","action":"Open drainage channels. Stop irrigation immediately."})
    if "storm" in description or "thunder" in description:
        alerts_list.append({"type":"danger","category":"Weather","icon":"⛈️","title":"Thunderstorm Warning","message":"Thunderstorm detected. Risk of lightning and hail damage.","action":"Stay indoors. Secure equipment. Do not operate machinery."})
    if 25 <= temp <= 35 and humidity > 70:
        alerts_list.append({"type":"warning","category":"Pest","icon":"🐛","title":"Aphid & Whitefly Risk","message":"Warm humid conditions — ideal for aphid and whitefly outbreak.","action":"Spray Neem oil (5 ml/L) at dusk. Check undersides of leaves."})
    if temp > 30 and humidity < 50:
        alerts_list.append({"type":"warning","category":"Pest","icon":"🕷️","title":"Spider Mite Alert","message":"Hot dry conditions — spider mites multiply rapidly.","action":"Apply Abamectin 1.8 EC (0.5 ml/L). Increase soil moisture."})

    harmful = []
    if temp > 38: harmful.append("Wheat (grain shriveling risk)")
    if humidity > 85 and rain > 20: harmful.append("Cotton (boll rot risk)")
    if temp < 10: harmful.append("Rice (cold injury risk)")
    if harmful:
        alerts_list.append({"type":"info","category":"Crop Advisory","icon":"🌾","title":"Crops at Risk","message":f"Avoid growing: {', '.join(harmful)}","action":"Consider alternate crops better suited to current weather."})

    return jsonify({"alerts": alerts_list, "total": len(alerts_list)})


# ─── Market Prices (Hardcoded MSP-based Indian mandi data) ───────────────────
# Prices based on 2024-25 MSP rates. Random seed = date so prices are
# consistent per day but change daily — giving a "live" feel.

BASE_PRICES = {
    "Rice":     2300,
    "Wheat":    2275,
    "Maize":    2090,
    "Cotton":   7121,
    "Soybean":  4892,
    "Mustard":  5650,
    "Groundnut":6377,
    "Onion":    1800,
    "Potato":   1200,
    "Tomato":   2500,
    "Chilli":   8000,
    "Sugarcane":3150,
    "Arhar":    7550,
    "Moong":    8682,
    "Urad":     7400,
}

CITIES = [
    "Delhi", "Mumbai", "Kolkata", "Chennai", "Hyderabad",
    "Pune", "Ahmedabad", "Lucknow", "Jaipur", "Bhopal",
    "Patna", "Nagpur", "Indore", "Surat", "Kanpur",
    "Coimbatore", "Visakhapatnam", "Bhubaneswar", "Guwahati", "Amritsar"
]

# City price multipliers (some cities are higher/lower for certain crops)
CITY_FACTORS = {
    "Delhi":         1.05, "Mumbai":       1.08, "Kolkata":       1.02,
    "Chennai":       1.06, "Hyderabad":    1.04, "Pune":          1.07,
    "Ahmedabad":     1.03, "Lucknow":      0.98, "Jaipur":        1.01,
    "Bhopal":        0.97, "Patna":        0.96, "Nagpur":        1.02,
    "Indore":        1.00, "Surat":        1.04, "Kanpur":        0.99,
    "Coimbatore":    1.05, "Visakhapatnam":1.03, "Bhubaneswar":   0.98,
    "Guwahati":      1.01, "Amritsar":     1.00,
}

def get_daily_seed():
    """Same seed per day — prices stable within a day."""
    return int(datetime.now().strftime("%Y%m%d"))

def get_market_prices():
    seed = get_daily_seed()
    rng  = random.Random(seed)

    markets = {}
    for city in CITIES:
        city_factor = CITY_FACTORS.get(city, 1.0)
        crops_data  = []

        for crop, base_price in BASE_PRICES.items():
            # Daily variation ±6%
            variation    = rng.uniform(0.94, 1.06)
            price        = int(base_price * city_factor * variation)
            # Daily change ±4%
            change       = round(rng.uniform(-4.0, 4.0), 2)

            crops_data.append({
                "crop":   crop,
                "price":  price,
                "unit":   "quintal",
                "change": change,
                "demand": get_demand(change)
            })

        markets[city] = crops_data

    return markets

def get_demand(change):
    if change > 2:    return "Very High"
    elif change > 0:  return "High"
    elif change > -2: return "Medium"
    else:             return "Low"

@app.route("/api/market")
def get_market_data():
    markets  = get_market_prices()
    location = request.args.get("location", "").strip().lower()

    if location:
        markets = {
            city: crops
            for city, crops in markets.items()
            if location in city.lower()
        }

    return jsonify({
        "markets":   markets,
        "locations": list(markets.keys())
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)
