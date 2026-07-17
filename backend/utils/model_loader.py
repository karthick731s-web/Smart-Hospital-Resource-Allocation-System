"""
utils/model_loader.py

Loads every pickled ML model exactly once at application startup.
All route handlers import from this module instead of calling pickle.load
themselves, keeping the hot path fast and memory-efficient.
"""

import pickle
import os
from config import MODEL_PATHS


def _load(key: str):
    """Load a single model from disk; raise a clear error if missing."""
    path = MODEL_PATHS[key]
    if not os.path.exists(path):
        raise FileNotFoundError(
            f"[model_loader] Model file not found: {path}\n"
            "Make sure all .pkl files are present in backend/models/."
        )
    with open(path, "rb") as f:
        return pickle.load(f)


# ─────────────────────────────────────────────
# Loaded models (module-level singletons)
# ─────────────────────────────────────────────
linear_regression_model   = _load("linear_regression")
logistic_regression_model = _load("logistic_regression")
decision_tree_model       = _load("decision_tree")
random_forest_model       = _load("random_forest")
knn_model                 = _load("knn_model")
knn_scaler                = _load("knn_scaler")
kmeans_model              = _load("kmeans")
kmeans_scaler             = _load("kmeans_scaler")
pca_model                 = _load("pca_model")
pca_scaler                = _load("pca_scaler")

print("[model_loader] ✅  All models loaded successfully.")
