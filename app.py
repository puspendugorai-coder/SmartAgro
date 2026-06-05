from flask import Flask, render_template, request, jsonify
import requests
import os
import json
import re
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load .env from the same folder as app.py — works regardless of where you run from
basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

app = Flask(__name__)

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GOVT_MANDI_API_KEY= os.getenv("GOVT_MANDI_API_KEY", "")
print(f"[AgroSmart] Groq key:    {'OK (' + GROQ_API_KEY[:8] + '...)' if GROQ_API_KEY else 'MISSING - check .env'}")
print(f"[AgroSmart] Weather key: {'OK' if OPENWEATHER_API_KEY else 'MISSING'}")
print(f"[AgroSmart] Mandi API key: {'OK' if GOVT_MANDI_API_KEY else 'MISSING'}")
# ─── Routes ──────────────────────────────────────────────────────────────────
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

        # Group forecast by day
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
    if month in [6,7,8,9]:    return "Kharif (Monsoon)"
    elif month in [10,11,12,1,2]: return "Rabi (Winter)"
    else:                      return "Zaid (Summer)"


def recommend_crops(temp, humidity, rain, season):
    all_crops = [
        {"name":"Rice",      "icon":"🌾","temp_range":(20,38),"humidity_range":(70,100),"season":"Kharif (Monsoon)","water":"High","yield":"3-5 tonnes/ha","profit":"₹45,000-65,000/ha","duration":"90-150 days","description":"Ideal for high humidity and warm conditions","soil":"Clay loam, alluvial","fertilizer":"NPK 120:60:60 kg/ha"},
        {"name":"Wheat",     "icon":"🌿","temp_range":(10,25),"humidity_range":(40,65), "season":"Rabi (Winter)",   "water":"Medium","yield":"4-6 tonnes/ha","profit":"₹50,000-75,000/ha","duration":"100-150 days","description":"Best suited for cool, dry winters","soil":"Well-drained loam","fertilizer":"NPK 120:60:40 kg/ha"},
        {"name":"Maize",     "icon":"🌽","temp_range":(18,35),"humidity_range":(50,80), "season":"Kharif (Monsoon)","water":"Medium","yield":"5-8 tonnes/ha","profit":"₹40,000-60,000/ha","duration":"80-110 days","description":"Versatile crop for warm humid weather","soil":"Sandy loam to clay loam","fertilizer":"NPK 150:75:75 kg/ha"},
        {"name":"Cotton",    "icon":"☁️","temp_range":(25,40),"humidity_range":(40,70), "season":"Kharif (Monsoon)","water":"Medium","yield":"2-3 tonnes/ha","profit":"₹60,000-90,000/ha","duration":"150-180 days","description":"Thrives in hot dry spells with moderate rain","soil":"Black cotton soil","fertilizer":"NPK 90:45:45 kg/ha"},
        {"name":"Tomato",    "icon":"🍅","temp_range":(18,30),"humidity_range":(60,80), "season":"Zaid (Summer)",   "water":"Medium","yield":"20-40 tonnes/ha","profit":"₹80,000-1,50,000/ha","duration":"60-80 days","description":"High value crop for moderate climates","soil":"Sandy loam, rich organic matter","fertilizer":"NPK 100:60:60 kg/ha"},
        {"name":"Sugarcane", "icon":"🎋","temp_range":(24,38),"humidity_range":(75,90), "season":"Kharif (Monsoon)","water":"Very High","yield":"70-100 tonnes/ha","profit":"₹70,000-1,00,000/ha","duration":"300-360 days","description":"Requires hot climate and heavy rainfall","soil":"Deep loam, good drainage","fertilizer":"NPK 250:80:100 kg/ha"},
        {"name":"Soybean",   "icon":"🫘","temp_range":(20,32),"humidity_range":(60,80), "season":"Kharif (Monsoon)","water":"Medium","yield":"2-3 tonnes/ha","profit":"₹35,000-55,000/ha","duration":"90-120 days","description":"Nitrogen-fixing legume for warm monsoon","soil":"Well-drained loam","fertilizer":"NPK 30:60:40 kg/ha"},
        {"name":"Mustard",   "icon":"🌻","temp_range":(10,25),"humidity_range":(40,60), "season":"Rabi (Winter)",   "water":"Low","yield":"1-2 tonnes/ha","profit":"₹25,000-40,000/ha","duration":"90-110 days","description":"Cool weather oil seed crop","soil":"Sandy loam, well-drained","fertilizer":"NPK 80:40:40 kg/ha"},
    ]
    scored = []
    for crop in all_crops:
        score = 0
        if crop["temp_range"][0] <= temp <= crop["temp_range"][1]:       score += 40
        elif abs(temp - sum(crop["temp_range"])/2) < 5:                  score += 20
        if crop["humidity_range"][0] <= humidity <= crop["humidity_range"][1]: score += 30
        if crop["season"] == season:                                     score += 30
        crop["score"] = score
        crop["match"] = f"{min(100,score)}%"
        scored.append(crop)
    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored


def generate_advisory_calendar(crops):
    today      = datetime.now()
    activities = [
        {"week":1,  "activity":"Soil preparation & ploughing",       "type":"preparation"},
        {"week":2,  "activity":"Seed treatment & sowing",            "type":"sowing"},
        {"week":3,  "activity":"First irrigation",                   "type":"irrigation"},
        {"week":4,  "activity":"Apply basal fertilizer (NPK)",       "type":"fertilizer"},
        {"week":6,  "activity":"Weeding & thinning",                 "type":"maintenance"},
        {"week":8,  "activity":"Apply Urea (top dressing)",          "type":"fertilizer"},
        {"week":10, "activity":"Pest & disease inspection",          "type":"pesticide"},
        {"week":12, "activity":"Spray fungicide if required",        "type":"pesticide"},
        {"week":16, "activity":"Foliar spray micronutrients",        "type":"fertilizer"},
        {"week":20, "activity":"Pre-harvest irrigation stop",        "type":"irrigation"},
        {"week":22, "activity":"Harvest preparation",                "type":"harvest"},
    ]
    calendar = []
    for act in activities:
        date = today + timedelta(weeks=act["week"])
        calendar.append({"date": date.strftime("%d %b %Y"), "activity": act["activity"],
                         "type": act["type"], "week": act["week"]})
    return calendar


def get_pesticide_guide(crops):
    guides = {
        "Rice":   [{"pest":"Brown Plant Hopper","pesticide":"Imidacloprid 17.8 SL","dose":"125 ml/ha","timing":"At 30 & 60 days after transplanting","eco":False},
                   {"pest":"Leaf folder",       "pesticide":"Neem Oil 5%",          "dose":"2.5 L/ha", "timing":"At first sign of damage","eco":True}],
        "Wheat":  [{"pest":"Aphids",            "pesticide":"Dimethoate 30 EC",     "dose":"1 L/ha",   "timing":"At tillering stage","eco":False},
                   {"pest":"Yellow rust",       "pesticide":"Propiconazole 25 EC",  "dose":"500 ml/ha","timing":"At boot leaf stage","eco":False}],
        "Maize":  [{"pest":"Fall Armyworm",     "pesticide":"Spinetoram 11.7 SC",   "dose":"450 ml/ha","timing":"7-10 days after infestation","eco":False},
                   {"pest":"Stem borer",        "pesticide":"Emamectin Benzoate 5 SG","dose":"220 g/ha","timing":"At whorl stage","eco":False}],
        "Cotton": [{"pest":"Bollworm",          "pesticide":"Chlorpyriphos 20 EC",  "dose":"2.5 ml/L", "timing":"At first boll formation","eco":False},
                   {"pest":"Whitefly",          "pesticide":"Neem Oil 5%",          "dose":"5 ml/L",   "timing":"Every 7 days","eco":True}],
    }
    result = []
    for crop in crops:
        if crop["name"] in guides:
            result.append({"crop": crop["name"], "guides": guides[crop["name"]]})
    return result


# ─── Diagnose Crop via Claude Vision API ──────────────────────────────────────
# ─── Diagnose Crop via Google Gemini Vision API (FREE) ────────────────────────
# ─── Diagnose Crop via Groq API (FREE, no quota issues) ──────────────────────
@app.route("/api/diagnose", methods=["POST"])
def diagnose_crop():
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
    if not GROQ_API_KEY:
        return jsonify({"error": "GROQ_API_KEY not set in .env"}), 500

    data      = request.json or {}
    image_b64 = data.get("image", "")
    if not image_b64:
        return jsonify({"error": "No image data received"}), 400

    prompt = """You are an expert agricultural plant pathologist AI.
Look very carefully at this crop image. Identify the EXACT disease, pest damage, or nutrient deficiency you can see.

Be very specific — different diseases look completely different:
- Tomato Early Blight: dark concentric rings on leaves
- Tomato Late Blight: water-soaked dark patches
- Maize Smut: large black/grey galls on corn cob
- Powdery Mildew: white powder coating on leaves
- Rust Disease: orange/brown pustules on leaves
- Bacterial Leaf Spot: water soaked angular spots
- Anthracnose: dark sunken lesions on fruit/stem
- Mosaic Virus: yellow-green mottled pattern
- Leaf Miner: white winding trails on leaves
- Healthy: normal green color, no symptoms

Look at the actual image carefully and identify what you truly see.

Respond ONLY with valid JSON, absolutely no markdown or backticks:
{
  "disease": "Exact specific disease name you can see in this image",
  "confidence": 88,
  "severity": "Mild or Moderate or Severe",
  "affected_part": "Exact part affected e.g. Leaves/Stem/Fruit/Root/Cob",
  "cause": "Specific pathogen name and how it spreads",
  "eco_remedies": [
    {"remedy": "Specific remedy for THIS disease", "method": "Exact application steps", "frequency": "How often to apply", "effectiveness": 80}
  ],
  "chemical_remedies": [
    {"name": "Specific chemical for THIS disease", "dose": "Exact dose per litre", "interval": "Days between sprays"}
  ],
  "prevention": [
    "Prevention tip specific to this exact disease",
    "Cultural practice to avoid this disease",
    "Variety or season management tip"
  ],
  "recovery_timeline": "Realistic weeks for recovery with treatment"
}"""

    # Groq vision models — try in order
    vision_models = [
        "meta-llama/llama-4-scout-17b-16e-instruct",
        "meta-llama/llama-4-maverick-17b-128e-instruct",
    ]

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type":  "application/json"
    }

    for model in vision_models:
        try:
            print(f"[Diagnose] Trying Groq vision model: {model}")

            body = {
                "model": model,
                "messages": [
                    {
                        "role": "system",
                        "content": "You are an expert plant pathologist. Look at the image carefully. Return ONLY valid JSON. Never give generic answers — always base your diagnosis on what you actually see in the image."
                    },
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{image_b64}"
                                }
                            },
                            {
                                "type": "text",
                                "text": prompt
                            }
                        ]
                    }
                ],
                "temperature": 0.2,
                "max_tokens":  1200,
            }

            resp = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers=headers,
                json=body,
                timeout=45
            )
            print(f"[Diagnose] {model} status: {resp.status_code}")

            if resp.status_code == 429:
                print(f"[Diagnose] {model} rate limited, trying next...")
                continue

            if resp.status_code != 200:
                print(f"[Diagnose] {model} error: {resp.text[:300]}")
                continue

            raw_text = resp.json()["choices"][0]["message"]["content"].strip()
            print(f"[Diagnose] Raw: {raw_text[:200]}")

            cleaned = re.sub(r"```(?:json)?", "", raw_text).replace("```", "").strip()
            match   = re.search(r"\{.*\}", cleaned, re.DOTALL)
            if match:
                result = json.loads(match.group())
                print(f"[Diagnose] ✅ Success with {model}: {result.get('disease')}")
                return jsonify(result)

        except Exception as e:
            print(f"[Diagnose] {model} exception: {e}")
            continue

    return jsonify({"error": "All vision models failed. Check your GROQ_API_KEY in .env"}), 500
# ─── Alerts ───────────────────────────────────────────────────────────────────
@app.route("/api/alerts", methods=["POST"])
def get_alerts():
    data        = request.json or {}
    temp        = data.get("temp", 25)
    humidity    = data.get("humidity", 60)
    wind_speed  = data.get("wind_speed", 10)
    rain        = data.get("rain", 0)
    description = data.get("description", "").lower()
    alerts      = []

    if temp > 40:
        alerts.append({"type":"danger","category":"Weather","icon":"🌡️","title":"Extreme Heat Alert","message":"Temperature above 40°C. Provide shade netting and increase irrigation frequency.","action":"Schedule irrigation every 4-5 hours. Avoid afternoon spraying."})
    if temp < 5:
        alerts.append({"type":"danger","category":"Weather","icon":"❄️","title":"Frost Warning","message":"Sub-zero temperatures expected. Frost can destroy standing crops overnight.","action":"Cover crops with frost cloth. Use smudge pots or sprinkler irrigation."})
    if humidity > 85:
        alerts.append({"type":"warning","category":"Disease","icon":"🍄","title":"High Fungal Disease Risk","message":"Humidity above 85% creates ideal conditions for fungal diseases like blight and rust.","action":"Apply preventive fungicide (Mancozeb 75 WP at 2.5 g/L) immediately."})
    if wind_speed > 50:
        alerts.append({"type":"danger","category":"Weather","icon":"💨","title":"High Wind Speed Alert","message":"Strong winds can cause lodging in tall crops like maize and wheat.","action":"Avoid spraying. Support tall crops with stakes. Harvest if near maturity."})
    if rain > 50:
        alerts.append({"type":"warning","category":"Weather","icon":"🌧️","title":"Heavy Rainfall Alert","message":"Excessive rain may cause waterlogging and root rot.","action":"Ensure field drainage channels are open. Pause irrigation."})
    if "storm" in description or "thunder" in description:
        alerts.append({"type":"danger","category":"Weather","icon":"⛈️","title":"Thunderstorm Warning","message":"Thunderstorm conditions detected. Risk of lightning and hail damage.","action":"Stay indoors. Secure farm equipment. Do not operate machinery."})
    if 25 <= temp <= 35 and humidity > 70:
        alerts.append({"type":"warning","category":"Pest","icon":"🐛","title":"Aphid & Whitefly Risk","message":"Warm humid conditions are ideal for aphid multiplication.","action":"Spray Neem oil (5 ml/L) or Imidacloprid 0.3 ml/L at dusk."})
    if temp > 30 and humidity < 50:
        alerts.append({"type":"warning","category":"Pest","icon":"🕷️","title":"Spider Mite Alert","message":"Hot dry conditions favour rapid spider mite population growth.","action":"Apply Abamectin 1.8 EC (0.5 ml/L). Increase soil moisture."})

    harmful = []
    if temp > 38: harmful.append("Wheat (grain shriveling risk)")
    if humidity > 85 and rain > 20: harmful.append("Cotton (boll rot risk)")
    if temp < 10: harmful.append("Rice (cold injury risk)")
    if harmful:
        alerts.append({"type":"info","category":"Crop Advisory","icon":"🌾","title":"Crops at Risk in Current Conditions","message":f"Avoid growing: {', '.join(harmful)}","action":"Consider alternate crops better suited to current climate."})

    return jsonify({"alerts": alerts, "total": len(alerts)})


if __name__ == "__main__":
    app.run(debug=True, port=5000)


# if __name__ == "__main__":
#     app.run(host="localhost", debug=True, port=5000)