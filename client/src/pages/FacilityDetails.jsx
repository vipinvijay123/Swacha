import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Users,
  Mail,
  Phone,
  ClipboardCheck,
  AlertTriangle,
  CheckSquare,
  FileText,
  ArrowLeft,
  Calendar,
  Award,
} from 'lucide-react';
import { facilityService } from '../services/appServices';
import CircularGauge from '../components/CircularGauge';
import { formatDate, getStatusBadge, getSeverityBadge } from '../utils/formatters';

const FacilityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await facilityService.getFacilityById(id);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center animate-pulse text-slate-500">Loading facility details...</div>;
  }

  if (!data || !data.facility) {
    return <div className="p-8 text-center text-slate-500">Facility record not found</div>;
  }

  const { facility, inspections = [], violations = [], correctiveActions = [] } = data;
  const categoryScores = facility.categoryScores || {};

  return (
    <div className="space-y-6">
      {/* Back Button & Title Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/facilities')}
          className="p-2 bg-white hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-200 text-slate-700">
              {facility.facilityId}
            </span>
            <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${getStatusBadge(facility.status)}`}>
              {facility.status}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mt-1">{facility.name}</h1>
        </div>
      </div>

      {/* Main Profile Info Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">{facility.description || 'No detailed description.'}</p>
          <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
            <div>
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Type & Category</p>
              <p className="font-semibold text-slate-800 mt-0.5">{facility.facilityType}</p>
            </div>
            <div>
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Location</p>
              <p className="font-semibold text-slate-800 mt-0.5">
                {facility.location?.address}, {facility.location?.city} ({facility.location?.pincode})
              </p>
            </div>
            <div>
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Manager / Director</p>
              <p className="font-semibold text-slate-800 mt-0.5">{facility.manager?.name || facility.contact?.person || 'N/A'}</p>
            </div>
            <div>
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Occupants / Students</p>
              <p className="font-semibold text-slate-800 mt-0.5">{facility.numberOfOccupants || 0}</p>
            </div>
          </div>
        </div>

        {/* Score Gauge */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
          <CircularGauge score={facility.complianceScore || 0} size={140} />
          <p className="text-[11px] text-slate-500 mt-2">
            Last Audit: {formatDate(facility.lastInspectionDate)}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-xs font-bold">
        {['overview', 'inspections', 'violations', 'correctiveActions'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 capitalize transition-all border-b-2 ${
              activeTab === tab
                ? 'border-emerald-600 text-emerald-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab === 'correctiveActions' ? 'Corrective Actions' : tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Category Scores Breakdown */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
              Category-Wise Performance Index
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(categoryScores).map((cat) => {
                const score = categoryScores[cat];
                return (
                  <div key={cat} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
                      <span className="text-slate-700">{cat}</span>
                      <span className="text-emerald-700">{score}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          score >= 90
                            ? 'bg-emerald-500'
                            : score >= 75
                            ? 'bg-blue-500'
                            : score >= 50
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'inspections' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/60 text-slate-500 font-bold uppercase border-b">
                <th className="p-4">ID</th>
                <th className="p-4">Type</th>
                <th className="p-4">Inspector</th>
                <th className="p-4">Date</th>
                <th className="p-4">Score</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inspections.map((insp) => (
                <tr key={insp._id}>
                  <td className="p-4 font-bold text-emerald-700">{insp.inspectionId}</td>
                  <td className="p-4">{insp.inspectionType}</td>
                  <td className="p-4">{insp.inspector?.name}</td>
                  <td className="p-4">{formatDate(insp.inspectionDate)}</td>
                  <td className="p-4 font-extrabold">{insp.compliancePercentage}%</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => navigate(`/inspections/${insp._id}`)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'violations' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/60 text-slate-500 font-bold uppercase border-b">
                <th className="p-4">ID</th>
                <th className="p-4">Category</th>
                <th className="p-4">Description</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {violations.map((v) => (
                <tr key={v._id}>
                  <td className="p-4 font-bold text-rose-700">{v.violationId}</td>
                  <td className="p-4 font-semibold">{v.category}</td>
                  <td className="p-4 text-slate-700">{v.description}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${getSeverityBadge(v.severity)}`}>
                      {v.severity}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${getStatusBadge(v.status)}`}>
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'correctiveActions' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/60 text-slate-500 font-bold uppercase border-b">
                <th className="p-4">Action ID</th>
                <th className="p-4">Action Required</th>
                <th className="p-4">Target Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {correctiveActions.map((ca) => (
                <tr key={ca._id}>
                  <td className="p-4 font-bold text-blue-700">{ca.actionId}</td>
                  <td className="p-4 font-semibold text-slate-800">{ca.actionRequired}</td>
                  <td className="p-4 text-slate-600">{formatDate(ca.targetDate)}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${getStatusBadge(ca.status)}`}>
                      {ca.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FacilityDetails;
