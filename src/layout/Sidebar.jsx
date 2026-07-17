import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  AlertTriangle, 
  BedDouble, 
  UserCheck, 
  Users, 
  BarChart3, 
  Database, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ collapsed, toggleCollapsed }) {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Patient Prediction', path: '/prediction', icon: TrendingUp },
    { name: 'Emergency Risk', path: '/risk', icon: AlertTriangle },
    { name: 'Resource Allocation', path: '/resources', icon: BedDouble },
    { name: 'Similar Patients', path: '/similar', icon: UserCheck },
    { name: 'Patient Segmentation', path: '/segmentation', icon: Users },
    { name: 'PCA Analysis', path: '/pca', icon: BarChart3 },
    { name: 'Dataset Analytics', path: '/dataset', icon: Database },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside 
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] z-30 glass-panel border-r bg-white/80 dark:bg-slate-900/80 transition-all duration-300 flex flex-col justify-between ${
        collapsed ? 'w-16 animate-counter' : 'w-64'
      }`}
    >
      <div className="py-4 overflow-y-auto overflow-x-hidden flex-1 flex flex-col gap-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `mx-2 px-3 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 group text-sm font-medium ${
                isActive 
                  ? 'bg-hospital-brandBlue text-white shadow-md shadow-hospital-brandBlue/30' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-950 dark:hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" />
            <span 
              className={`transition-opacity duration-300 font-semibold whitespace-nowrap ${
                collapsed ? 'opacity-0 w-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              {item.name}
            </span>
          </NavLink>
        ))}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-2 border-t border-slate-200/50 dark:border-slate-800/50 flex justify-end">
        <button
          onClick={toggleCollapsed}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
}
