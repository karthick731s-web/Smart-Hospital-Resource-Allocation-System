"""
config.py – Centralised configuration for the Smart Hospital Resource Allocation backend.

All path and app-level settings are defined here so every other module imports
from a single place, making it easy to swap values for different environments
(local vs. Render).
"""

import os

# ─────────────────────────────────────────────
# Base directory (the backend/ folder itself)
# ─────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ─────────────────────────────────────────────
# Model & Dataset paths
# ─────────────────────────────────────────────
MODELS_DIR  = os.path.join(BASE_DIR, "models")
DATASET_DIR = os.path.join(BASE_DIR, "dataset")

MODEL_PATHS = {
    "linear_regression"  : os.path.join(MODELS_DIR, "linear_regression.pkl"),
    "logistic_regression": os.path.join(MODELS_DIR, "logistic_regression.pkl"),
    "decision_tree"      : os.path.join(MODELS_DIR, "decision_tree.pkl"),
    "random_forest"      : os.path.join(MODELS_DIR, "random_forest.pkl"),
    "knn_model"          : os.path.join(MODELS_DIR, "knn_model.pkl"),
    "knn_scaler"         : os.path.join(MODELS_DIR, "knn_scaler.pkl"),
    "kmeans"             : os.path.join(MODELS_DIR, "kmeans.pkl"),
    "kmeans_scaler"      : os.path.join(MODELS_DIR, "kmeans_scaler.pkl"),
    "pca_model"          : os.path.join(MODELS_DIR, "pca_model.pkl"),
    "pca_scaler"         : os.path.join(MODELS_DIR, "pca_scaler.pkl"),
}

DATASET_PATH = os.path.join(DATASET_DIR, "DATASSS.csv")

# ─────────────────────────────────────────────
# Flask / CORS
# ─────────────────────────────────────────────
# Allow all origins in development; tighten this to your Vercel URL in prod.
CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*")

# Gunicorn / Render will set PORT; default to 5000 for local dev.
PORT = int(os.environ.get("PORT", 5000))

# ─────────────────────────────────────────────
# Shared feature column order
# (must match the order used during training)
# ─────────────────────────────────────────────
FEATURE_COLUMNS = [
    "arrival_hour",
    "day_type",
    "season",
    "weather",
    "previous_patient_count",
    "average_wait_time",
    "available_beds",
    "available_icu",
    "available_doctors",
    "emergency_cases",
    "flu_cases",
    "accident_cases",
    "chronic_cases",
    "average_age",
    "average_heart_rate",
    "average_oxygen_level",
]

# ─────────────────────────────────────────────
# Label-encoder mappings
# These encode categorical inputs the same way LabelEncoder did during training.
# (Weekday < Weekend  →  0, 1)
# (Spring < Summer < Winter  →  0, 1, 2)    [alphabetical]
# (Clear < Cloudy < Rainy < Sunny  →  0, 1, 2, 3)
# ─────────────────────────────────────────────
DAY_TYPE_MAP = {"Weekday": 0, "Weekend": 1}
SEASON_MAP   = {"Spring": 0, "Summer": 1, "Winter": 2}
WEATHER_MAP  = {"Clear": 0, "Cloudy": 1, "Rainy": 2, "Sunny": 3}
