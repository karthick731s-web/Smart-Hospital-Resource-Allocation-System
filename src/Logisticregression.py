import pandas as pd
import pickle
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    classification_report,
    ConfusionMatrixDisplay
)

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
# Convert Emergency Risk into Classes
# =====================================

threshold = df["emergency_risk"].median()

print("Threshold Used :", threshold)

df["risk_class"] = (df["emergency_risk"] >= threshold).astype(int)

print("\nClass Distribution")
print(df["risk_class"].value_counts())

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
# Target
# =====================================

y = df["risk_class"]

# =====================================
# Train Test Split
# =====================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

# =====================================
# Train Model
# =====================================

model = LogisticRegression(max_iter=1000)

model.fit(X_train, y_train)

print("\nModel Trained Successfully")

# =====================================
# Prediction
# =====================================

y_pred = model.predict(X_test)

# =====================================
# Accuracy
# =====================================

accuracy = accuracy_score(y_test, y_pred)

print("\nAccuracy :", round(accuracy * 100, 2), "%")

print("\nConfusion Matrix")
cm = confusion_matrix(y_test, y_pred)
print(cm)

print("\nClassification Report")
print(classification_report(y_test, y_pred))

# =====================================
# Predict New Data
# =====================================

new_data = pd.DataFrame([{
    "arrival_hour": 10,
    "day_type": day_encoder.transform(["Weekday"])[0],
    "season": season_encoder.transform(["Winter"])[0],
    "weather": weather_encoder.transform(["Clear"])[0],
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
    "average_oxygen_level": 97
}])

prediction = model.predict(new_data)
probability = model.predict_proba(new_data)

print("\nPrediction")

if prediction[0] == 1:
    print("Emergency Risk : HIGH")
else:
    print("Emergency Risk : LOW")

print("Probability :", probability)

# =====================================
# Save Model
# =====================================

pickle.dump(model, open("../models/logistic_regression.pkl", "wb"))

print("\nModel Saved Successfully")

# =====================================
# Visualization 1 : Class Distribution
# =====================================

plt.figure(figsize=(6,5))

df["risk_class"].value_counts().plot(
    kind="bar",
    color=["green","red"]
)

plt.title("Emergency Risk Distribution")
plt.xlabel("Risk Class")
plt.ylabel("Number of Patients")
plt.xticks([0,1],["Low","High"])

plt.show()

# =====================================
# Visualization 2 : Confusion Matrix
# =====================================

disp = ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=["Low","High"]
)

disp.plot(cmap="Blues")

plt.title("Confusion Matrix")

plt.show()

# =====================================
# Visualization 3 : Prediction Probability
# =====================================

prob = probability[0]

plt.figure(figsize=(5,5))

plt.bar(
    ["Low Risk","High Risk"],
    prob,
    color=["green","red"]
)

plt.title("Prediction Probability")
plt.ylabel("Probability")

plt.show()