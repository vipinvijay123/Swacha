import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  ClipboardCheck,
  Award,
  AlertTriangle,
  CheckSquare,
  FileBarChart,
  PieChart,
  Users,
  Settings,
  Leaf,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Facilities', path: '/facilities', icon: Building2 },
    { name: 'Inspections', path: '/inspections', icon: ClipboardCheck },
    { name: 'Compliance Standards', path: '/standards', icon: Award },
    { name: 'Violations', path: '/violations', icon: AlertTriangle },
    { name: 'Corrective Actions', path: '/corrective-actions', icon: CheckSquare },
    { name: 'Reports', path: '/reports', icon: FileBarChart },
    { name: 'Analytics', path: '/analytics', icon: PieChart },
  ];

  if (user?.role === 'admin') {
    navItems.push({ name: 'Users', path: '/users', icon: Users });
  }

  navItems.push({ name: 'Settings', path: '/settings', icon: Settings });

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 text-white shadow-2xl transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-emerald-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-900/50 ring-2 ring-emerald-400/30">
              <Leaf className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white leading-tight">
                SWACHHTA & GREEN
              </h1>
              <p className="text-[11px] font-medium text-emerald-400 tracking-wide uppercase">
                Compliance Dashboard
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Banner */}
        <div className="mx-4 my-4 p-3 bg-emerald-900/30 border border-emerald-700/40 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center font-bold text-emerald-300 uppercase">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-white truncate">{user?.name || 'User'}</p>
            <span className="inline-block px-2 py-0.5 mt-0.5 text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
              {user?.role?.replace('_', ' ') || 'Inspector'}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="px-4 space-y-1 py-2 overflow-y-auto max-h-[calc(100vh-190px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-semibold ring-1 ring-emerald-400/40'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-5 h-5 opacity-90" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <p className="text-[11px] text-slate-400">Swachh Bharat & Green Initiative</p>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">v1.0.0 • Production Ready</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
