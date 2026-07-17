// Realistic Mock JSON Data matching DATASSS.csv and the Data Science models predictions

// 1. A pool of realistic dataset rows matching DATASSS.csv structure
export const rawDataset = [
  { record_id: 1, date: "2026-01-01", arrival_hour: 9, day_type: "Weekday", season: "Winter", weather: "Rainy", previous_patient_count: 45, average_wait_time: 32, available_beds: 15, available_icu: 5, available_doctors: 8, emergency_cases: 4, flu_cases: 12, accident_cases: 3, chronic_cases: 8, average_age: 45, average_heart_rate: 78, average_oxygen_level: 96.5, patient_count: 52, emergency_risk: 0.18, beds_required: 31, icu_required: 2, doctors_required: 5 },
  { record_id: 2, date: "2026-01-01", arrival_hour: 14, day_type: "Weekday", season: "Winter", weather: "Clear", previous_patient_count: 52, average_wait_time: 20, available_beds: 28, available_icu: 8, available_doctors: 12, emergency_cases: 2, flu_cases: 4, accident_cases: 1, chronic_cases: 9, average_age: 52, average_heart_rate: 72, average_oxygen_level: 98.2, patient_count: 33, emergency_risk: 0.06, beds_required: 19, icu_required: 0, doctors_required: 3 },
  { record_id: 3, date: "2026-01-01", arrival_hour: 19, day_type: "Weekday", season: "Winter", weather: "Rainy", previous_patient_count: 33, average_wait_time: 35, available_beds: 12, available_icu: 3, available_doctors: 6, emergency_cases: 6, flu_cases: 15, accident_cases: 5, chronic_cases: 7, average_age: 42, average_heart_rate: 85, average_oxygen_level: 94.1, patient_count: 58, emergency_risk: 0.41, beds_required: 34, icu_required: 3, doctors_required: 6 },
  { record_id: 4, date: "2026-01-01", arrival_hour: 23, day_type: "Weekday", season: "Winter", weather: "Clear", previous_patient_count: 58, average_wait_time: 15, available_beds: 35, available_icu: 9, available_doctors: 14, emergency_cases: 1, flu_cases: 2, accident_cases: 0, chronic_cases: 11, average_age: 58, average_heart_rate: 68, average_oxygen_level: 98.8, patient_count: 18, emergency_risk: 0.03, beds_required: 10, icu_required: 0, doctors_required: 2 },
  { record_id: 5, date: "2026-01-02", arrival_hour: 8, day_type: "Weekday", season: "Winter", weather: "Snowy", previous_patient_count: 18, average_wait_time: 34, available_beds: 10, available_icu: 4, available_doctors: 7, emergency_cases: 5, flu_cases: 18, accident_cases: 4, chronic_cases: 6, average_age: 44, average_heart_rate: 81, average_oxygen_level: 95.3, patient_count: 55, emergency_risk: 0.32, beds_required: 33, icu_required: 2, doctors_required: 6 },
  { record_id: 6, date: "2026-01-02", arrival_hour: 11, day_type: "Weekday", season: "Winter", weather: "Snowy", previous_patient_count: 55, average_wait_time: 38, available_beds: 5, available_icu: 2, available_doctors: 4, emergency_cases: 7, flu_cases: 21, accident_cases: 6, chronic_cases: 10, average_age: 48, average_heart_rate: 88, average_oxygen_level: 93.4, patient_count: 66, emergency_risk: 0.53, beds_required: 40, icu_required: 4, doctors_required: 7 },
  { record_id: 7, date: "2026-01-02", arrival_hour: 15, day_type: "Weekday", season: "Winter", weather: "Clear", previous_patient_count: 66, average_wait_time: 22, available_beds: 22, available_icu: 6, available_doctors: 11, emergency_cases: 3, flu_cases: 5, accident_cases: 2, chronic_cases: 8, average_age: 50, average_heart_rate: 74, average_oxygen_level: 97.6, patient_count: 38, emergency_risk: 0.09, beds_required: 22, icu_required: 1, doctors_required: 4 },
  { record_id: 8, date: "2026-01-02", arrival_hour: 20, day_type: "Weekday", season: "Winter", weather: "Clear", previous_patient_count: 38, average_wait_time: 28, available_beds: 16, available_icu: 5, available_doctors: 9, emergency_cases: 4, flu_cases: 6, accident_cases: 3, chronic_cases: 7, average_age: 47, average_heart_rate: 79, average_oxygen_level: 96.1, patient_count: 46, emergency_risk: 0.19, beds_required: 27, icu_required: 2, doctors_required: 5 },
  { record_id: 9, date: "2026-01-03", arrival_hour: 2, day_type: "Weekend", season: "Winter", weather: "Clear", previous_patient_count: 46, average_wait_time: 12, available_beds: 40, available_icu: 10, available_doctors: 15, emergency_cases: 1, flu_cases: 1, accident_cases: 1, chronic_cases: 5, average_age: 55, average_heart_rate: 70, average_oxygen_level: 98.5, patient_count: 12, emergency_risk: 0.04, beds_required: 7, icu_required: 0, doctors_required: 1 },
  { record_id: 10, date: "2026-01-03", arrival_hour: 10, day_type: "Weekend", season: "Winter", weather: "Clear", previous_patient_count: 12, average_wait_time: 21, available_beds: 30, available_icu: 8, available_doctors: 12, emergency_cases: 2, flu_cases: 5, accident_cases: 2, chronic_cases: 6, average_age: 49, average_heart_rate: 73, average_oxygen_level: 97.8, patient_count: 29, emergency_risk: 0.08, beds_required: 17, icu_required: 0, doctors_required: 3 },
  { record_id: 11, date: "2026-01-03", arrival_hour: 17, day_type: "Weekend", season: "Winter", weather: "Rainy", previous_patient_count: 29, average_wait_time: 26, available_beds: 20, available_icu: 4, available_doctors: 8, emergency_cases: 5, flu_cases: 10, accident_cases: 4, chronic_cases: 8, average_age: 43, average_heart_rate: 83, average_oxygen_level: 94.8, patient_count: 41, emergency_risk: 0.34, beds_required: 24, icu_required: 2, doctors_required: 4 },
  { record_id: 12, date: "2026-01-03", arrival_hour: 21, day_type: "Weekend", season: "Winter", weather: "Rainy", previous_patient_count: 41, average_wait_time: 29, available_beds: 14, available_icu: 3, available_doctors: 6, emergency_cases: 6, flu_cases: 12, accident_cases: 5, chronic_cases: 7, average_age: 41, average_heart_rate: 86, average_oxygen_level: 93.9, patient_count: 47, emergency_risk: 0.45, beds_required: 28, icu_required: 3, doctors_required: 5 },
  { record_id: 13, date: "2026-01-04", arrival_hour: 4, day_type: "Weekend", season: "Winter", weather: "Clear", previous_patient_count: 47, average_wait_time: 11, available_beds: 42, available_icu: 10, available_doctors: 16, emergency_cases: 0, flu_cases: 1, accident_cases: 0, chronic_cases: 4, average_age: 56, average_heart_rate: 67, average_oxygen_level: 99.1, patient_count: 10, emergency_risk: 0.02, beds_required: 6, icu_required: 0, doctors_required: 1 },
  { record_id: 14, date: "2026-01-04", arrival_hour: 9, day_type: "Weekend", season: "Winter", weather: "Clear", previous_patient_count: 10, average_wait_time: 23, available_beds: 28, available_icu: 7, available_doctors: 11, emergency_cases: 3, flu_cases: 4, accident_cases: 2, chronic_cases: 9, average_age: 53, average_heart_rate: 75, average_oxygen_level: 97.3, patient_count: 31, emergency_risk: 0.11, beds_required: 18, icu_required: 1, doctors_required: 3 },
  { record_id: 15, date: "2026-01-04", arrival_hour: 14, day_type: "Weekend", season: "Winter", weather: "Clear", previous_patient_count: 31, average_wait_time: 16, available_beds: 36, available_icu: 9, available_doctors: 13, emergency_cases: 2, flu_cases: 3, accident_cases: 1, chronic_cases: 8, average_age: 51, average_heart_rate: 71, average_oxygen_level: 98.1, patient_count: 22, emergency_risk: 0.05, beds_required: 13, icu_required: 0, doctors_required: 2 },
  { record_id: 16, date: "2026-01-04", arrival_hour: 18, day_type: "Weekend", season: "Winter", weather: "Clear", previous_patient_count: 22, average_wait_time: 24, available_beds: 25, available_icu: 6, available_doctors: 10, emergency_cases: 4, flu_cases: 5, accident_cases: 3, chronic_cases: 6, average_age: 46, average_heart_rate: 78, average_oxygen_level: 96.4, patient_count: 36, emergency_risk: 0.17, beds_required: 21, icu_required: 1, doctors_required: 4 },
  { record_id: 17, date: "2026-01-05", arrival_hour: 8, day_type: "Weekday", season: "Winter", weather: "Clear", previous_patient_count: 36, average_wait_time: 29, available_beds: 15, available_icu: 6, available_doctors: 9, emergency_cases: 4, flu_cases: 6, accident_cases: 2, chronic_cases: 10, average_age: 52, average_heart_rate: 76, average_oxygen_level: 97.0, patient_count: 46, emergency_risk: 0.13, beds_required: 27, icu_required: 1, doctors_required: 5 },
  { record_id: 18, date: "2026-01-05", arrival_hour: 11, day_type: "Weekday", season: "Winter", weather: "Clear", previous_patient_count: 46, average_wait_time: 33, available_beds: 9, available_icu: 4, available_doctors: 7, emergency_cases: 5, flu_cases: 8, accident_cases: 3, chronic_cases: 11, average_age: 54, average_heart_rate: 80, average_oxygen_level: 95.8, patient_count: 54, emergency_risk: 0.22, beds_required: 32, icu_required: 2, doctors_required: 5 },
  { record_id: 19, date: "2026-01-05", arrival_hour: 16, day_type: "Weekday", season: "Winter", weather: "Clear", previous_patient_count: 54, average_wait_time: 22, available_beds: 24, available_icu: 7, available_doctors: 12, emergency_cases: 2, flu_cases: 4, accident_cases: 1, chronic_cases: 8, average_age: 49, average_heart_rate: 72, average_oxygen_level: 98.3, patient_count: 34, emergency_risk: 0.06, beds_required: 20, icu_required: 0, doctors_required: 3 },
  { record_id: 20, date: "2026-01-05", arrival_hour: 20, day_type: "Weekday", season: "Winter", weather: "Rainy", previous_patient_count: 34, average_wait_time: 36, available_beds: 10, available_icu: 2, available_doctors: 5, emergency_cases: 7, flu_cases: 16, accident_cases: 6, chronic_cases: 7, average_age: 40, average_heart_rate: 89, average_oxygen_level: 93.1, patient_count: 60, emergency_risk: 0.58, beds_required: 36, icu_required: 4, doctors_required: 6 },
  { record_id: 21, date: "2026-04-01", arrival_hour: 9, day_type: "Weekday", season: "Spring", weather: "Clear", previous_patient_count: 41, average_wait_time: 27, available_beds: 18, available_icu: 7, available_doctors: 10, emergency_cases: 3, flu_cases: 2, accident_cases: 2, chronic_cases: 9, average_age: 51, average_heart_rate: 73, average_oxygen_level: 97.6, patient_count: 41, emergency_risk: 0.09, beds_required: 24, icu_required: 1, doctors_required: 4 },
  { record_id: 22, date: "2026-04-01", arrival_hour: 14, day_type: "Weekday", season: "Spring", weather: "Clear", previous_patient_count: 41, average_wait_time: 19, available_beds: 30, available_icu: 9, available_doctors: 13, emergency_cases: 2, flu_cases: 1, accident_cases: 1, chronic_cases: 8, average_age: 49, average_heart_rate: 70, average_oxygen_level: 98.4, patient_count: 26, emergency_risk: 0.04, beds_required: 15, icu_required: 0, doctors_required: 2 },
  { record_id: 23, date: "2026-04-01", arrival_hour: 19, day_type: "Weekday", season: "Spring", weather: "Clear", previous_patient_count: 26, average_wait_time: 28, available_beds: 15, available_icu: 6, available_doctors: 9, emergency_cases: 4, flu_cases: 3, accident_cases: 3, chronic_cases: 7, average_age: 46, average_heart_rate: 77, average_oxygen_level: 96.5, patient_count: 43, emergency_risk: 0.17, beds_required: 25, icu_required: 1, doctors_required: 4 },
  { record_id: 24, date: "2026-04-02", arrival_hour: 8, day_type: "Weekday", season: "Spring", weather: "Clear", previous_patient_count: 14, average_wait_time: 26, available_beds: 19, available_icu: 7, available_doctors: 10, emergency_cases: 3, flu_cases: 2, accident_cases: 2, chronic_cases: 8, average_age: 49, average_heart_rate: 73, average_oxygen_level: 97.5, patient_count: 39, emergency_risk: 0.09, beds_required: 23, icu_required: 1, doctors_required: 4 },
  { record_id: 25, date: "2026-04-02", arrival_hour: 11, day_type: "Weekday", season: "Spring", weather: "Clear", previous_patient_count: 39, average_wait_time: 30, available_beds: 12, available_icu: 5, available_doctors: 8, emergency_cases: 4, flu_cases: 3, accident_cases: 3, chronic_cases: 9, average_age: 51, average_heart_rate: 77, average_oxygen_level: 96.4, patient_count: 48, emergency_risk: 0.18, beds_required: 28, icu_required: 1, doctors_required: 5 },
  { record_id: 26, date: "2026-07-01", arrival_hour: 9, day_type: "Weekday", season: "Summer", weather: "Clear", previous_patient_count: 37, average_wait_time: 24, available_beds: 20, available_icu: 8, available_doctors: 11, emergency_cases: 2, flu_cases: 0, accident_cases: 2, chronic_cases: 8, average_age: 52, average_heart_rate: 72, average_oxygen_level: 97.8, patient_count: 37, emergency_risk: 0.07, beds_required: 22, icu_required: 1, doctors_required: 4 },
  { record_id: 27, date: "2026-07-01", arrival_hour: 14, day_type: "Weekday", season: "Summer", weather: "Clear", previous_patient_count: 37, average_wait_time: 18, available_beds: 32, available_icu: 9, available_doctors: 14, emergency_cases: 1, flu_cases: 0, accident_cases: 1, chronic_cases: 7, average_age: 49, average_heart_rate: 70, average_oxygen_level: 98.5, patient_count: 23, emergency_risk: 0.03, beds_required: 13, icu_required: 0, doctors_required: 2 },
  { record_id: 28, date: "2026-07-01", arrival_hour: 19, day_type: "Weekday", season: "Summer", weather: "Clear", previous_patient_count: 23, average_wait_time: 26, available_beds: 17, available_icu: 7, available_doctors: 10, emergency_cases: 3, flu_cases: 0, accident_cases: 3, chronic_cases: 6, average_age: 46, average_heart_rate: 76, average_oxygen_level: 96.7, patient_count: 40, emergency_risk: 0.15, beds_required: 24, icu_required: 1, doctors_required: 4 },
  { record_id: 29, date: "2026-10-01", arrival_hour: 9, day_type: "Weekday", season: "Autumn", weather: "Clear", previous_patient_count: 40, average_wait_time: 26, available_beds: 19, available_icu: 7, available_doctors: 10, emergency_cases: 3, flu_cases: 1, accident_cases: 2, chronic_cases: 9, average_age: 51, average_heart_rate: 73, average_oxygen_level: 97.5, patient_count: 40, emergency_risk: 0.09, beds_required: 24, icu_required: 1, doctors_required: 4 },
  { record_id: 30, date: "2026-10-01", arrival_hour: 14, day_type: "Weekday", season: "Autumn", weather: "Clear", previous_patient_count: 40, average_wait_time: 20, available_beds: 29, available_icu: 8, available_doctors: 12, emergency_cases: 2, flu_cases: 0, accident_cases: 1, chronic_cases: 8, average_age: 49, average_heart_rate: 70, average_oxygen_level: 98.3, patient_count: 27, emergency_risk: 0.04, beds_required: 16, icu_required: 0, doctors_required: 2 }
];

// 2. Metrics for Dashboard Header Cards & Sparklines
export const dashboardMetrics = {
  totalPatientsToday: { value: 74, trend: 12.5, positive: true, sparkline: [45, 52, 33, 58, 48, 66, 74] },
  predictedPatientCount: { value: 87, trend: 18.2, positive: true, sparkline: [58, 66, 70, 78, 81, 84, 87] },
  availableBeds: { value: 24, trend: -8.3, positive: false, sparkline: [35, 30, 28, 22, 19, 15, 24] },
  icuAvailability: { value: 6, trend: -25.0, positive: false, sparkline: [9, 8, 8, 7, 5, 4, 6] },
  doctorsAvailable: { value: 14, trend: 7.7, positive: true, sparkline: [12, 12, 11, 11, 10, 13, 14] },
  emergencyCases: { value: 11, trend: 22.4, positive: false, sparkline: [3, 5, 6, 7, 8, 9, 11] },
  averageWaitTime: { value: 28, trend: -12.5, positive: true, sparkline: [35, 32, 29, 31, 33, 30, 28] }, // positive = trend lower is good
  averageOxygenLevel: { value: 96.8, trend: 0.5, positive: true, sparkline: [96.1, 96.3, 96.5, 96.4, 96.8, 96.6, 96.8] }
};

// 3. Linear Regression (Patient Prediction) Page Metrics & Charts
export const linearRegressionMetrics = {
  rmse: 4.128,
  r2Score: 0.8854,
  testSamples: 69,
  coefficients: [
    { feature: "arrival_hour", weight: 0.28 },
    { feature: "day_type (Weekend)", weight: -1.45 },
    { feature: "previous_patient_count", weight: 0.65 },
    { feature: "average_wait_time", weight: 1.12 },
    { feature: "average_oxygen_level", weight: -2.31 }
  ],
  actualVsPredictedScatter: [
    { actual: 12, predicted: 13.5, id: 1 },
    { actual: 18, predicted: 16.2, id: 2 },
    { actual: 22, predicted: 24.1, id: 3 },
    { actual: 29, predicted: 31.0, id: 4 },
    { actual: 33, predicted: 30.5, id: 5 },
    { actual: 38, predicted: 35.8, id: 6 },
    { actual: 41, predicted: 43.2, id: 7 },
    { actual: 46, predicted: 44.9, id: 8 },
    { actual: 47, predicted: 49.3, id: 9 },
    { actual: 52, predicted: 50.1, id: 10 },
    { actual: 55, predicted: 53.8, id: 11 },
    { actual: 58, predicted: 56.4, id: 12 },
    { actual: 60, predicted: 62.8, id: 13 },
    { actual: 66, predicted: 67.5, id: 14 }
  ],
  predictionTrend: [
    { hour: "08:00", actual: 46, predicted: 44.5 },
    { hour: "10:00", actual: 54, predicted: 51.2 },
    { hour: "12:00", actual: 60, predicted: 58.9 },
    { hour: "14:00", actual: 33, predicted: 36.4 },
    { hour: "16:00", actual: 38, predicted: 39.1 },
    { hour: "18:00", actual: 49, predicted: 47.6 },
    { hour: "20:00", actual: 66, predicted: 68.2 },
    { hour: "22:00", actual: 18, predicted: 19.8 }
  ],
  errorDistribution: [
    { errorRange: "-8 to -6", count: 2 },
    { errorRange: "-6 to -4", count: 5 },
    { errorRange: "-4 to -2", count: 12 },
    { errorRange: "-2 to 0", count: 22 },
    { errorRange: "0 to 2", count: 18 },
    { errorRange: "2 to 4", count: 7 },
    { errorRange: "4 to 6", count: 3 },
    { errorRange: "6 to 8", count: 1 }
  ]
};

// 4. Logistic Regression (Emergency Risk) Page Metrics & Charts
export const logisticRegressionMetrics = {
  accuracy: 0.913,
  precision: 0.889,
  recall: 0.842,
  f1Score: 0.865,
  confusionMatrix: [
    { label: "Actual Low Risk", Predict_Low: 42, Predict_High: 3 },
    { label: "Actual High Risk", Predict_Low: 4, Predict_High: 20 }
  ],
  probabilityBarChart: [
    { id: "P-101", prob: 0.12, risk: "Low", age: 45 },
    { id: "P-102", prob: 0.85, risk: "High", age: 72 },
    { id: "P-103", prob: 0.05, risk: "Low", age: 23 },
    { id: "P-104", prob: 0.58, risk: "High", age: 61 },
    { id: "P-105", prob: 0.92, risk: "High", age: 80 },
    { id: "P-106", prob: 0.22, risk: "Low", age: 34 },
    { id: "P-107", prob: 0.41, risk: "Low", age: 50 },
    { id: "P-108", prob: 0.77, risk: "High", age: 67 }
  ],
  riskDistribution: [
    { name: "High Risk (>50%)", value: 34, color: "#ef4444" },
    { name: "Medium Risk (20%-50%)", value: 22, color: "#06b6d4" },
    { name: "Low Risk (<20%)", value: 44, color: "#10b981" }
  ]
};

// 5. Decision Tree (Resource Allocation) Metrics & Charts
export const decisionTreeMetrics = {
  accuracy: 0.875,
  featureImportance: [
    { name: "emergency_cases", score: 0.38 },
    { name: "previous_patient_count", score: 0.22 },
    { name: "average_wait_time", score: 0.18 },
    { name: "available_beds", score: 0.11 },
    { name: "available_icu", score: 0.06 },
    { name: "average_oxygen_level", score: 0.03 },
    { name: "average_age", score: 0.02 }
  ],
  hospitalRequirements: [
    { department: "General Ward Beds", current: 15, required: 31, deficit: 16 },
    { department: "ICU Beds", current: 5, required: 8, deficit: 3 },
    { department: "Duty Doctors", current: 8, required: 12, deficit: 4 },
    { department: "Ventilators", current: 4, required: 6, deficit: 2 },
    { department: "Nurses", current: 22, required: 35, deficit: 13 }
  ],
  treeStructure: {
    name: "Root: emergency_cases > 4.5",
    condition: "Emergency Cases",
    yes: {
      name: "Node A: available_beds < 10.5",
      condition: "Available Beds < 10.5",
      yes: "Output 1: Deficit Mode (Beds+30, ICU+5, Doc+8)",
      no: "Output 2: Action Pool (Beds+15, ICU+2, Doc+4)"
    },
    no: {
      name: "Node B: average_wait_time > 30 min",
      condition: "Avg Wait Time > 30m",
      yes: "Output 3: Alert Flow (Beds+10, Doc+3)",
      no: "Output 4: Safe Mode (Resource allocations normal)"
    }
  }
};

// 6. Random Forest (Future Demand Forecast) Page Metrics & Charts
export const randomForestMetrics = {
  rmse: 2.854,
  r2Score: 0.941,
  predictionErrorHistogram: [
    { bin: "-5 to -3", count: 1 },
    { bin: "-3 to -1", count: 8 },
    { bin: "-1 to 1", count: 32 },
    { bin: "1 to 3", count: 16 },
    { bin: "3 to 5", count: 4 }
  ],
  featureImportance: [
    { name: "previous_patient_count", score: 0.31 },
    { name: "arrival_hour", score: 0.24 },
    { name: "average_wait_time", score: 0.17 },
    { name: "day_type", score: 0.11 },
    { name: "weather", score: 0.09 },
    { name: "season", score: 0.08 }
  ],
  demandForecastTrend: [
    { date: "Jul 18", actual: 38, forecasted: 39 },
    { date: "Jul 19", actual: 44, forecasted: 42 },
    { date: "Jul 20", actual: 56, forecasted: 54 },
    { date: "Jul 21", actual: null, forecasted: 62 },
    { date: "Jul 22", actual: null, forecasted: 68 },
    { date: "Jul 23", actual: null, forecasted: 59 },
    { date: "Jul 24", actual: null, forecasted: 45 },
    { date: "Jul 25", actual: null, forecasted: 39 },
    { date: "Jul 26", actual: null, forecasted: 48 }
  ]
};

// 7. KNN (Similar Patients) Page Metrics & Charts
export const knnMetrics = {
  lastPredictedGroup: "Group C (High Emergency)",
  averageDistance: 0.5841,
  nearestPatients: [
    { record_id: 6, similarity: 93.4, distance: 0.28, age: 48, emergency_cases: 7, flu_cases: 21, accident_cases: 6, beds_required: 40, patient_count: 66 },
    { record_id: 20, similarity: 90.1, distance: 0.35, age: 40, emergency_cases: 7, flu_cases: 16, accident_cases: 6, beds_required: 36, patient_count: 60 },
    { record_id: 12, similarity: 88.5, distance: 0.44, age: 41, emergency_cases: 6, flu_cases: 12, accident_cases: 5, beds_required: 28, patient_count: 47 },
    { record_id: 3, similarity: 86.2, distance: 0.52, age: 42, emergency_cases: 6, flu_cases: 15, accident_cases: 5, beds_required: 34, patient_count: 58 },
    { record_id: 5, similarity: 84.7, distance: 0.58, age: 44, emergency_cases: 5, flu_cases: 18, accident_cases: 4, beds_required: 33, patient_count: 55 }
  ]
};

// 8. K-Means (Patient Segmentation) Page Metrics & Charts
export const kmeansMetrics = {
  clusters: [
    { id: 1, name: "Cluster 1 (Critical Emergencies)", patientCount: 38, avgWaitTime: 36.5, emergencyCases: 6.8, color: "#ef4444" },
    { id: 2, name: "Cluster 2 (Incidental Outpatients)", patientCount: 94, avgWaitTime: 18.2, emergencyCases: 1.2, color: "#10b981" },
    { id: 3, name: "Cluster 3 (Routine Care)", patientCount: 68, avgWaitTime: 26.4, emergencyCases: 3.1, color: "#06b6d4" }
  ],
  clusterDistribution: [
    { name: "Cluster 1", value: 38 },
    { name: "Cluster 2", value: 94 },
    { name: "Cluster 3", value: 68 }
  ]
};

// 9. PCA Analysis Page Metrics & Charts
export const pcaMetrics = {
  totalVarianceRetained: 92.4, // percent
  explainedVariance: [
    { name: "PC1", variance: 58.4, cumulative: 58.4 },
    { name: "PC2", variance: 22.1, cumulative: 80.5 },
    { name: "PC3", variance: 11.9, cumulative: 92.4 },
    { name: "PC4", variance: 4.2, cumulative: 96.6 },
    { name: "PC5", variance: 2.1, cumulative: 98.7 }
  ],
  scatterPlot: [
    // PC1, PC2 coordinates and cluster grouping
    { PC1: -2.3, PC2: 1.8, cluster: "Cluster 1", record_id: 6 },
    { PC1: -2.1, PC2: 1.5, cluster: "Cluster 1", record_id: 20 },
    { PC1: -1.8, PC2: 1.2, cluster: "Cluster 1", record_id: 12 },
    { PC1: 1.5, PC2: -0.8, cluster: "Cluster 2", record_id: 2 },
    { PC1: 1.8, PC2: -1.1, cluster: "Cluster 2", record_id: 4 },
    { PC1: 1.4, PC2: -0.6, cluster: "Cluster 2", record_id: 9 },
    { PC1: 0.2, PC2: 0.3, cluster: "Cluster 3", record_id: 1 },
    { PC1: -0.1, PC2: 0.1, cluster: "Cluster 3", record_id: 7 },
    { PC1: 0.3, PC2: 0.5, cluster: "Cluster 3", record_id: 10 },
    { PC1: 0.5, PC2: -0.2, cluster: "Cluster 3", record_id: 14 }
  ],
  contributionMatrix: [
    { feature: "emergency_cases", PC1: 0.52, PC2: -0.12 },
    { feature: "average_wait_time", PC1: 0.48, PC2: -0.08 },
    { feature: "previous_patient_count", PC1: 0.42, PC2: 0.22 },
    { feature: "available_beds", PC1: -0.38, PC2: 0.45 },
    { feature: "available_icu", PC1: -0.35, PC2: 0.51 },
    { feature: "average_oxygen_level", PC1: -0.29, PC2: -0.38 }
  ]
};

// 10. AI Recommendation & Insights
export const aiRecommendations = [
  { id: 1, type: "critical", text: "Patient demand is expected to increase by 18% tomorrow due to extreme incoming weather patterns (Snowy conditions projected).", action: "Prepare Emergency Department" },
  { id: 2, type: "warning", text: "Bed vacancies are entering a critical phase. Standard General Ward capacity is currently at 84% occupancy.", action: "Reserve 12 ICU beds" },
  { id: 3, type: "success", text: "Optimized staff roster: Re-align 6 additional duty doctors from routine out-patient care to emergency wings between 18:00 and 22:00.", action: "Shift 6 Doctor Shifts" },
  { id: 4, type: "info", text: "Flu cases are trending up by 32% week-on-week, matching winter seasonal forecasting models.", action: "Stock Influenza Vaccines" }
];

// 11. Custom Alerts
export const alerts = [
  { id: 1, type: "critical", msg: "High Emergency Alert: 11 active emergencies in the queue.", time: "10 mins ago" },
  { id: 2, type: "warning", msg: "Low Bed Availability: Only 24 general hospital beds empty.", time: "25 mins ago" },
  { id: 3, type: "critical", msg: "ICU Almost Full: ICU unit at 88% capacity limit (only 6 beds remain).", time: "42 mins ago" },
  { id: 4, type: "warning", msg: "Doctor Shortage Alert: Surgeon availability under critical threshold for nighttime shift.", time: "1 hour ago" }
];
