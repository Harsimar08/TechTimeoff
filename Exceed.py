from flask import Flask, jsonify

app = Flask(__name__)

# --- Mock employee data ---
employees = [
    {
        "id": 1,
        "name": "Aman",
        "allowed_leaves": 20,
        "leaves_taken": 17,
        "pending_leaves": 3,
        "leave_history": [2, 3, 2, 5, 5],
        "recent_reason": "medical emergency"
    },
    {
        "id": 2,
        "name": "Riya",
        "allowed_leaves": 25,
        "leaves_taken": 15,
        "pending_leaves": 2,
        "leave_history": [1, 2, 1, 3],
        "recent_reason": "vacation"
    },
    {
        "id": 3,
        "name": "Karan",
        "allowed_leaves": 18,
        "leaves_taken": 10,
        "pending_leaves": 0,
        "leave_history": [1, 1],
        "recent_reason": "personal work"
    },
    {
        "id": 4,
        "name": "Simran",
        "allowed_leaves": 15,
        "leaves_taken": 13,
        "pending_leaves": 2,
        "leave_history": [3, 3, 4, 5],
        "recent_reason": "family function"
    }
]

# --- AI-style risk prediction function ---
def ai_leave_risk(emp):
    usage_ratio = (emp["leaves_taken"] + emp["pending_leaves"]) / emp["allowed_leaves"]

    # Trend factor: if most leaves already used (>70%), increase sensitivity
    trend_factor = 1.3 if emp["leaves_taken"] > 0.7 * emp["allowed_leaves"] else 1.0

    # Frequency factor: frequent small leaves (avg < 3 days) → more likely to exceed
    avg_leave_length = sum(emp["leave_history"]) / len(emp["leave_history"])
    frequency_factor = 1.2 if avg_leave_length < 3 else 1.0

    # Reason factor: certain reasons weighted more
    reason = emp["recent_reason"].lower()
    if "medical" in reason or "emergency" in reason:
        reason_factor = 1.3
    elif "family" in reason:
        reason_factor = 1.1
    else:
        reason_factor = 1.0

    risk_score = usage_ratio * trend_factor * frequency_factor * reason_factor
    return round(risk_score, 2)


# --- Homepage route ---
@app.route('/')
def home():
    return "✅ Flask AI Leave Alert System is running! Go to /alert_managers"


# --- Alert route ---
@app.route('/alert_managers', methods=['GET'])
def alert_managers():
    alerts = []

    for emp in employees:
        risk = ai_leave_risk(emp)

        # Only alert if predicted risk >= 1
        if risk >= 1.0:
            status = "EXCEEDED" if risk > 1.0 else "LIKELY_TO_EXCEED"
            alerts.append({
                "employee_id": emp["id"],
                "name": emp["name"],
                "risk_score": risk,
                "status": status,
                "message": f"⚠️ {emp['name']} is likely to exceed the leave quota soon. (Predicted risk: {risk})"
            })

    return jsonify({"alerts": alerts})


# --- Run Flask app ---
if __name__ == '__main__':
    app.run(debug=True)
