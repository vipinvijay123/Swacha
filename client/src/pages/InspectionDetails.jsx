import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ClipboardCheck,
  ArrowLeft,
  Printer,
  FileText,
  Calendar,
  Building2,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MinusCircle,
} from 'lucide-react';
import { inspectionService } from '../services/appServices';
import CircularGauge from '../components/CircularGauge';
import EvidenceGallery from '../components/EvidenceGallery';
import { formatDate } from '../utils/formatters';

const InspectionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInspection();
  }, [id]);

  const fetchInspection = async () => {
    setLoading(true);
    try {
      const data = await inspectionService.getInspectionById(id);
      setInspection(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="p-8 text-center animate-pulse text-slate-500">Loading inspection audit details...</div>;
  }

  if (!inspection) {
    return <div className="p-8 text-center text-slate-500">Inspection record not found</div>;
  }

  const {
    inspectionId,
    facility,
    inspector,
    inspectionType,
    inspectionDate,
    checklist = [],
    totalScore,
    maxPossibleScore,
    compliancePercentage,
    remarks,
    evidence = [],
  } = inspection;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between no-print">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/inspections')}
            className="p-2 bg-white hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-200 text-slate-700">
                {inspectionId}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {inspectionType} Audit
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mt-0.5">
              {facility?.name}
            </h1>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <Printer className="w-4 h-4" /> Print Report
        </button>
      </div>

      {/* Printable Report Header Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6">
        {/* Swachhta Official Header */}
        <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
              SWACHHTA & GREEN COMPLIANCE AUDIT REPORT
            </h2>
            <p className="text-xs text-emerald-700 font-bold uppercase">
              Ministry of Housing and Urban Affairs & Environmental Standards
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-600 pt-2">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold">{facility?.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatDate(inspectionDate)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>{inspector?.name}</span>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <CircularGauge score={compliancePercentage} size={120} strokeWidth={10} />
          </div>
        </div>

        {/* Detailed Evaluation Checklist */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
            Detailed Evaluation Checklist ({checklist.length} Criteria)
          </h3>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-600 font-bold uppercase border-b border-slate-200">
                  <th className="p-3">Category</th>
                  <th className="p-3">Criterion</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Points</th>
                  <th className="p-3">Inspector Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {checklist.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/60">
                    <td className="p-3 font-bold text-slate-700">{item.category}</td>
                    <td className="p-3 text-slate-900 font-semibold">{item.criterion}</td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          item.status === 'Compliant'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Partially Compliant'
                            ? 'bg-amber-100 text-amber-800'
                            : item.status === 'Non-Compliant'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {item.status === 'Compliant' && <CheckCircle2 className="w-3 h-3" />}
                        {item.status === 'Partially Compliant' && <AlertCircle className="w-3 h-3" />}
                        {item.status === 'Non-Compliant' && <XCircle className="w-3 h-3" />}
                        {item.status === 'Not Applicable' && <MinusCircle className="w-3 h-3" />}
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold text-slate-800">{item.score} / 2</td>
                    <td className="p-3 text-slate-600">{item.remarks || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Evidence Photos */}
        {evidence && evidence.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <EvidenceGallery photos={evidence} title="Inspection Evidence Photos Gallery" />
          </div>
        )}

        {/* General Summary */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Inspector General Summary</h4>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {remarks || 'No general notes recorded.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InspectionDetails;
