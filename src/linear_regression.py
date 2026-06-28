import pandas as pd
import pickle
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# =====================================
# Load Dataset
# =====================================

df = pd.read_csv("../dataset/DATASSS.csv")

# =====================================
# Encode Categorical Columns
# =====================================

day_encoder = LabelEncoder()
season_encoder = LabelEncoder()
weather_encoder = LabelEncoder()

df["day_type"] = day_encoder.fit_transform(df["day_type"])
df["season"] = season_encoder.fit_transform(df["season"])
df["weather"] = weather_encoder.fit_transform(df["weather"])

print("Day Types :", day_encoder.classes_)
print("Seasons   :", season_encoder.classes_)
print("Weather   :", weather_encoder.classes_)

# =====================================
# Features
# =====================================

feature_columns = [
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
    "average_oxygen_level"
]

X = df[feature_columns]

# =====================================
# Target
# =====================================

y = df["patient_count"]

# =====================================
# Train-Test Split
# =====================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42
)

# =====================================
# Train Model
# =====================================

model = LinearRegression()
model.fit(X_train, y_train)

print("\nModel Trained Successfully")

# =====================================
# Prediction
# =====================================

y_pred = model.predict(X_test)

# =====================================
# Evaluation
# =====================================

mse = mean_squared_error(y_test, y_pred)
rmse = mse ** 0.5
r2 = r2_score(y_test, y_pred)

print("\nModel Performance")
print("---------------------")
print("MSE :", round(mse, 4))
print("RMSE :", round(rmse, 4))
print("R2 Score :", round(r2, 4))

# =====================================
# Actual vs Predicted
# =====================================

result = pd.DataFrame({
    "Actual": y_test.values,
    "Predicted": y_pred.round(2)
})

print("\nFirst 10 Predictions")
print(result.head(10))

# =====================================
# Predict New Hospital Load
# =====================================

new_data = pd.DataFrame([{
    "arrival_hour": 10,
    "day_type": day_encoder.transform(["Weekday"])[0],
    "season": season_encoder.transform(["Winter"])[0],
    "weather": weather_encoder.transform(["Clear"])[0],   # Changed from Sunny
    "previous_patient_count": 80,
    "average_wait_time": 25,
    "available_beds": 30,
    "available_icu": 8,
    "available_doctors": 12,
    "emergency_cases": 5,
    "flu_cases": 10,
    "accident_cases": 3,
    "chronic_cases": 8,
    "average_age": 45,
    "average_heart_rate": 78,
    "average_oxygen_level": 97.0
}])

prediction = model.predict(new_data)

print("\nPredicted Patient Count :", round(prediction[0], 2))

# =====================================
# Save Model
# =====================================

pickle.dump(model, open("../models/linear_regression.pkl", "wb"))

print("\nModel Saved Successfully")

# =====================================
# Plot Actual vs Predicted
# =====================================

plt.figure(figsize=(8,6))
plt.scatter(y_test, y_pred)
plt.plot(
    [y_test.min(), y_test.max()],
    [y_test.min(), y_test.max()],
    'r--'
)
plt.xlabel("Actual Patient Count")
plt.ylabel("Predicted Patient Count")
plt.title("Actual vs Predicted Patient Count")
plt.show()