"use client";

import React from "react";
import { AlertCircle, CheckSquare, Info } from "lucide-react";

interface LocalCheckBadgeProps {
  className?: string;
  compact?: boolean;
}

export const LocalCheckBadge: React.FC<LocalCheckBadgeProps> = ({ className = "", compact = false }) => {
  if (compact) {
    return (
      <div className={`p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 ${className}`}>
        <div className="flex items-start space-x-2">
          <CheckSquare className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="font-bold">
              Local Check: Verify canal water schedules, seed prices, soil salinity, pest pressure, and field-specific conditions before planting.
            </p>
            <p className="text-blue-700 text-[11px]">
              NASA satellite data represents broad-area conditions, not a field-specific measurement.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-300 rounded-2xl shadow-sm ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-blue-600 text-white rounded-xl shadow-sm mt-0.5 shrink-0">
          <CheckSquare className="w-5 h-5" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black uppercase tracking-wider text-blue-900 bg-blue-100 px-2 py-0.5 rounded-md">
              Mandatory Ground Verification
            </span>
          </div>
          <p className="text-sm font-bold text-blue-950 leading-snug">
            Local Check: Verify canal water schedules, seed prices, soil salinity, pest pressure, and field-specific conditions before planting.
          </p>
          <div className="flex items-center space-x-1.5 text-xs text-blue-800">
            <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>NASA satellite data represents broad-area conditions, not a field-specific measurement.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
