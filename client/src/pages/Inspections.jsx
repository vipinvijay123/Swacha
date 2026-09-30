import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ClipboardCheck, Plus, Search, Filter, Eye, Award, Building2, Calendar, Trash2 } from 'lucide-react';
import { inspectionService, facilityService } from '../services/appServices';
import { formatDate, getStatusBadge } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

const Inspections = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { searchQuery: globalSearch } = useOutletContext() || {};

  const [inspections, setInspections] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [facilityFilter, setFacilityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState(globalSearch || '');

  useEffect(() => {
    fetchInspections();
    fetchFacilities();
  }, [facilityFilter, typeFilter]);

  useEffect(() => {
    if (globalSearch !== undefined) {
      setSearch(globalSearch);
    }
  }, [globalSearch]);

  const fetchInspections = async () => {
    setLoading(true);
    try {
      const data = await inspectionService.getInspections({
        facility: facilityFilter,
        type: typeFilter,
      });
      setInspections(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFacilities = async () => {
    try {
      const data = await facilityService.getFacilities();
      setFacilities(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this inspection record permanently?')) {
      try {
        await inspectionService.deleteInspection(id);
        fetchInspections();
      } catch (err) {
        alert('Failed to delete inspection');
      }
    }
  };

  const filtered = inspections.filter((insp) => {
    const q = search.toLowerCase();
    return (
      insp.inspectionId.toLowerCase().includes(q) ||
      insp.facility?.name?.toLowerCase().includes(q) ||
      insp.inspector?.name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Inspection Audits</h1>
          <p className="text-xs text-slate-500 mt-1">Conduct compliance audits, record observations, and calculate scores</p>
        </div>

        <button
          onClick={() => navigate('/inspections/new')}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Conduct New Inspection
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search inspection ID, facility, inspector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={facilityFilter}
            onChange={(e) => setFacilityFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
          >
            <option value="">All Facilities</option>
            {facilities.map((f) => (
              <option key={f._id} value={f._id}>
                {f.name}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
          >
            <option value="">All Audit Types</option>
            <option value="Routine">Routine</option>
            <option value="Surprise">Surprise</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Special">Special</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 animate-pulse">Loading inspection logs...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-slate-200">
          <ClipboardCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Inspection Records Found</h3>
          <p className="text-xs text-slate-500 mt-1">Conduct a new inspection to populate audit records.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/60 text-slate-500 font-bold uppercase border-b border-slate-200/60">
                <th className="py-3.5 px-6">Inspection ID</th>
                <th className="py-3.5 px-6">Facility</th>
                <th className="py-3.5 px-6">Audit Type</th>
                <th className="py-3.5 px-6">Inspector</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Compliance Score</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((insp) => (
                <tr key={insp._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-emerald-700">{insp.inspectionId}</td>
                  <td className="py-3.5 px-6 font-bold text-slate-900">{insp.facility?.name || 'N/A'}</td>
                  <td className="py-3.5 px-6">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {insp.inspectionType}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-slate-600">{insp.inspector?.name || 'Inspector'}</td>
                  <td className="py-3.5 px-6 text-slate-500">{formatDate(insp.inspectionDate)}</td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold ${
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
                  <td className="py-3.5 px-6 text-right space-x-2">
                    <button
                      onClick={() => navigate(`/inspections/${insp._id}`)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg"
                    >
                      Report
                    </button>
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => handleDelete(insp._id)}
                        className="px-2 py-1 text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    )}
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

export default Inspections;
