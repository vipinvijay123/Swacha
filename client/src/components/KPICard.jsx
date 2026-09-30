import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const KPICard = ({ title, value, icon: Icon, change, trend = 'up', color = 'emerald', subtext }) => {
  const colorMap = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    teal: 'bg-teal-50 text-teal-600 border-teal-100',
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-xl border ${colorMap[color] || colorMap.emerald}`}>
          <Icon className="w-6 h-6" />
        </div>
        {change && (
          <div
            className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
              trend === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}
          >
            {trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {change}
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{value}</h3>
        <p className="text-xs font-medium text-slate-500 mt-1">{title}</p>
        {subtext && <p className="text-[11px] text-slate-400 mt-0.5">{subtext}</p>}
      </div>
    </div>
  );
};

export default KPICard;
