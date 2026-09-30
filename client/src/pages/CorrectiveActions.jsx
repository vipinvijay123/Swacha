import React, { useEffect, useState } from 'react';
import { CheckSquare, Upload, Calendar, Clock, AlertTriangle, Eye } from 'lucide-react';
import { actionService } from '../services/appServices';
import { getStatusBadge, formatDate } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import EvidenceGallery from '../components/EvidenceGallery';

const CorrectiveActions = () => {
  const { user } = useAuth();
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  // Update Action Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [status, setStatus] = useState('In Progress');
  const [proofFiles, setProofFiles] = useState([]);

  useEffect(() => {
    fetchActions();
  }, [statusFilter]);

  const fetchActions = async () => {
    setLoading(true);
    try {
      const data = await actionService.getCorrectiveActions({ status: statusFilter });
      setActions(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (act) => {
    setSelectedAction(act);
    setRemarks(act.remarks || '');
    setStatus(act.status || 'In Progress');
    setProofFiles([]);
    setShowModal(true);
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    if (!selectedAction) return;

    const formData = new FormData();
    formData.append('remarks', remarks);
    formData.append('status', status);

    proofFiles.forEach((f) => {
      formData.append('evidence', f);
    });

    try {
      await actionService.updateCorrectiveAction(selectedAction._id, formData);
      setShowModal(false);
      fetchActions();
    } catch (err) {
      alert('Failed to update corrective action');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Corrective Action Workflow</h1>
          <p className="text-xs text-slate-500 mt-1">Submit proof of compliance, monitor deadlines, and resolve violations</p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl font-bold text-slate-700 shadow-sm"
        >
          <option value="">All Action Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Submitted">Submitted (Under Review)</option>
          <option value="Completed">Completed</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      {loading ? (
        <div className="p-8 text-center animate-pulse text-slate-400">Loading corrective actions...</div>
      ) : actions.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-slate-200">
          <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Corrective Actions Found</h3>
          <p className="text-xs text-slate-500 mt-1">All facility violations are resolved or no actions match current filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {actions.map((act) => {
            const isOverdue = act.status === 'Overdue';

            return (
              <div
                key={act._id}
                className={`bg-white rounded-3xl p-6 border shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                  isOverdue ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded bg-blue-100 text-blue-800 border border-blue-200">
                      {act.actionId}
                    </span>
                    <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${getStatusBadge(act.status)}`}>
                      {act.status}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-800 leading-snug">{act.actionRequired}</h3>
                  <p className="text-xs font-bold text-emerald-700 mt-1">{act.facility?.name}</p>

                  <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-semibold">Target Due Date:</span>
                      <span className={`font-bold ${isOverdue ? 'text-rose-600' : 'text-slate-700'}`}>
                        {formatDate(act.targetDate)}
                      </span>
                    </div>
                    {act.completionDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-semibold">Completed On:</span>
                        <span className="font-bold text-emerald-700">{formatDate(act.completionDate)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-semibold">Assigned To:</span>
                      <span className="font-semibold text-slate-800">{act.assignedTo?.name || 'Facility Manager'}</span>
                    </div>
                  </div>

                  {act.remarks && (
                    <p className="text-xs text-slate-600 mt-3 italic bg-slate-100/60 p-2.5 rounded-xl">
                      "{act.remarks}"
                    </p>
                  )}

                  {/* Proof Evidence Gallery */}
                  {act.evidence && act.evidence.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <EvidenceGallery photos={act.evidence} title="Proof Photos Uploaded" />
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Created: {formatDate(act.createdAt)}</span>
                  <button
                    onClick={() => handleOpenModal(act)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                  >
                    Submit Proof / Update Status
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Update Corrective Action Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`Update Action ${selectedAction?.actionId}`}>
        <form onSubmit={handleSubmitUpdate} className="space-y-4">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
            <p className="font-bold text-slate-800">{selectedAction?.actionRequired}</p>
            <p className="text-slate-500 mt-0.5">Facility: {selectedAction?.facility?.name}</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status Transition *</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Submitted">Submitted (Under Review)</option>
              <option value="Completed">Completed (Resolved)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Upload Corrective Proof Photos</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setProofFiles(Array.from(e.target.files))}
              className="w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-emerald-100 file:text-emerald-800 font-medium cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Action Remarks & Progress Notes</label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Describe work completed, maintenance steps taken..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md">
              Save Action Update
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CorrectiveActions;
