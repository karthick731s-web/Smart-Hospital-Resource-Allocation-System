"""
utils/helpers.py

Shared helper functions used across multiple route handlers:
  - Input parsing / validation
  - Categorical encoding (mirrors the LabelEncoder logic from training)
  - JSON response builder
"""

import pandas as pd
from flask import jsonify
from config import FEATURE_COLUMNS, DAY_TYPE_MAP, SEASON_MAP, WEATHER_MAP


# ─────────────────────────────────────────────
# Encoding helpers
# ─────────────────────────────────────────────

def encode_day_type(value: str) -> int:
    """Convert 'Weekday' / 'Weekend' to the integer used during training."""
    val = str(value).strip()
    if val in DAY_TYPE_MAP:
        return DAY_TYPE_MAP[val]
    # Graceful fallback: try int
    try:
        return int(val)
    except (ValueError, TypeError):
        raise ValueError(
            f"Unknown day_type '{val}'. Expected one of {list(DAY_TYPE_MAP.keys())}."
        )


def encode_season(value: str) -> int:
    """Convert season string to integer."""
    val = str(value).strip()
    if val in SEASON_MAP:
        return SEASON_MAP[val]
    try:
        return int(val)
    except (ValueError, TypeError):
        raise ValueError(
            f"Unknown season '{val}'. Expected one of {list(SEASON_MAP.keys())}."
        )


def encode_weather(value: str) -> int:
    """Convert weather string to integer."""
    val = str(value).strip()
    if val in WEATHER_MAP:
        return WEATHER_MAP[val]
    try:
        return int(val)
    except (ValueError, TypeError):
        raise ValueError(
            f"Unknown weather '{val}'. Expected one of {list(WEATHER_MAP.keys())}."
        )


# ─────────────────────────────────────────────
# Input parsing
# ─────────────────────────────────────────────

def parse_input(data: dict) -> pd.DataFrame:
    """
    Parse raw JSON body into a single-row DataFrame with the exact column order
    expected by every model.

    Categorical columns are encoded here so the caller doesn't have to.
    Numeric fields are cast to float.
    """
    try:
        row = {
            "arrival_hour"           : float(data.get("arrival_hour", 0)),
            "day_type"               : encode_day_type(data.get("day_type", "Weekday")),
            "season"                 : encode_season(data.get("season", "Summer")),
            "weather"                : encode_weather(data.get("weather", "Clear")),
            "previous_patient_count" : float(data.get("previous_patient_count", 0)),
            "average_wait_time"      : float(data.get("average_wait_time", 0)),
            "available_beds"         : float(data.get("available_beds", 0)),
            "available_icu"          : float(data.get("available_icu", 0)),
            "available_doctors"      : float(data.get("available_doctors", 0)),
            "emergency_cases"        : float(data.get("emergency_cases", 0)),
            "flu_cases"              : float(data.get("flu_cases", 0)),
            "accident_cases"         : float(data.get("accident_cases", 0)),
            "chronic_cases"          : float(data.get("chronic_cases", 0)),
            "average_age"            : float(data.get("average_age", 0)),
            "average_heart_rate"     : float(data.get("average_heart_rate", 0)),
            "average_oxygen_level"   : float(data.get("average_oxygen_level", 0)),
        }
    except (ValueError, TypeError) as exc:
        raise ValueError(f"Input parsing error: {exc}")

    return pd.DataFrame([row], columns=FEATURE_COLUMNS)


# ─────────────────────────────────────────────
# Response builders
# ─────────────────────────────────────────────

def success_response(payload: dict, status: int = 200):
    """Return a standardised success JSON response."""
    return jsonify({"success": True, **payload}), status


def error_response(message: str, status: int = 400):
    """Return a standardised error JSON response."""
    return jsonify({"success": False, "error": message}), status
