from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import requests
from utils.threat_score import compute_threat_score

load_dotenv()

app = Flask(__name__)
CORS(app)

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")
WEATHERAPI_KEY = os.getenv("WEATHERAPI_KEY")
AIRVISUAL_KEY = os.getenv("AIRVISUAL_KEY")
CAT_API_KEY = os.getenv("CAT_API_KEY")

def get_city_data(city_name):
    url = "https://wft-geo-db.p.rapidapi.com/v1/geo/cities"
    params = {"namePrefix": city_name}
    headers = {
        "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
        "x-rapidapi-key": RAPIDAPI_KEY
    }
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        data = response.json()
        if data["data"]:
            city = data["data"][0]
            return {
                "name": city["name"],
                "country": city["country"],
                "latitude": city["latitude"],
                "longitude": city["longitude"]
            }
    return None

def get_weather(lat, lon):
    url = f"https://api.weatherapi.com/v1/current.json?key={WEATHERAPI_KEY}&q={lat},{lon}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return {
            "temperature": data["current"]["temp_c"],
            "feels_like": data["current"]["feelslike_c"],
            "condition": data["current"]["condition"]["text"],
            "humidity": data["current"]["humidity"]
        }
    return None

def get_air_quality(lat, lon):
    url = f"https://api.airvisual.com/v2/nearest_city?lat={lat}&lon={lon}&key={AIRVISUAL_KEY}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        pollution = data["data"]["current"]["pollution"]
        return {
            "aqi": pollution["aqius"],
            "main_pollutant": pollution["mainus"]
        }
    return None

def get_covid_stats(country):
    url = f"https://disease.sh/v3/covid-19/countries/{country}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return {
            "cases": data["todayCases"],
            "deaths": data["todayDeaths"],
            "active": data["active"],
            "critical": data["critical"],
            "total": data["cases"]
        }
    return None

def get_fallback_cat():
    url = "https://api.thecatapi.com/v1/images/search"
    headers = {"x-api-key": CAT_API_KEY}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()[0]["url"]
    return "https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg"

def get_all_city_data(city_input):
    city_info = get_city_data(city_input)
    if not city_info:
        return {"error": "City not found", "cat": get_fallback_cat()}

    lat, lon = city_info["latitude"], city_info["longitude"]
    weather = get_weather(lat, lon)
    air_quality = get_air_quality(lat, lon)
    covid = get_covid_stats(city_info["country"])

    if not (weather and air_quality and covid):
        return {"error": "Data fetch failed", "cat": get_fallback_cat()}

    threat = compute_threat_score(weather, air_quality, covid)

    return {
        "city": city_info["name"],
        "country": city_info["country"],
        "latitude": lat,
        "longitude": lon,
        "weather": weather,
        "air_quality": air_quality,
        "covid": covid,
        "threat": threat
    }

@app.route('/api/data', methods=['POST'])
def get_city_info():
    data = request.get_json()
    city_input = data.get("city")
    if not city_input:
        return jsonify({"error": "City parameter missing"}), 400

    result = get_all_city_data(city_input)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
