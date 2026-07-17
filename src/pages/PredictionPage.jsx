import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Settings2, 
  HelpCircle, 
  PieChart as PieIcon, 
  CheckCircle2, 
  TrendingUp,
  Sliders,
  Play
} from 'lucide-react';
import { apiService } from '../services/api';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis,
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  ReferenceLine
} from 'recharts';

export default function PredictionPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Interactive Sandbox fields
  const [inputs, setInputs] = useState({
    previous_patient_count: 50,
    arrival_hour: 12,
    average_wait_time: 25,
    day_type: "Weekday",
    season: "Winter",
    weather: "Clear",
    average_age: 45,
    average_oxygen_level: 97.0
  });

  const [predictedResult, setPredictedResult] = useState(null);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await apiService.getLinearRegressionStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const handlePredict = async (e) => {
    e.preventDefault();
    setPredicting(true);
    try {
      const res = await apiService.predictPatientCount(inputs);
      setPredictedResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setPredicting(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-hospital-brandBlue/10"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-hospital-brandBlue animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
          Linear Regression – Patient Demand Forecasting
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Quantifies arrival density matrices relative to local microclimatic and operational indicators.
        </p>
      </div>

      {/* Model Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl glass-panel p-4 shadow-sm border bg-gradient-to-br from-hospital-brandBlue/10 to-transparent">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Root Mean Squared Error</span>
          <span className="text-3xl font-black text-slate-850 dark:text-white tracking-tight mt-1.5 block">{stats.rmse.toFixed(3)}</span>
          <p className="text-[10px] text-slate-400 mt-1 font-semibold">Average predicted deviation (lower is optimal)</p>
        </div>

        <div className="rounded-2xl glass-panel p-4 shadow-sm border bg-gradient-to-br from-hospital-cyan/10 to-transparent">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">R² Score (Coefficient of Det.)</span>
          <span className="text-3xl font-black text-slate-850 dark:text-white tracking-tight mt-1.5 block">{stats.r2Score.toFixed(4)}</span>
          <p className="text-[10px] text-slate-400 mt-1 font-semibold">Variance proportion captured by the models</p>
        </div>

        <div className="rounded-2xl glass-panel p-4 shadow-sm border bg-gradient-to-br from-hospital-emerald/10 to-transparent">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Model Status</span>
          <span className="text-sm font-bold text-hospital-emerald mt-2 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 inline-block">
            ACTIVE & OPTIMIZED
          </span>
          <p className="text-[10px] text-slate-400 mt-2 font-semibold">Scikit-learn model saved as linear_regression.pkl</p>
        </div>

        <div className="rounded-2xl glass-panel p-4 shadow-sm border bg-gradient-to-br from-hospital-red/10 to-transparent">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Evaluation Sample Count</span>
          <span className="text-3xl font-black text-slate-850 dark:text-white tracking-tight mt-1.5 block">{stats.testSamples}</span>
          <p className="text-[10px] text-slate-400 mt-1 font-semibold">20% test-split rows checked from historical logs</p>
        </div>
      </div>

      {/* Main Plots Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Actual vs Predicted Scatter */}
        <div className="rounded-2xl glass-panel p-5 shadow-sm border">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">Actual vs Predicted Scatter Plot</h2>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155/10" className="dark:opacity-20" />
                <XAxis type="number" dataKey="actual" name="Actual Patient Count" stroke="#94a3b8" fontSize={10} />
                <YAxis type="number" dataKey="predicted" name="Predicted Patient Count" stroke="#94a3b8" fontSize={10} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter data={stats.actualVsPredictedScatter} fill="#0284c7" />
                {/* 45 degree line */}
                <ReferenceLine segment={[{ x: 10, y: 10 }, { x: 70, y: 70 }]} stroke="#ef4444" strokeDasharray="3 3" strokeWidth={1.5} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <span className="text-[9px] text-slate-400 font-semibold block text-center mt-2">Red Line represents a perfect model forecast (y = x)</span>
        </div>

        {/* Prediction Trend Line */}
        <div className="rounded-2xl glass-panel p-5 shadow-sm border">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">Prediction Trend Line Comparison</h2>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.predictionTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="dark:opacity-10" />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip />
                <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Actual" />
                <Line type="monotone" dataKey="predicted" stroke="#06b6d4" strokeWidth={2} strokeDasharray="5 5" name="Predicted" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <span className="text-[9px] text-slate-400 font-semibold block text-center mt-2">Active trends mapped over 2-hour interval segments</span>
        </div>

        {/* Error distribution histogram */}
        <div className="rounded-2xl glass-panel p-5 shadow-sm border">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">Model Prediction Error Distribution</h2>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.errorDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="dark:opacity-10" />
                <XAxis dataKey="errorRange" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]}>
                  {stats.errorDistribution.map((entry, index) => (
                    <ReferenceLine key={index} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <span className="text-[9px] text-slate-400 font-semibold block text-center mt-2">Variance residuals showing high bell curve consistency around zero error</span>
        </div>

        {/* Interactive Predictive Sandbox */}
        <div className="rounded-2xl glass-panel p-5 shadow-sm border flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-hospital-cyan" /> Predictive Sandbox
            </h2>
            <p className="text-[9px] uppercase tracking-wider font-semibold text-slate-400 mb-4">Adjust features to project realtime hospital load</p>
            
            <form onSubmit={handlePredict} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Previous Patient Count slider */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Previous Patients</span>
                  <span className="font-bold text-hospital-brandBlue">{inputs.previous_patient_count}</span>
                </div>
                <input 
                  type="range" min="10" max="100" 
                  value={inputs.previous_patient_count} 
                  onChange={(e) => setInputs({...inputs, previous_patient_count: parseInt(e.target.value)})}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-hospital-brandBlue" 
                />
              </div>

              {/* Waiting time slider */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Average Delay Time</span>
                  <span className="font-bold text-hospital-cyan">{inputs.average_wait_time}m</span>
                </div>
                <input 
                  type="range" min="5" max="60" 
                  value={inputs.average_wait_time} 
                  onChange={(e) => setInputs({...inputs, average_wait_time: parseInt(e.target.value)})}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-hospital-cyan" 
                />
              </div>

              {/* Hour input slider */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Arrival Hour</span>
                  <span className="font-bold text-hospital-brandBlue">{inputs.arrival_hour}:00</span>
                </div>
                <input 
                  type="range" min="0" max="23" 
                  value={inputs.arrival_hour} 
                  onChange={(e) => setInputs({...inputs, arrival_hour: parseInt(e.target.value)})}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-hospital-brandBlue" 
                />
              </div>

              {/* Patient Oxygen slider */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Avg Patient O₂</span>
                  <span className="font-bold text-hospital-emerald">{inputs.average_oxygen_level}%</span>
                </div>
                <input 
                  type="range" min="90" max="100" step="0.5" 
                  value={inputs.average_oxygen_level} 
                  onChange={(e) => setInputs({...inputs, average_oxygen_level: parseFloat(e.target.value)})}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-hospital-emerald" 
                />
              </div>

              {/* Day dropdown */}
              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Day Type</label>
                <select 
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-850 border border-slate-200/50 dark:border-slate-800/50 text-slate-700 dark:text-slate-200 focus:outline-none"
                  value={inputs.day_type}
                  onChange={(e) => setInputs({...inputs, day_type: e.target.value})}
                >
                  <option value="Weekday">Weekday</option>
                  <option value="Weekend">Weekend</option>
                </select>
              </div>

              {/* Weather dropdown */}
              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Weather Condition</label>
                <select 
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-850 border border-slate-200/50 dark:border-slate-800/50 text-slate-700 dark:text-slate-200 focus:outline-none"
                  value={inputs.weather}
                  onChange={(e) => setInputs({...inputs, weather: e.target.value})}
                >
                  <option value="Clear">Clear</option>
                  <option value="Rainy">Rainy</option>
                  <option value="Snowy">Snowy</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={predicting}
                  className="w-full flex items-center justify-center gap-1.5 bg-hospital-brandBlue text-white hover:bg-hospital-brandBlue/90 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-hospital-brandBlue/20"
                >
                  <Play className="w-3.5 h-3.5 fill-white" /> {predicting ? "Running LR Engine..." : "Submit Model Inquiry"}
                </button>
              </div>
            </form>
          </div>

          {/* Results Output */}
          {predictedResult && (
            <div className="mt-4 p-4 rounded-xl border border-hospital-cyan/30 bg-hospital-cyan/5 text-left animate-counter">
              <span className="text-[10px] font-bold text-hospital-cyan uppercase tracking-widest">Model Regression Forecast</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-slate-800 dark:text-white leading-none">
                  {predictedResult.predicted_patient_count} Patients
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  (95% CI: {predictedResult.confidence_interval[0]} - {predictedResult.confidence_interval[1]})
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-hospital-emerald" /> Linear regression weights successfully applied to inputs.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
