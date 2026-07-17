import React, { useState } from 'react';
import { 
  Database, 
  BellRing, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function SettingsPage() {
  const [apiUrl, setApiUrl] = useState("http://localhost:5000/api");
  const [modelMode, setModelMode] = useState("mock");
  const [thresholds, setThresholds] = useState({
    maxWait: 30,
    minBeds: 20,
    minIcu: 8
  });
  
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl text-left">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
          System Configuration & Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Manage backend endpoints, set vital alert levels, and customize analytical weights.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Setup forms panel */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="rounded-2xl glass-panel p-5 shadow-sm border space-y-5">
            <h2 className="text-sm font-bold text-slate-855 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-205/50 dark:border-slate-800/80 pb-3">
              <Database className="w-4 h-4 text-hospital-cyan" /> Backend Integration Setup
            </h2>

            {/* Flask API config */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-550 dark:text-slate-405 uppercase tracking-wide block">
                Flask API Base URL
              </label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-840 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none focus:ring-1 focus:ring-hospital-brandBlue text-slate-800 dark:text-slate-100"
                placeholder="http://localhost:5000/api"
              />
              <span className="text-[10px] text-slate-455 font-medium leading-normal block">
                Once your Python Flask server is running locally, toggle API Mode to Live and enter the address.
              </span>
            </div>

            {/* Model Mode select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-550 dark:text-slate-405 uppercase block">
                API Data Source Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setModelMode("mock")}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    modelMode === "mock"
                      ? 'border-hospital-brandBlue bg-hospital-brandBlue/10 text-hospital-brandBlue font-bold'
                      : 'border-slate-200/50 dark:border-slate-800/50 text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
                  }`}
                >
                  <span className="text-xs uppercase tracking-wider block">Mock JSON Mode</span>
                  <span className="text-[9px] font-medium opacity-70 block mt-0.5">Loads local dataset & models stats</span>
                </button>

                <button
                  type="button"
                  onClick={() => setModelMode("live")}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    modelMode === "live"
                      ? 'border-hospital-brandBlue bg-hospital-brandBlue/10 text-hospital-brandBlue font-bold'
                      : 'border-slate-200/50 dark:border-slate-800/50 text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
                  }`}
                >
                  <span className="text-xs uppercase tracking-wider block">Live Flask Mode</span>
                  <span className="text-[9px] font-medium opacity-70 block mt-0.5">Queries real ML pipelines on server</span>
                </button>
              </div>
            </div>

            <h2 className="text-sm font-bold text-slate-855 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-205/50 dark:border-slate-800/80 pb-3 pt-4">
              <BellRing className="w-4 h-4 text-hospital-red" /> Clinical Caseload Alerts triggers
            </h2>

            {/* Triage limits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase">Max Wait (Mins)</label>
                <input
                  type="number"
                  value={thresholds.maxWait}
                  onChange={(e) => setThresholds({...thresholds, maxWait: parseInt(e.target.value)})}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase">Min General Beds</label>
                <input
                  type="number"
                  value={thresholds.minBeds}
                  onChange={(e) => setThresholds({...thresholds, minBeds: parseInt(e.target.value)})}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase">Min ICU Beds</label>
                <input
                  type="number"
                  value={thresholds.minIcu}
                  onChange={(e) => setThresholds({...thresholds, minIcu: parseInt(e.target.value)})}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/50 dark:border-slate-800/50 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-202/50 dark:border-slate-800/80 flex items-center justify-between">
              {saved && (
                <span className="text-emerald-500 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5 animate-counter">
                  <CheckCircle className="w-4 h-4" /> Parameters saved successfully.
                </span>
              )}
              <div className="flex-1"></div>
              <button
                type="submit"
                className="bg-hospital-brandBlue text-white hover:bg-hospital-brandBlue/90 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-hospital-brandBlue/20"
              >
                Apply Parameters
              </button>
            </div>

          </form>
        </div>

        {/* Info panel */}
        <div className="space-y-6 text-left">
          <div className="rounded-2xl glass-panel p-5 shadow-sm border space-y-4">
            <span className="text-[10px] font-bold text-hospital-cyan uppercase tracking-widest block">Dashboard Status</span>
            <h3 className="text-sm font-bold text-slate-805 dark:text-white uppercase tracking-wider">Clinical Telemetry Nodes</h3>
            
            <div className="space-y-3 font-sans text-xs">
              <div className="flex justify-between items-center text-left">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Dashboard Build</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">v1.12.0 Stable</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Algorithm Engine</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Scikit-Learn 1.4+</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Telemetry pipeline</span>
                <span className="font-bold text-emerald-500">Connected (Mock)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">User Role Credentials</span>
                <span className="font-bold text-indigo-500 uppercase">SYS_ADMIN</span>
              </div>
            </div>
            
            <div className="border-t border-slate-200/50 dark:border-slate-800/80 pt-4 flex gap-2 text-xs font-semibold text-slate-500 leading-relaxed text-left">
              <HelpCircle className="w-12 h-12 text-slate-400 flex-shrink-0" />
              <p className="text-[10px]">
                To route requests to Python Flask backend, modify the imports in <code className="font-mono text-hospital-cyan">api.js</code> to use the Flask router logic. Make sure CORS is allowed in your Python codebase.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
