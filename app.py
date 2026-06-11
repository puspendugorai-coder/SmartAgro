from flask import Flask, render_template, request, jsonify
import requests, os, json, re, random
from datetime import datetime
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

app = Flask(__name__)

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")
GROQ_API_KEY        = os.getenv("GROQ_API_KEY", "")
KINDWISE_API_KEY    = os.getenv("KINDWISE_API_KEY", "")
RAPIDAPI_KEY        = os.getenv("RAPIDAPI_KEY", "")

print(f"[SmartAgro] Weather  : {'OK' if OPENWEATHER_API_KEY else 'MISSING'}")
print(f"[SmartAgro] Groq     : {'OK' if GROQ_API_KEY else 'MISSING'}")
print(f"[SmartAgro] Kindwise : {'OK' if KINDWISE_API_KEY else 'MISSING'}")
print(f"[SmartAgro] RapidAPI : {'OK' if RAPIDAPI_KEY else 'MISSING'}")

@app.route("/")
def index(): return render_template("index.html")

@app.route("/diagnose")
def diagnose_page(): return render_template("diagnose.html")

@app.route("/market")
def market(): return render_template("market.html")

@app.route("/alerts")
def alerts(): return render_template("alerts.html")

@app.route("/ping")
def ping(): return "OK", 200

# ── Weather ──────────────────────────────────────────────
@app.route("/api/weather")
def get_weather():
    lat = request.args.get("lat")
    lon = request.args.get("lon")
    if not lat or not lon:
        return jsonify({"error": "Location required"}), 400
    try:
        cr = requests.get(
            f"https://api.openweathermap.org/data/2.5/weather"
            f"?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric", timeout=10)
        fr = requests.get(
            f"https://api.openweathermap.org/data/2.5/forecast"
            f"?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric&cnt=56", timeout=10)
        if cr.status_code != 200:
            return jsonify({"error": "Weather API error"}), 500
        cd = cr.json()
        fd = fr.json()
        daily = {}
        for item in fd.get("list", []):
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
                "city":        cd.get("name", "Your Location"),
                "temp":        round(cd["main"]["temp"]),
                "feels_like":  round(cd["main"]["feels_like"]),
                "humidity":    cd["main"]["humidity"],
                "description": cd["weather"][0]["description"],
                "icon":        cd["weather"][0]["icon"],
                "wind_speed":  cd["wind"]["speed"],
                "pressure":    cd["main"]["pressure"],
                "visibility":  cd.get("visibility", 0) / 1000,
                "rain":        cd.get("rain", {}).get("1h", 0),
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
        "pesticides": get_pesticide_guide(crops[:3]),
        "soil_tips":  get_soil_tips(season, temp, humidity)
    })

def get_season(month):
    if month in [6,7,8,9]:        return "Kharif (Monsoon)"
    elif month in [10,11,12,1,2]: return "Rabi (Winter)"
    else:                          return "Zaid (Summer)"

def recommend_crops(temp, humidity, rain, season):
    all_crops = [
        {"name":"Rice","temp_range":(20,38),"humidity_range":(70,100),"season":"Kharif (Monsoon)","water":"High","yield":"3-5 t/ha","profit":"45,000-65,000/ha","duration":"90-150 days","description":"Best for high humidity and warm weather"},
        {"name":"Wheat","temp_range":(10,25),"humidity_range":(40,65),"season":"Rabi (Winter)","water":"Medium","yield":"4-6 t/ha","profit":"50,000-75,000/ha","duration":"100-150 days","description":"Cool dry winters, most popular rabi crop"},
        {"name":"Maize","temp_range":(18,35),"humidity_range":(50,80),"season":"Kharif (Monsoon)","water":"Medium","yield":"5-8 t/ha","profit":"40,000-60,000/ha","duration":"80-110 days","description":"Versatile crop for warm humid weather"},
        {"name":"Cotton","temp_range":(25,40),"humidity_range":(40,70),"season":"Kharif (Monsoon)","water":"Medium","yield":"2-3 t/ha","profit":"60,000-90,000/ha","duration":"150-180 days","description":"Hot dry spells with moderate rain"},
        {"name":"Tomato","temp_range":(18,30),"humidity_range":(60,80),"season":"Zaid (Summer)","water":"Medium","yield":"20-40 t/ha","profit":"80,000-1,50,000/ha","duration":"60-80 days","description":"High value crop for moderate climates"},
        {"name":"Sugarcane","temp_range":(24,38),"humidity_range":(75,90),"season":"Kharif (Monsoon)","water":"Very High","yield":"70-100 t/ha","profit":"70,000-1,00,000/ha","duration":"300-360 days","description":"Hot climate and heavy rainfall needed"},
        {"name":"Soybean","temp_range":(20,32),"humidity_range":(60,80),"season":"Kharif (Monsoon)","water":"Medium","yield":"2-3 t/ha","profit":"35,000-55,000/ha","duration":"90-120 days","description":"Nitrogen-fixing legume for warm monsoon"},
        {"name":"Mustard","temp_range":(10,25),"humidity_range":(40,60),"season":"Rabi (Winter)","water":"Low","yield":"1-2 t/ha","profit":"25,000-40,000/ha","duration":"90-110 days","description":"Cool weather oil seed crop"},
        {"name":"Onion","temp_range":(13,28),"humidity_range":(50,75),"season":"Rabi (Winter)","water":"Medium","yield":"15-25 t/ha","profit":"50,000-1,00,000/ha","duration":"100-120 days","description":"High demand vegetable with good income"},
        {"name":"Potato","temp_range":(10,22),"humidity_range":(60,80),"season":"Rabi (Winter)","water":"Medium","yield":"20-30 t/ha","profit":"40,000-80,000/ha","duration":"70-90 days","description":"Cool weather staple with high yield"},
        {"name":"Chilli","temp_range":(20,35),"humidity_range":(60,80),"season":"Zaid (Summer)","water":"Medium","yield":"6-10 t/ha","profit":"60,000-1,20,000/ha","duration":"90-120 days","description":"Warm climate spice with high market value"},
        {"name":"Groundnut","temp_range":(22,36),"humidity_range":(50,75),"season":"Kharif (Monsoon)","water":"Medium","yield":"1.5-3 t/ha","profit":"30,000-55,000/ha","duration":"90-130 days","description":"Warm season oilseed crop"},
    ]
    scored = []
    for crop in all_crops:
        score = 0
        if crop["temp_range"][0] <= temp <= crop["temp_range"][1]: score += 40
        elif abs(temp - sum(crop["temp_range"])/2) < 5:            score += 20
        if crop["humidity_range"][0] <= humidity <= crop["humidity_range"][1]: score += 30
        if crop["season"] == season: score += 30
        crop["score"] = score
        crop["match"] = f"{min(100, score)}%"
        scored.append(crop)
    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored

def get_pesticide_guide(crops):
    guides = {
        "Rice":     [{"pest":"Brown Plant Hopper","pesticide":"Imidacloprid 17.8 SL","dose":"125 ml/ha","eco":False},
                     {"pest":"Leaf folder","pesticide":"Neem Oil 5%","dose":"2.5 L/ha","eco":True}],
        "Wheat":    [{"pest":"Aphids","pesticide":"Dimethoate 30 EC","dose":"1 L/ha","eco":False},
                     {"pest":"Yellow rust","pesticide":"Propiconazole 25 EC","dose":"500 ml/ha","eco":False}],
        "Maize":    [{"pest":"Fall Armyworm","pesticide":"Spinetoram 11.7 SC","dose":"450 ml/ha","eco":False}],
        "Cotton":   [{"pest":"Bollworm","pesticide":"Chlorpyriphos 20 EC","dose":"2.5 ml/L","eco":False},
                     {"pest":"Whitefly","pesticide":"Neem Oil 5%","dose":"5 ml/L","eco":True}],
        "Tomato":   [{"pest":"Early Blight","pesticide":"Mancozeb 75 WP","dose":"2.5 g/L","eco":False}],
        "Onion":    [{"pest":"Thrips","pesticide":"Spinosad 45 SC","dose":"0.5 ml/L","eco":False}],
    }
    result = []
    for crop in crops:
        if crop["name"] in guides:
            result.append({"crop": crop["name"], "guides": guides[crop["name"]]})
    return result

def get_soil_tips(season, temp, humidity):
    tips = []
    if season == "Kharif (Monsoon)":
        tips = [
            {"icon":"water","title":"Drainage Important","tip":"Ensure field drainage channels are open to prevent waterlogging during heavy rains."},
            {"icon":"leaf","title":"Green Manure","tip":"Grow Dhaincha or Sunhemp as green manure before main crop to improve soil nitrogen."},
            {"icon":"flask","title":"Soil Testing","tip":"Test soil pH before sowing. Most crops need pH 6.0-7.5. Apply lime if acidic."},
        ]
    elif season == "Rabi (Winter)":
        tips = [
            {"icon":"temp","title":"Deep Ploughing","tip":"Deep ploughing 20-25 cm exposes soil to winter cold, killing pests and weeds."},
            {"icon":"pill","title":"Phosphorus Application","tip":"Apply DAP at sowing time for strong root development in cool weather."},
            {"icon":"grain","title":"Residue Management","tip":"Incorporate kharif crop residues into soil to improve organic matter."},
        ]
    else:
        tips = [
            {"icon":"drop","title":"Mulching Essential","tip":"Apply mulch around plants to retain soil moisture in summer heat."},
            {"icon":"sun","title":"Early Morning Irrigation","tip":"Irrigate early morning or evening to reduce evaporation losses."},
            {"icon":"atom","title":"Micronutrients","tip":"Apply zinc sulphate 25 kg/ha for summer crops — deficiency is common in hot weather."},
        ]
    if humidity > 80:
        tips.append({"icon":"mushroom","title":"Fungal Disease Alert","tip":"High humidity — apply preventive fungicide spray on susceptible crops."})
    if temp > 38:
        tips.append({"icon":"fire","title":"Heat Stress Warning","tip":"Temperature above 38C — increase irrigation frequency and apply shade nets."})
    return tips

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
            json={"images": [f"data:image/jpeg;base64,{image_b64}"],
                  "latitude": 22.5, "longitude": 78.9, "similar_images": True},
            timeout=30)
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
            return {
                "disease": "Healthy Plant", "confidence": 95, "severity": "None",
                "affected_part": "N/A", "cause": "No disease detected. Plant looks healthy.",
                "eco_remedies": [{"remedy": "Regular care", "method": "Maintain proper irrigation and fertilization", "frequency": "As needed", "effectiveness": 100}],
                "chemical_remedies": [], "prevention": ["Maintain proper spacing", "Water at base", "Monitor regularly"],
                "recovery_timeline": "Plant is healthy"
            }
        top    = suggestions[0]
        conf   = round(top.get("probability", 0) * 100)
        detail = top.get("details", {})
        treat  = detail.get("treatment", {})
        bio    = treat.get("biological", [])
        chem   = treat.get("chemical", [])
        prev   = treat.get("prevention", [])
        eco = [{"remedy": str(r), "method": "Apply on affected area", "frequency": "Every 7 days", "effectiveness": max(60, 85 - i*10)} for i, r in enumerate(bio[:3])]
        if not eco:
            eco = [{"remedy": "Neem oil spray", "method": "5ml per litre water spray on leaves", "frequency": "Every 5-7 days", "effectiveness": 75}]
        return {
            "disease":           top.get("name", "Unknown Disease"),
            "confidence":        conf,
            "severity":          "Severe" if conf > 80 else "Moderate" if conf > 55 else "Mild",
            "affected_part":     "Leaves",
            "cause":             detail.get("description", "")[:300] or f"{top.get('name')} identified by AI.",
            "eco_remedies":      eco,
            "chemical_remedies": [{"name": str(c), "dose": "As per label", "interval": "10-14 days"} for c in chem[:3]],
            "prevention":        [str(p) for p in prev[:4]] or ["Proper spacing", "Avoid overhead watering", "Remove infected parts", "Use certified seeds"],
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
{"disease":"name","confidence":85,"severity":"Mild/Moderate/Severe","affected_part":"Leaves/Stem/Fruit","cause":"description","eco_remedies":[{"remedy":"name","method":"how","frequency":"when","effectiveness":80}],"chemical_remedies":[{"name":"chem","dose":"dose","interval":"days"}],"prevention":["tip1","tip2"],"recovery_timeline":"2-4 weeks"}"""
    for model in ["meta-llama/llama-4-scout-17b-16e-instruct", "meta-llama/llama-4-maverick-17b-128e-instruct"]:
        try:
            resp = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
                json={"model": model, "messages": [
                    {"role": "system", "content": "Return ONLY valid JSON."},
                    {"role": "user", "content": [
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_b64}"}},
                        {"type": "text", "text": prompt}
                    ]}
                ], "temperature": 0.2, "max_tokens": 1000}, timeout=45)
            if resp.status_code != 200: continue
            raw   = resp.json()["choices"][0]["message"]["content"].strip()
            clean = re.sub(r"```(?:json)?", "", raw).replace("```", "").strip()
            match = re.search(r"\{.*\}", clean, re.DOTALL)
            if match:
                return jsonify(json.loads(match.group()))
        except: continue
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
        alerts_list.append({"type":"danger","category":"Weather","icon":"fa-temperature-full","title":"Extreme Heat","message":"Temperature above 40C. Crops may wilt and soil loses moisture fast.","action":"Irrigate every 4-5 hours. Provide shade netting."})
    if temp < 5:
        alerts_list.append({"type":"danger","category":"Weather","icon":"fa-snowflake","title":"Frost Warning","message":"Very cold temperature. Frost can destroy crops overnight.","action":"Cover crops with cloth. Use sprinkler irrigation at night."})
    if humidity > 85:
        alerts_list.append({"type":"warning","category":"Disease","icon":"fa-cloud-rain","title":"Fungal Disease Risk","message":"Humidity above 85 percent — blight and rust risk very high.","action":"Spray Mancozeb 75 WP at 2.5 g/L immediately."})
    if wind_speed > 50:
        alerts_list.append({"type":"danger","category":"Weather","icon":"fa-wind","title":"Strong Winds","message":"Strong winds can lodge tall crops like maize and wheat.","action":"Avoid spraying. Support tall crops with stakes."})
    if rain > 50:
        alerts_list.append({"type":"warning","category":"Weather","icon":"fa-cloud-showers-heavy","title":"Heavy Rainfall","message":"Excess rain may cause waterlogging and root rot.","action":"Open drainage channels. Stop irrigation."})
    if "storm" in description or "thunder" in description:
        alerts_list.append({"type":"danger","category":"Weather","icon":"fa-bolt","title":"Thunderstorm","message":"Risk of lightning and hail damage to crops.","action":"Stay indoors. Secure farm equipment."})
    if 25 <= temp <= 35 and humidity > 70:
        alerts_list.append({"type":"warning","category":"Pest","icon":"fa-bug","title":"Aphid and Whitefly Risk","message":"Warm humid conditions — aphids multiplying fast.","action":"Spray Neem oil 5 ml/L at dusk."})
    if temp > 30 and humidity < 50:
        alerts_list.append({"type":"warning","category":"Pest","icon":"fa-spider","title":"Spider Mite Alert","message":"Hot dry conditions — mites spreading rapidly.","action":"Apply Abamectin 1.8 EC at 0.5 ml/L."})
    harmful = []
    if temp > 38: harmful.append("Wheat")
    if humidity > 85 and rain > 20: harmful.append("Cotton")
    if temp < 10: harmful.append("Rice")
    if harmful:
        alerts_list.append({"type":"info","category":"Crop Advisory","icon":"fa-seedling","title":"Crops at Risk","message":f"Avoid growing: {', '.join(harmful)} in current weather.","action":"Consider alternate crops better suited to current conditions."})
    return jsonify({"alerts": alerts_list, "total": len(alerts_list)})

# ── Market Prices — RapidAPI India Mandi Price ───────────
MSP_PRICES = {
    "Rice":2300,"Wheat":2275,"Maize":2090,"Cotton":7121,
    "Soybean":4892,"Mustard":5650,"Groundnut":6377,"Onion":1700,
    "Potato":1000,"Tomato":2000,"Chilli":7500,"Sugarcane":3050,
    "Arhar":7550,"Moong":8682,"Urad":7400,
    "Paddy":2300,
}

# Cache so we don't hit API on every request
_market_cache = {"data": None, "time": None}
CACHE_MINUTES = 60  # refresh every 60 minutes

def fetch_rapidapi_mandi():
    """Fetch live data from India Mandi Price RapidAPI"""
    if not RAPIDAPI_KEY:
        print("[Market] No RAPIDAPI_KEY set")
        return None
    try:
        headers = {
            "x-rapidapi-host": "india-mandi-price-api.p.rapidapi.com",
            "x-rapidapi-key":  RAPIDAPI_KEY,
            "Content-Type":    "application/json"
        }
        resp = requests.get(
            "https://india-mandi-price-api.p.rapidapi.com/api/mandi/prices",
            headers=headers,
            timeout=15
        )
        print(f"[RapidAPI] Status: {resp.status_code}")
        if resp.status_code != 200:
            print(f"[RapidAPI] Error body: {resp.text[:300]}")
            return None

        raw = resp.json()
        print(f"[RapidAPI] Got {len(raw) if isinstance(raw, list) else 'unknown'} records")

        # Parse response into our format
        # Response format: list of {crop, state, market/district, modal_price, min_price, max_price, date}
        if not isinstance(raw, list) or len(raw) == 0:
            return None

        # Group by market/city
        markets = {}
        for r in raw:
            # Try different field names the API might use
            city = (r.get("market") or r.get("Market") or
                    r.get("district") or r.get("District") or
                    r.get("mandi") or r.get("Mandi") or "").strip()
            commodity = (r.get("commodity") or r.get("Commodity") or
                         r.get("crop") or r.get("Crop") or "").strip()
            modal = r.get("modal_price") or r.get("Modal_Price") or r.get("modalPrice") or 0
            min_p = r.get("min_price")   or r.get("Min_Price")   or r.get("minPrice")   or 0
            max_p = r.get("max_price")   or r.get("Max_Price")   or r.get("maxPrice")   or 0

            if not city or not commodity or not modal:
                continue

            try:
                modal = float(str(modal).replace(",", ""))
                min_p = float(str(min_p).replace(",", ""))
                max_p = float(str(max_p).replace(",", ""))
            except:
                continue

            # Normalize commodity names
            crop_map = {
                "Paddy":"Rice","Rice":"Rice","Wheat":"Wheat","Maize":"Maize",
                "Cotton":"Cotton","Soyabean":"Soybean","Soybean":"Soybean",
                "Mustard":"Mustard","Rapeseed":"Mustard","Onion":"Onion",
                "Potato":"Potato","Tomato":"Tomato","Chilli":"Chilli",
                "Green Chilli":"Chilli","Dry Chilli":"Chilli",
                "Groundnut":"Groundnut","Sugarcane":"Sugarcane",
                "Arhar":"Arhar","Tur":"Arhar","Red Gram":"Arhar",
                "Moong":"Moong","Green Gram":"Moong",
                "Urad":"Urad","Black Gram":"Urad",
            }
            crop_name = crop_map.get(commodity, commodity)
            msp = MSP_PRICES.get(crop_name, int(modal))

            if city not in markets:
                markets[city] = []

            # Check if crop already added for this city — keep highest modal price
            existing = next((c for c in markets[city] if c["crop"] == crop_name), None)
            if existing:
                if modal > existing["price"]:
                    existing["price"]     = int(modal)
                    existing["min_price"] = int(min_p)
                    existing["max_price"] = int(max_p)
                continue

            change = round(((modal - msp) / msp) * 100, 1) if msp else 0
            markets[city].append({
                "crop":        crop_name,
                "price":       int(modal),
                "min_price":   int(min_p),
                "max_price":   int(max_p),
                "msp":         msp,
                "above_msp":   modal >= msp,
                "unit":        "quintal",
                "change":      change,
                "demand":      "Very High" if modal > msp * 1.1 else "High" if modal > msp else "Medium" if modal > msp * 0.9 else "Low",
                "source":      "live"
            })

        if not markets:
            return None

        print(f"[RapidAPI] Parsed {len(markets)} cities")
        return markets

    except Exception as e:
        print(f"[RapidAPI] Exception: {e}")
        return None

def get_fallback_markets():
    """MSP-based hardcoded fallback"""
    BASE = {
        "Rice":2300,"Wheat":2275,"Maize":2090,"Cotton":7121,
        "Soybean":4892,"Mustard":5650,"Groundnut":6377,"Onion":1800,
        "Potato":1200,"Tomato":2500,"Chilli":8000,"Sugarcane":3150,
        "Arhar":7550,"Moong":8682,"Urad":7400,
    }
    CITIES = ["Delhi","Mumbai","Kolkata","Chennai","Hyderabad","Pune",
              "Ahmedabad","Lucknow","Jaipur","Bhopal","Patna","Nagpur",
              "Indore","Amritsar","Kanpur","Guwahati","Bhubaneswar",
              "Visakhapatnam","Coimbatore","Surat"]
    FACTORS = {
        "Delhi":1.05,"Mumbai":1.08,"Kolkata":1.02,"Chennai":1.06,"Hyderabad":1.04,
        "Pune":1.07,"Ahmedabad":1.03,"Lucknow":0.98,"Jaipur":1.01,"Bhopal":0.97,
        "Patna":0.96,"Nagpur":1.02,"Indore":1.00,"Amritsar":1.00,"Kanpur":0.99,
        "Guwahati":1.01,"Bhubaneswar":0.98,"Visakhapatnam":1.03,"Coimbatore":1.05,"Surat":1.04,
    }
    seed = int(datetime.now().strftime("%Y%m%d"))
    rng  = random.Random(seed)
    markets = {}
    for city in CITIES:
        f = FACTORS.get(city, 1.0)
        crops = []
        for crop, base in BASE.items():
            price  = int(base * f * rng.uniform(0.94, 1.06))
            msp    = MSP_PRICES.get(crop, base)
            change = round(((price - msp) / msp) * 100, 1)
            crops.append({
                "crop": crop, "price": price,
                "min_price": int(price * 0.95), "max_price": int(price * 1.05),
                "msp": msp, "above_msp": price >= msp,
                "unit": "quintal", "change": change,
                "demand": "Very High" if price > msp*1.1 else "High" if price > msp else "Medium" if price > msp*0.9 else "Low",
                "source": "indicative"
            })
        markets[city] = crops
    return markets

@app.route("/api/market")
def get_market_data():
    global _market_cache
    now = datetime.now()

    # Use cache if fresh
    if (_market_cache["data"] and _market_cache["time"] and
            (now - _market_cache["time"]).seconds < CACHE_MINUTES * 60):
        markets     = _market_cache["data"]
        data_source = _market_cache.get("source", "cached")
    else:
        live = fetch_rapidapi_mandi()
        if live and len(live) >= 3:
            markets     = live
            data_source = "live"
            _market_cache = {"data": live, "time": now, "source": "live"}
            print(f"[Market] LIVE data — {len(live)} cities")
        else:
            markets     = get_fallback_markets()
            data_source = "indicative"
            _market_cache = {"data": markets, "time": now, "source": "indicative"}
            print("[Market] FALLBACK data")

    location = request.args.get("location", "").strip().lower()
    if location:
        markets = {c: v for c, v in markets.items() if location in c.lower()}

    return jsonify({
        "markets":     markets,
        "locations":   list(markets.keys()),
        "data_source": data_source,
        "last_updated": now.strftime("%d %b %Y, %I:%M %p")
    })

# ── Chat ─────────────────────────────────────────────────
@app.route("/api/chat", methods=["POST"])
def chat():
    if not GROQ_API_KEY:
        return jsonify({"reply": "Groq API key missing."}), 500
    data    = request.json or {}
    message = data.get("message", "").strip()
    weather = data.get("weather_context", {})
    history = data.get("history", [])
    if not message:
        return jsonify({"reply": "Please ask a question."}), 400

    weather_ctx = ""
    if weather:
        weather_ctx = f"Current weather: {weather.get('temp','?')}C, {weather.get('humidity','?')}% humidity, {weather.get('description','')}, city: {weather.get('city','India')}."

    system_prompt = f"""You are SmartAgro Assistant — expert AI for Indian farmers.

CRITICAL: Detect the language of the user message and reply in EXACTLY that same language.
- Hindi message → reply in Hindi Devanagari script
- Bengali message → reply in Bengali script
- Tamil → Tamil script, Telugu → Telugu script, etc.
- English → English. Never mix languages.

{weather_ctx}

You know about: crop diseases, weather, mandi prices, government schemes (PM-KISAN Rs 6000/year, Fasal Bima Yojana, Kisan Credit Card, Soil Health Card), fertilizers, pesticides, irrigation, soil health.
Kisan helpline: 1800-180-1551 toll free.
Keep answers SHORT and PRACTICAL. Use simple words. Be encouraging."""

    messages = [{"role": "system", "content": system_prompt}]
    for h in history[-6:]:
        messages.append({"role": h["role"], "content": h["content"]})
    messages.append({"role": "user", "content": message})

    try:
        resp = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
            json={"model": "llama-3.3-70b-versatile", "messages": messages,
                  "temperature": 0.7, "max_tokens": 500},
            timeout=30)
        if resp.status_code == 200:
            reply = resp.json()["choices"][0]["message"]["content"].strip()
            return jsonify({"reply": reply})
        return jsonify({"reply": "Sorry, could not get answer. Try again."}), 500
    except Exception as e:
        return jsonify({"reply": f"Error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
