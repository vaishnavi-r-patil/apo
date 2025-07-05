
def compute_threat_score(weather, air_quality, covid):
    score = 0
    tips = []

    # Air Quality Index
    aqi = air_quality["aqi"]
    if aqi > 300:
        score += 40
        tips.append("Air quality is hazardous. Stay indoors and use an air purifier.")
    elif aqi > 200:
        score += 30
        tips.append("Air quality is very unhealthy. Avoid all outdoor activity.")
    elif aqi > 150:
        score += 20
        tips.append("Air quality is unhealthy for everyone. Wear a mask when outside.")
    elif aqi > 100:
        score += 10
        tips.append("Air quality is moderate. Sensitive groups should limit exposure.")
    elif aqi > 75:
        score += 5
        tips.append("Air quality is acceptable but may affect sensitive individuals.")

    # Temperature
    feels_like = weather["feels_like"]
    if feels_like > 35:
        score += 20
        tips.append("Extreme heat detected. Stay hydrated and avoid peak sun hours.")
    elif feels_like < 5:
        score += 20
        tips.append("Severe cold detected. Bundle up and avoid prolonged exposure.")

    # Weather condition
    condition = weather["condition"].lower()
    if any(term in condition for term in ["storm", "rain", "snow", "wind"]):
        score += 20
        tips.append("Adverse weather conditions. Stay indoors and secure belongings.")

    # COVID cases
    active_cases = covid["active"]
    if active_cases > 1_000_000:
        score += 30
        tips.append("Extremely high number of active COVID cases. Limit social contact and mask up.")
    elif active_cases > 10_000:
        score += 15
        tips.append("High number of active COVID cases. Wear a mask and avoid crowds.")

    # Threat Level & Theme
    if score <= 20:
        level = "Low"
        theme = "safe"
    elif score <= 49:
        level = "Moderate"
        theme = "caution"
    else:
        level = "High"
        theme = "danger"

    # No risk detected
    if score == 0:
        tips.append("Conditions are currently safe. Stay aware and enjoy your day!")

    return {
        "score": score,
        "level": level,
        "tips": tips,
        "theme": theme  # used for frontend styling
    }
