import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCheck, 
  Search, 
  HelpCircle, 
  ArrowRight,
  TrendingUp,
  Activity,
  Award
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
  Legend
} from 'recharts';

export default function SimilarPatientPage() {
  const [knnStats, setKnnStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRecordId, setSelectedRecordId] = useState(1);
  const [recordsList, setRecordsList] = useState([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const analyticsData = await apiService.getDatasetAnalytics({ pageSize: 30 });
        setRecordsList(analyticsData.records);
        
        const knnData = await apiService.getKNNStats(1);
        setKnnStats(knnData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleRecordChange = async (e) => {
    const id = parseInt(e.target.value);
    setSelectedRecordId(id);
    setLoading(true);
    try {
      const data = await apiService.getKNNStats(id);
      setKnnStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !knnStats) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-hospital-brandBlue/10"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-hospital-brandBlue animate-spin"></div>
        </div>
      </div>
    );
  }

  // Formatting chart data for similarity
  const similarityChartData = knnStats.nearestPatients.map(p => ({
    id: `Record #${p.record_id}`,
    similarity: p.similarity,
    distance: p.distance
  }));

  // Compares emergency case profiles of the top 5 matches
  const comparisonChartData = knnStats.nearestPatients.map(p => ({
    id: `#${p.record_id}`,
    emergencies: p.emergency_cases,
    accidents: p.accident_cases,
    flu: p.flu_cases
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            K-Nearest Neighbors – Similar Patient Matching
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Cross-references patient diagnostics traits to establish treatment cohorts and clinical outcomes.
          </p>
        </div>

        {/* Dropdown Selector */}
        <div className="flex items-center gap-2.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase whitespace-nowrap">Select Target Case:</label>
          <select 
            value={selectedRecordId}
            onChange={handleRecordChange}
            className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-850 border border-slate-205/50 dark:border-slate-800/50 text-slate-700 dark:text-slate-250 focus:outline-none shadow-sm"
          >
            {recordsList.map((row) => (
              <option key={row.record_id} value={row.record_id}>Record #{row.record_id} (Age {row.average_age}, Temp/O2 Vitals)</option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl glass-panel p-4 shadow-sm border bg-gradient-to-br from-hospital-brandBlue/10 to-transparent">
          <span className="text-[10px] font-bold text-slate-405 dark:text-slate-500 uppercase tracking-widest block font-sans">Predicted Risk Group</span>
          <span className="text-2xl font-black text-slate-850 dark:text-white tracking-tight mt-1.5 block leading-none">{knnStats.lastPredictedGroup}</span>
          <p className="text-[10px] text-slate-400 mt-2 font-semibold">Classification based on nearest neighbors label</p>
        </div>

        <div className="rounded-2xl glass-panel p-4 shadow-sm border bg-gradient-to-br from-hospital-cyan/10 to-transparent">
          <span className="text-[10px] font-bold text-slate-405 dark:text-slate-500 uppercase tracking-widest block font-sans">Confidence Level</span>
          <span className="text-3xl font-black text-slate-850 dark:text-white tracking-tight mt-1.5 block leading-none">
            {knnStats.nearestPatients[0].similarity.toFixed(1)}%
          </span>
          <p className="text-[10px] text-slate-400 mt-2 font-semibold font-sans">Proximity match rating of closest neighbor case</p>
        </div>

        <div className="rounded-2xl glass-panel p-4 shadow-sm border bg-gradient-to-br from-hospital-emerald/10 to-transparent">
          <span className="text-[10px] font-bold text-slate-405 dark:text-slate-505 uppercase tracking-widest block">Mean Neighbor Distance</span>
          <span className="text-3xl font-black text-slate-850 dark:text-white tracking-tight mt-1.5 block leading-none">{knnStats.averageDistance.toFixed(4)}</span>
          <p className="text-[10px] text-slate-405 mt-2 font-semibold font-sans">Euclidean distance of top matches (k=5)</p>
        </div>
      </div>

      {/* Matches Table */}
      <div className="rounded-2xl glass-panel shadow-sm border overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200/50 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 text-left">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Top 5 Nearest Neighbor Matches</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/70 dark:bg-slate-850/50 text-[10px] font-bold text-slate-405 dark:text-slate-455 uppercase tracking-widest border-b border-slate-200/50 dark:border-slate-800/50">
              <tr>
                <th className="px-5 py-3">Patient Record ID</th>
                <th className="px-5 py-3">Age</th>
                <th className="px-5 py-3">Similarity Match</th>
                <th className="px-5 py-3">Euclidean Distance</th>
                <th className="px-5 py-3">Emergencies</th>
                <th className="px-5 py-3">Accident Cases</th>
                <th className="px-5 py-3">Flu Cases</th>
                <th className="px-5 py-3">Beds Forecast</th>
                <th className="px-5 py-3 text-right">Outpatient Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50 font-semibold text-slate-656 dark:text-slate-350">
              {knnStats.nearestPatients.map((p, idx) => (
                <tr key={p.record_id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3 text-hospital-brandBlue">Record #{p.record_id}</td>
                  <td className="px-5 py-3">{p.age} yrs</td>
                  <td className="px-5 py-3">
                    <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      {p.similarity.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono">{p.distance.toFixed(3)}</td>
                  <td className="px-5 py-3">{p.emergency_cases}</td>
                  <td className="px-5 py-3">{p.accident_cases}</td>
                  <td className="px-5 py-3">{p.flu_cases}</td>
                  <td className="px-5 py-3 font-semibold">{p.beds_required} beds</td>
                  <td className="px-5 py-3 text-right font-bold text-slate-800 dark:text-white">{p.patient_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Horizontal Similarity Chart */}
        <div className="rounded-2xl glass-panel p-5 shadow-sm border">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">Proximity Similarity %</h2>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={similarityChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="dark:opacity-10" />
                <XAxis type="number" domain={[50, 100]} stroke="#94a3b8" fontSize={10} />
                <YAxis dataKey="id" type="category" stroke="#94a3b8" fontSize={10} width={90} />
                <Tooltip formatter={(v) => [`${v.toFixed(1)}%`, "Match"]} />
                <Bar dataKey="similarity" fill="#0284c7" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Caseload Profiles comparisons of neighbors */}
        <div className="rounded-2xl glass-panel p-5 shadow-sm border">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">Patient Caseload Profile Comparison</h2>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="dark:opacity-10" />
                <XAxis dataKey="id" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="emergencies" fill="#ef4444" radius={[3, 3, 0, 0]} name="Emergencies" />
                <Bar dataKey="accidents" fill="#06b6d4" radius={[3, 3, 0, 0]} name="Accidents" />
                <Bar dataKey="flu" fill="#10b981" radius={[3, 3, 0, 0]} name="Flus" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
