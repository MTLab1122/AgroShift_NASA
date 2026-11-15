"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Scenario } from "@/types/recommendation";

interface ScenarioScoreChartProps {
  scenarios: Scenario[];
}

export default function ScenarioScoreChart({ scenarios }: ScenarioScoreChartProps) {
  if (!scenarios || scenarios.length === 0) {
    return null;
  }

  const chartData = scenarios.map((s) => ({
    name: s.scenario_id === "baseline" ? "Baseline Cereal" : s.scenario_id === "pulse_inclusive" ? "Pulse Inclusive" : "Soil Cover",
    total_score: s.score ?? 0,
    water_fit: s.score_breakdown.water_fit ?? 0,
    climate_fit: s.score_breakdown.climate_suitability ?? 0,
    soil_fit: s.score_breakdown.soil_health_diversity ?? 0,
  }));

  return (
    <div className="w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
        <div>
          <h3 className="font-semibold text-slate-800 text-base">
            Multi-Criteria Adaptation Scores
          </h3>
          <p className="text-xs text-slate-500">
            Comparing Water Fit, Climate Suitability, and Soil Health Diversity
          </p>
        </div>
        <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-medium">
          Scale: 0 – 100
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#475569" }} dy={10} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748b" }} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-lg text-xs shadow-xl space-y-1">
                      <p className="font-semibold text-slate-200">{label}</p>
                      {payload.map((p: any) => (
                        <p key={p.name} style={{ color: p.color }}>
                          {p.name}: {p.value} / 100
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="water_fit" name="Water Fit" fill="#0284c7" radius={[4, 4, 0, 0]} />
            <Bar dataKey="climate_fit" name="Climate Fit" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="soil_fit" name="Soil Health" fill="#16a34a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
