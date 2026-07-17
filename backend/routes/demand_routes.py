"""
routes/demand_routes.py

POST /predict/demand
Random Forest – forecasts future patient demand.
"""

from flask import Blueprint, request
from utils.helpers import parse_input, success_response, error_response
from utils.model_loader import random_forest_model

demand_bp = Blueprint("demand", __name__)


@demand_bp.route("/predict/demand", methods=["POST"])
def predict_demand():
    """
    Forecast future patient demand using the trained Random Forest Regressor.

    Expected JSON body – same 16 feature fields as /predict/patient.

    Returns:
    {
        "success"                 : true,
        "forecasted_patient_count": <int>,
        "model"                   : "Random Forest"
    }
    """
    data = request.get_json(silent=True) or {}
    try:
        df = parse_input(data)
    except ValueError as exc:
        return error_response(str(exc))

    prediction = random_forest_model.predict(df)
    forecasted  = round(float(prediction[0]))

    return success_response({
        "forecasted_patient_count": forecasted,
        "model"                   : "Random Forest",
    })
