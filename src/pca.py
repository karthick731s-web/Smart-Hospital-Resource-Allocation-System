import pandas as pd
import pickle
import matplotlib.pyplot as plt

from sklearn.preprocessing import LabelEncoder, StandardScaler
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
# Standardize Data
# =====================================

scaler = StandardScaler()

X_scaled = scaler.fit_transform(X)

# =====================================
# PCA
# =====================================

pca = PCA(n_components=2)

X_pca = pca.fit_transform(X_scaled)

print("PCA Completed Successfully")

# =====================================
# Explained Variance
# =====================================

print("\nExplained Variance Ratio")

for i, value in enumerate(pca.explained_variance_ratio_):
    print(f"PC{i+1} : {value:.4f}")

print("\nTotal Variance Retained :",
      round(sum(pca.explained_variance_ratio_)*100,2),"%")

# =====================================
# Component Matrix
# =====================================

components = pd.DataFrame(
    pca.components_,
    columns=X.columns,
    index=["PC1","PC2"]
)

print("\nPrincipal Components")

print(components)

# =====================================
# Save PCA
# =====================================

pickle.dump(pca, open("../models/pca_model.pkl", "wb"))
pickle.dump(scaler, open("../models/pca_scaler.pkl", "wb"))

print("\nPCA Model Saved Successfully")

# =====================================
# Visualization 1
# PCA Scatter Plot
# =====================================

plt.figure(figsize=(8,6))

plt.scatter(
    X_pca[:,0],
    X_pca[:,1]
)

plt.title("PCA - Medical Feature Reduction")

plt.xlabel("Principal Component 1")

plt.ylabel("Principal Component 2")

plt.grid(True)

plt.show()

# =====================================
# Visualization 2
# Explained Variance
# =====================================

plt.figure(figsize=(6,5))

plt.bar(
    ["PC1","PC2"],
    pca.explained_variance_ratio_
)

plt.ylabel("Explained Variance")

plt.title("Variance Explained by Principal Components")

plt.show()

# =====================================
# Visualization 3
# Feature Contribution
# =====================================

plt.figure(figsize=(10,6))

plt.bar(
    X.columns,
    abs(pca.components_[0])
)

plt.xticks(rotation=90)

plt.title("Feature Contribution to PC1")

plt.tight_layout()

plt.show()