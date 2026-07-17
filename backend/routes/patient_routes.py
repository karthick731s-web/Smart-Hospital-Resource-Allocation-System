"""
routes/patient_routes.py

POST /predict/patient
Linear Regression – predicts the expected patient count for a given shift.
"""

from flask import Blueprint, request
from utils.helpers import parse_input, success_response, error_response
from utils.model_loader import linear_regression_model

patient_bp = Blueprint("patient", __name__)


@patient_bp.route("/predict/patient", methods=["POST"])
def predict_patient():
    """
    Predict patient count using the trained Linear Regression model.

    Expected JSON body (all fields optional – sensible defaults applied):
    {
        "arrival_hour"           : 10,
        "day_type"               : "Weekday",
        "season"                 : "Winter",
        "weather"                : "Clear",
        "previous_patient_count" : 80,
        "average_wait_time"      : 25,
        "available_beds"         : 30,
        "available_icu"          : 8,
        "available_doctors"      : 12,
        "emergency_cases"        : 5,
        "flu_cases"              : 10,
        "accident_cases"         : 3,
        "chronic_cases"          : 8,
        "average_age"            : 45,
        "average_heart_rate"     : 78,
        "average_oxygen_level"   : 97.0
    }

    Returns:
    {
        "success"                : true,
        "predicted_patient_count": <int>,
        "model"                  : "Linear Regression"
    }
    """
    data = request.get_json(silent=True) or {}
    try:
        df = parse_input(data)
    except ValueError as exc:
        return error_response(str(exc))

    prediction = linear_regression_model.predict(df)
    predicted_count = round(float(prediction[0]))

    return success_response({
        "predicted_patient_count": predicted_count,
        "model": "Linear Regression",
    })
