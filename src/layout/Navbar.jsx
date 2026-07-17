import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  ShieldAlert,
  SearchCheck,
  CheckCircle2
} from 'lucide-react';
import { apiService } from '../services/api';

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains('dark') || 
    localStorage.getItem('theme') === 'dark'
  );
  
  const [time, setTime] = useState(new Date());
  const [notifications, setNotifications] = useState([]);
  const [isOpenAlerts, setIsOpenAlerts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Clock Ticker
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Alerts
  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const data = await apiService.getAlerts();
        setNotifications(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadAlerts();
  }, []);

  // Dark Mode Sync
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleToggle = () => {
    setDarkMode(!darkMode);
  };

  const getAlertIcon = (type) => {
    if (type === 'critical') return <ShieldAlert className="w-5 h-5 text-red-500" />;
    return <SearchCheck className="w-5 h-5 text-amber-500" />;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 px-4 flex items-center justify-between shadow-sm">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-hospital-brandBlue/10 flex items-center justify-center border border-hospital-brandBlue/20 shadow-inner">
          <HeartPulse className="w-6 h-6 text-hospital-brandBlue animate-pulse" />
        </div>
        <div>
          <span className="font-bold text-slate-800 dark:text-white tracking-tight text-lg block">
            AURA Health
          </span>
          <span className="text-[10px] text-hospital-cyan font-bold tracking-wider uppercase -mt-1 block">
            Smart Allocation System
          </span>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3" />
        <input
          type="text"
          placeholder="Search records, models, parameters..."
          className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-100/70 dark:bg-slate-850/60 border border-slate-200/50 dark:border-slate-800/50 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-hospital-brandBlue/40 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Time, toggles, profile */}
      <div className="flex items-center gap-4">
        {/* DateTime Display */}
        <div className="hidden lg:flex flex-col text-right">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest leading-none">
            {formatDate(time)}
          </span>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-0.5 leading-none">
            {formatTime(time)}
          </span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={handleToggle}
          className="w-9 h-9 rounded-xl glass-panel hover:bg-slate-100 dark:hover:bg-slate-800/50 flex items-center justify-center text-slate-600 dark:text-slate-350 transition-colors shadow-sm"
          title="Toggle Color Theme"
        >
          {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5" />}
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpenAlerts(!isOpenAlerts)}
            className="w-9 h-9 rounded-xl glass-panel hover:bg-slate-100 dark:hover:bg-slate-800/50 flex items-center justify-center text-slate-600 dark:text-slate-350 transition-colors shadow-sm relative"
          >
            <Bell className="w-4.5 h-4.5" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-hospital-red text-[9px] font-extrabold text-white rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isOpenAlerts && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl glass-panel-heavy shadow-xl border overflow-hidden z-50 animate-counter">
              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-850/80 border-b border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                  Today's Alerts
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-hospital-red/10 text-hospital-red">
                  {notifications.length} Critical
                </span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/50 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    No active warnings. System running optimal.
                  </div>
                ) : (
                  notifications.map((alert) => (
                    <div key={alert.id} className="p-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors flex gap-3 text-left">
                      <div className="flex-shrink-0 mt-0.5">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 line-clamp-2">
                          {alert.msg}
                        </p>
                        <span className="text-[10px] font-medium text-slate-400 mt-1 block">
                          {alert.time}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Info Profile */}
        <hr className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" />
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-hospital-brandBlue/10 border border-hospital-brandBlue/20 overflow-hidden shadow-sm flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=120"
              alt="Dr. Alex Carter"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.target.style.display = 'none'; // hide if broken
              }}
            />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
              Dr. Alex Carter
            </span>
            <span className="text-[10px] font-semibold text-hospital-cyan leading-none">
              Administrator
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
