"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, Droplets, Shield, Sprout, ArrowRight } from "lucide-react";
import { ConfidenceBadge } from "@/components/trust/ConfidenceBadge";

export interface RotationSeason {
  season_name: string;
  season_code: string;
  crop_id: string;
  crop_name: string;
  duration_days: number;
  water_demand: string;
  soil_benefit: string;
}

export interface SoilHealthBreakdown {
  legume_included: boolean;
  cover_forage_included: boolean;
  crop_family_diversity: number;
  bare_field_reduction_days: number;
}

export interface StrategyScoring {
  water_fit: number;
  climate_suitability: number;
  soil_health_diversity: number;
  income_stability: number;
  implementation_feasibility: number;
  overall_score: number;
  soil_health_breakdown?: SoilHealthBreakdown;
}

export interface RotationStrategy {
  strategy_id: string;
  name: string;
  summary: string;
  rotation_sequence: RotationSeason[];
  scoring: StrategyScoring;
  relative_water_demand_indicator: string;
  relative_water_saving_note: string;
  satellite_evidence: string[];
  risks: string[];
  benefits: string[];
  confidence: string;
  local_check_required: boolean;
  local_check_reminder: string;
  disclaimer: string;
}

interface StrategyComparisonTableProps {
  strategies: RotationStrategy[];
  selectedStrategyId?: string;
  onSelectStrategy?: (strategyId: string) => void;
}

export const StrategyComparisonTable: React.FC<StrategyComparisonTableProps> = ({
  strategies,
  selectedStrategyId,
  onSelectStrategy,
}) => {
  const getWaterBadge = (indicator: string) => {
    switch (indicator.toLowerCase()) {
      case "low":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Low (Conserving)</span>;
      case "medium":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">Medium (Balanced)</span>;
      case "high":
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">High (Demanding)</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Three-Strategy Side-by-Side Evaluation</h3>
          <p className="text-xs text-slate-500 mt-1">
            Compare the conventional baseline against pulse-diversified and continuous-cover soil shielding rotations.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <Droplets className="w-4 h-4 text-blue-600" />
          <span>Modeled water demand relative indicator</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <th className="p-4 w-1/4">Rotation Strategy</th>
              <th className="p-4 w-1/3">3-Season Sequence</th>
              <th className="p-4">Water Demand Indicator</th>
              <th className="p-4">Soil Health</th>
              <th className="p-4">Overall Score</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {strategies.map((strat) => {
              const isSelected = selectedStrategyId === strat.strategy_id;
              return (
                <tr
                  key={strat.strategy_id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    isSelected ? "bg-emerald-50/50" : ""
                  }`}
                >
                  <td className="p-4 align-top space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900">{strat.name}</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{strat.summary}</p>
                    <ConfidenceBadge level={strat.confidence} />
                  </td>

                  <td className="p-4 align-top space-y-2">
                    <div className="space-y-1.5">
                      {strat.rotation_sequence.map((season, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-xs">
                          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-slate-800">{season.crop_name}</span>
                          <span className="text-slate-400">({season.season_name})</span>
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="p-4 align-top space-y-1.5">
                    {getWaterBadge(strat.relative_water_demand_indicator)}
                    <p className="text-[11px] text-slate-500 mt-1 max-w-[200px]">
                      {strat.relative_water_saving_note}
                    </p>
                  </td>

                  <td className="p-4 align-top">
                    <div className="space-y-1">
                      <span className="text-base font-bold text-slate-800">
                        {strat.scoring.soil_health_diversity}
                        <span className="text-xs text-slate-400 font-normal"> / 100</span>
                      </span>
                      {strat.scoring.soil_health_breakdown && (
                        <div className="text-[11px] text-slate-500 space-y-0.5">
                          <p>
                            Legume: {strat.scoring.soil_health_breakdown.legume_included ? "Included (+N2)" : "None"}
                          </p>
                          <p>
                            Bare Reduction: {strat.scoring.soil_health_breakdown.bare_field_reduction_days} days
                          </p>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="p-4 align-top">
                    <div className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-900 text-white rounded-xl shadow-sm">
                      <span className="text-base font-black">{strat.scoring.overall_score}</span>
                      <span className="text-xs text-slate-400">/100</span>
                    </div>
                  </td>

                  <td className="p-4 align-top text-right">
                    {onSelectStrategy && (
                      <button
                        type="button"
                        onClick={() => onSelectStrategy(strat.strategy_id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                          isSelected
                            ? "bg-emerald-600 text-white"
                            : "border border-slate-300 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {isSelected ? "Selected" : "View Details"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
