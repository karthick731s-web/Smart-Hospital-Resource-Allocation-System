import pandas as pd
import pickle
import matplotlib.pyplot as plt

from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA

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
# Features for Clustering
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
# Feature Scaling
# =====================================

scaler = StandardScaler()

X_scaled = scaler.fit_transform(X)

# =====================================
# Train K-Means
# =====================================

kmeans = KMeans(
    n_clusters=3,
    random_state=42,
    n_init=10
)

df["Cluster"] = kmeans.fit_predict(X_scaled)

print("K-Means Model Trained Successfully")

# =====================================
# Cluster Summary
# =====================================

print("\nPatients in Each Cluster")

print(df["Cluster"].value_counts().sort_index())

# =====================================
# Cluster Statistics
# =====================================

summary = df.groupby("Cluster")[[
    "patient_count",
    "average_wait_time",
    "emergency_cases",
    "flu_cases",
    "accident_cases"
]].mean()

print("\nCluster Summary")

print(summary)

# =====================================
# Predict New Patient Cluster
# =====================================

new_patient = pd.DataFrame([{

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

new_scaled = scaler.transform(new_patient)

cluster = kmeans.predict(new_scaled)

print("\nNew Patient belongs to Cluster :", cluster[0])

# =====================================
# Save Model
# =====================================

pickle.dump(kmeans, open("../models/kmeans.pkl", "wb"))
pickle.dump(scaler, open("../models/kmeans_scaler.pkl", "wb"))

print("\nModel Saved Successfully")

# =====================================
# PCA for Visualization
# =====================================

pca = PCA(n_components=2)

X_pca = pca.fit_transform(X_scaled)

plt.figure(figsize=(8,6))

plt.scatter(
    X_pca[:,0],
    X_pca[:,1],
    c=df["Cluster"]
)

plt.title("Patient Segmentation using K-Means")

plt.xlabel("Principal Component 1")

plt.ylabel("Principal Component 2")

plt.show()

# =====================================
# Cluster Size Chart
# =====================================

plt.figure(figsize=(6,5))

df["Cluster"].value_counts().sort_index().plot(kind="bar")

plt.title("Number of Patients in Each Cluster")

plt.xlabel("Cluster")

plt.ylabel("Patients")

plt.show()