"""
routes/similar_routes.py

POST /predict/similar
KNN – finds similar patients and returns their risk group.
"""

import numpy as np
from flask import Blueprint, request
from utils.helpers import parse_input, success_response, error_response
from utils.model_loader import knn_model, knn_scaler

similar_bp = Blueprint("similar", __name__)


@similar_bp.route("/predict/similar", methods=["POST"])
def predict_similar():
    """
    Find the K nearest neighbours for a given patient record using KNN.

    Expected JSON body – same 16 feature fields as /predict/patient.

    Returns:
    {
        "success"             : true,
        "patient_group"       : "High Risk" | "Low Risk",
        "neighbor_indices"    : [<int>, ...],
        "neighbor_distances"  : [<float>, ...],
        "model"               : "KNN"
    }
    """
    data = request.get_json(silent=True) or {}
    try:
        df = parse_input(data)
    except ValueError as exc:
        return error_response(str(exc))

    # Scale the input the same way the training data was scaled
    scaled = knn_scaler.transform(df)

    prediction           = knn_model.predict(scaled)
    distances, indices   = knn_model.kneighbors(scaled)

    group = "High Risk" if int(prediction[0]) == 1 else "Low Risk"

    return success_response({
        "patient_group"     : group,
        "neighbor_indices"  : indices[0].tolist(),
        "neighbor_distances": [round(d, 4) for d in distances[0].tolist()],
        "model"             : "KNN",
    })
