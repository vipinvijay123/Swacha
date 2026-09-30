import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Building2,
  ClipboardCheck,
  Award,
  AlertTriangle,
  CheckSquare,
  Sparkles,
  PlusCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { analyticsService, inspectionService } from '../services/appServices';
import KPICard from '../components/KPICard';
import CircularGauge from '../components/CircularGauge';
import { formatDate, getStatusBadge } from '../utils/formatters';
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
} from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const { searchQuery } = useOutletContext() || {};
  const [data, setData] = useState(null);
  const [recentInspections, setRecentInspections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const analytics = await analyticsService.getDashboardAnalytics();
      const inspections = await inspectionService.getInspections();
      setData(analytics);
      setRecentInspections(inspections.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard analytics', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-slate-200 rounded-lg" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-200 rounded-2xl" />
          <div className="h-80 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const charts = data?.charts || {};

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-6 rounded-3xl shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-emerald-300 border border-white/10 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Swachh Bharat & Green Standard 2026
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Compliance Monitoring Command Center</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Real-time aggregate data, inspection metrics, facility cleanliness index, and corrective action workflows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/inspections/new')}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Start Inspection
          </button>
          <button
            onClick={() => navigate('/reports')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-all"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* 6 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard
          title="Total Facilities"
          value={kpis.totalFacilities || 0}
          icon={Building2}
          color="emerald"
          change="+12%"
          trend="up"
        />
        <KPICard
          title="Inspections Completed"
          value={kpis.inspectionsCompleted || 0}
          icon={ClipboardCheck}
          color="blue"
          change="+8%"
          trend="up"
        />
        <KPICard
          title="Avg Compliance Score"
          value={`${kpis.avgComplianceScore || 0}%`}
          icon={Award}
          color="teal"
          change="+4.2%"
          trend="up"
        />
        <KPICard
          title="Critical Violations"
          value={kpis.criticalViolations || 0}
          icon={AlertTriangle}
          color="rose"
          change="-2"
          trend="up"
        />
        <KPICard
          title="Pending Actions"
          value={kpis.pendingCorrectiveActions || 0}
          icon={CheckSquare}
          color="amber"
        />
        <KPICard
          title="Fully Compliant"
          value={kpis.fullyCompliantFacilities || 0}
          icon={Sparkles}
          color="purple"
          subtext="Score ≥ 90%"
        />
      </div>

      {/* Overview Score & Trend Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance Gauge */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Overall System Score</h3>
          <CircularGauge score={kpis.avgComplianceScore || 0} size={160} strokeWidth={14} />
          <p className="text-xs text-slate-500 mt-4 max-w-xs leading-relaxed">
            Evaluated across {kpis.totalFacilities || 0} registered facilities and {kpis.inspectionsCompleted || 0} completed audits.
          </p>
        </div>

        {/* Compliance Trend Line Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Compliance Score Trend</h3>
              <p className="text-xs text-slate-500 mt-0.5">Monthly average percentage across all facilities</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" /> +4.2% Growth
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.complianceTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                  itemStyle={{ color: '#34d399' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category Performance & Facility Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Category Performance Breakdown</h3>
          <p className="text-xs text-slate-500 mb-6">Comparative score across the 7 compliance categories</p>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.categoryPerformance || []} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
                <YAxis dataKey="category" type="category" stroke="#64748b" fontSize={11} width={130} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                />
                <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                  {(charts.categoryPerformance || []).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.score >= 90
                          ? '#10B981'
                          : entry.score >= 75
                          ? '#3B82F6'
                          : entry.score >= 50
                          ? '#F59E0B'
                          : '#EF4444'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Facility Scores Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Facility Compliance Scores</h3>
            <button
              onClick={() => navigate('/facilities')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-6">Latest overall compliance index per facility</p>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.facilityCompliance || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {(charts.facilityCompliance || []).map((entry, index) => (
                    <Cell
                      key={`cell-fac-${index}`}
                      fill={
                        entry.score >= 90
                          ? '#10B981'
                          : entry.score >= 75
                          ? '#3B82F6'
                          : entry.score >= 50
                          ? '#F59E0B'
                          : '#EF4444'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Inspections Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-800">Recent Completed Inspections</h3>
            <p className="text-xs text-slate-500">Audit logs and calculated compliance scores</p>
          </div>
          <button
            onClick={() => navigate('/inspections')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
          >
            All Inspections <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/60 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200/60">
                <th className="py-3.5 px-6">Inspection ID</th>
                <th className="py-3.5 px-6">Facility</th>
                <th className="py-3.5 px-6">Type</th>
                <th className="py-3.5 px-6">Inspector</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Score</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {recentInspections.map((insp) => (
                <tr key={insp._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-emerald-700">{insp.inspectionId}</td>
                  <td className="py-3.5 px-6 text-slate-800 font-semibold">{insp.facility?.name || 'N/A'}</td>
                  <td className="py-3.5 px-6">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-700">
                      {insp.inspectionType}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-slate-600">{insp.inspector?.name || 'Inspector'}</td>
                  <td className="py-3.5 px-6 text-slate-500">{formatDate(insp.inspectionDate)}</td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        insp.compliancePercentage >= 90
                          ? 'bg-emerald-100 text-emerald-800'
                          : insp.compliancePercentage >= 75
                          ? 'bg-blue-100 text-blue-800'
                          : insp.compliancePercentage >= 50
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {insp.compliancePercentage}%
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => navigate(`/inspections/${insp._id}`)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
