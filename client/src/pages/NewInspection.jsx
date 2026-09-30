import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MinusCircle,
  Upload,
  ArrowLeft,
  Sparkles,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { facilityService, standardService, inspectionService } from '../services/appServices';
import CircularGauge from '../components/CircularGauge';

const NewInspection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedFacility = searchParams.get('facility');

  const [facilities, setFacilities] = useState([]);
  const [standards, setStandards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [selectedFacilityId, setSelectedFacilityId] = useState(preselectedFacility || '');
  const [inspectionType, setInspectionType] = useState('Routine');
  const [inspectionDate, setInspectionDate] = useState(new Date().toISOString().substring(0, 10));
  const [remarks, setRemarks] = useState('');
  const [autoCreateViolations, setAutoCreateViolations] = useState(true);
  const [evidenceFiles, setEvidenceFiles] = useState([]);

  // Checklist State Map: { [stdId]: { status, remarks } }
  const [checklistState, setChecklistState] = useState({});

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    setLoading(true);
    try {
      const [facs, stds] = await Promise.all([
        facilityService.getFacilities(),
        standardService.getStandards({ active: true }),
      ]);
      setFacilities(facs || []);
      setStandards(stds || []);

      if (!selectedFacilityId && facs?.length > 0) {
        setSelectedFacilityId(facs[0]._id);
      }

      // Initialize default checklist state
      const initialMap = {};
      (stds || []).forEach((std) => {
        initialMap[std._id] = {
          standard: std._id,
          category: std.category,
          criterion: std.criterion,
          status: 'Compliant', // default
          remarks: '',
        };
      });
      setChecklistState(initialMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (stdId, newStatus) => {
    setChecklistState((prev) => ({
      ...prev,
      [stdId]: {
        ...prev[stdId],
        status: newStatus,
      },
    }));
  };

  const handleRemarksChange = (stdId, text) => {
    setChecklistState((prev) => ({
      ...prev,
      [stdId]: {
        ...prev[stdId],
        remarks: text,
      },
    }));
  };

  // Calculate live scores
  let totalObtained = 0;
  let totalMax = 0;

  Object.values(checklistState).forEach((item) => {
    if (item.status === 'Not Applicable') return;
    let pts = 0;
    if (item.status === 'Compliant') pts = 2;
    else if (item.status === 'Partially Compliant') pts = 1;
    else if (item.status === 'Non-Compliant') pts = 0;

    totalObtained += pts;
    totalMax += 2;
  });

  const calculatedPercentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;

  // Group standards by category
  const categories = [
    'Cleanliness & Hygiene',
    'Waste Management',
    'Water Management',
    'Energy Management',
    'Green Environment',
    'Sanitation',
    'Awareness & Sustainability',
  ];

  const handleFileChange = (e) => {
    if (e.target.files) {
      setEvidenceFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFacilityId) {
      alert('Please select a facility for the inspection.');
      return;
    }

    setSubmitting(true);

    const checklistArray = Object.values(checklistState);

    const formData = new FormData();
    formData.append('facilityId', selectedFacilityId);
    formData.append('inspectionType', inspectionType);
    formData.append('inspectionDate', inspectionDate);
    formData.append('remarks', remarks);
    formData.append('autoCreateViolations', autoCreateViolations);
    formData.append('checklist', JSON.stringify(checklistArray));

    evidenceFiles.forEach((file) => {
      formData.append('evidence', file);
    });

    try {
      const created = await inspectionService.createInspection(formData);
      navigate(`/inspections/${created._id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting inspection');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center animate-pulse text-slate-500">Loading compliance audit framework...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/inspections')}
          className="p-2 bg-white hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Conduct Compliance Audit</h1>
          <p className="text-xs text-slate-500 mt-1">Complete criteria evaluation checklist. Scores update dynamically.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Inspection Header Metadata Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Target Facility *</label>
            <select
              value={selectedFacilityId}
              onChange={(e) => setSelectedFacilityId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30"
            >
              {facilities.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name} ({f.facilityId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Inspection Audit Type *</label>
            <select
              value={inspectionType}
              onChange={(e) => setInspectionType(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="Routine">Routine Inspection</option>
              <option value="Surprise">Surprise Inspection</option>
              <option value="Follow-up">Follow-up Audit</option>
              <option value="Special">Special Task Force</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Inspection Date *</label>
            <input
              type="date"
              value={inspectionDate}
              onChange={(e) => setInspectionDate(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
        </div>

        {/* Live Floating / Banner Score Summary Ticker */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-emerald-800/40">
          <div className="flex items-center gap-4">
            <CircularGauge score={calculatedPercentage} size={96} strokeWidth={8} />
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Live Compliance Score Calculation
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-white mt-1">
                {totalObtained} / {totalMax} <span className="text-xs font-normal text-slate-300">Points</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically computed. Score field is non-editable.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs bg-white/10 hover:bg-white/15 px-4 py-2.5 rounded-xl border border-white/10">
              <input
                type="checkbox"
                checked={autoCreateViolations}
                onChange={(e) => setAutoCreateViolations(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <span className="font-semibold text-slate-200">Auto-flag violations for Non-Compliant items</span>
            </label>
          </div>
        </div>

        {/* Categorized Checklist Framework */}
        <div className="space-y-6">
          {categories.map((catName) => {
            const catStandards = standards.filter((s) => s.category === catName);
            if (catStandards.length === 0) return null;

            return (
              <div key={catName} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-800 tracking-tight uppercase">
                    {catName}
                  </h3>
                  <span className="text-xs font-bold text-slate-500">{catStandards.length} criteria</span>
                </div>

                <div className="divide-y divide-slate-100 p-4 space-y-4">
                  {catStandards.map((std) => {
                    const itemState = checklistState[std._id] || { status: 'Compliant', remarks: '' };

                    return (
                      <div key={std._id} className="pt-3 first:pt-0 space-y-3">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 text-[9px] font-extrabold rounded bg-slate-100 text-slate-600">
                                {std.code}
                              </span>
                              <h4 className="text-xs font-bold text-slate-800">{std.criterion}</h4>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">{std.description}</p>
                          </div>

                          {/* Status Options Segmented Control */}
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => handleStatusChange(std._id, 'Compliant')}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                                itemState.status === 'Compliant'
                                  ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/30'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Compliant (2pts)
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStatusChange(std._id, 'Partially Compliant')}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                                itemState.status === 'Partially Compliant'
                                  ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-400/30'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              <AlertCircle className="w-3.5 h-3.5" /> Partial (1pt)
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStatusChange(std._id, 'Non-Compliant')}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                                itemState.status === 'Non-Compliant'
                                  ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400/30'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              <XCircle className="w-3.5 h-3.5" /> Non-Compliant (0pt)
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStatusChange(std._id, 'Not Applicable')}
                              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                                itemState.status === 'Not Applicable'
                                  ? 'bg-slate-700 text-white'
                                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                              }`}
                            >
                              <MinusCircle className="w-3.5 h-3.5" /> N/A
                            </button>
                          </div>
                        </div>

                        {/* Criterion Specific Remarks */}
                        <input
                          type="text"
                          placeholder="Add specific remarks / observation notes for this criterion..."
                          value={itemState.remarks || ''}
                          onChange={(e) => handleRemarksChange(std._id, e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Evidence Photos Upload Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Upload Photo Evidence
          </h3>
          <p className="text-xs text-slate-500">
            Attach visual proof for waste segregation areas, toilets, water harvesters, solar panels, compost units, or drainage systems.
          </p>

          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50 hover:bg-slate-100/60 transition-colors">
            <Upload className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">Click to upload or drag photo files here</p>
            <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WEBP up to 10MB each</p>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="mt-3 text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 cursor-pointer"
            />
          </div>

          {evidenceFiles.length > 0 && (
            <div className="text-xs font-semibold text-slate-700">
              Selected {evidenceFiles.length} file(s): {evidenceFiles.map((f) => f.name).join(', ')}
            </div>
          )}
        </div>

        {/* General Audit Summary Remarks */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            Inspector General Summary & Recommendations
          </label>
          <textarea
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter overall inspector summary notes, urgent recommendations, or compliance directives..."
            className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/inspections')}
            className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl"
          >
            Cancel Audit
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2"
          >
            {submitting ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ClipboardCheck className="w-4 h-4" /> Finalize & Submit Inspection ({calculatedPercentage}%)
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewInspection;
