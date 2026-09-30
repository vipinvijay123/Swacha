import React, { useEffect, useState } from 'react';
import { AlertTriangle, Plus, Search, Filter, ShieldAlert, CheckCircle2, Trash2 } from 'lucide-react';
import { violationService, facilityService, userService } from '../services/appServices';
import { getStatusBadge, getSeverityBadge, formatDate } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const Violations = () => {
  const { user } = useAuth();
  const [violations, setViolations] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  // Add Modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    facility: '',
    category: 'Waste Management',
    description: '',
    severity: 'High',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
    assignedTo: '',
  });

  useEffect(() => {
    fetchViolations();
    fetchMeta();
  }, [severityFilter, statusFilter]);

  const fetchViolations = async () => {
    setLoading(true);
    try {
      const data = await violationService.getViolations({
        severity: severityFilter,
        status: statusFilter,
      });
      setViolations(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeta = async () => {
    try {
      const [facs, uList] = await Promise.all([facilityService.getFacilities(), userService.getUsers()]);
      setFacilities(facs || []);
      setUsers(uList || []);
      if (facs?.length > 0) {
        setFormData((prev) => ({ ...prev, facility: facs[0]._id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this violation record and linked corrective action?')) {
      try {
        await violationService.deleteViolation(id);
        fetchViolations();
      } catch (err) {
        alert('Failed to delete violation');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await violationService.createViolation(formData);
      setShowModal(false);
      fetchViolations();
    } catch (err) {
      alert(err.response?.data?.message || 'Error logging violation');
    }
  };

  const filtered = violations.filter((v) => {
    const q = search.toLowerCase();
    return (
      v.violationId.toLowerCase().includes(q) ||
      v.facility?.name?.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Violations Registry</h1>
          <p className="text-xs text-slate-500 mt-1">Track compliance breaches, severity levels, and resolution status</p>
        </div>

        {(user?.role === 'admin' || user?.role === 'inspector') && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-900/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Log Violation
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search violation ID, facility, issue description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
          >
            <option value="">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Under Review">Under Review</option>
            <option value="Corrective Action Submitted">Action Submitted</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Violations Table */}
      {loading ? (
        <div className="p-8 text-center animate-pulse text-slate-400">Loading violations registry...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-slate-200">
          <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Violations Found</h3>
          <p className="text-xs text-slate-500 mt-1">Zero non-compliance violations reported under current filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/60 text-slate-500 font-bold uppercase border-b border-slate-200/60">
                <th className="py-3.5 px-6">Violation ID</th>
                <th className="py-3.5 px-6">Facility</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Description</th>
                <th className="py-3.5 px-6">Severity</th>
                <th className="py-3.5 px-6">Due Date</th>
                <th className="py-3.5 px-6">Status</th>
                {user?.role === 'admin' && <th className="py-3.5 px-6 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((v) => (
                <tr key={v._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-rose-700">{v.violationId}</td>
                  <td className="py-3.5 px-6 font-bold text-slate-900">{v.facility?.name || 'N/A'}</td>
                  <td className="py-3.5 px-6 font-semibold text-slate-700">{v.category}</td>
                  <td className="py-3.5 px-6 text-slate-600 max-w-xs leading-relaxed">{v.description}</td>
                  <td className="py-3.5 px-6">
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded border ${getSeverityBadge(v.severity)}`}>
                      {v.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-slate-500">{formatDate(v.dueDate)}</td>
                  <td className="py-3.5 px-6">
                    <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${getStatusBadge(v.status)}`}>
                      {v.status}
                    </span>
                  </td>
                  {user?.role === 'admin' && (
                    <td className="py-3.5 px-6 text-right">
                      <button onClick={() => handleDelete(v._id)} className="text-rose-500 hover:text-rose-700 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Log Violation Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Log New Violation">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Facility *</label>
            <select
              value={formData.facility}
              onChange={(e) => setFormData({ ...formData, facility: e.target.value })}
              required
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            >
              {facilities.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name} ({f.facilityId})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="Cleanliness & Hygiene">Cleanliness & Hygiene</option>
                <option value="Waste Management">Waste Management</option>
                <option value="Water Management">Water Management</option>
                <option value="Energy Management">Energy Management</option>
                <option value="Green Environment">Green Environment</option>
                <option value="Sanitation">Sanitation</option>
                <option value="Awareness & Sustainability">Awareness & Sustainability</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Severity *</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Violation Description *</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of non-compliant observation..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Due Date *</label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Assign Responsible Person</label>
              <select
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="">Select Assignee</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md">
              Log Violation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Violations;
