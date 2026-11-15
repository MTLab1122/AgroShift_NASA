"use client";

import React from "react";
import { Satellite, AlertTriangle, CheckCircle, ShieldCheck, Info } from "lucide-react";
import { RotationStrategy } from "./StrategyComparisonTable";

interface SatelliteEvidencePanelProps {
  strategy: RotationStrategy;
}

export const SatelliteEvidencePanel: React.FC<SatelliteEvidencePanelProps> = ({ strategy }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2.5">
          <Satellite className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">
            Satellite Evidence &amp; Agronomic Reasoning: {strategy.name}
          </h3>
        </div>
        <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-full border border-indigo-200">
          Multi-NASA Verified
        </span>
      </div>

      {/* Multi-NASA Evidence Statements */}
      <div className="space-y-2">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
          NASA Earth-Observation Data Evidence ({strategy.satellite_evidence.length} Streams Active)
        </h4>
        <div className="space-y-2">
          {strategy.satellite_evidence.map((ev, i) => (
            <div
              key={i}
              className="flex items-start space-x-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed"
            >
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{ev}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits & Risks Split Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
          <h4 className="text-xs font-bold text-emerald-900 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Documented Agronomic Benefits</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-emerald-800">
            {strategy.benefits.map((b, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-emerald-500">•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
          <h4 className="text-xs font-bold text-amber-900 flex items-center space-x-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>Residual Risks &amp; Management Constraints</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-amber-800">
            {strategy.risks.map((r, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-amber-500">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Broad-Area Disclaimers */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start space-x-2">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p>
          <span className="font-semibold text-slate-700">Scientific Boundary: </span>
          {strategy.disclaimer} Always verify local canal delivery schedules (&apos;warabandi&apos;) and soil salinity prior to planting.
        </p>
      </div>
    </div>
  );
};
