import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Clock, 
  ShieldAlert, 
  HelpCircle,
  BarChart, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { apiService } from '../services/api';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';

export default function PatientSegmentationPage() {
  const [kmeansStats, setKmeansStats] = useState(null);
  const [pcaStats, setPcaStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [kmeansData, pcaData] = await Promise.all([
          apiService.getKMeansStats(),
          apiService.getPCAStats()
        ]);
        setKmeansStats(kmeansData);
        setPcaStats(pcaData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading || !kmeansStats || !pcaStats) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-hospital-brandBlue/10"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-hospital-brandBlue animate-spin"></div>
        </div>
      </div>
    );
  }

  // Map cluster descriptions for summary cards
  const clusterMeta = {
    "Cluster 1": { 
      desc: "Emergency admissions, extreme wait times, severe vital signatures requiring fast bed and surgeon assignments.", 
      gradient: "from-red-500/20 to-pink-500/5", 
      border: "border-red-500/20"
    },
    "Cluster 2": { 
      desc: "Mild flu, simple injury, short outpatient care without major surgical or ventilator needs.", 
      gradient: "from-emerald-500/20 to-teal-500/5", 
      border: "border-emerald-500/20"
    },
    "Cluster 3": { 
      desc: "Chronic conditions, routine follow-up consultations. Moderately consistent waiting cycles.", 
      gradient: "from-cyan-500/20 to-blue-500/5", 
      border: "border-cyan-500/20"
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
          K-Means Clustering – Patient Segmentation
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Partitions the caseload directory into homogeneous groupings for targeted triage routing.
        </p>
      </div>

      {/* Cluster Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kmeansStats.clusters.map((cluster) => {
          const meta = clusterMeta[`Cluster ${cluster.id}`];
          return (
            <div 
              key={cluster.id}
              className={`rounded-2xl border p-4 bg-gradient-to-br ${meta.gradient} ${meta.border} backdrop-blur-sm shadow-sm flex flex-col justify-between h-56 text-left`}
            >
              <div>
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/70 dark:bg-slate-800/70 shadow-sm border text-slate-655 dark:text-slate-350 inline-block">
                  CLUSTER {cluster.id} GROUP
                </span>
                
                <h3 className="text-base font-black text-slate-800 dark:text-white mt-3 select-none">
                  {cluster.name}
                </h3>
                <p className="text-[11px] text-slate-405 dark:text-slate-400 font-medium mt-1.5 leading-relaxed">
                  {meta.desc}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-1 border-t border-slate-200/50 dark:border-slate-800/50 pt-3 mt-4 text-center font-semibold">
                <div>
                  <span className="text-[8px] text-slate-405 block uppercase">Patients</span>
                  <span className="text-sm font-black text-slate-800 dark:text-white">{cluster.patientCount}</span>
                </div>
                <div>
                  <span className="text-[8px] text-slate-405 block uppercase">Wait Time</span>
                  <span className="text-sm font-black text-slate-800 dark:text-white">{cluster.avgWaitTime}m</span>
                </div>
                <div>
                  <span className="text-[8px] text-slate-405 block uppercase">Emergencies</span>
                  <span className="text-sm font-black text-slate-800 dark:text-white">{cluster.emergencyCases}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PCA Clustered Scatter Plot */}
        <div className="lg:col-span-2 rounded-2xl glass-panel p-5 shadow-sm border text-left">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Patient Clusters projected in PCA Space</h2>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">2D Coordinate Loadings (PC1 vs PC2)</p>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-hospital-brandBlue/10 text-hospital-brandBlue uppercase">k=3 Clusters</span>
          </div>
          
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="dark:opacity-10" />
                <XAxis type="number" dataKey="PC1" name="PC1 Loading" stroke="#94a3b8" fontSize={10} label={{ value: 'Principal Component 1 (PC1)', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#64748b' }} />
                <YAxis type="number" dataKey="PC2" name="PC2 Loading" stroke="#94a3b8" fontSize={10} label={{ value: 'Principal Component 2 (PC2)', angle: -90, position: 'insideLeft', offset: 10, fontSize: 10, fill: '#64748b' }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(v, name) => [v, name]} />
                <Scatter data={pcaStats.scatterPlot} name="Patients">
                  {pcaStats.scatterPlot.map((entry, index) => {
                    let color = '#ef4444'; // default cluster 1
                    if (entry.cluster === 'Cluster 2') color = '#10b981';
                    if (entry.cluster === 'Cluster 3') color = '#06b6d4';
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <span className="text-[9px] text-slate-450 font-semibold block text-center mt-2.5">Patients with matching clinical properties cluster together. Colors correspond to Cluster Groups 1 (Red), 2 (Green) and 3 (Cyan).</span>
        </div>

        {/* Cluster Distribution Pie */}
        <div className="rounded-2xl glass-panel p-5 shadow-sm border flex flex-col justify-between text-left">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 font-sans">Patient Cluster Allocations</h2>
          <div className="h-64 sm:h-72 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={kmeansStats.clusterDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={5}
                >
                  <Cell fill="#ef4444" />
                  <Cell fill="#10b981" />
                  <Cell fill="#06b6d4" />
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
