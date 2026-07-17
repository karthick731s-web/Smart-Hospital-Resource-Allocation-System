import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  Settings2, 
  HelpCircle, 
  CheckCircle2, 
  Heart,
  Sliders,
  Play,
  Activity
} from 'lucide-react';
import { apiService } from '../services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadialBarChart,
  RadialBar
} from 'recharts';

export default function EmergencyRiskPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Interactive test fields
  const [inputs, setInputs] = useState({
    average_oxygen_level: 97.0,
    average_heart_rate: 78,
    emergency_cases: 3,
    average_age: 45
  });

  const [predictedResult, setPredictedResult] = useState(null);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await apiService.getLogisticRegressionStats();
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
      const res = await apiService.predictEmergencyRisk(inputs);
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

  // Gauge details for High Risk Gauge Chart using RadialBarChart
  const gaugeData = [
    { name: 'Risk Limit', value: 100, fill: '#334155/10' },
    { name: 'Risk Factor', value: predictedResult ? predictedResult.probability * 100 : 34, fill: predictedResult && predictedResult.risk_level === 'High Risk' ? '#ef4444' : '#06b6d4' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
          Logistic Regression – Emergency Risk Classification
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Delineates clinical cases into Low Risk and High Risk queues using statistical binary logit regressions.
        </p>
      </div>

      {/* Accuracy Scoring */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl glass-panel p-4 shadow-sm border bg-gradient-to-br from-hospital-brandBlue/10 to-transparent">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Model Accuracy</span>
          <span className="text-3xl font-black text-slate-850 dark:text-white tracking-tight mt-1.5 block">{(stats.accuracy * 100).toFixed(1)}%</span>
          <p className="text-[10px] text-slate-400 mt-1 font-semibold">Total correct classifications in test set</p>
        </div>

        <div className="rounded-2xl glass-panel p-4 shadow-sm border bg-gradient-to-br from-hospital-cyan/10 to-transparent">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Precision Rate</span>
          <span className="text-3xl font-black text-slate-850 dark:text-white tracking-tight mt-1.5 block">{(stats.precision * 100).toFixed(1)}%</span>
          <p className="text-[10px] text-slate-400 mt-1 font-semibold">Positive predictive score consistency</p>
        </div>

        <div className="rounded-2xl glass-panel p-4 shadow-sm border bg-gradient-to-br from-hospital-emerald/10 to-transparent">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Recall Rate (Sensitivity)</span>
          <span className="text-3xl font-black text-slate-850 dark:text-white tracking-tight mt-1.5 block">{(stats.recall * 100).toFixed(1)}%</span>
          <p className="text-[10px] text-slate-400 mt-1 font-semibold">Ability of model to capture High Risk patients</p>
        </div>

        <div className="rounded-2xl glass-panel p-4 shadow-sm border bg-gradient-to-br from-hospital-red/10 to-transparent">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">F1-Score</span>
          <span className="text-3xl font-black text-slate-850 dark:text-white tracking-tight mt-1.5 block">{(stats.f1Score * 100).toFixed(1)}%</span>
          <p className="text-[10px] text-slate-400 mt-1 font-semibold">Harmonic mean of precision and recall</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Confusion Matrix */}
        <div className="rounded-2xl glass-panel p-5 shadow-sm border flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-2">Confusion Matrix Results</h2>
            <p className="text-[9px] uppercase tracking-wider font-semibold text-slate-400 mb-4">Actual vs Predicted quadrants</p>
            
            <div className="grid grid-cols-3 gap-2 text-center text-xs mt-6">
              <div></div>
              <div className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Predict Low Risk</div>
              <div className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Predict High Risk</div>

              <div className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider py-8 flex items-center justify-center">Actual Low</div>
              <div className="bg-hospital-cyan/10 dark:bg-sky-500/10 border border-hospital-cyan/20 dark:border-sky-500/20 rounded-2xl py-8 font-black text-hospital-cyan text-xl flex flex-col items-center justify-center">
                <span>{stats.confusionMatrix[0].Predict_Low}</span>
                <span className="text-[9px] text-slate-400 mt-1 font-semibold uppercase">True Neg (TN)</span>
              </div>
              <div className="bg-hospital-red/5 dark:bg-rose-500/5 border border-hospital-red/10 dark:border-rose-500/10 rounded-2xl py-8 font-bold text-slate-500 dark:text-slate-400 text-xl flex flex-col items-center justify-center">
                <span>{stats.confusionMatrix[0].Predict_High}</span>
                <span className="text-[9px] text-slate-450 mt-1 font-semibold uppercase">False Pos (FP)</span>
              </div>

              <div className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider py-8 flex items-center justify-center">Actual High</div>
              <div className="bg-hospital-red/5 dark:bg-rose-500/5 border border-hospital-red/10 dark:border-rose-500/10 rounded-2xl py-8 font-bold text-slate-500 dark:text-slate-400 text-xl flex flex-col items-center justify-center">
                <span>{stats.confusionMatrix[1].Predict_Low}</span>
                <span className="text-[9px] text-slate-450 mt-1 font-semibold uppercase">False Neg (FN)</span>
              </div>
              <div className="bg-hospital-red/20 dark:bg-rose-500/20 border border-hospital-red/30 dark:border-rose-500/30 rounded-2xl py-8 font-black text-hospital-red text-xl flex flex-col items-center justify-center">
                <span>{stats.confusionMatrix[1].Predict_High}</span>
                <span className="text-[9px] text-slate-400 mt-1 font-semibold uppercase">True Pos (TP)</span>
              </div>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold block text-center mt-6">Metrics derived from validation segment containing 69 patient vectors.</span>
        </div>

        {/* Probability Bar Chart */}
        <div className="rounded-2xl glass-panel p-5 shadow-sm border">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">Patient Risk Probabilities</h2>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.probabilityBarChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="dark:opacity-10" />
                <XAxis dataKey="id" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 1]} tickFormatter={(v) => `${(v * 100)}%`} />
                <Tooltip formatter={(v) => [`${(v * 100).toFixed(0)}%`, "Probability"]} />
                <Bar dataKey="prob" radius={[6, 6, 0, 0]}>
                  {stats.probabilityBarChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.prob > 0.5 ? '#ef4444' : '#0284c7'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <span className="text-[9px] text-slate-400 font-semibold block text-center mt-2">Red columns represent patients flagged as High Risk (probability threshold &gt; 0.5)</span>
        </div>

        {/* Risk Distribution Pie Chart */}
        <div className="rounded-2xl glass-panel p-5 shadow-sm border flex flex-col justify-between">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">Overall Risk Distribution</h2>
          <div className="h-64 sm:h-72 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={stats.riskDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={5}
                >
                  {stats.riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <span className="text-[9px] text-slate-400 font-semibold block text-center mt-2">Aggregated risk categories from active hospital cohort</span>
        </div>

        {/* Interactive Risk Predictor Form & Gauge Indicator */}
        <div className="rounded-2xl glass-panel p-5 shadow-sm border flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-hospital-cyan" /> Patient Risk Diagnostics
            </h2>
            <p className="text-[9px] uppercase tracking-wider font-semibold text-slate-400 mb-4">Submit clinical vitals to classify emergency priority</p>
            
            <form onSubmit={handlePredict} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Oxygen Level range */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Oxygen Saturation O₂</span>
                  <span className={`font-bold ${inputs.average_oxygen_level < 94 ? 'text-hospital-red' : 'text-hospital-emerald'}`}>{inputs.average_oxygen_level}%</span>
                </div>
                <input 
                  type="range" min="88" max="100" step="0.5" 
                  value={inputs.average_oxygen_level} 
                  onChange={(e) => setInputs({...inputs, average_oxygen_level: parseFloat(e.target.value)})}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-hospital-red" 
                />
              </div>

              {/* Heart rate range */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Heart Rate (BPM)</span>
                  <span className="font-bold text-hospital-brandBlue">{inputs.average_heart_rate} bpm</span>
                </div>
                <input 
                  type="range" min="50" max="140" 
                  value={inputs.average_heart_rate} 
                  onChange={(e) => setInputs({...inputs, average_heart_rate: parseInt(e.target.value)})}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-hospital-brandBlue" 
                />
              </div>

              {/* Emergency Department load */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Active Emergencies</span>
                  <span className="font-bold text-hospital-cyan">{inputs.emergency_cases} cases</span>
                </div>
                <input 
                  type="range" min="0" max="15" 
                  value={inputs.emergency_cases} 
                  onChange={(e) => setInputs({...inputs, emergency_cases: parseInt(e.target.value)})}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-hospital-cyan" 
                />
              </div>

              {/* Age slider */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Patient Age</span>
                  <span className="font-bold text-slate-600 dark:text-slate-300">{inputs.average_age} yrs</span>
                </div>
                <input 
                  type="range" min="5" max="95" 
                  value={inputs.average_age} 
                  onChange={(e) => setInputs({...inputs, average_age: parseInt(e.target.value)})}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-slate-500" 
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={predicting}
                  className="w-full flex items-center justify-center gap-1.5 bg-hospital-brandBlue text-white hover:bg-hospital-brandBlue/90 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-hospital-brandBlue/20"
                >
                  <Play className="w-3.5 h-3.5 fill-white" /> {predicting ? "Running Classifier..." : "Analyze Vitals"}
                </button>
              </div>
            </form>
          </div>

          {/* Results Output */}
          {predictedResult && (
            <div className={`mt-4 p-4 rounded-xl border text-left animate-counter flex items-center justify-between ${
              predictedResult.risk_level === 'High Risk'
                ? 'bg-red-500/10 border-red-500/30'
                : 'bg-emerald-500/10 border-emerald-500/30'
            }`}>
              <div>
                <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest leading-none block">Classification Result</span>
                <span className={`text-2xl font-black tracking-tight mt-1.5 block leading-none ${
                  predictedResult.risk_level === 'High Risk' ? 'text-hospital-red' : 'text-hospital-emerald'
                }`}>
                  {predictedResult.risk_level}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold mt-1 block">
                  Probability: {(predictedResult.probability * 100).toFixed(0)}% | Accuracy: {(predictedResult.model_accuracy * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-12 h-12 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart innerRadius="60%" outerRadius="100%" barSize={10} data={[{ value: predictedResult.probability * 100 }]}>
                    <RadialBar 
                      minAngle={15} 
                      clockWise 
                      dataKey="value" 
                      fill={predictedResult.risk_level === 'High Risk' ? '#ef4444' : '#10b981'} 
                      background={{ fill: '#e2e8f0' }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
