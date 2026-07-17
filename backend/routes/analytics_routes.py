"""
routes/analytics_routes.py

GET /analytics
Returns dashboard summary statistics computed from DATASSS.csv.
"""

import pandas as pd
from flask import Blueprint
from config import DATASET_PATH
from utils.helpers import success_response, error_response

analytics_bp = Blueprint("analytics", __name__)


def _load_dataset() -> pd.DataFrame:
    """Load the CSV once per request (small file – no caching needed)."""
    return pd.read_csv(DATASET_PATH)


@analytics_bp.route("/analytics", methods=["GET"])
def get_analytics():
    """
    Return a comprehensive summary of the hospital dataset for the dashboard.

    Returns:
    {
        "success"       : true,
        "total_records" : <int>,
        "summary"       : { ... },
        "day_type_counts": { ... },
        "season_counts"  : { ... },
        "weather_counts" : { ... }
    }
    """
    try:
        df = _load_dataset()
    except FileNotFoundError:
        return error_response(
            "Dataset file not found. Ensure DATASSS.csv is in backend/dataset/.", 500
        )

    # ── Numeric summary ────────────────────────────────────────────────
    numeric_cols = [
        "patient_count", "available_beds", "available_icu",
        "available_doctors", "emergency_cases", "flu_cases",
        "accident_cases", "chronic_cases", "average_wait_time",
        "average_heart_rate", "average_oxygen_level", "average_age",
        "beds_required", "icu_required", "doctors_required",
    ]

    summary = {}
    for col in numeric_cols:
        if col in df.columns:
            summary[col] = {
                "mean"  : round(float(df[col].mean()), 2),
                "min"   : round(float(df[col].min()), 2),
                "max"   : round(float(df[col].max()), 2),
                "median": round(float(df[col].median()), 2),
                "std"   : round(float(df[col].std()), 2),
            }

    # ── Categorical distributions ──────────────────────────────────────
    day_type_counts = (
        df["day_type"].value_counts().to_dict() if "day_type" in df.columns else {}
    )
    season_counts = (
        df["season"].value_counts().to_dict() if "season" in df.columns else {}
    )
    weather_counts = (
        df["weather"].value_counts().to_dict() if "weather" in df.columns else {}
    )

    # ── Emergency risk distribution ────────────────────────────────────
    emergency_risk_stats = {}
    if "emergency_risk" in df.columns:
        threshold = df["emergency_risk"].median()
        high_risk_count = int((df["emergency_risk"] >= threshold).sum())
        low_risk_count  = int((df["emergency_risk"] <  threshold).sum())
        emergency_risk_stats = {
            "threshold"      : round(float(threshold), 4),
            "high_risk_count": high_risk_count,
            "low_risk_count" : low_risk_count,
        }

    return success_response({
        "total_records"      : len(df),
        "total_features"     : df.shape[1],
        "summary"            : summary,
        "day_type_counts"    : day_type_counts,
        "season_counts"      : season_counts,
        "weather_counts"     : weather_counts,
        "emergency_risk_stats": emergency_risk_stats,
    })
