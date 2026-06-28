import pandas as pd
import pickle
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report, ConfusionMatrixDisplay

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
# Create Target
# =====================================

threshold = df["emergency_risk"].median()

df["risk_class"] = (df["emergency_risk"] >= threshold).astype(int)

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
# Feature Scaling
# =====================================

scaler = StandardScaler()

X_scaled = scaler.fit_transform(X)

# =====================================
# Train Test Split
# =====================================

X_train, X_test, y_train, y_test = train_test_split(
    X_scaled,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

# =====================================
# Train KNN Model
# =====================================

model = KNeighborsClassifier(
    n_neighbors=5,
    metric="euclidean"
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

accuracy = accuracy_score(y_test, y_pred)

print("\nAccuracy :", round(accuracy * 100, 2), "%")

cm = confusion_matrix(y_test, y_pred)

print("\nConfusion Matrix")
print(cm)

print("\nClassification Report")
print(classification_report(y_test, y_pred))

# =====================================
# Similar Patient Prediction
# =====================================

new_patient = pd.DataFrame([{
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

new_scaled = scaler.transform(new_patient)

prediction = model.predict(new_scaled)

print("\nPrediction")

if prediction[0] == 1:
    print("Similar Patient Group : HIGH RISK")
else:
    print("Similar Patient Group : LOW RISK")

# =====================================
# Show Similar Patients
# =====================================

distances, indices = model.kneighbors(new_scaled)

print("\nTop 5 Similar Patient Records")

similar_cases = df.iloc[indices[0]]

print(similar_cases[[
    "patient_count",
    "emergency_risk",
    "available_beds",
    "available_icu",
    "emergency_cases",
    "flu_cases",
    "accident_cases"
]])

# =====================================
# Save Model
# =====================================

pickle.dump(model, open("../models/knn_model.pkl", "wb"))
pickle.dump(scaler, open("../models/knn_scaler.pkl", "wb"))

print("\nModel Saved Successfully")

# =====================================
# Visualization 1
# Confusion Matrix
# =====================================

disp = ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=["Low Risk","High Risk"]
)

disp.plot(cmap="Blues")

plt.title("KNN Confusion Matrix")

plt.show()

# =====================================
# Visualization 2
# Similar Patient Distances
# =====================================
plt.figure(figsize=(8,5))

plt.bar(
    range(1,6),
    similar_cases["emergency_risk"]
)

plt.xticks(range(1,6))

plt.xlabel("Nearest Patients")
plt.ylabel("Emergency Risk")

plt.title("Emergency Risk of Top 5 Similar Patients")

plt.show()