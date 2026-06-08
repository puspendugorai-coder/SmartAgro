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

# ── Weather API Module ───────────────────────────────────
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

# ── Crop Recommendations Module ──────────────────────────
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

# ── Kindwise Diagnosis Module ────────────────────────────
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
            clean = re.sub(r"
http://googleusercontent.com/immersive_entry_chip/0

---

## 2. The Complete Frontend (`static/js/chatbot.js`)
This script contains isolated storage instances, silence trackers, and a translation string array matched completely to native voice modules.

```javascript
// Scope-isolated variables to prevent global collisions
let chatOpen         = false;
let recognition      = null;
let isListening      = false;
let userClickedStop  = false; // Tracks if the user explicitly hit the stop button
let chatHistory      = [];
let currentLangCode  = (localStorage.getItem('agrosmart_lang') || 'hi').toLowerCase();
let speechTimeout    = null; // Manages the Gemini-style silence detection

const LANG_SPEECH_CODES = {
  'hi':'hi-IN','bn':'bn-IN','ta':'ta-IN','te':'te-IN',
  'mr':'mr-IN','pa':'pa-IN','gu':'gu-IN','kn':'kn-IN',
  'ml':'ml-IN','en':'en-IN'
};

// Conflict-free notification fallback
function safeToast(message, type = 'info') {
  if (typeof showToast === 'function') {
    showToast(message, type);
  } else {
    console.log(`[ChatBot Mini-Toast - ${type}]: ${message}`);
  }
}

function toggleChat() {
  chatOpen = !chatOpen;
  const box = document.getElementById('chatBox');
  const fab = document.getElementById('chatFab');
  
  if (chatOpen) {
    if (box) {
      box.style.display = 'flex';
      setTimeout(() => box.classList.add('open'), 10);
    }
    if (fab) fab.innerHTML = '<i class="fas fa-times"></i>';
    if (chatHistory.length === 0) addBotMessage(getWelcomeMsg());
  } else {
    if (box) {
      box.classList.remove('open');
      setTimeout(() => { box.style.display = 'none'; }, 300);
    }
    if (fab) fab.innerHTML = '<i class="fas fa-microphone"></i>';
  }
}

function getWelcomeMsg() {
  const msgs = {
    hi: '🌾 नमस्ते किसान भाई! मैं SmartAgro सहायक हूं। आप मुझसे मौसम, फसल, बाजार भाव या सरकारी योजनाओं के बारे में पूछ सकते हैं।',
    bn: '🌾 নমস্কার! আমি SmartAgro সহায়ক। আপনি আমাকে আবহাওয়া, ফসল বা বাজার সম্পর্কে জিজ্ঞাসা করতে পারেন।',
    ta: '🌾 வணக்கம்! நான் SmartAgro உதவியாளர். வானிலை, பயிர் அல்லது சந்தை பற்றி கேளுங்கள்.',
    te: '🌾 నమస్కாரம் రైతు సోదరులారా! నేను SmartAgro సహాయకుడిని. వాతావరణం, పంటలు, మార్కెట్ ధరలు లేదా ప్రభుత్వ పథకాల గురించి నన్ను అడಗండి.',
    mr: '🌾 नमस्कार शेतकरी बंधूंनो! मी SmartAgro सहाय्यक आहे. तुम्ही मला हवामान, पिके, बाजारभाव किंवा सरकारी योजनांबद्दल विचारू शकता.',
    pa: '🌾 ਨਮਸਤੇ ਕਿਸਾਨ ਵੀਰੋ! ਮੈਂ SmartAgro ਸਹਾਇਕ ਹਾਂ। ਤੁਸੀਂ ਮੇਰੇ ਕੋਲੋਂ ਮੌਸਮ, ਫਸਲਾਂ, ਮੰਡੀ ਦੇ ਭਾਅ ਜਾਂ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ।',
    gu: '🌾 નમસ્તે ખેડૂત ભાઈઓ! હું SmartAgro સહાયક છું. તમે મને હવામાન, પાક, બજારના ભાવ અથવા સરકારી યોજનાઓ વિશે પૂછી શકો છો.',
    kn: '🌾 ನಮಸ್ಕಾರ ರೈತ ಬಾಂಧವರೇ! ನಾನು SmartAgro ಸಹಾಯಕ. ನೀವು ನನ್ನ ಬಳಿ ಹವಾಮಾನ, ಬೆಳೆಗಳು, ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಅಥವಾ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಕೇಳಬಹುದು.',
    ml: '🌾 നമസ്കാരം കർഷക സുഹൃത്തുക്കളെ! ഞാൻ SmartAgro സഹായിയാണ്. കാലാവസ്ഥ, വിളകൾ, വിപണി വിലകൾ അല്ലെങ്കിൽ സർക്കാർ പദ്ധതികളെക്കുറിച്ച് നിങ്ങൾക്ക് എന്നോട് ചോദിക്കാം.',
    en: '🌾 Hello farmer! I am SmartAgro Assistant. Ask me about weather, crops, market prices or government schemes.',
  };
  return msgs[currentLangCode] || msgs.en;
}

function addBotMessage(text) {
  const list = document.getElementById('chatMessages');
  if (!list) return;
  const div  = document.createElement('div');
  div.className = 'chat-msg bot';
  div.innerHTML = `<div class="msg-bubble">${text}</div>`;
  list.appendChild(div);
  list.scrollTop = list.scrollHeight;
}

function addUserMessage(text) {
  const list = document.getElementById('chatMessages');
  if (!list) return;
  const div  = document.createElement('div');
  div.className = 'chat-msg user';
  div.innerHTML = `<div class="msg-bubble">${text}</div>`;
  list.appendChild(div);
  list.scrollTop = list.scrollHeight;
}

function addTypingIndicator() {
  const list = document.getElementById('chatMessages');
  if (!list) return null;
  const div  = document.createElement('div');
  div.className = 'chat-msg bot typing-msg';
  div.innerHTML = '<div class="msg-bubble"><span class="typing-dots"><span></span><span></span><span></span></span></div>';
  list.appendChild(div);
  list.scrollTop = list.scrollHeight;
  return div;
}

async function sendMessage() {
  const input = document.getElementById('chatInput');
  if (!input) return;
  
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  
  addUserMessage(msg);
  const typing = addTypingIndicator();

  const weather = (window.weatherData && window.weatherData.current) ? window.weatherData.current : {};

  try {
    const res = await fetch('/api/chat', {
      method:  'POST',
      headers: {'Content-Type':'application/json'},
      body:    JSON.stringify({
        message:         msg,
        language:        currentLangCode, // Lowercase variable structure sent perfectly
        weather_context: weather
      })
    });
    const data = await res.json();
    if (typing) typing.remove();
    addBotMessage(data.reply || 'Sorry, try again.');
  } catch (err) {
    if (typing) typing.remove();
    addBotMessage('Connection error. Please try again.');
  }
}

function handleChatKey(e) {
  if (e.key === 'Enter') sendMessage();
}

function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    safeToast('Voice not supported. Use Chrome browser.', 'error');
    return;
  }

  const inputEl = document.getElementById('chatInput');

  if (isListening) {
    isListening = false;
    userClickedStop = true; 
    clearTimeout(speechTimeout);
    if (recognition) {
      recognition.stop();
    }
    updateMicBtn(false);
    return;
  }

  if (!chatOpen) toggleChat();

  userClickedStop = false; 
  recognition = new SpeechRecognition();
  recognition.lang = LANG_SPEECH_CODES[currentLangCode] || 'hi-IN';
  
  recognition.continuous = true; 
  recognition.interimResults = true; 
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    isListening = true;
    updateMicBtn(true);
    if (inputEl) {
      inputEl.classList.add('listening-mode');
      inputEl.placeholder = "Listening... बोलिए / बोलुन...";
    }
    safeToast('🎤 Listening... speak freely', 'success');
  };

  recognition.onresult = e => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = e.resultIndex; i < e.results.length; ++i) {
      if (e.results[i].isFinal) {
        finalTranscript += e.results[i][0].transcript;
      } else {
        interimTranscript += e.results[i][0].transcript;
      }
    }

    const currentText = finalTranscript || interimTranscript;
    if (inputEl && currentText) {
      inputEl.value = currentText;
    }

    // Smart Auto-Submit after 2 seconds of silence
    clearTimeout(speechTimeout);
    speechTimeout = setTimeout(() => {
      if (inputEl && inputEl.value.trim()) {
        isListening = false;
        userClickedStop = true; 
        sendMessage();
        if (recognition) recognition.stop(); 
      }
    }, 2000); 
  };

  recognition.onerror = e => {
    if (e.error === 'no-speech' || e.error === 'aborted') return; 
    console.error("Speech error caught safely: ", e.error);
  };

  recognition.onend = () => {
    if (isListening && !userClickedStop) {
      try {
        recognition.start();
      } catch (err) {
        console.log("Mic restarting loop active...");
      }
    } else {
      isListening = false;
      updateMicBtn(false);
      if (inputEl) {
        inputEl.classList.remove('listening-mode');
        inputEl.placeholder = "Type or speak...";
      }
      clearTimeout(speechTimeout);
    }
  };

  recognition.start();
}

function updateMicBtn(listening) {
  const btn = document.getElementById('micBtn');
  const fab = document.getElementById('chatFab');
  
  if (btn) {
    btn.classList.toggle('listening', listening);
    btn.innerHTML = listening
      ? '<i class="fas fa-stop"></i>'
      : '<i class="fas fa-microphone"></i>';
  }
  if (fab && !chatOpen) {
    fab.classList.toggle('listening', listening);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  currentLangCode = (localStorage.getItem('agrosmart_lang') || 'hi').toLowerCase();
});

const origSetLang = window.setLanguage;
window.setLanguage = function(code) {
  if(code) currentLangCode = code.toLowerCase();
  if (typeof origSetLang === 'function') origSetLang(code);
};
