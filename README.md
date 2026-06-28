# 🏥 Smart Hospital Resource Allocation System

## Project Overview

The Smart Hospital Resource Allocation System is a Machine Learning-based project designed to predict hospital patient demand and assist administrators in efficiently allocating hospital resources. The system analyzes historical hospital data and uses multiple machine learning algorithms to forecast patient load, predict emergency risk, estimate required medical resources, identify similar patient cases, segment patients into groups, and reduce feature complexity.

The project aims to improve hospital decision-making by providing accurate predictions that help reduce waiting times, optimize bed utilization, improve ICU management, and ensure adequate doctor availability.

---

# Problem Statement

Hospitals frequently face challenges in managing limited medical resources during periods of high patient demand. Unexpected increases in patient arrivals can lead to:

- Overcrowded emergency departments
- Shortage of hospital beds
- Insufficient ICU capacity
- Limited doctor availability
- Increased patient waiting time
- Delayed treatment

Traditional resource planning often depends on manual estimation and historical experience, which may not accurately reflect future demand.

This project addresses these challenges by using Machine Learning algorithms to predict patient demand and recommend appropriate resource allocation based on historical hospital data.

---

# Project Objectives

The main objectives of this project are:

- Predict future patient count.
- Predict emergency risk levels.
- Find patients with similar medical conditions.
- Estimate hospital resource requirements.
- Forecast future hospital demand.
- Segment patients into meaningful groups.
- Reduce the dimensionality of medical features for better visualization and analysis.
- Support hospital administrators in making data-driven decisions.

---

# Technologies Used

- Python
- Pandas
- NumPy
- Scikit-Learn
- Matplotlib
- Pickle
- Visual Studio Code

---

# Machine Learning Algorithms

## 1. Linear Regression

Purpose:
Predict the expected patient count based on hospital conditions.

Output:
- Predicted Patient Count

---

## 2. Logistic Regression

Purpose:
Predict whether the emergency risk is LOW or HIGH.

Output:
- Emergency Risk Classification

---

## 3. K-Nearest Neighbors (KNN)

Purpose:
Find patients with similar medical conditions using historical hospital records.

Output:
- Similar Patient Cases
- Risk Group

---

## 4. Decision Tree

Purpose:
Predict hospital resource requirements.

Outputs:
- Beds Required
- ICU Required
- Doctors Required

---

## 5. Random Forest

Purpose:
Forecast future hospital demand.

Output:
- Future Patient Count

---

## 6. K-Means Clustering

Purpose:
Group similar patients into different patient segments.

Output:
- Patient Clusters

---

## 7. Principal Component Analysis (PCA)

Purpose:
Reduce medical features while preserving maximum information.

Output:
- Principal Components
- Reduced Feature Space

---

# Dataset Description

The dataset contains historical hospital information used to train and evaluate the machine learning models.

Total Features: 23

---

## Dataset Columns

| Column | Description |
|---------|-------------|
| record_id | Unique identifier for each hospital record |
| date | Date of patient record |
| arrival_hour | Hour when patients arrived at the hospital |
| day_type | Weekday or Weekend |
| season | Season (Winter, Summer, Rainy, etc.) |
| weather | Weather condition (Clear, Rainy, Snowy, etc.) |
| previous_patient_count | Number of patients from the previous period |
| average_wait_time | Average patient waiting time (minutes) |
| available_beds | Number of beds currently available |
| available_icu | Number of ICU beds available |
| available_doctors | Number of doctors available |
| emergency_cases | Number of emergency patients |
| flu_cases | Number of flu-related patients |
| accident_cases | Number of accident-related patients |
| chronic_cases | Number of chronic disease patients |
| average_age | Average age of patients |
| average_heart_rate | Average heart rate of patients |
| average_oxygen_level | Average oxygen saturation level (%) |
| patient_count | Total number of patients (Target for Linear Regression & Random Forest) |
| emergency_risk | Emergency risk score (Target for Logistic Regression) |
| beds_required | Estimated beds required (Target for Decision Tree) |
| icu_required | Estimated ICU beds required (Target for Decision Tree) |
| doctors_required | Estimated doctors required (Target for Decision Tree) |

---

# Project Workflow

1. Load Dataset
2. Data Preprocessing
3. Encode Categorical Features
4. Train Machine Learning Models
5. Evaluate Model Performance
6. Generate Predictions
7. Visualize Results
8. Save Trained Models

---

# Project Folder Structure
Smart-Hospital-Resource-Allocation-System/

├── dataset/
│ └── DATASSS.csv
│
├── models/
│ ├── linear_regression.pkl
│ ├── logistic_regression.pkl
│ ├── knn_model.pkl
│ ├── decision_tree.pkl
│ ├── random_forest.pkl
│ ├── kmeans.pkl
│ └── pca_model.pkl
│
├── src/
│ ├── linear_regression.py
│ ├── logistic_regression.py
│ ├── knn.py
│ ├── decision_tree.py
│ ├── random_forest.py
│ ├── kmeans.py
│ └── pca.py
|
├── README.md
|── Smart_Hospital_Presentation.pptx