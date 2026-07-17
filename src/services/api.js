import * as mockData from '../data/mockData';

// Flask Backend API URL (Toggle or replace this with your actual Flask address later, e.g. "http://localhost:5000/api")
const API_BASE_URL = 'http://localhost:5000/api';
const USE_MOCK = true;

// Helper to simulate latency/asynchronous fetch behaviour
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  // 1. Dashboard Metrics
  async getDashboardMetrics() {
    if (USE_MOCK) {
      await delay(400);
      return mockData.dashboardMetrics;
    }
    const res = await fetch(`${API_BASE_URL}/dashboard/metrics`);
    return res.json();
  },

  // 2. Linear Regression (Patient Count Prediction)
  async getLinearRegressionStats() {
    if (USE_MOCK) {
      await delay(500);
      return mockData.linearRegressionMetrics;
    }
    const res = await fetch(`${API_BASE_URL}/models/linear-regression`);
    return res.json();
  },

  // Predict endpoint for linear regression
  async predictPatientCount(inputData) {
    if (USE_MOCK) {
      await delay(300);
      // Simple formula to generate mock patient prediction
      const base = parseInt(inputData.previous_patient_count || 40);
      const hourEffect = parseInt(inputData.arrival_hour || 12) * 0.5;
      const waitEffect = parseInt(inputData.average_wait_time || 20) * 0.3;
      const dayEffect = inputData.day_type === 'Weekend' ? -3 : 2;
      return {
        predicted_patient_count: Math.round(base + hourEffect + waitEffect + dayEffect),
        confidence_interval: [Math.round(base + hourEffect - 4), Math.round(base + hourEffect + 8)]
      };
    }
    const res = await fetch(`${API_BASE_URL}/predict/patient-count`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputData),
    });
    return res.json();
  },

  // 3. Logistic Regression (Emergency Risk)
  async getLogisticRegressionStats() {
    if (USE_MOCK) {
      await delay(550);
      return mockData.logisticRegressionMetrics;
    }
    const res = await fetch(`${API_BASE_URL}/models/logistic-regression`);
    return res.json();
  },

  async predictEmergencyRisk(inputData) {
    if (USE_MOCK) {
      await delay(300);
      const o2 = parseFloat(inputData.average_oxygen_level || 97);
      const hr = parseFloat(inputData.average_heart_rate || 75);
      const ec = parseInt(inputData.emergency_cases || 2);
      
      // Rough risk calculation
      let probability = 0.1;
      if (o2 < 95) probability += 0.45;
      if (hr > 85) probability += 0.25;
      if (ec > 4) probability += 0.15;
      
      probability = Math.min(Math.max(probability, 0.02), 0.98);
      return {
        risk_level: probability > 0.5 ? 'High Risk' : 'Low Risk',
        probability: Math.round(probability * 100) / 100,
        model_accuracy: 0.913
      };
    }
    const res = await fetch(`${API_BASE_URL}/predict/emergency-risk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputData),
    });
    return res.json();
  },

  // 4. Decision Tree (Resource Allocation)
  async getDecisionTreeStats() {
    if (USE_MOCK) {
      await delay(450);
      return mockData.decisionTreeMetrics;
    }
    const res = await fetch(`${API_BASE_URL}/models/decision-tree`);
    return res.json();
  },

  async predictResourceRequirements(inputData) {
    if (USE_MOCK) {
      await delay(350);
      const ec = parseInt(inputData.emergency_cases || 3);
      const p = parseInt(inputData.patient_count || 45);
      
      // Calculate realistic requirements
      const beds = Math.ceil(p * 0.6 + ec * 1.5);
      const icu = Math.ceil(ec * 0.5);
      const doc = Math.ceil(p / 10 + ec * 0.6);
      
      return {
        beds_required: beds,
        icu_required: icu,
        doctors_required: doc,
        model_accuracy: 0.875
      };
    }
    const res = await fetch(`${API_BASE_URL}/predict/resources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputData),
    });
    return res.json();
  },

  // 5. Random Forest (Future Demand Forecast)
  async getRandomForestStats() {
    if (USE_MOCK) {
      await delay(500);
      return mockData.randomForestMetrics;
    }
    const res = await fetch(`${API_BASE_URL}/models/random-forest`);
    return res.json();
  },

  // 6. KNN (Similar Patients Search)
  async getKNNStats(recordId = null) {
    if (USE_MOCK) {
      await delay(400);
      return mockData.knnMetrics;
    }
    const res = await fetch(`${API_BASE_URL}/models/knn?record_id=${recordId}`);
    return res.json();
  },

  // 7. K-Means (Patient Segmentation)
  async getKMeansStats() {
    if (USE_MOCK) {
      await delay(450);
      return mockData.kmeansMetrics;
    }
    const res = await fetch(`${API_BASE_URL}/models/kmeans`);
    return res.json();
  },

  // 8. PCA (Dimensionality Reduction)
  async getPCAStats() {
    if (USE_MOCK) {
      await delay(480);
      return mockData.pcaMetrics;
    }
    const res = await fetch(`${API_BASE_URL}/models/pca`);
    return res.json();
  },

  // 9. Dataset Analytics (Fetch all rows from the dataset)
  async getDatasetAnalytics(params = {}) {
    if (USE_MOCK) {
      await delay(350);
      let data = [...mockData.rawDataset];
      
      // Search filter
      if (params.search) {
        const query = params.search.toLowerCase();
        data = data.filter(row => 
          row.date.includes(query) || 
          row.day_type.toLowerCase().includes(query) ||
          row.season.toLowerCase().includes(query) ||
          row.weather.toLowerCase().includes(query)
        );
      }

      // Sort logic
      if (params.sortBy) {
        const { key, order } = params.sortBy;
        data.sort((a, b) => {
          let valA = a[key];
          let valB = b[key];
          
          if (typeof valA === 'string') {
            return order === 'asc' 
              ? valA.localeCompare(valB) 
              : valB.localeCompare(valA);
          } else {
            return order === 'asc' ? valA - valB : valB - valA;
          }
        });
      }

      const totalCount = data.length;
      const page = params.page || 1;
      const pageSize = params.pageSize || 10;
      const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);

      return {
        records: paginatedData,
        total: totalCount,
        page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
        overview: {
          totalRecords: 343, // total records inDATASS.csv
          totalFeatures: 23,
          missingValues: 0,
          duplicateRecords: 0,
          categoricalColumns: ['date', 'day_type', 'season', 'weather'],
          numericalColumns: [
            'arrival_hour', 'previous_patient_count', 'average_wait_time', 
            'available_beds', 'available_icu', 'available_doctors', 
            'emergency_cases', 'flu_cases', 'accident_cases', 'chronic_cases', 
            'average_age', 'average_heart_rate', 'average_oxygen_level', 
            'patient_count', 'beds_required', 'icu_required', 'doctors_required'
          ]
        }
      };
    }

    // Call backend API with search parameters
    const queryString = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/dataset?${queryString}`);
    return res.json();
  },

  // 10. AI Insight Recommendation list
  async getAIInsights() {
    if (USE_MOCK) {
      await delay(300);
      return mockData.aiRecommendations;
    }
    const res = await fetch(`${API_BASE_URL}/insights/recommendations`);
    return res.json();
  },

  // 11. Alerts notification
  async getAlerts() {
    if (USE_MOCK) {
      await delay(250);
      return mockData.alerts;
    }
    const res = await fetch(`${API_BASE_URL}/notifications/alerts`);
    return res.json();
  }
};
