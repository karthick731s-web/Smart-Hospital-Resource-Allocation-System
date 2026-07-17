"""
routes/cluster_routes.py

POST /predict/cluster
KMeans – assigns a patient record to a cluster (0, 1, or 2).
"""

from flask import Blueprint, request
from utils.helpers import parse_input, success_response, error_response
from utils.model_loader import kmeans_model, kmeans_scaler

cluster_bp = Blueprint("cluster", __name__)

# Human-readable cluster labels derived from exploratory analysis
CLUSTER_LABELS = {
    0: "Low Acuity",
    1: "Moderate Acuity",
    2: "High Acuity",
}


@cluster_bp.route("/predict/cluster", methods=["POST"])
def predict_cluster():
    """
    Assign a patient record to a K-Means cluster segment.

    Expected JSON body – same 16 feature fields as /predict/patient.

    Returns:
    {
        "success"      : true,
        "cluster_id"   : <int 0|1|2>,
        "cluster_label": "Low Acuity" | "Moderate Acuity" | "High Acuity",
        "model"        : "KMeans"
    }
    """
    data = request.get_json(silent=True) or {}
    try:
        df = parse_input(data)
    except ValueError as exc:
        return error_response(str(exc))

    # Scale then predict cluster
    scaled      = kmeans_scaler.transform(df)
    cluster_id  = int(kmeans_model.predict(scaled)[0])
    label       = CLUSTER_LABELS.get(cluster_id, f"Cluster {cluster_id}")

    return success_response({
        "cluster_id"   : cluster_id,
        "cluster_label": label,
        "model"        : "KMeans",
    })
