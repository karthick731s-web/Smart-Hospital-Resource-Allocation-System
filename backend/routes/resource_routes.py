"""
routes/resource_routes.py

POST /predict/resources
Decision Tree – predicts required beds, ICU units, and doctors.
"""

from flask import Blueprint, request
from utils.helpers import parse_input, success_response, error_response
from utils.model_loader import decision_tree_model

resource_bp = Blueprint("resource", __name__)


@resource_bp.route("/predict/resources", methods=["POST"])
def predict_resources():
    """
    Predict hospital resource requirements (multi-output) using the
    trained Decision Tree Regressor model.

    Expected JSON body – same 16 feature fields as /predict/patient.

    Returns:
    {
        "success"         : true,
        "beds_required"   : <int>,
        "icu_required"    : <int>,
        "doctors_required": <int>,
        "model"           : "Decision Tree"
    }
    """
    data = request.get_json(silent=True) or {}
    try:
        df = parse_input(data)
    except ValueError as exc:
        return error_response(str(exc))

    # decision_tree outputs shape (1, 3): [beds, icu, doctors]
    prediction = decision_tree_model.predict(df)

    return success_response({
        "beds_required"   : round(float(prediction[0][0])),
        "icu_required"    : round(float(prediction[0][1])),
        "doctors_required": round(float(prediction[0][2])),
        "model"           : "Decision Tree",
    })
