import React, { useEffect, useState } from 'react';
import { analyticsService } from '../services/appServices';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
  PieChart as RePieChart,
  Pie,
  Legend,
} from 'recharts';
import { PieChart, TrendingUp, AlertTriangle, CheckSquare, Award, Building2 } from 'lucide-react';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await analyticsService.getDashboardAnalytics();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center animate-pulse text-slate-400">Loading interactive compliance analytics...</div>;
  }

  const { charts = {} } = data || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Analytics & Intelligence Dashboard</h1>
        <p className="text-xs text-slate-500 mt-1">Deep insights, statistical distributions, and historical trends</p>
      </div>

      {/* Grid of 6 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Compliance Score Trend Line Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">1. Compliance Score Trend</h3>
              <p className="text-xs text-slate-500">6-Month historical average compliance percentage</p>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.complianceTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }} />
                <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Category Performance Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">2. Category Performance</h3>
              <p className="text-xs text-slate-500">Average score across the 7 compliance categories</p>
            </div>
            <Award className="w-5 h-5 text-blue-600" />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.categoryPerformance || []} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
                <YAxis dataKey="category" type="category" stroke="#64748b" fontSize={10} width={130} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }} />
                <Bar dataKey="score" radius={[0, 6, 6, 0]} fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Facility Compliance Scores */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">3. Facility Score Comparison</h3>
              <p className="text-xs text-slate-500">Cross-facility compliance index</p>
            </div>
            <Building2 className="w-5 h-5 text-purple-600" />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.facilityCompliance || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }} />
                <Bar dataKey="score" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Violation Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">4. Violation Severity Distribution</h3>
              <p className="text-xs text-slate-500">Breakdown by Low, Medium, High, Critical</p>
            </div>
            <AlertTriangle className="w-5 h-5 text-rose-600" />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={charts.violationDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(charts.violationDistribution || []).map((entry, index) => (
                    <Cell key={`cell-v-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }} />
                <Legend />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Corrective Action Status Donut Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">5. Corrective Action Statuses</h3>
              <p className="text-xs text-slate-500">Status of resolution workflows</p>
            </div>
            <CheckSquare className="w-5 h-5 text-teal-600" />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={charts.actionStatusDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {(charts.actionStatusDistribution || []).map((entry, index) => (
                    <Cell key={`cell-a-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }} />
                <Legend />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6. Monthly Inspection Count Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">6. Monthly Inspection Volume</h3>
              <p className="text-xs text-slate-500">Total audits conducted per month</p>
            </div>
            <PieChart className="w-5 h-5 text-indigo-600" />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.monthlyInspectionCount || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }} />
                <Bar dataKey="inspections" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
