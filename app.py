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

print(f"[SmartAgro] Weather : {'OK' if OPENWEATHER_API_KEY else 'MISSING'}")
print(f"[SmartAgro] Groq    : {'OK' if GROQ_API_KEY else 'MISSING'}")
print(f"[SmartAgro] Kindwise: {'OK' if KINDWISE_API_KEY else 'MISSING'}")

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

# ── Weather ──────────────────────────────────────────────
@app.route("/api/weather")
def get_weather():
    lat = request.args.get("lat")
    lon = request.args.get("lon")
    if not lat or not lon:
        return jsonify({"error": "Location required"}), 400
    try:
        current_resp  = requests.get(
            f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric",
            timeout=10)
        forecast_resp = requests.get(
            f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric&cnt=56",
            timeout=10)
        if current_resp.status_code != 200:
            return jsonify({"error": "Weather API error"}), 500
        current_data  = current_resp.json()
        forecast_data = forecast_resp.json()
        daily = {}
        for item in forecast_data.get("list", []):
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
            "forecast": list(daily.values())[:7]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ── Crop Recommendations ─────────────────────────────────
@app.route("/api/crop-recommendations", methods=["POST"])
def crop_recommendations():
    data     = request.json or {}
    temp     = data.get("temp", 25)
    humidity = data.get("humidity", 60)
    rain     = data.get("rain", 0)
    season   = get_season(datetime.now().month)
    crops    = recommend_crops(temp, humidity, rain, season)
    return jsonify({
        "season":     season,
        "crops":      crops,
        "pesticides": get_pesticide_guide(crops[:3])
    })

def get_season(month):
    if month in [6,7,8,9]:        return "Kharif (Monsoon)"
    elif month in [10,11,12,1,2]: return "Rabi (Winter)"
    else:                          return "Zaid (Summer)"

def recommend_crops(temp, humidity, rain, season):
    all_crops = [
        {"name":"Rice",      "icon":"🌾","temp_range":(20,38),"humidity_range":(70,100),"season":"Kharif (Monsoon)","water":"High",     "yield":"3-5 t/ha",  "profit":"₹45,000-65,000/ha","duration":"90-150 days","description":"Best for high humidity and warm weather","soil":"Clay loam","fertilizer":"NPK 120:60:60 kg/ha"},
        {"name":"Wheat",     "icon":"🌿","temp_range":(10,25),"humidity_range":(40,65), "season":"Rabi (Winter)",   "water":"Medium",   "yield":"4-6 t/ha",  "profit":"₹50,000-75,000/ha","duration":"100-150 days","description":"Cool dry winters — most popular rabi crop","soil":"Loam","fertilizer":"NPK 120:60:40 kg/ha"},
        {"name":"Maize",     "icon":"🌽","temp_range":(18,35),"humidity_range":(50,80), "season":"Kharif (Monsoon)","water":"Medium",   "yield":"5-8 t/ha",  "profit":"₹40,000-60,000/ha","duration":"80-110 days","description":"Versatile crop for warm humid weather","soil":"Sandy loam","fertilizer":"NPK 150:75:75 kg/ha"},
        {"name":"Cotton",    "icon":"☁️","temp_range":(25,40),"humidity_range":(40,70), "season":"Kharif (Monsoon)","water":"Medium",   "yield":"2-3 t/ha",  "profit":"₹60,000-90,000/ha","duration":"150-180 days","description":"Hot dry spells with moderate rain","soil":"Black cotton soil","fertilizer":"NPK 90:45:45 kg/ha"},
        {"name":"Tomato",    "icon":"🍅","temp_range":(18,30),"humidity_range":(60,80), "season":"Zaid (Summer)",   "water":"Medium",   "yield":"20-40 t/ha","profit":"₹80,000-1,50,000/ha","duration":"60-80 days","description":"High value crop for moderate climates","soil":"Sandy loam","fertilizer":"NPK 100:60:60 kg/ha"},
        {"name":"Sugarcane", "icon":"🎋","temp_range":(24,38),"humidity_range":(75,90), "season":"Kharif (Monsoon)","water":"Very High","yield":"70-100 t/ha","profit":"₹70,000-1,00,000/ha","duration":"300-360 days","description":"Hot climate and heavy rainfall needed","soil":"Deep loam","fertilizer":"NPK 250:80:100 kg/ha"},
        {"name":"Soybean",   "icon":"🫘","temp_range":(20,32),"humidity_range":(60,80), "season":"Kharif (Monsoon)","water":"Medium",   "yield":"2-3 t/ha",  "profit":"₹35,000-55,000/ha","duration":"90-120 days","description":"Nitrogen-fixing legume for warm monsoon","soil":"Well-drained loam","fertilizer":"NPK 30:60:40 kg/ha"},
        {"name":"Mustard",   "icon":"🌻","temp_range":(10,25),"humidity_range":(40,60), "season":"Rabi (Winter)",   "water":"Low",      "yield":"1-2 t/ha",  "profit":"₹25,000-40,000/ha","duration":"90-110 days","description":"Cool weather oil seed crop","soil":"Sandy loam","fertilizer":"NPK 80:40:40 kg/ha"},
        {"name":"Onion",     "icon":"🧅","temp_range":(13,28),"humidity_range":(50,75), "season":"Rabi (Winter)",   "water":"Medium",   "yield":"15-25 t/ha","profit":"₹50,000-1,00,000/ha","duration":"100-120 days","description":"High demand vegetable with good income","soil":"Sandy loam","fertilizer":"NPK 100:50:50 kg/ha"},
        {"name":"Potato",    "icon":"🥔","temp_range":(10,22),"humidity_range":(60,80), "season":"Rabi (Winter)",   "water":"Medium",   "yield":"20-30 t/ha","profit":"₹40,000-80,000/ha","duration":"70-90 days","description":"Cool weather staple — high yield","soil":"Sandy loam","fertilizer":"NPK 120:80:100 kg/ha"},
        {"name":"Chilli",    "icon":"🌶️","temp_range":(20,35),"humidity_range":(60,80), "season":"Zaid (Summer)",   "water":"Medium",   "yield":"6-10 t/ha", "profit":"₹60,000-1,20,000/ha","duration":"90-120 days","description":"Warm climate spice with high market value","soil":"Sandy loam","fertilizer":"NPK 100:50:50 kg/ha"},
        {"name":"Groundnut", "icon":"🥜","temp_range":(22,36),"humidity_range":(50,75), "season":"Kharif (Monsoon)","water":"Medium",   "yield":"1.5-3 t/ha","profit":"₹30,000-55,000/ha","duration":"90-130 days","description":"Warm season oilseed — good for dry areas","soil":"Sandy loam","fertilizer":"NPK 25:50:25 kg/ha"},
    ]
    scored = []
    for crop in all_crops:
        score = 0
        if crop["temp_range"][0] <= temp <= crop["temp_range"][1]:             score += 40
        elif abs(temp - sum(crop["temp_range"])/2) < 5:                        score += 20
        if crop["humidity_range"][0] <= humidity <= crop["humidity_range"][1]: score += 30
        if crop["season"] == season:                                            score += 30
        crop["score"] = score
        crop["match"] = f"{min(100, score)}%"
        scored.append(crop)
    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored

def get_pesticide_guide(crops):
    guides = {
        "Rice":     [{"pest":"Brown Plant Hopper","pesticide":"Imidacloprid 17.8 SL","dose":"125 ml/ha","timing":"At 30 & 60 days","eco":False},
                     {"pest":"Leaf folder","pesticide":"Neem Oil 5%","dose":"2.5 L/ha","timing":"At first sign","eco":True}],
        "Wheat":    [{"pest":"Aphids","pesticide":"Dimethoate 30 EC","dose":"1 L/ha","timing":"At tillering","eco":False},
                     {"pest":"Yellow rust","pesticide":"Propiconazole 25 EC","dose":"500 ml/ha","timing":"At boot leaf","eco":False}],
        "Maize":    [{"pest":"Fall Armyworm","pesticide":"Spinetoram 11.7 SC","dose":"450 ml/ha","timing":"7-10 days after","eco":False}],
        "Cotton":   [{"pest":"Bollworm","pesticide":"Chlorpyriphos 20 EC","dose":"2.5 ml/L","timing":"At boll formation","eco":False},
                     {"pest":"Whitefly","pesticide":"Neem Oil 5%","dose":"5 ml/L","timing":"Every 7 days","eco":True}],
        "Tomato":   [{"pest":"Early Blight","pesticide":"Mancozeb 75 WP","dose":"2.5 g/L","timing":"Every 7-10 days","eco":False},
                     {"pest":"Fruit borer","pesticide":"Neem Oil 5%","dose":"5 ml/L","timing":"At flowering","eco":True}],
        "Onion":    [{"pest":"Thrips","pesticide":"Spinosad 45 SC","dose":"0.5 ml/L","timing":"At 30 & 60 days","eco":False}],
    }
    result = []
    for crop in crops:
        if crop["name"] in guides:
            result.append({"crop": crop["name"], "guides": guides[crop["name"]]})
    return result

# ── Kindwise Diagnosis ───────────────────────────────────
@app.route("/api/diagnose", methods=["POST"])
def diagnose_crop():
    if not KINDWISE_API_KEY:
        return jsonify({"error": "KINDWISE_API_KEY not set"}), 500
    data      = request.json or {}
    image_b64 = data.get("image", "")
    if not image_b64:
        return jsonify({"error": "No image received"}), 400
    try:
        resp = requests.post(
            "https://crop.kindwise.com/api/v1/identification",
            headers={"Api-Key": KINDWISE_API_KEY, "Content-Type": "application/json"},
            json={"images": [f"data:image/jpeg;base64,{image_b64}"], "latitude": 22.5, "longitude": 78.9, "similar_images": True},
            timeout=30
        )
        if resp.status_code == 200:
            result = parse_kindwise(resp.json())
            if result:
                return jsonify(result)
    except Exception as e:
        print(f"[Kindwise error] {e}")
    return diagnose_groq(image_b64)

def parse_kindwise(kw):
    try:
        suggestions = kw.get("result", {}).get("disease", {}).get("suggestions", [])
        if not suggestions:
            return {"disease":"Healthy Plant","confidence":95,"severity":"None","affected_part":"N/A",
                    "cause":"No disease detected. Plant looks healthy.",
                    "eco_remedies":[{"remedy":"Regular care","method":"Maintain irrigation and fertilization","frequency":"As needed","effectiveness":100}],
                    "chemical_remedies":[],"prevention":["Maintain proper spacing","Water at base","Monitor regularly"],"recovery_timeline":"Plant is healthy"}
        top    = suggestions[0]
        conf   = round(top.get("probability", 0) * 100)
        detail = top.get("details", {})
        treat  = detail.get("treatment", {})
        bio    = treat.get("biological", [])
        chem   = treat.get("chemical", [])
        prev   = treat.get("prevention", [])
        eco = [{"remedy": str(r), "method": "Apply on affected area", "frequency": "Every 7 days", "effectiveness": max(60, 85 - i*10)} for i, r in enumerate(bio[:3])]
        if not eco:
            eco = [{"remedy":"Neem oil spray","method":"5ml per litre water, spray on leaves","frequency":"Every 5-7 days","effectiveness":75}]
        return {
            "disease":           top.get("name", "Unknown Disease"),
            "confidence":        conf,
            "severity":          "Severe" if conf > 80 else "Moderate" if conf > 55 else "Mild",
            "affected_part":     "Leaves",
            "cause":             detail.get("description", "")[:300] or f"{top.get('name')} identified by AI.",
            "eco_remedies":      eco,
            "chemical_remedies": [{"name": str(c), "dose": "As per label", "interval": "10-14 days"} for c in chem[:3]],
            "prevention":        [str(p) for p in prev[:4]] or ["Proper spacing","Avoid overhead watering","Remove infected parts","Use certified seeds"],
            "recovery_timeline": "2-4 weeks with proper treatment"
        }
    except Exception as e:
        print(f"[parse_kindwise] {e}")
        return None

def diagnose_groq(image_b64):
    if not GROQ_API_KEY:
        return jsonify({"error": "All diagnosis methods failed"}), 500
    prompt = """Look at this crop image carefully. Identify the disease.
Return ONLY valid JSON no markdown:
{"disease":"name","confidence":85,"severity":"Mild/Moderate/Severe","affected_part":"Leaves/Stem/Fruit","cause":"pathogen description","eco_remedies":[{"remedy":"name","method":"how to apply","frequency":"how often","effectiveness":80}],"chemical_remedies":[{"name":"chemical","dose":"dose/L","interval":"days"}],"prevention":["tip1","tip2","tip3"],"recovery_timeline":"2-4 weeks"}"""
    for model in ["meta-llama/llama-4-scout-17b-16e-instruct","meta-llama/llama-4-maverick-17b-128e-instruct"]:
        try:
            resp = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
                json={"model": model, "messages": [
                    {"role": "system", "content": "You are a plant pathologist. Return ONLY valid JSON."},
                    {"role": "user", "content": [
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_b64}"}},
                        {"type": "text", "text": prompt}
                    ]}
                ], "temperature": 0.2, "max_tokens": 1000},
                timeout=45
            )
            if resp.status_code != 200: continue
            raw   = resp.json()["choices"][0]["message"]["content"].strip()
            clean = re.sub(r"```(?:json)?", "", raw).replace("```", "").strip()
            match = re.search(r"\{.*\}", clean, re.DOTALL)
            if match:
                return jsonify(json.loads(match.group()))
        except:
            continue
    return jsonify({"error": "Diagnosis failed. Try again."}), 500

# ── Alerts ───────────────────────────────────────────────
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
        alerts_list.append({"type":"danger","category":"Weather","icon":"🌡️","title":"Extreme Heat","message":"Temperature above 40°C. Crops may wilt.","action":"Irrigate every 4-5 hours. Provide shade netting."})
    if temp < 5:
        alerts_list.append({"type":"danger","category":"Weather","icon":"❄️","title":"Frost Warning","message":"Very cold. Frost can destroy crops overnight.","action":"Cover crops. Use sprinkler irrigation at night."})
    if humidity > 85:
        alerts_list.append({"type":"warning","category":"Disease","icon":"🍄","title":"Fungal Disease Risk","message":"High humidity — blight and rust risk is high.","action":"Spray Mancozeb 75 WP (2.5 g/L) immediately."})
    if wind_speed > 50:
        alerts_list.append({"type":"danger","category":"Weather","icon":"💨","title":"Strong Winds","message":"Strong winds can damage tall crops.","action":"Avoid spraying. Support tall crops with stakes."})
    if rain > 50:
        alerts_list.append({"type":"warning","category":"Weather","icon":"🌧️","title":"Heavy Rain","message":"Waterlogging and root rot risk.","action":"Open drainage channels. Stop irrigation."})
    if "storm" in description or "thunder" in description:
        alerts_list.append({"type":"danger","category":"Weather","icon":"⛈️","title":"Thunderstorm","message":"Risk of lightning and hail damage.","action":"Stay indoors. Secure farm equipment."})
    if 25 <= temp <= 35 and humidity > 70:
        alerts_list.append({"type":"warning","category":"Pest","icon":"🐛","title":"Aphid & Whitefly Risk","message":"Warm humid weather — aphids multiplying fast.","action":"Spray Neem oil (5 ml/L) at dusk."})
    if temp > 30 and humidity < 50:
        alerts_list.append({"type":"warning","category":"Pest","icon":"🕷️","title":"Spider Mite Alert","message":"Hot dry conditions — mites spreading fast.","action":"Apply Abamectin 1.8 EC (0.5 ml/L)."})
    harmful = []
    if temp > 38: harmful.append("Wheat")
    if humidity > 85 and rain > 20: harmful.append("Cotton")
    if temp < 10: harmful.append("Rice")
    if harmful:
        alerts_list.append({"type":"info","category":"Crop Advisory","icon":"🌾","title":"Crops at Risk","message":f"Avoid growing: {', '.join(harmful)} in current weather.","action":"Consider alternate crops better suited now."})
    return jsonify({"alerts": alerts_list, "total": len(alerts_list)})

# ── Market Prices ────────────────────────────────────────
BASE_PRICES = {
    "Rice":2300,"Wheat":2275,"Maize":2090,"Cotton":7121,
    "Soybean":4892,"Mustard":5650,"Groundnut":6377,"Onion":1800,
    "Potato":1200,"Tomato":2500,"Chilli":8000,"Sugarcane":3150,
    "Arhar":7550,"Moong":8682,"Urad":7400,
}
MSP_PRICES = {
    "Rice":2300,"Wheat":2275,"Maize":2090,"Cotton":7121,
    "Soybean":4892,"Mustard":5650,"Groundnut":6377,"Onion":1700,
    "Potato":1000,"Tomato":2000,"Chilli":7500,"Sugarcane":3050,
    "Arhar":7550,"Moong":8682,"Urad":7400,
}
CITIES = ["Delhi","Mumbai","Kolkata","Chennai","Hyderabad","Pune","Ahmedabad",
          "Lucknow","Jaipur","Bhopal","Patna","Nagpur","Indore","Surat","Kanpur",
          "Coimbatore","Visakhapatnam","Bhubaneswar","Guwahati","Amritsar"]
CITY_FACTORS = {
    "Delhi":1.05,"Mumbai":1.08,"Kolkata":1.02,"Chennai":1.06,"Hyderabad":1.04,
    "Pune":1.07,"Ahmedabad":1.03,"Lucknow":0.98,"Jaipur":1.01,"Bhopal":0.97,
    "Patna":0.96,"Nagpur":1.02,"Indore":1.00,"Surat":1.04,"Kanpur":0.99,
    "Coimbatore":1.05,"Visakhapatnam":1.03,"Bhubaneswar":0.98,"Guwahati":1.01,"Amritsar":1.00,
}

@app.route("/api/market")
def get_market_data():
    seed = int(datetime.now().strftime("%Y%m%d"))
    rng  = random.Random(seed)
    markets = {}
    for city in CITIES:
        factor = CITY_FACTORS.get(city, 1.0)
        crops  = []
        for crop, base in BASE_PRICES.items():
            price  = int(base * factor * rng.uniform(0.94, 1.06))
            change = round(rng.uniform(-4.0, 4.0), 2)
            msp    = MSP_PRICES.get(crop, base)
            crops.append({
                "crop":   crop,
                "price":  price,
                "msp":    msp,
                "above_msp": price >= msp,
                "unit":   "quintal",
                "change": change,
                "demand": "Very High" if change > 2 else "High" if change > 0 else "Medium" if change > -2 else "Low"
            })
        markets[city] = crops
    location = request.args.get("location", "").strip().lower()
    if location:
        markets = {c: v for c, v in markets.items() if location in c.lower()}
    return jsonify({"markets": markets, "locations": list(markets.keys())})

# ── Voice Chatbot ────────────────────────────────────────
@app.route("/api/chat", methods=["POST"])
def chat():
    if not GROQ_API_KEY:
        return jsonify({"reply": "Groq API key missing."}), 500
    data     = request.json or {}
    message  = data.get("message", "").strip()
    language = data.get("language", "en")
    weather  = data.get("weather_context", {})
    if not message:
        return jsonify({"reply": "Please ask a question."}), 400

    lang_names = {
        "hi": "Hindi", "bn": "Bengali", "ta": "Tamil",
        "te": "Telugu", "mr": "Marathi", "pa": "Punjabi",
        "gu": "Gujarati", "kn": "Kannada", "ml": "Malayalam", "en": "English"
    }
    lang_name = lang_names.get(language, "English")

    weather_context = ""
    if weather:
        weather_context = f"Current weather: {weather.get('temp','?')}°C, {weather.get('humidity','?')}% humidity, {weather.get('description','')}, city: {weather.get('city','India')}."

    system_prompt = f"""You are SmartAgro Assistant — an AI helper for Indian farmers.
You MUST reply in {lang_name} language only, regardless of what language the question is in.
Keep answers SHORT, SIMPLE and PRACTICAL — farmers need easy advice.
{weather_context}
You know about: crops, diseases, weather, mandi prices, government schemes, fertilizers, pesticides, irrigation.
For government schemes mention: PM-KISAN, Fasal Bima Yojana, Kisan Credit Card, Soil Health Card.
Kisan helpline: 1800-180-1551 (free call).
Always be helpful and encouraging to farmers."""

    try:
        resp = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user",   "content": message}
                ],
                "temperature": 0.7,
                "max_tokens":  400
            },
            timeout=30
        )
        if resp.status_code == 200:
            reply = resp.json()["choices"][0]["message"]["content"].strip()
            return jsonify({"reply": reply})
        return jsonify({"reply": "Sorry, could not get answer. Try again."}), 500
    except Exception as e:
        return jsonify({"reply": f"Error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
    
