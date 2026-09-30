import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Shield, Bell, Database } from 'lucide-react';

const Settings = () => {
  const [saved, setSaved] = useState(false);
  const [thresholds, setThresholds] = useState({
    excellent: 90,
    compliant: 75,
    needsImprovement: 50,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">System Settings & Thresholds</h1>
        <p className="text-xs text-slate-500 mt-1">Configure compliance thresholds, notifications, and environmental standards</p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold">
          Settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Compliance Thresholds */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" /> Compliance Scoring Thresholds (%)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Excellent Compliance (&ge; %)</label>
              <input
                type="number"
                value={thresholds.excellent}
                onChange={(e) => setThresholds({ ...thresholds, excellent: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Good Compliance (&ge; %)</label>
              <input
                type="number"
                value={thresholds.compliant}
                onChange={(e) => setThresholds({ ...thresholds, compliant: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Needs Improvement (&ge; %)</label>
              <input
                type="number"
                value={thresholds.needsImprovement}
                onChange={(e) => setThresholds({ ...thresholds, needsImprovement: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" /> Automated Alert Triggers
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-emerald-600 rounded" />
              <span className="font-semibold text-slate-700">Send instant alert when Critical Violation is reported</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-emerald-600 rounded" />
              <span className="font-semibold text-slate-700">Auto-flag corrective actions as Overdue when target date passes</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-emerald-600 rounded" />
              <span className="font-semibold text-slate-700">Notify Facility Manager upon inspection completion</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
