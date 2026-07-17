import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './layout/Navbar';
import Sidebar from './layout/Sidebar';
import Dashboard from './pages/Dashboard';
import PredictionPage from './pages/PredictionPage';
import EmergencyRiskPage from './pages/EmergencyRiskPage';
import ResourceAllocationPage from './pages/ResourceAllocationPage';
import SimilarPatientPage from './pages/SimilarPatientPage';
import PatientSegmentationPage from './pages/PatientSegmentationPage';
import PcaAnalysisPage from './pages/PcaAnalysisPage';
import DatasetAnalyticsPage from './pages/DatasetAnalyticsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <Router>
      <div className="min-h-screen text-slate-800 dark:text-slate-100 bg-hospital-lightBg dark:bg-slate-950 transition-colors duration-200">
        {/* Top Header Navbar */}
        <Navbar />

        {/* Outer Layout containing Sidebar & Main Panel */}
        <div className="flex pt-16">
          {/* Sidebar */}
          <Sidebar collapsed={sidebarCollapsed} toggleCollapsed={toggleSidebar} />

          {/* Main Content Area */}
          <main 
            className={`flex-1 min-h-[calc(100vh-4rem)] p-6 transition-all duration-300 ${
              sidebarCollapsed ? 'ml-16' : 'ml-64'
            }`}
          >
            <div className="mx-auto max-w-7xl">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/prediction" element={<PredictionPage />} />
                <Route path="/risk" element={<EmergencyRiskPage />} />
                <Route path="/resources" element={<ResourceAllocationPage />} />
                <Route path="/similar" element={<SimilarPatientPage />} />
                <Route path="/segmentation" element={<PatientSegmentationPage />} />
                <Route path="/pca" element={<PcaAnalysisPage />} />
                <Route path="/dataset" element={<DatasetAnalyticsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                
                {/* Fallback routing */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            
            {/* Footer */}
            <footer className="mt-16 py-6 border-t border-slate-200/50 dark:border-slate-800/80 text-center text-xs text-slate-500 font-semibold uppercase tracking-wider">
              <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto gap-4">
                <span>Smart Hospital Resource Allocation System</span>
                <div className="flex gap-4">
                  <span>React + Vite</span>
                  <span>Tailwind CSS</span>
                  <span>Python Scikit-Learn</span>
                  <span>Flask</span>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </Router>
  );
}
