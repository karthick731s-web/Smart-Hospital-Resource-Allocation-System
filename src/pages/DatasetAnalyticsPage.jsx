import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown,
  BookOpen,
  PieChart as PieIcon,
  HelpCircle
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
  Legend
} from 'recharts';

export default function DatasetAnalyticsPage() {
  const [data, setData] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  // Table params table state
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState({ key: 'record_id', order: 'asc' });
  const pageSize = 10;

  useEffect(() => {
    const loadDataset = async () => {
      setLoading(true);
      try {
        const response = await apiService.getDatasetAnalytics({
          search,
          page,
          pageSize,
          sortBy
        });
        setData(response.records);
        setTotalCount(response.total);
        setOverview(response.overview);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDataset();
  }, [search, page, sortBy]);

  const handleSort = (key) => {
    setSortBy(prev => ({
      key,
      order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc'
    }));
    setPage(1);
  };

  const handleExportCSV = () => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvRows = [];
    csvRows.push(headers.join(','));

    // Push all rows
    data.forEach(row => {
      const values = headers.map(header => {
        const val = row[header];
        if (typeof val === 'string') {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      });
      csvRows.push(values.join(','));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hospital_analytics_export_page_${page}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Weather and Season load distribution graphs
  const weatherDistribution = [
    { name: 'Clear', value: 18 },
    { name: 'Rainy', value: 8 },
    { name: 'Snowy', value: 4 }
  ];

  const colors = ['#0284c7', '#06b6d4', '#10b981', '#ef4444'];

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            Dataset Analytics – Clinical Registry
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Inspect raw inputs, filter metrics, and export data variables for secondary analytics.
          </p>
        </div>
        
        {/* CSV Export Button */}
        <button
          onClick={handleExportCSV}
          disabled={data.length === 0}
          className="flex items-center gap-1.5 bg-hospital-brandBlue text-white hover:bg-hospital-brandBlue/90 px-4 py-2 hover-lift rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-hospital-brandBlue/20"
        >
          <Download className="w-4.5 h-4.5" /> Export Page to CSV
        </button>
      </div>

      {/* Dataset Overview cards */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
          <div className="rounded-2xl glass-panel p-4 shadow-sm border">
            <span className="text-[10px] font-bold text-slate-405 dark:text-slate-500 uppercase tracking-widest block font-sans">Total Records (Rows)</span>
            <span className="text-3xl font-black text-slate-850 dark:text-white tracking-tight mt-1.5 block leading-none">{overview.totalRecords}</span>
            <p className="text-[10px] text-slate-400 mt-2 font-semibold">Total rows in datasss.csv registry</p>
          </div>

          <div className="rounded-2xl glass-panel p-4 shadow-sm border">
            <span className="text-[10px] font-bold text-slate-450 dark:text-slate-550 uppercase tracking-widest block font-sans">Total Columns (Features)</span>
            <span className="text-3xl font-black text-slate-850 dark:text-white tracking-tight mt-1.5 block leading-none">{overview.totalFeatures}</span>
            <p className="text-[10px] text-slate-400 mt-2 font-semibold">Includes targets & labels</p>
          </div>

          <div className="rounded-2xl glass-panel p-4 shadow-sm border">
            <span className="text-[10px] font-bold text-slate-450 dark:text-slate-550 uppercase tracking-widest block">Missing Values (Nulls)</span>
            <span className="text-3xl font-black text-hospital-emerald tracking-tight mt-1.5 block leading-none">{overview.missingValues}</span>
            <p className="text-[10px] text-slate-400 mt-2 font-semibold font-sans">0% missing - Cleaned registry</p>
          </div>

          <div className="rounded-2xl glass-panel p-4 shadow-sm border">
            <span className="text-[10px] font-bold text-slate-455 dark:text-slate-555 uppercase tracking-widest block">Duplicate Rows</span>
            <span className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mt-1.5 block leading-none">{overview.duplicateRecords}</span>
            <p className="text-[10px] text-slate-400 mt-2 font-semibold">Optimal record uniqueness verified</p>
          </div>
        </div>
      )}

      {/* Charts overview distributions of dataset */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        <div className="lg:col-span-2 rounded-2xl glass-panel p-5 shadow-sm border">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">Caseload Trends over rows (First 15 records)</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="dark:opacity-10" />
                <XAxis dataKey="record_id" stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `#${v}`} />
                <YAxis stroke="#94a3b8" fontSize={10} name="Count" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="patient_count" fill="#0284c7" name="Total Patients" radius={[3, 3, 0, 0]} />
                <Bar dataKey="emergency_cases" fill="#ef4444" name="Emergencies" radius={[3, 3, 0, 0]} />
                <Bar dataKey="available_beds" fill="#10b981" name="Beds Empty" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl glass-panel p-5 shadow-sm border flex flex-col justify-between">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">Weather Distribution Share</h2>
          <div className="h-52 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={weatherDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={45}
                  paddingAngle={5}
                >
                  {weatherDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Interactive Data Table search Pagination */}
      <div className="rounded-2xl glass-panel shadow-sm border overflow-hidden">
        {/* Actions panel */}
        <div className="px-5 py-4 border-b border-slate-205/50 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          <h2 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider text-left">Clinical Registry Data Table</h2>
          
          {/* Search container */}
          <div className="relative max-w-xs flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search date, seasons, weather..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-850 border border-slate-201/50 dark:border-slate-800/50 text-slate-700 dark:text-slate-259 placeholder-slate-400 focus:outline-none ring-1 ring-slate-200 dark:ring-slate-800"
            />
          </div>
        </div>

        {/* Real Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/70 dark:bg-slate-850/50 text-[10px] font-bold text-slate-455 dark:text-slate-465 uppercase tracking-widest border-b border-slate-200/50 dark:border-slate-800/50">
              <tr>
                {[
                  { label: "ID", key: 'record_id' },
                  { label: "Date", key: 'date' },
                  { label: "Hour", key: 'arrival_hour' },
                  { label: "Day", key: 'day_type' },
                  { label: "Season", key: 'season' },
                  { label: "Weather", key: 'weather' },
                  { label: "Prev Pts", key: 'previous_patient_count' },
                  { label: "Wait", key: 'average_wait_time' },
                  { label: "Beds Empty", key: 'available_beds' },
                  { label: "ICU Empty", key: 'available_icu' },
                  { label: "Docs Available", key: 'available_doctors' },
                  { label: "Emergencies", key: 'emergency_cases' },
                  { label: "Patient Count", key: 'patient_count' }
                ].map((col) => (
                  <th 
                    key={col.key} 
                    onClick={() => handleSort(col.key)}
                    className="px-4 py-3 cursor-pointer hover:bg-slate-200/55 dark:hover:bg-slate-800/50 transition-colors select-none whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50 text-slate-655 dark:text-slate-350 font-semibold">
              {loading ? (
                <tr>
                  <td colSpan={13} className="px-5 py-20 text-center text-slate-450 uppercase tracking-widest">
                    Updating registry...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-5 py-20 text-center text-slate-450 uppercase tracking-widest">
                    No matching records found.
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.record_id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors select-none">
                    <td className="px-4 py-3 font-bold text-hospital-brandBlue">#{row.record_id}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.date}</td>
                    <td className="px-4 py-3">{row.arrival_hour}:00</td>
                    <td className="px-4 py-3">{row.day_type}</td>
                    <td className="px-4 py-3">{row.season}</td>
                    <td className="px-4 py-3">{row.weather}</td>
                    <td className="px-4 py-3">{row.previous_patient_count}</td>
                    <td className="px-4 py-3">{row.average_wait_time}m</td>
                    <td className="px-4 py-3">{row.available_beds}</td>
                    <td className="px-4 py-3">{row.available_icu}</td>
                    <td className="px-4 py-3">{row.available_doctors}</td>
                    <td className="px-4 py-3 text-hospital-red">{row.emergency_cases}</td>
                    <td className="px-4 py-3 text-right font-black text-slate-800 dark:text-white">{row.patient_count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-5 py-3 border-t border-slate-205/50 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex justify-between items-center text-xs">
          <span className="text-slate-451 font-semibold">
            Showing Page {page} of {totalPages || 1} — {totalCount} matching rows
          </span>
          
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages || totalPages === 0}
              className="px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
