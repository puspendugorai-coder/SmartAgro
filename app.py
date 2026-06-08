from flask import Flask, render_template, request, jsonify
import requests
import os
import json
import re
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

# API Keys
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

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

@app.route("/api/weather")
def get_weather():
    lat = request.args.get("lat")
    lon = request.args.get("lon")
    if not lat or not lon:
        return jsonify({"error": "Missing coordinates"}), 400
    
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
    try:
        response = requests.get(url, timeout=5)
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json or {}
    user_message = data.get("message", "")
    
    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [{"role": "user", "content": user_message}],
                "temperature": 0.7
            },
            timeout=10
        )
        reply = response.json()["choices"][0]["message"]["content"]
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"reply": "Error connecting to AI service."}), 500

@app.route("/api/diagnose", methods=["POST"])
def diagnose_crop():
    data = request.json or {}
    image_b64 = data.get("image", "")
    
    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
            json={
                "model": "llama-3.2-11b-vision-preview",
                "messages": [
                    {"role": "user", "content": [
                        {"type": "text", "text": "Identify the plant disease in this image. Return strictly valid JSON with: disease, confidence, severity, cause, recovery."},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_b64}"}}
                    ]}
                ]
            },
            timeout=20
        )
        content = response.json()["choices"][0]["message"]["content"]
        # Clean markdown if present
        clean_json = re.sub(r"```json|```", "", content).strip()
        return jsonify(json.loads(clean_json))
    except Exception as e:
        return jsonify({"error": "Diagnosis failed"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
