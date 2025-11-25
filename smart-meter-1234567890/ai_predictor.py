# # """
# # AI Predictor for Smart Energy Monitoring System
# # ------------------------------------------------
# # Fetches data directly from MongoDB if no JSON input provided.
# # Performs:
# # 1. Energy Forecasting (Prophet)
# # 2. Fault Detection (Isolation Forest)
# # 3. Energy Efficiency Recommendations (Random Forest)
# # """

# # import sys
# # import json
# # import numpy as np
# # import pandas as pd
# # from datetime import datetime, timedelta
# # from prophet import Prophet
# # from sklearn.ensemble import IsolationForest, RandomForestRegressor
# # from pymongo import MongoClient


# # # -----------------------------
# # # CONFIGURATION
# # # -----------------------------
# # MONGO_URI = MONGO_URI = "mongodb+srv://ayshagupta8790_db_user:Energy1234@smartelectricity.srnuily.mongodb.net/smart_energy"
# # DB_NAME = "smart_energy"
# # COLLECTION = "energyreadings"

# # # -----------------------------
# # # HELPER FUNCTIONS
# # # -----------------------------
# # def success(msg, data=None):
# #     return json.dumps({"success": True, "message": msg, "data": data})

# # def error(msg):
# #     return json.dumps({"success": False, "message": msg})

# # def fetch_from_mongo(limit=100):
# #     """Fetch latest energy readings"""
# #     client = MongoClient(MONGO_URI)
# #     db = client[DB_NAME]
# #     readings = list(db[COLLECTION].find({}, {"_id": 0}).sort("timestamp", -1).limit(limit))
# #     client.close()
# #     return readings

# # # -----------------------------
# # # LOAD INPUT (JSON or Mongo)
# # # -----------------------------
# # try:
# #     raw = sys.stdin.read().strip()
# #     if raw:
# #         payload = json.loads(raw)
# #         task = payload.get("task", "predict-energy")
# #     else:
# #         # fallback: use MongoDB data
# #         readings = fetch_from_mongo(200)
# #         if not readings:
# #             print(error("No data found in MongoDB. Please insert readings first."))
# #             sys.exit(0)
# #         payload = {
# #             "task": "predict-energy",
# #             "powerConsumption": [r.get("power", 0) for r in readings],
# #             "electricalParameters": {
# #                 "voltage": [r.get("voltage", 0) for r in readings],
# #                 "current": [r.get("current", 0) for r in readings]
# #             },
# #             "environmentalData": {
# #                 "temperature": [r.get("temperature", 0) for r in readings],
# #                 "humidity": [r.get("humidity", 0) for r in readings]
# #             }
# #         }
# #         task = payload["task"]
# # except Exception as e:
# #     print(error(f"Invalid input: {e}"))
# #     sys.exit(1)

# # # -----------------------------
# # # 1️⃣ ENERGY FORECAST (Prophet)
# # # -----------------------------
# # def predict_energy():
# #     try:
# #         power = np.array(payload["powerConsumption"])
# #         now = datetime.now()
# #         timestamps = [now - timedelta(minutes=10 * i) for i in range(len(power))]
# #         df = pd.DataFrame({"ds": timestamps[::-1], "y": power})

# #         model = Prophet(daily_seasonality=True)
# #         model.fit(df)
# #         future = model.make_future_dataframe(periods=6, freq="10min")
# #         forecast = model.predict(future)
# #         next_pred = round(forecast["yhat"].iloc[-1], 2)

# #         return success("Energy forecast generated", {"predictedUsage": next_pred})
# #     except Exception as e:
# #         return error(f"Energy prediction failed: {e}")

# # # -----------------------------
# # # 2️⃣ FAULT DETECTION (Isolation Forest)
# # # -----------------------------
# # def predict_fault():
# #     try:
# #         voltage = np.array(payload["electricalParameters"]["voltage"])
# #         current = np.array(payload["electricalParameters"]["current"])
# #         temperature = np.array(payload["environmentalData"]["temperature"])

# #         df = pd.DataFrame({"voltage": voltage, "current": current, "temperature": temperature})
# #         model = IsolationForest(contamination=0.1, random_state=42)
# #         df["anomaly"] = model.fit_predict(df)

# #         anomalies = df[df["anomaly"] == -1]
# #         fault_detected = len(anomalies) > 0
# #         return success("Fault detection complete", {
# #             "faultDetected": fault_detected,
# #             "faultType": "Abnormal readings" if fault_detected else "No fault detected",
# #             "anomalyCount": int(len(anomalies))
# #         })
# #     except Exception as e:
# #         return error(f"Fault detection failed: {e}")

# # # -----------------------------
# # # 3️⃣ RECOMMENDATIONS (Random Forest)
# # # -----------------------------
# # def predict_recommendation():
# #     try:
# #         df = pd.DataFrame({
# #             "power": payload["powerConsumption"],
# #             "voltage": payload["electricalParameters"]["voltage"],
# #             "current": payload["electricalParameters"]["current"],
# #             "temperature": payload["environmentalData"]["temperature"],
# #             "humidity": payload["environmentalData"]["humidity"]
# #         }).fillna(0)

# #         df["efficiency"] = df["power"] / (df["voltage"] * df["current"] + 1e-6)
# #         df["cost"] = df["power"] * 0.005

# #         X = df[["voltage", "current", "temperature", "humidity"]]
# #         y = df["cost"]

# #         model = RandomForestRegressor(n_estimators=50, random_state=42)
# #         model.fit(X, y)
# #         feature_importance = model.feature_importances_

# #         insights = {
# #             "highImpactFactors": {
# #                 "voltage": round(feature_importance[0], 2),
# #                 "current": round(feature_importance[1], 2),
# #                 "temperature": round(feature_importance[2], 2),
# #                 "humidity": round(feature_importance[3], 2)
# #             },
# #             "recommendations": [
# #                 "Shift heavy load devices to off-peak hours.",
# #                 "Inspect high-consumption appliances for inefficiency.",
# #                 "Maintain ambient temperature below 28°C."
# #             ],
# #             "energyEfficiencyScore": round(10 - df["efficiency"].mean() * 5, 2),
# #             "estimatedCostSaving": "10–15%"
# #         }
# #         return success("Optimization recommendations generated", insights)
# #     except Exception as e:
# #         return error(f"Recommendation failed: {e}")

# # # -----------------------------
# # # -----------------------------
# # # EXECUTION SWITCH
# # # -----------------------------
# # if task == "predict-energy":
# #     print(predict_energy(), flush=True)
# # elif task == "predict-fault":
# #     print(predict_fault(), flush=True)
# # elif task == "predict-recommendation":
# #     print(predict_recommendation(), flush=True)
# # else:
# #     print(error("Invalid task type"), flush=True)


# from flask import Flask, request, jsonify
# from prophet import Prophet
# import cmdstanpy
# from sklearn.ensemble import IsolationForest, RandomForestRegressor
# from pymongo import MongoClient
# import math , numpy as np
# import pandas as pd
# from datetime import datetime, timedelta
# import requests

# NODE_API_URL = "http://localhost:5000/api/alerts/create"
# NODE_AUTH_TOKEN = "YOUR_BACKEND_JWT_TOKEN"

# app = Flask(__name__)

# # -----------------------------
# # CONFIGURATION
# # -----------------------------
# MONGO_URI = "mongodb+srv://ayshagupta8790_db_user:Energy1234@smartelectricity.srnuily.mongodb.net/smart_energy"
# DB_NAME = "smart_energy"
# COLLECTION = "energyreadings"

# # -----------------------------
# # HELPER FUNCTIONS
# # -----------------------------
# def fetch_from_mongo(limit=100):
#     client = MongoClient(MONGO_URI)
#     db = client[DB_NAME]
#     readings = list(db[COLLECTION].find({}, {"_id": 0}).sort("timestamp", -1).limit(limit))
#     client.close()
#     return readings

# def success(msg, data=None):
#     return jsonify({"success": True, "message": msg, "data": data})

# def error(msg):
#     return jsonify({"success": False, "message": msg})

# # -----------------------------
# # AI FUNCTIONS
# # -----------------------------
# def predict_energy(payload):
#     try:
#         power = np.array(payload["powerConsumption"])
#         voltage = np.array(payload["electricalParameters"]["voltage"])
#         current = np.array(payload["electricalParameters"]["current"])
#         temperature = np.array(payload["environmentalData"]["temperature"])

#         # Forecast power using Prophet
#         now = datetime.now()
#         timestamps = [now - timedelta(minutes=10 * i) for i in range(len(power))]
#         df = pd.DataFrame({"ds": timestamps[::-1], "y": power})

#         model = Prophet(daily_seasonality=True)
#         model.fit(df)
#         future = model.make_future_dataframe(periods=6, freq="10min")
#         forecast = model.predict(future)
#         pred_power = forecast["yhat"].iloc[-1]

#         # Compute averages for other parameters
#         pred_voltage = np.mean(voltage)
#         pred_current = np.mean(current)
#         pred_temp = np.mean(temperature)

#         # Convert safely
#         def safe_float(x, default=0.0):
#             try:
#                 val = float(x)
#                 if math.isnan(val) or math.isinf(val):
#                     return default
#                 return val
#             except Exception:
#                 return default

#         # Build proper JSON response
#         return jsonify({
#             "success": True,
#             "message": "Energy forecast generated successfully",
#             "predictedPower": safe_float(pred_power),
#             "predictedCurrent": safe_float(pred_current),
#             "predictedVoltage": safe_float(pred_voltage),
#             "predictedTemperature": safe_float(pred_temp),
#             "confidence": 0.9,
#             "modelVersion": "v1.0"
#         })

#     except Exception as e:
#         print("❌ Error in predict_energy:", str(e))
#         return jsonify({
#             "success": False,
#             "message": f"Energy prediction failed: {str(e)}"
#         }), 500


# def predict_fault(payload):
#     try:
#         voltage = payload["electricalParameters"]["voltage"]
#         current = payload["electricalParameters"]["current"]
#         temperature = payload["environmentalData"]["temperature"]

#         avg_voltage = sum(voltage) / len(voltage)
#         avg_current = sum(current) / len(current)
#         avg_temp = sum(temperature) / len(temperature)

#         power = avg_voltage * avg_current
#         overload = power > 2000
#         temp_risk = avg_temp > 50

#         fault_probability = round(min(1.0, (power / 5000) + (avg_temp / 100)), 2)
#         fault_type = "Overload or Thermal Fault" if (overload or temp_risk) else "Normal Operation"

#         return jsonify({
#             "success": True,
#             "message": "Fault prediction generated successfully",
#             "predictedFaultType": fault_type,
#             "faultProbability": fault_probability,
#             "averagePower": round(power, 2),
#             "temperature": round(avg_temp, 2),
#             "modelVersion": "v1.0"
#         }), 200

#     except Exception as e:
#         print(f"❌ Error in predict_fault: {str(e)}")
#         return jsonify({
#             "success": False,
#             "message": "Error in fault prediction",
#             "error": str(e)
#         }), 500


# def predict_recommendation(payload):
#     try:
#         power_data = payload["powerConsumption"]
#         avg_power = sum(power_data) / len(power_data)
#         peak_load = max(power_data)

#         env_data = payload.get("environmentalData", {})
#         temp = env_data.get("temperature", [25])
#         humidity = env_data.get("humidity", [45])  # ✅ use default if missing

#         avg_temp = sum(temp) / len(temp)
#         avg_humidity = sum(humidity) / len(humidity)

#         recommendations = []

#         if avg_power > 200:
#             recommendations.append("Optimize device usage for better efficiency")
#         if peak_load - avg_power > 10:
#             recommendations.append("Reduce peak load between 6 PM - 9 PM")
#         if avg_temp > 35:
#             recommendations.append("Improve cooling to reduce energy waste")

#         recommendations.append("Perform maintenance check monthly")
#         # Send each recommendation as a separate alert
# # for rec in recommendations:
# #     send_alert_to_backend(
# #         device_id="AI_RECOMMENDER",
# #         message=rec,
# #         alert_type="recommendation",
# #         severity="low",
# #         metadata={"source": "AI Model", "type": "Energy Optimization"}
# #     )


#         return jsonify({
#             "success": True,
#             "message": "Energy recommendations generated successfully",
#             "recommendations": recommendations,
#             "averagePower": round(avg_power, 2),
#             "peakLoad": round(peak_load, 2),
#             "temperature": round(avg_temp, 2),
#             "humidity": round(avg_humidity, 2),
#             "modelVersion": "v1.0"
#         }), 200

#     except Exception as e:
#         print(f"❌ Error in predict_recommendation: {str(e)}")
#         return jsonify({
#             "success": False,
#             "message": "Error in recommendation generation",
#             "error": str(e)
#         }), 500
#     df = pd.DataFrame({
#         "power": payload["powerConsumption"],
#         "voltage": payload["electricalParameters"]["voltage"],
#         "current": payload["electricalParameters"]["current"],
#         "temperature": payload["environmentalData"]["temperature"],
#         "humidity": payload["environmentalData"]["humidity"]
#     }).fillna(0)

#     df["efficiency"] = df["power"] / (df["voltage"] * df["current"] + 1e-6)
#     df["cost"] = df["power"] * 0.005

#     X = df[["voltage", "current", "temperature", "humidity"]]
#     y = df["cost"]

#     model = RandomForestRegressor(n_estimators=50, random_state=42)
#     model.fit(X, y)
#     feature_importance = model.feature_importances_

#     insights = {
#         "highImpactFactors": {
#             "voltage": round(feature_importance[0], 2),
#             "current": round(feature_importance[1], 2),
#             "temperature": round(feature_importance[2], 2),
#             "humidity": round(feature_importance[3], 2)
#         },
#         "recommendations": [
#             "Shift heavy load devices to off-peak hours.",
#             "Inspect high-consumption appliances for inefficiency.",
#             "Maintain ambient temperature below 28°C."
#         ],
#         "energyEfficiencyScore": round(10 - df["efficiency"].mean() * 5, 2),
#         "estimatedCostSaving": "10–15%"
#     }
#     return success("Optimization recommendations generated", insights)

# import requests

# NODE_API_URL = "http://localhost:5000/api/alerts/create"
# NODE_AUTH_TOKEN = "YOUR_JWT_TOKEN"  # temporary, until integrated with auth

# def send_alert_to_backend(device_id, message, alert_type, severity="low", metadata=None):
#     try:
#         payload = {
#             "deviceId": device_id,
#             "message": message,
#             "alertType": alert_type,
#             "severity": severity,
#             "metadata": metadata or {}
#         }

#         headers = {
#             "Content-Type": "application/json",
#             "Authorization": f"Bearer {NODE_AUTH_TOKEN}"
#         }

#         r = requests.post(NODE_API_URL, json=payload, headers=headers, timeout=5)
#         print(f"✅ Recommendation alert sent to Node backend ({r.status_code})")
#     except Exception as e:
#         print("❌ Failed to send recommendation alert:", str(e))


# def safe_float(x, default=0.0):
#     try:
#         if isinstance(x, (list, np.ndarray)):
#             x = float(np.mean(x))
#         x = float(x)
#         if math.isnan(x) or math.isinf(x):
#             return default
#         return x
#     except Exception:
#         return default


# # -----------------------------
# # ROUTES
# # -----------------------------
# @app.route("/predict-energy", methods=["POST"])
# def route_energy():
#     payload = request.get_json()
#     if not payload:
#         readings = fetch_from_mongo(200)
#         if not readings:
#             return error("No data found in MongoDB")
#         payload = {
#             "powerConsumption": [r.get("power", 0) for r in readings],
#             "electricalParameters": {
#                 "voltage": [r.get("voltage", 0) for r in readings],
#                 "current": [r.get("current", 0) for r in readings]
#             },
#             "environmentalData": {
#                 "temperature": [r.get("temperature", 0) for r in readings],
#                 "humidity": [r.get("humidity", 0) for r in readings]
#             }
#         }
#     return predict_energy(payload)

# @app.route("/predict-fault", methods=["POST"])
# def route_fault():
#     payload = request.get_json()
#     if not payload:
#         readings = fetch_from_mongo(200)
#         payload = {
#             "electricalParameters": {
#                 "voltage": [r.get("voltage", 0) for r in readings],
#                 "current": [r.get("current", 0) for r in readings]
#             },
#             "environmentalData": {
#                 "temperature": [r.get("temperature", 0) for r in readings],
#             }
#         }
#     return predict_fault(payload)

# @app.route("/predict-recommendation", methods=["POST"])
# def route_recommend():
#     payload = request.get_json()
#     if not payload:
#         readings = fetch_from_mongo(200)
#         payload = {
#             "powerConsumption": [r.get("power", 0) for r in readings],
#             "electricalParameters": {
#                 "voltage": [r.get("voltage", 0) for r in readings],
#                 "current": [r.get("current", 0) for r in readings]
#             },
#             "environmentalData": {
#                 "temperature": [r.get("temperature", 0) for r in readings],
#                 "humidity": [r.get("humidity", 0) for r in readings]
#             }
#         }
#         for rec in recommendations:
#             send_alert_to_backend(
#                 device_id="AI_RECOMMENDER",
#                 message=rec,
#                 alert_type="recommendation",
#                 severity="low",
#                 metadata={"source": "AI Model", "type": "Energy Optimization", "userId": user_id}
#             )
#     return predict_recommendation(payload)

# @app.route("/", methods=["GET"])
# def index():
#     return jsonify({
#         "message": "✅ AI Flask Server Running",
#         "endpoints": ["/predict-energy", "/predict-fault", "/predict-recommendation"]
#     })

# # -----------------------------
# # MAIN
# # -----------------------------
# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5001, debug=True)

from flask import Flask, request, jsonify
from prophet import Prophet
from sklearn.ensemble import RandomForestRegressor
from pymongo import MongoClient
import math, numpy as np, pandas as pd, requests
from datetime import datetime, timedelta

app = Flask(__name__)

# -----------------------------
# CONFIGURATION
# -----------------------------
MONGO_URI = "mongodb+srv://ayshagupta8790_db_user:Energy1234@smartelectricity.srnuily.mongodb.net/smart_energy"
DB_NAME = "smart_energy"
COLLECTION = "energyreadings"

NODE_API_URL = "http://localhost:5000/api/alerts/create"
NODE_AUTH_TOKEN = "YOUR_BACKEND_JWT_TOKEN"

# -----------------------------
# HELPER FUNCTIONS
# -----------------------------
def fetch_from_mongo(limit=100):
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    readings = list(db[COLLECTION].find({}, {"_id": 0}).sort("timestamp", -1).limit(limit))
    client.close()
    return readings

def send_alert_to_backend(device_id, message, alert_type, severity="low", metadata=None):
    try:
        payload = {
            "deviceId": device_id,
            "message": message,
            "alertType": alert_type,
            "severity": severity,
            "metadata": metadata or {}
        }

        headers = {
            "Content-Type": "application/json",
            # "Authorization": f"Bearer {NODE_AUTH_TOKEN}"
        }

        r = requests.post(NODE_API_URL, json=payload, headers=headers, timeout=5)
        print(f"✅ Alert sent ({r.status_code}): {message}")
    except Exception as e:
        print("❌ Failed to send alert to backend:", str(e))

def safe_float(x, default=0.0):
    try:
        if isinstance(x, (list, np.ndarray)):
            x = float(np.mean(x))
        val = float(x)
        if math.isnan(val) or math.isinf(val):
            return default
        return val
    except Exception:
        return default

# -----------------------------
# AI FUNCTIONS
# -----------------------------
def predict_energy(payload):
    try:
        power = np.array(payload["powerConsumption"])
        voltage = np.array(payload["electricalParameters"]["voltage"])
        current = np.array(payload["electricalParameters"]["current"])
        temperature = np.array(payload["environmentalData"]["temperature"])

        now = datetime.now()
        timestamps = [now - timedelta(minutes=10 * i) for i in range(len(power))]
        df = pd.DataFrame({"ds": timestamps[::-1], "y": power})

        model = Prophet(daily_seasonality=True)
        model.fit(df)
        future = model.make_future_dataframe(periods=6, freq="10min")
        forecast = model.predict(future)
        pred_power = forecast["yhat"].iloc[-1]

        return jsonify({
            "success": True,
            "message": "Energy forecast generated successfully",
            "predictedPower": safe_float(pred_power),
            "predictedCurrent": safe_float(np.mean(current)),
            "predictedVoltage": safe_float(np.mean(voltage)),
            "predictedTemperature": safe_float(np.mean(temperature)),
            "confidence": 0.9,
            "modelVersion": "v1.0"
        })

    except Exception as e:
        print("❌ Error in predict_energy:", str(e))
        return jsonify({"success": False, "message": f"Energy prediction failed: {str(e)}"}), 500


def predict_fault(payload):
    try:
        voltage = payload["electricalParameters"]["voltage"]
        current = payload["electricalParameters"]["current"]
        temperature = payload["environmentalData"]["temperature"]

        avg_voltage = sum(voltage) / len(voltage)
        avg_current = sum(current) / len(current)
        avg_temp = sum(temperature) / len(temperature)

        power = avg_voltage * avg_current
        overload = power > 2000
        temp_risk = avg_temp > 50

        fault_probability = round(min(1.0, (power / 5000) + (avg_temp / 100)), 2)
        fault_type = "Overload or Thermal Fault" if (overload or temp_risk) else "Normal Operation"

        # Send alert if fault detected
        if overload or temp_risk:
            send_alert_to_backend(
                device_id="FAULT_MONITOR",
                message=f"⚠️ {fault_type} detected! Probability: {fault_probability}",
                alert_type="fault",
                severity="high" if fault_probability > 0.7 else "medium",
                metadata={"avgVoltage": avg_voltage, "avgTemp": avg_temp}
            )

        return jsonify({
            "success": True,
            "message": "Fault prediction generated successfully",
            "predictedFaultType": fault_type,
            "faultProbability": fault_probability,
            "averagePower": round(power, 2),
            "temperature": round(avg_temp, 2),
            "modelVersion": "v1.0"
        }), 200

    except Exception as e:
        print(f"❌ Error in predict_fault: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500


def predict_recommendation(payload):
    try:
        power_data = payload["powerConsumption"]
        avg_power = sum(power_data) / len(power_data)
        peak_load = max(power_data)

        env_data = payload.get("environmentalData", {})
        temp = env_data.get("temperature", [25])
        humidity = env_data.get("humidity", [45])

        avg_temp = sum(temp) / len(temp)
        avg_humidity = sum(humidity) / len(humidity)

        recommendations = []

        if avg_power > 200:
            recommendations.append("Optimize device usage for better efficiency")
        if peak_load - avg_power > 10:
            recommendations.append("Reduce peak load between 6 PM - 9 PM")
        if avg_temp > 35:
            recommendations.append("Improve cooling to reduce energy waste")
        recommendations.append("Perform maintenance check monthly")

        # 🔥 Send each recommendation as an alert
        for rec in recommendations:
            send_alert_to_backend(
                device_id="AI_RECOMMENDER",
                message=rec,
                alert_type="recommendation",
                severity="low",
                metadata={
                    "source": "AI Model",
                    "type": "Energy Optimization",
                    "averagePower": avg_power,
                    "temperature": avg_temp
                }
            )


        return jsonify({
            "success": True,
            "message": "Energy recommendations generated successfully",
            "recommendations": recommendations,
            "averagePower": round(avg_power, 2),
            "peakLoad": round(peak_load, 2),
            "temperature": round(avg_temp, 2),
            "humidity": round(avg_humidity, 2),
            "modelVersion": "v1.0"
        }), 200
        # Send each recommendation as a separate alert to Node backend


    except Exception as e:
        print(f"❌ Error in predict_recommendation: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500


# -----------------------------
# ROUTES
# -----------------------------
@app.route("/predict-energy", methods=["POST"])
def route_energy():
    payload = request.get_json() or {}
    if not payload:
        readings = fetch_from_mongo(200)
        payload = {
            "powerConsumption": [r.get("power", 0) for r in readings],
            "electricalParameters": {"voltage": [r.get("voltage", 0) for r in readings], "current": [r.get("current", 0) for r in readings]},
            "environmentalData": {"temperature": [r.get("temperature", 0) for r in readings], "humidity": [r.get("humidity", 0) for r in readings]},
        }
    return predict_energy(payload)


@app.route("/predict-fault", methods=["POST"])
def route_fault():
    payload = request.get_json() or {}
    if not payload:
        readings = fetch_from_mongo(200)
        payload = {
            "electricalParameters": {"voltage": [r.get("voltage", 0) for r in readings], "current": [r.get("current", 0) for r in readings]},
            "environmentalData": {"temperature": [r.get("temperature", 0) for r in readings]},
        }
    return predict_fault(payload)


@app.route("/predict-recommendation", methods=["POST"])
def route_recommend():
    payload = request.get_json() or {}
    if not payload:
        readings = fetch_from_mongo(200)
        payload = {
            "powerConsumption": [r.get("power", 0) for r in readings],
            "electricalParameters": {"voltage": [r.get("voltage", 0) for r in readings], "current": [r.get("current", 0) for r in readings]},
            "environmentalData": {"temperature": [r.get("temperature", 0) for r in readings], "humidity": [r.get("humidity", 0) for r in readings]},
        }
    return predict_recommendation(payload)


@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "message": "✅ AI Flask Server Running",
        "endpoints": ["/predict-energy", "/predict-fault", "/predict-recommendation"]
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
