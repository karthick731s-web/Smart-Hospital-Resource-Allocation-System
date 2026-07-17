import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Network, 
  GitCommit, 
  ChevronRight, 
  CheckCircle,
  TrendingUp, 
  Layout, 
  AlertTriangle,
  Play,
  FileMinus,
  Sparkles
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
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend
} from 'recharts';

export default function ResourceAllocationPage() {
  const [dtStats, setDtStats] = useState(null);
  const [rfStats, setRfStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tree'); // 'tree' or 'forest'

  // Input states for immediate resource evaluation
  const [inputs, setInputs] = useState({
    patient_count: 50,
    emergency_cases: 5
  });

  const [predictedRes, setPredictedRes] = useState(null);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [dtData, rfData] = await Promise.all([
          apiService.getDecisionTreeStats(),
          apiService.getRandomForestStats()
        ]);
        setDtStats(dtData);
        setRfStats(rfData);
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
      const res = await apiService.predictResourceRequirements(inputs);
      setPredictedRes(res);
    } catch (err) {
      console.error(err);
    } finally {
      setPredicting(false);
    }
  };

  if (loading || !dtStats || !rfStats) {
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            Resource Allocation – Predictive Modeling
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Projects required clinical assets using Decision Tree and aggregates future volume demand using Random Forest.
          </p>
        </div>
        
        {/* Toggle tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-850 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800/60 shadow-inner">
          <button
            onClick={() => setActiveTab('tree')}
            className={`px-4 py-2 font-bold text-xs uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'tree' 
                ? 'bg-white dark:bg-slate-800 shadow-sm text-hospital-brandBlue' 
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            Decision Tree
          </button>
          <button
            onClick={() => setActiveTab('forest')}
            className={`px-4 py-2 font-bold text-xs uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'forest' 
                ? 'bg-white dark:bg-slate-800 shadow-sm text-hospital-brandBlue' 
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            Random Forest
          </button>
        </div>
      </div>

      {activeTab === 'tree' ? (
        // ----------------------------------------------------
        // DECISION TREE TAB
        // ----------------------------------------------------
        <div className="space-y-6">
          
          {/* Accuracy header cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-2xl glass-panel p-4 shadow-sm border bg-gradient-to-br from-hospital-brandBlue/10 to-transparent">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-sans">Decision Tree Accuracy</span>
              <span className="text-3xl font-black text-slate-850 dark:text-white tracking-tight mt-1.5 block">{(dtStats.accuracy * 100).toFixed(1)}%</span>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">Asset prediction correctness limits</p>
            </div>
            
            <div className="rounded-2xl glass-panel p-4 shadow-sm border bg-gradient-to-br from-hospital-cyan/10 to-transparent">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Available General Beds</span>
              <span className="text-3xl font-black text-slate-850 dark:text-white tracking-tight mt-1.5 block">24</span>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">Current empty ward units</p>
            </div>

            <div className="rounded-2xl glass-panel p-4 shadow-sm border bg-gradient-to-br from-hospital-emerald/10 to-transparent">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Available ICU Beds</span>
              <span className="text-3xl font-black text-slate-850 dark:text-white tracking-tight mt-1.5 block">6</span>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold font-sans">Active Critical unit safety reserves</p>
            </div>

            <div className="rounded-2xl glass-panel p-4 shadow-sm border bg-gradient-to-br from-hospital-red/10 to-transparent">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Active Rostered Doctors</span>
              <span className="text-3xl font-black text-slate-850 dark:text-white tracking-tight mt-1.5 block">14</span>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">Clinicians on duty for the hour</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Resource allocation demands bar chart */}
            <div className="lg:col-span-2 rounded-2xl glass-panel p-5 shadow-sm border">
              <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">Required Hospital Resources vs Available</h2>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dtStats.hospitalRequirements} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="dark:opacity-10" />
                    <XAxis dataKey="department" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="current" fill="#10b981" radius={[4, 4, 0, 0]} name="Current Available" />
                    <Bar dataKey="required" fill="#0284c7" radius={[4, 4, 0, 0]} name="Required Demand" />
                    <Bar dataKey="deficit" fill="#ef4444" radius={[4, 4, 0, 0]} name="Asset Deficit Margin" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sandbox tester */}
            <div className="rounded-2xl glass-panel p-5 shadow-sm border flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Network className="w-4 h-4 text-hospital-cyan animate-pulse" /> Resource Allocation Calculator
                </h2>
                <p className="text-[9px] uppercase tracking-wider font-semibold text-slate-400 mb-4">Estimate resources based on caseloads</p>

                <form onSubmit={handlePredict} className="space-y-4">
                  
                  {/* Patients count input */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">Total Patient Cohort</span>
                      <span className="font-bold text-hospital-brandBlue">{inputs.patient_count} patients</span>
                    </div>
                    <input 
                      type="range" min="10" max="150" 
                      value={inputs.patient_count} 
                      onChange={(e) => setInputs({...inputs, patient_count: parseInt(e.target.value)})}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-hospital-brandBlue" 
                    />
                  </div>

                  {/* Emergencies caseload slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">Emergency Case Volume</span>
                      <span className="font-bold text-hospital-cyan">{inputs.emergency_cases} cases</span>
                    </div>
                    <input 
                      type="range" min="0" max="25" 
                      value={inputs.emergency_cases} 
                      onChange={(e) => setInputs({...inputs, emergency_cases: parseInt(e.target.value)})}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-hospital-cyan" 
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={predicting}
                    className="w-full py-2 bg-hospital-brandBlue text-white hover:bg-hospital-brandBlue/90 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" /> Compute Reserves
                  </button>
                </form>
              </div>

              {predictedRes && (
                <div className="mt-4 p-4 rounded-xl border border-hospital-cyan/30 bg-hospital-cyan/5 text-left animate-counter space-y-2">
                  <span className="text-[10px] font-bold text-hospital-cyan uppercase tracking-widest leading-none block">Required Clinical Assets</span>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold mt-1">
                    <div className="p-2 border border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 rounded-lg">
                      <span className="text-[9px] text-slate-400 block uppercase font-medium">Beds</span>
                      <span className="text-sm font-black text-slate-800 dark:text-white">{predictedRes.beds_required}</span>
                    </div>
                    <div className="p-2 border border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 rounded-lg">
                      <span className="text-[9px] text-slate-400 block uppercase font-medium">ICU</span>
                      <span className="text-sm font-black text-slate-800 dark:text-white">{predictedRes.icu_required}</span>
                    </div>
                    <div className="p-2 border border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 rounded-lg">
                      <span className="text-[9px] text-slate-400 block uppercase font-medium">Doctors</span>
                      <span className="text-sm font-black text-slate-800 dark:text-white">{predictedRes.doctors_required}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Feature Importance */}
            <div className="rounded-2xl glass-panel p-5 shadow-sm border">
              <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">Decision Tree Feature Importance Gini</h2>
              <div className="h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={dtStats.featureImportance} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="dark:opacity-10" />
                    <XAxis type="number" stroke="#94a3b8" fontSize={10} />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={120} />
                    <Tooltip formatter={(v) => [`${(v * 100).toFixed(0)}%`, "Feature weight"]} />
                    <Bar dataKey="score" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tree Structure visualization */}
            <div className="rounded-2xl glass-panel p-5 shadow-sm border text-left">
              <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">Tree Node Splitting Scheme</h2>
              
              <div className="space-y-4 font-sans text-xs">
                {/* Node visual box */}
                <div className="p-3 border border-hospital-brandBlue/35 bg-hospital-brandBlue/5 rounded-xl">
                  <span className="text-[9px] font-extrabold text-hospital-brandBlue uppercase tracking-wider">Root Node Splitting Condition</span>
                  <p className="font-bold text-slate-800 dark:text-white mt-0.5">{dtStats.treeStructure.name}</p>
                </div>
                
                {/* Arrows */}
                <div className="pl-6 border-l-2 border-dashed border-slate-300 dark:border-slate-800 space-y-4">
                  
                  {/* Left branch */}
                  <div className="space-y-1 relative">
                    <ChevronRight className="absolute -left-6.5 top-0.5 w-4 h-4 text-emerald-500" />
                    <span className="text-[9px] font-extrabold uppercase text-emerald-500">True Branch</span>
                    <div className="p-2.5 border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/40 rounded-lg">
                      <p className="font-semibold text-slate-700 dark:text-slate-350">{dtStats.treeStructure.yes.name}</p>
                      <ul className="list-disc pl-4 text-[10px] text-slate-400 font-semibold space-y-1 mt-1 uppercase">
                        <li>YES: {dtStats.treeStructure.yes.yes}</li>
                        <li>NO: {dtStats.treeStructure.yes.no}</li>
                      </ul>
                    </div>
                  </div>

                  {/* Right branch */}
                  <div className="space-y-1 relative">
                    <ChevronRight className="absolute -left-6.5 top-0.5 w-4 h-4 text-red-500" />
                    <span className="text-[9px] font-extrabold uppercase text-red-500">False Branch (Safe Path)</span>
                    <div className="p-2.5 border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/40 rounded-lg">
                      <p className="font-semibold text-slate-700 dark:text-slate-350">{dtStats.treeStructure.no.name}</p>
                      <ul className="list-disc pl-4 text-[10px] text-slate-400 font-semibold space-y-1 mt-1 uppercase">
                        <li>YES: {dtStats.treeStructure.no.yes}</li>
                        <li>NO: {dtStats.treeStructure.no.no}</li>
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      ) : (
        // ----------------------------------------------------
        // RANDOM FOREST TAB
        // ----------------------------------------------------
        <div className="space-y-6 animate-counter text-left">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-2xl glass-panel p-4 shadow-sm border bg-gradient-to-br from-hospital-brandBlue/10 to-transparent">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-sans">Ensemble RMSE Error</span>
              <span className="text-3xl font-black text-slate-850 dark:text-white tracking-tight mt-1.5 block">{rfStats.rmse.toFixed(3)}</span>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">Lower residuals compared to single Decision Tree</p>
            </div>

            <div className="rounded-2xl glass-panel p-4 shadow-sm border bg-gradient-to-br from-hospital-cyan/10 to-transparent">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Forest R² Variance Score</span>
              <span className="text-3xl font-black text-slate-850 dark:text-white tracking-tight mt-1.5 block">{rfStats.r2Score.toFixed(4)}</span>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">Accuracy fit on testing split sets</p>
            </div>

            <div className="rounded-2xl glass-panel p-4 shadow-sm border bg-gradient-to-br from-hospital-emerald/10 to-transparent">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Aggregated Decision Trees</span>
              <span className="text-3xl font-black text-slate-850 dark:text-white tracking-tight mt-1.5 block">100</span>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">Independent estimators in forest voter pool</p>
            </div>

            <div className="rounded-2xl glass-panel p-4 shadow-sm border bg-gradient-to-br from-hospital-red/10 to-transparent">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Estimated Load Tomorrow</span>
              <span className="text-3xl font-black text-slate-850 dark:text-white tracking-tight mt-1.5 block">87</span>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">Mean patient predictor count</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-counter">
            
            {/* Future Demand Forecast Trend */}
            <div className="lg:col-span-2 rounded-2xl glass-panel p-5 shadow-sm border">
              <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">7-Day Outpatient Demand Trend Forecast</h2>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={rfStats.demandForecastTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity="0.3"/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity="0"/>
                      </linearGradient>
                      <linearGradient id="colorActualRF" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity="0.3"/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="dark:opacity-10" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorActualRF)" name="Actual Patient Count" />
                    <Area type="monotone" dataKey="forecasted" stroke="#06b6d4" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorForecast)" name="Forest Projected Count" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Feature Importance Random Forest */}
            <div className="rounded-2xl glass-panel p-5 shadow-sm border flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">Random Forest Feature Importance</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={rfStats.featureImportance} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="dark:opacity-10" />
                      <XAxis type="number" stroke="#94a3b8" fontSize={10} />
                      <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={110} />
                      <Tooltip formatter={(v) => [`${(v * 100).toFixed(0)}%`, "Feature weight"]} />
                      <Bar dataKey="score" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <span className="text-[9px] text-slate-400 font-semibold block text-center mt-2">Importance derived from Mean Decrease Impurity (MDI).</span>
            </div>

          </div>

          {/* Random Forest Error Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl glass-panel p-5 shadow-sm border">
              <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">Ensemble Prediction Error Histogram</h2>
              <div className="h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rfStats.predictionErrorHistogram} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="dark:opacity-10" />
                    <XAxis dataKey="bin" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#818cf8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <span className="text-[9px] text-slate-400 font-semibold block text-center mt-2">Tighter, narrower error ranges demonstrate forest model superiority or lower variance.</span>
            </div>
            
            {/* AI Insights Card for Forest Forecast */}
            <div className="rounded-2xl glass-panel p-5 shadow-sm border bg-gradient-to-br from-hospital-brandBlue/5 to-transparent flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-hospital-cyan uppercase tracking-widest block">AI Forecast Insights</span>
                <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight mt-1">Winter Capacity Warnings</h3>
                <p className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed mt-3">
                  Historical seasonality patterns indicate that the upcoming days will exceed the 80 patients mark, mostly driven by higher accident and flu caseloads.
                </p>
                <div className="mt-4 space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-350">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-hospital-red"></div> Average ward deficit will increase by index 5.1</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-hospital-cyan"></div> ICU admissions peak expected between 19:00 - 23:00</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-hospital-emerald"></div> Current duty doctor levels (14) must increase to (18)</div>
                </div>
              </div>
              <span className="text-[9px] text-slate-400 font-semibold mt-4">Random forest predictions updated daily.</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
