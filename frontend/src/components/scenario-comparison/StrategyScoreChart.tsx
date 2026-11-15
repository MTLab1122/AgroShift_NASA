"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { RotationStrategy } from "./StrategyComparisonTable";

interface StrategyScoreChartProps {
  strategies: RotationStrategy[];
}

export const StrategyScoreChart: React.FC<StrategyScoreChartProps> = ({ strategies }) => {
  // Transform strategies into metric-centric data for multi-bar comparison
  const metrics = [
    { key: "water_fit", label: "Water Fit" },
    { key: "climate_suitability", label: "Climate Suitability" },
    { key: "soil_health_diversity", label: "Soil Health & Diversity" },
    { key: "income_stability", label: "Income Stability" },
    { key: "implementation_feasibility", label: "Feasibility" },
  ];

  const chartData = metrics.map((m) => {
    const row: any = { metric: m.label };
    strategies.forEach((s) => {
      row[s.strategy_id] = (s.scoring as any)[m.key] || 0;
    });
    return row;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">Multi-Dimensional Agronomic Tradeoff Analysis</h3>
          <p className="text-xs text-slate-500">
            Compare five deterministic scoring dimensions across the three rotation strategies.
          </p>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Scale: 0 to 100
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="metric"
              tick={{ fontSize: 11, fill: "#475569" }}
              axisLine={{ stroke: "#cbd5e1" }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={{ stroke: "#cbd5e1" }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderRadius: "12px",
                border: "none",
                color: "#ffffff",
                fontSize: "12px",
              }}
              formatter={(value: any) => [`${value} / 100`]}
            />
            <Legend
              wrapperStyle={{ paddingTop: "15px", fontSize: "12px" }}
              formatter={(val) => {
                const s = strategies.find((item) => item.strategy_id === val);
                return s ? s.name : val;
              }}
            />
            <Bar dataKey="baseline" name="Baseline (Conventional)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="water_saver_pulse_fix" name="Water-Saver Pulse Fix" fill="#059669" radius={[4, 4, 0, 0]} />
            <Bar dataKey="soil_shield_forage" name="Soil-Shield Forage" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
