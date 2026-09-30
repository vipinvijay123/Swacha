import React, { useEffect, useState } from 'react';
import { FileBarChart, Printer, Download, Filter, Building2, Calendar, UserCheck, CheckCircle2 } from 'lucide-react';
import { facilityService, inspectionService } from '../services/appServices';
import { formatDate } from '../utils/formatters';
import CircularGauge from '../components/CircularGauge';

const Reports = () => {
  const [facilities, setFacilities] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedInspection, setSelectedInspection] = useState(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setLoading(true);
    try {
      const [facList, inspList] = await Promise.all([
        facilityService.getFacilities(),
        inspectionService.getInspections(),
      ]);
      setFacilities(facList || []);
      setInspections(inspList || []);
      if (inspList?.length > 0) {
        setSelectedInspection(inspList[0]);
      }
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
    return <div className="p-8 text-center animate-pulse text-slate-400">Loading report builder...</div>;
  }

  const filteredInspections = selectedFacility
    ? inspections.filter((i) => i.facility?._id === selectedFacility)
    : inspections;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Compliance Reports Center</h1>
          <p className="text-xs text-slate-500 mt-1">Generate official audit reports, compliance certificates, and printable documentation</p>
        </div>

        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <Printer className="w-4 h-4" /> Print / Export PDF
        </button>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-4 no-print">
        <div className="w-full sm:w-1/2">
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Select Facility</label>
          <select
            value={selectedFacility}
            onChange={(e) => {
              setSelectedFacility(e.target.value);
              const matched = inspections.find((i) => !e.target.value || i.facility?._id === e.target.value);
              if (matched) setSelectedInspection(matched);
            }}
            className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold"
          >
            <option value="">All Registered Facilities</option>
            {facilities.map((f) => (
              <option key={f._id} value={f._id}>
                {f.name} ({f.facilityId})
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-1/2">
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Select Inspection Audit Record</label>
          <select
            value={selectedInspection?._id || ''}
            onChange={(e) => {
              const matched = inspections.find((i) => i._id === e.target.value);
              if (matched) setSelectedInspection(matched);
            }}
            className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold"
          >
            {filteredInspections.map((i) => (
              <option key={i._id} value={i._id}>
                {i.inspectionId} - {i.facility?.name} ({i.compliancePercentage}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Official Report Template */}
      {selectedInspection ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 space-y-8">
          {/* Header Banner */}
          <div className="border-b-2 border-emerald-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  OFFICIAL AUDIT REPORT
                </span>
                <span className="text-xs font-bold text-slate-400 font-mono">
                  {selectedInspection.inspectionId}
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                SWACHHTA & GREEN COMPLIANCE MONITORING REPORT
              </h2>
              <p className="text-xs font-semibold text-emerald-700 uppercase mt-0.5">
                Government & Institutional Sanitation Standards
              </p>
            </div>

            <div className="flex flex-col items-center">
              <CircularGauge score={selectedInspection.compliancePercentage || 0} size={110} strokeWidth={10} />
            </div>
          </div>

          {/* Facility & Metadata Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
            <div>
              <p className="font-bold text-slate-400 uppercase text-[10px]">Facility Name</p>
              <p className="font-extrabold text-slate-800 mt-0.5">{selectedInspection.facility?.name}</p>
            </div>
            <div>
              <p className="font-bold text-slate-400 uppercase text-[10px]">Audit Type</p>
              <p className="font-extrabold text-slate-800 mt-0.5">{selectedInspection.inspectionType}</p>
            </div>
            <div>
              <p className="font-bold text-slate-400 uppercase text-[10px]">Date Conducted</p>
              <p className="font-extrabold text-slate-800 mt-0.5">{formatDate(selectedInspection.inspectionDate)}</p>
            </div>
            <div>
              <p className="font-bold text-slate-400 uppercase text-[10px]">Inspector Name</p>
              <p className="font-extrabold text-slate-800 mt-0.5">{selectedInspection.inspector?.name || 'Authorized Inspector'}</p>
            </div>
          </div>

          {/* Detailed Criteria Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Evaluated Criteria Breakdown ({selectedInspection.checklist?.length || 0} Standards)
            </h3>

            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 uppercase">
                    <th className="p-3">Category</th>
                    <th className="p-3">Criterion</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {(selectedInspection.checklist || []).map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-bold text-slate-700">{item.category}</td>
                      <td className="p-3 text-slate-900 font-semibold">{item.criterion}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'Compliant'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'Partially Compliant'
                              ? 'bg-amber-100 text-amber-800'
                              : item.status === 'Non-Compliant'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3 text-right font-bold text-slate-800">{item.score} / 2</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Remarks Section */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <h4 className="font-bold text-slate-800 uppercase">Inspector General Remarks</h4>
            <p className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed">
              {selectedInspection.remarks || 'Facility demonstrates satisfactory adherence to baseline green compliance policies.'}
            </p>
          </div>

          {/* Signatures Footer */}
          <div className="pt-12 flex justify-between text-xs text-slate-500 font-semibold border-t border-slate-200">
            <div className="text-center space-y-10">
              <div className="w-40 border-b border-slate-400" />
              <p>Inspector Signature</p>
            </div>
            <div className="text-center space-y-10">
              <div className="w-40 border-b border-slate-400" />
              <p>Facility Director Approval</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
          Select an inspection audit record above to preview and export the report.
        </div>
      )}
    </div>
  );
};

export default Reports;
