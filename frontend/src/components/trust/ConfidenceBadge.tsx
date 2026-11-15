"use client";

import React from "react";
import { ShieldCheck, AlertCircle, HelpCircle, AlertTriangle } from "lucide-react";

export type ConfidenceLevel = "high" | "medium" | "low" | "not_enough_information";

interface ConfidenceBadgeProps {
  level: ConfidenceLevel | string;
  showDetails?: boolean;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ level, showDetails = false }) => {
  const normLevel = (level || "medium").toLowerCase();

  switch (normLevel) {
    case "high":
      return (
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>CONFIDENCE: HIGH</span>
          {showDetails && <span className="font-normal text-emerald-700">| 4 NASA Earth Obs Streams Active</span>}
        </div>
      );
    case "medium":
      return (
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-sm">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>CONFIDENCE: MEDIUM</span>
          {showDetails && <span className="font-normal text-amber-700">| 3 NASA Streams / Minor Gaps</span>}
        </div>
      );
    case "low":
      return (
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-800 border border-orange-300 shadow-sm">
          <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
          <span>CONFIDENCE: LOW</span>
          {showDetails && <span className="font-normal text-orange-700">| Limited Satellite Coverage</span>}
        </div>
      );
    case "not_enough_information":
    default:
      return (
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300 shadow-sm">
          <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
          <span>NOT ENOUGH INFORMATION</span>
          {showDetails && <span className="font-normal text-slate-600">| &lt; 5 Valid Years Archive</span>}
        </div>
      );
  }
};
