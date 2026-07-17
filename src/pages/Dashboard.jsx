import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Bed, 
  Activity, 
  UserPlus, 
  AlertOctagon, 
  Clock, 
  Droplet,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight
} from 'lucide-react';
import { apiService } from '../services/api';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [aiInsights, setAiInsights] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricData, insightData, alertData] = await Promise.all([
          apiService.getDashboardMetrics(),
          apiService.getAIInsights(),
          apiService.getAlerts()
        ]);
        setMetrics(metricData);
        setAiInsights(insightData);
        setAlerts(alertData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-hospital-brandBlue/10"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-hospital-brandBlue animate-spin"></div>
        </div>
      </div>
    );
  }

  // Cards layout
  const cardsConfig = [
    { key: 'totalPatientsToday', label: 'Total Patients Today', icon: Users, suffix: '', color: 'from-blue-500/20 to-sky-500/5', border: 'border-blue-500/20 shadow-blue-500/5' },
    { key: 'predictedPatientCount', label: 'Predicted Patient Count', icon: TrendingUp, suffix: '', color: 'from-cyan-500/20 to-teal-500/5', border: 'border-cyan-500/20 shadow-cyan-500/5' },
    { key: 'availableBeds', label: 'Available Beds', icon: Bed, suffix: '', color: 'from-emerald-500/20 to-teal-500/5', border: 'border-emerald-500/20 shadow-emerald-500/5' },
    { key: 'icuAvailability', label: 'ICU Availability', icon: Activity, suffix: ' beds', color: 'from-red-500/20 to-pink-500/5', border: 'border-red-500/20 shadow-red-500/5' },
    { key: 'doctorsAvailable', label: 'Doctors Available', icon: UserPlus, suffix: '', color: 'from-blue-500/20 to-indigo-500/5', border: 'border-indigo-500/20 shadow-indigo-500/5' },
    { key: 'emergencyCases', label: 'Emergency Cases', icon: AlertOctagon, suffix: '', color: 'from-amber-500/20 to-red-500/5', border: 'border-amber-500/20 shadow-amber-500/5' },
    { key: 'averageWaitTime', label: 'Average Wait Time', icon: Clock, suffix: ' mins', color: 'from-cyan-500/20 to-blue-500/5', border: 'border-cyan-500/20 shadow-cyan-500/5' },
    { key: 'averageOxygenLevel', label: 'Average Oxygen Level', icon: Droplet, suffix: '%', color: 'from-emerald-500/20 to-teal-500/5', border: 'border-emerald-500/20 shadow-emerald-500/5' }
  ];

  // Helper formatting sparkline coordinates for Recharts
  const formatSparkline = (arr) => arr.map((val, i) => ({ value: val, index: i }));

  // Utilization rates
  const utilizationData = [
    { name: 'Beds Occupied', value: 76, color: '#0284c7' }, // 100 - (24 available out of 100 total capacity)
    { name: 'ICU Occupied', value: 88, color: '#ef4444' },  // 100 - (6 available out of 50 total capacity)
    { name: 'Doctor rostered', value: 70, color: '#10b981' }
  ];

  // Graph data for main layout
  const hourlyFlowData = [
    { hour: '08:00', arrivals: 42, activeCases: 95, waiting: 12 },
    { hour: '10:00', arrivals: 55, activeCases: 110, waiting: 18 },
    { hour: '12:00', arrivals: 60, activeCases: 115, waiting: 22 },
    { hour: '14:00', arrivals: 33, activeCases: 90, waiting: 16 },
    { hour: '16:00', arrivals: 38, activeCases: 85, waiting: 10 },
    { hour: '18:00', arrivals: 49, activeCases: 102, waiting: 15 },
    { hour: '20:00', arrivals: 66, activeCases: 120, waiting: 28 },
    { hour: '22:00', arrivals: 18, activeCases: 80, waiting: 8 }
  ];

  return (
    <div className="space-y-6">
      {/* Upper header summary */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            Clinical Dashboard Control Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Real-time telemetry, capacity forecast analytics, and hospital resource allocations.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-hospital-cyan/20 bg-hospital-cyan/5 text-hospital-cyan text-xs font-bold animate-pulse shadow-sm shadow-hospital-cyan/10">
          <Sparkles className="w-4 h-4" /> Live AI Engine Online
        </div>
      </div>

      {/* 8 Stats Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardsConfig.map((card) => {
          const item = metrics[card.key];
          const Icon = card.icon;
          return (
            <motion.div
              key={card.key}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className={`rounded-2xl border p-4 bg-gradient-to-br ${card.color} ${card.border} backdrop-blur-sm shadow-sm flex flex-col justify-between h-40`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-455 tracking-wider uppercase leading-none block">
                    {card.label}
                  </span>
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-none animate-counter">
                      {item.value}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {card.suffix}
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center text-slate-700 dark:text-slate-200">
                  <Icon className="w-4.5 h-4.5" />
                </div>
              </div>

              {/* Sparkline & Trend */}
              <div className="flex items-end justify-between mt-4">
                <div className="w-24 h-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={formatSparkline(item.sparkline)}>
                      <defs>
                        <linearGradient id={`grad-${card.key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={item.positive ? "#10b981" : "#ef4444"} stopOpacity={0.4}/>
                          <stop offset="95%" stopColor={item.positive ? "#10b981" : "#ef4444"} stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={item.positive ? "#10b981" : "#ef4444"} 
                        strokeWidth={1.5}
                        fillOpacity={1}
                        fill={`url(#grad-${card.key})`} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className={`flex items-center text-xs font-black ${
                  item.positive 
                    ? 'text-emerald-500 dark:text-emerald-400' 
                    : 'text-red-500 dark:text-red-400'
                }`}>
                  {item.positive ? <ArrowUpRight className="w-4 h-4 mr-0.5" /> : <ArrowDownRight className="w-4 h-4 mr-0.5" />}
                  {item.trend > 0 ? `+${item.trend}%` : `${item.trend}%`}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Analysis Graphs & AI Insights Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Arrivals & Waiting flow chart */}
        <div className="xl:col-span-2 rounded-2xl glass-panel p-5 shadow-sm border flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                Patient Traffic vs Waiting Queue Load
              </h2>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Hourly Hospital Telemetry</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-hospital-brandBlue"></span> Arrivals</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-hospital-cyan"></span> Waiting Queue</span>
            </div>
          </div>
          <div className="h-64 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorArrivals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorWaiting" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="arrivals" stroke="#0284c7" strokeWidth={2.5} fillOpacity={1} fill="url(#colorArrivals)" />
                <Area type="monotone" dataKey="waiting" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorWaiting)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Recommendations widget */}
        <div className="rounded-2xl glass-panel p-5 shadow-sm border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-3 mb-4">
              <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-hospital-cyan" /> AI Recommendations
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded font-extrabold bg-hospital-brandBlue/10 text-hospital-brandBlue">
                Live Insights
              </span>
            </div>
            
            <div className="space-y-3.5">
              {aiInsights.map((insight) => (
                <div 
                  key={insight.id}
                  className={`p-3 rounded-xl border flex flex-col gap-1.5 transition-all hover:scale-[1.01] ${
                    insight.type === 'critical' 
                      ? 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400'
                      : insight.type === 'warning'
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400'
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                  }`}
                >
                  <p className="text-xs font-semibold leading-relaxed">
                    {insight.text}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] font-extrabold uppercase mt-1">
                    <span className="bg-white/90 dark:bg-slate-800/80 px-2 py-0.5 rounded border border-slate-200/30">
                      Recommendation: {insight.action}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full mt-4 py-2 border border-slate-200/50 dark:border-slate-800/50 rounded-xl text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-center gap-1">
            Simulate Predictive Models <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Hospital Occupancy Progress & Deficit telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Beds, ICU and doctor roster progress rates */}
        <div className="rounded-2xl glass-panel p-5 shadow-sm border md:col-span-2">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">
            Hospital Resource Utilization Rates
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {utilizationData.map((item) => (
              <div key={item.name} className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/40 text-center flex flex-col justify-between h-44">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-normal block">
                  {item.name}
                </span>
                
                {/* Centered large percent with soft gauge ring */}
                <div className="my-3 flex items-center justify-center relative">
                  <span className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                    {item.value}%
                  </span>
                  
                  {/* Backdrop ring marker */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <div className="w-20 h-20 rounded-full border-12 border-slate-300"></div>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${item.value}%`, backgroundColor: item.color }}
                    ></div>
                  </div>
                  <span className="text-[9px] font-semibold text-slate-400 mt-1 block">
                    {item.value > 85 ? '🚨 CRITICAL CAPACITY' : 'NORMAL LOAD'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Alerts list */}
        <div className="rounded-2xl glass-panel p-5 shadow-sm border flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">
              Real-time System Flagged Logs
            </h2>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white/20 dark:bg-slate-900/20 flex gap-2.5 items-start">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    alert.type === 'critical' ? 'bg-red-500' : 'bg-amber-500'
                  }`}></div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 leading-snug">
                      {alert.msg}
                    </p>
                    <span className="text-[9px] text-slate-400 font-semibold block mt-0.5 uppercase">
                      {alert.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <span className="text-[9px] font-bold text-center text-slate-400 mt-4 uppercase border-t border-slate-100 dark:border-slate-800/80 pt-2 block">
            System sync 3 seconds ago
          </span>
        </div>
      </div>
    </div>
  );
}
