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
import { DailyClimateRecord } from "@/types/climate";

interface ClimatePrecipitationChartProps {
  records: DailyClimateRecord[];
  unit?: string;
  sourceBadge?: string;
}

export default function ClimatePrecipitationChart({
  records,
  unit = "mm/day",
  sourceBadge = "NASA POWER PRECTOTCORR",
}: ClimatePrecipitationChartProps) {
  if (!records || records.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-sm">
        No precipitation data recorded.
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
        <div>
          <h3 className="font-semibold text-slate-800 text-base">
            Bias-Corrected Daily Precipitation (PRECTOTCORR)
          </h3>
          <p className="text-xs text-slate-500">
            In-season rainfall distribution & dry-spell assessment
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            {sourceBadge}
          </span>
          <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            Unit: {unit}
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={records} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickFormatter={(val: string) => val.substring(5)}
              dy={10}
            />
            <YAxis
              unit={` ${unit}`}
              domain={[0, "auto"]}
              tick={{ fontSize: 11, fill: "#64748b" }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value;
                  return (
                    <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-xl space-y-1 border border-slate-800">
                      <p className="font-mono text-slate-300 font-semibold">{label}</p>
                      <p className="text-emerald-400">
                        Precipitation: {val !== null && val !== undefined ? `${val} ${unit}` : "Missing Observation"}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend verticalAlign="top" height={30} wrapperStyle={{ fontSize: 12 }} />
            <Bar
              dataKey="prectotcorr"
              name="Precipitation"
              fill="#0ea5e9"
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[11px] text-slate-400 italic">
        * Zero mm indicates dry weather; missing observations are distinct and rendered as absent bars.
      </p>
    </div>
  );
}
