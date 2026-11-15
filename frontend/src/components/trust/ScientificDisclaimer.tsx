import React from "react";
import { ShieldCheck, Info } from "lucide-react";

export interface ScientificDisclaimerProps {
  className?: string;
  compact?: boolean;
}

export const ScientificDisclaimer: React.FC<ScientificDisclaimerProps> = ({
  className = "",
  compact = false,
}) => {
  if (compact) {
    return (
      <div className={`p-3 bg-slate-100/90 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2 ${className}`}>
        <Info className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
        <p>
          AgroShift provides decision support, not guarantees. Actual outcomes depend on local soil, water, seed, weather, market, and management conditions.
        </p>
      </div>
    );
  }

  return (
    <div className={`p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-emerald-50/30 border border-slate-200/90 rounded-2xl text-slate-700 text-xs shadow-sm flex items-start gap-3.5 ${className}`}>
      <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 flex-shrink-0 mt-0.5">
        <ShieldCheck className="w-5 h-5" />
      </div>
      <div className="space-y-1">
        <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
          Scientific Decision Support & Ground Reality Notice
        </h5>
        <p className="leading-relaxed text-slate-600">
          AgroShift provides decision support, not guarantees. Actual outcomes depend on local soil, water, seed, weather, market, and management conditions. Satellite data from NASA POWER, SMAP L4, GPM IMERG, and MODIS NDVI reflects gridded regional atmospheric and soil states. Always test field salinity and verify canal warabandi turns with local agricultural extension officers before planting.
        </p>
      </div>
    </div>
  );
};
