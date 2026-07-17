"""
routes/risk_routes.py

POST /predict/risk
Logistic Regression – predicts emergency risk level (High / Low).
"""

from flask import Blueprint, request
from utils.helpers import parse_input, success_response, error_response
from utils.model_loader import logistic_regression_model

risk_bp = Blueprint("risk", __name__)


@risk_bp.route("/predict/risk", methods=["POST"])
def predict_risk():
    """
    Predict emergency risk using the trained Logistic Regression model.

    Expected JSON body – same 16 feature fields as /predict/patient.

    Returns:
    {
        "success"     : true,
        "risk_level"  : "High Risk" | "Low Risk",
        "probability" : <float 0-1>,
        "model"       : "Logistic Regression"
    }
    """
    data = request.get_json(silent=True) or {}
    try:
        df = parse_input(data)
    except ValueError as exc:
        return error_response(str(exc))

    prediction   = logistic_regression_model.predict(df)
    probability  = logistic_regression_model.predict_proba(df)

    risk_label  = "High Risk" if int(prediction[0]) == 1 else "Low Risk"
    # probability[:,1] is the probability of the "High Risk" (class 1) outcome
    risk_prob   = round(float(probability[0][1]), 4)

    return success_response({
        "risk_level" : risk_label,
        "probability": risk_prob,
        "model"      : "Logistic Regression",
    })
