import pandas as pd
import pickle
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import DecisionTreeRegressor, plot_tree
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

# =====================================
# Features
# =====================================

X = df[[
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
]]

# =====================================
# Targets
# =====================================

y = df[[
    "beds_required",
    "icu_required",
    "doctors_required"
]]

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

model = DecisionTreeRegressor(
    max_depth=5,
    random_state=42
)

model.fit(X_train, y_train)

print("Model Trained Successfully")

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
print("------------------------")
print("MSE :", round(mse, 3))
print("RMSE :", round(rmse, 3))
print("R2 Score :", round(r2, 3))

# =====================================
# First 10 Predictions
# =====================================

result = pd.DataFrame({
    "Actual Beds": y_test["beds_required"].values,
    "Pred Beds": y_pred[:,0].round(),

    "Actual ICU": y_test["icu_required"].values,
    "Pred ICU": y_pred[:,1].round(),

    "Actual Doctors": y_test["doctors_required"].values,
    "Pred Doctors": y_pred[:,2].round()
})

print("\nFirst 10 Predictions")
print(result.head(10))

# =====================================
# Predict New Hospital Resources
# =====================================

new_data = pd.DataFrame([{

    "arrival_hour":10,

    "day_type":day_encoder.transform(["Weekday"])[0],

    "season":season_encoder.transform(["Winter"])[0],

    "weather":weather_encoder.transform(["Clear"])[0],

    "previous_patient_count":80,

    "average_wait_time":25,

    "available_beds":30,

    "available_icu":8,

    "available_doctors":12,

    "emergency_cases":5,

    "flu_cases":10,

    "accident_cases":3,

    "chronic_cases":8,

    "average_age":45,

    "average_heart_rate":78,

    "average_oxygen_level":97
}])

prediction = model.predict(new_data)

print("\nPredicted Hospital Resources")
print("--------------------------------")

print("Beds Required     :", round(prediction[0][0]))
print("ICU Required      :", round(prediction[0][1]))
print("Doctors Required  :", round(prediction[0][2]))

# =====================================
# Save Model
# =====================================

pickle.dump(model, open("../models/decision_tree.pkl","wb"))

print("\nModel Saved Successfully")

# =====================================
# Feature Importance
# =====================================

importance = pd.DataFrame({
    "Feature":X.columns,
    "Importance":model.feature_importances_
})

importance = importance.sort_values(
    by="Importance",
    ascending=False
)

print("\nFeature Importance")
print(importance)

# =====================================
# Visualization 1
# Feature Importance
# =====================================

plt.figure(figsize=(10,6))

plt.bar(
    importance["Feature"],
    importance["Importance"]
)

plt.xticks(rotation=90)

plt.title("Decision Tree Feature Importance")

plt.tight_layout()

plt.show()

# =====================================
# Visualization 2
# Decision Tree
# =====================================

plt.figure(figsize=(20,10))

plot_tree(
    model,
    feature_names=X.columns,
    filled=True,
    fontsize=8
)

plt.title("Decision Tree")

plt.show()