import React from 'react';
import { Outlet } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-100/50 p-8">
        {/* Brand Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-tr from-emerald-700 to-teal-600 rounded-2xl text-white shadow-xl shadow-emerald-900/30 mb-4 ring-4 ring-emerald-500/20">
            <Leaf className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            SWACHHTA & GREEN COMPLIANCE
          </h1>
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mt-1">
            Government & Institutional Monitoring Portal
          </p>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
