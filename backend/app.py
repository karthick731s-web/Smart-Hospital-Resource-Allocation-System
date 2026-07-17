"""
app.py – Smart Hospital Resource Allocation System  |  Flask Backend

Startup sequence
----------------
1. Flask app is created.
2. Flask-CORS is enabled for all origins (configurable via CORS_ORIGINS env var).
3. All ML models are loaded once via utils/model_loader.py.
4. Each route Blueprint is registered.
5. The app is served by Gunicorn on Render (or by Flask's dev server locally).

Local development
-----------------
    cd backend
    pip install -r requirements.txt
    python app.py

Production (Render)
-------------------
Start command:  gunicorn app:app
"""

from flask import Flask, jsonify
from flask_cors import CORS

from config import CORS_ORIGINS, PORT

# ── Import Blueprints ──────────────────────────────────────────────────────────
from routes.patient_routes   import patient_bp
from routes.risk_routes      import risk_bp
from routes.resource_routes  import resource_bp
from routes.demand_routes    import demand_bp
from routes.similar_routes   import similar_bp
from routes.cluster_routes   import cluster_bp
from routes.analytics_routes import analytics_bp

# ── Create Flask app ───────────────────────────────────────────────────────────
app = Flask(__name__)

# ── Enable CORS ────────────────────────────────────────────────────────────────
CORS(app, resources={r"/*": {"origins": CORS_ORIGINS}})

# ── Register Blueprints ────────────────────────────────────────────────────────
app.register_blueprint(patient_bp)
app.register_blueprint(risk_bp)
app.register_blueprint(resource_bp)
app.register_blueprint(demand_bp)
app.register_blueprint(similar_bp)
app.register_blueprint(cluster_bp)
app.register_blueprint(analytics_bp)


# ── Health-check endpoint ──────────────────────────────────────────────────────
@app.route("/", methods=["GET"])
def health_check():
    """
    GET /
    Returns a simple status payload so Render can confirm the service is live.
    """
    return jsonify({"status": "Backend Running"}), 200


# ── 404 handler ────────────────────────────────────────────────────────────────
@app.errorhandler(404)
def not_found(e):
    return jsonify({"success": False, "error": "Endpoint not found"}), 404


# ── 405 handler ────────────────────────────────────────────────────────────────
@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify({"success": False, "error": "Method not allowed"}), 405


# ── Entry point (local dev only – Gunicorn ignores this block) ─────────────────
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=False)
