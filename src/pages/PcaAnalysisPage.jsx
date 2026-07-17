import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  HelpCircle, 
  CheckCircle,
  Database,
  ArrowRight
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
  Legend
} from 'recharts';

export default function PcaAnalysisPage() {
  const [pcaStats, setPcaStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await apiService.getPCAStats();
        setPcaStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading || !pcaStats) {
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
          Principal Component Analysis (PCA)
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Reduces feature high-dimensionality while preserving maximum clinical variance logs.
        </p>
      </div>

      {/* Variance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl glass-panel p-4 shadow-sm border bg-gradient-to-br from-hospital-brandBlue/10 to-transparent">
          <span className="text-[10px] font-bold text-slate-405 dark:text-slate-500 uppercase tracking-widest block font-sans">PC1 Explained Variance</span>
          <span className="text-3xl font-black text-slate-850 dark:text-white tracking-tight mt-1.5 block leading-none">
            {pcaStats.explainedVariance[0].variance.toFixed(1)}%
          </span>
          <p className="text-[10px] text-slate-400 mt-2 font-semibold">Captures primary patient diagnostic density</p>
        </div>

        <div className="rounded-2xl glass-panel p-4 shadow-sm border bg-gradient-to-br from-hospital-cyan/10 to-transparent">
          <span className="text-[10px] font-bold text-slate-405 dark:text-slate-500 uppercase tracking-widest block font-sans">PC2 Explained Variance</span>
          <span className="text-3xl font-black text-slate-850 dark:text-white tracking-tight mt-1.5 block leading-none">
            {pcaStats.explainedVariance[1].variance.toFixed(1)}%
          </span>
          <p className="text-[10px] text-slate-400 mt-2 font-semibold">Represents secondary variance dimensions</p>
        </div>

        <div className="rounded-2xl glass-panel p-4 shadow-sm border bg-gradient-to-br from-hospital-emerald/10 to-transparent">
          <span className="text-[10px] font-bold text-slate-405 dark:text-slate-505 uppercase tracking-widest block">Total Variance Retained</span>
          <span className="text-3xl font-black text-slate-850 dark:text-white tracking-tight mt-1.5 block leading-none">{pcaStats.totalVarianceRetained}%</span>
          <p className="text-[10px] text-slate-400 mt-2 font-semibold">Variance captured by top 3 components</p>
        </div>

        <div className="rounded-2xl glass-panel p-4 shadow-sm border bg-gradient-to-br from-hospital-red/10 to-transparent">
          <span className="text-[10px] font-bold text-slate-405 dark:text-slate-505 uppercase tracking-widest block">Complexity Reduction</span>
          <span className="text-2xl font-black text-slate-850 dark:text-white tracking-tight mt-1.5 block leading-none">23 to 3 Features</span>
          <p className="text-[10px] text-slate-400 mt-2 font-semibold font-sans">Dimensions compressed for visualization</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
        {/* Scree Explained Variance Bar Chart */}
        <div className="rounded-2xl glass-panel p-5 shadow-sm border">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">Scree Plot Variance Contribution</h2>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pcaStats.explainedVariance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="dark:opacity-10" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v) => [`${v.toFixed(1)}%`]} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="variance" fill="#0284c7" radius={[4, 4, 0, 0]} name="Individual %" />
                <Bar dataKey="cumulative" fill="#10b981" radius={[4, 4, 0, 0]} name="Cumulative %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Contribution / Loadings Chart */}
        <div className="rounded-2xl glass-panel p-5 shadow-sm border">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 font-sans">Feature Contribution Loadings</h2>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pcaStats.contributionMatrix} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="dark:opacity-10" />
                <XAxis dataKey="feature" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="PC1" fill="#06b6d4" radius={[3, 3, 0, 0]} name="Component 1 Loading" />
                <Bar dataKey="PC2" fill="#ef4444" radius={[3, 3, 0, 0]} name="Component 2 Loading" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Component Matrix Loading Table */}
      <div className="rounded-2xl glass-panel shadow-sm border overflow-hidden text-left">
        <div className="px-5 py-4 border-b border-slate-205/50 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Features Eigenvector Component Matrix</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/70 dark:bg-slate-850/50 text-[10px] font-bold text-slate-405 dark:text-slate-455 uppercase tracking-widest border-b border-slate-200/50 dark:border-slate-800/50">
              <tr>
                <th className="px-5 py-3">Feature Name</th>
                <th className="px-5 py-3">PC1 Loading Coefficient</th>
                <th className="px-5 py-3">PC2 Loading Coefficient</th>
                <th className="px-5 py-3 text-right">Dominant Vector Axis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50 font-semibold text-slate-655 dark:text-slate-350">
              {pcaStats.contributionMatrix.map((row) => (
                <tr key={row.feature} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3 text-slate-800 dark:text-white font-bold">{row.feature}</td>
                  <td className={`px-5 py-3 font-mono ${row.PC1 > 0 ? 'text-hospital-brandBlue' : 'text-slate-500'}`}>{row.PC1.toFixed(4)}</td>
                  <td className={`px-5 py-3 font-mono ${row.PC2 > 0 ? 'text-hospital-red' : 'text-slate-500'}`}>{row.PC2.toFixed(4)}</td>
                  <td className="px-5 py-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      Math.abs(row.PC1) > Math.abs(row.PC2) 
                        ? 'bg-hospital-cyan/10 text-hospital-cyan border border-hospital-cyan/20' 
                        : 'bg-hospital-red/10 text-hospital-red border border-hospital-red/20'
                    }`}>
                      {Math.abs(row.PC1) > Math.abs(row.PC2) ? 'Principal Axis 1' : 'Secondary Axis 2'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
